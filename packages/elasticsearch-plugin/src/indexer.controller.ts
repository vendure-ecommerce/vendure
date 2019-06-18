import { Client } from '@elastic/elasticsearch';
import { Controller, Inject } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { InjectConnection } from '@nestjs/typeorm';
import { unique } from '@vendure/common/lib/unique';
import { FacetValue, ID, JobService, Logger, Product, ProductVariant, ProductVariantService, RequestContext, translateDeep } from '@vendure/core';
import { defer, Observable } from 'rxjs';
import { Connection, SelectQueryBuilder } from 'typeorm';
import { FindOptionsUtils } from 'typeorm/find-options/FindOptionsUtils';

import {
    ELASTIC_SEARCH_CLIENT,
    ELASTIC_SEARCH_OPTIONS,
    loggerCtx,
    Message,
    PRODUCT_INDEX_NAME,
    PRODUCT_INDEX_TYPE,
    VARIANT_INDEX_NAME,
    VARIANT_INDEX_TYPE,
} from './constants';
import { ElasticsearchOptions } from './plugin';
import { BulkOperation, BulkOperationDoc, BulkResponseBody, ProductIndexItem, VariantIndexItem } from './types';

export const variantRelations = [
    'product',
    'product.featuredAsset',
    'product.facetValues',
    'product.facetValues.facet',
    'featuredAsset',
    'facetValues',
    'facetValues.facet',
    'collections',
    'taxCategory',
];

export interface ReindexMessageResponse {
    total: number;
    completed: number;
    duration: number;
}

@Controller()
export class ElasticsearchIndexerController {

    constructor(@InjectConnection() private connection: Connection,
                @Inject(ELASTIC_SEARCH_OPTIONS) private options: Required<ElasticsearchOptions>,
                @Inject(ELASTIC_SEARCH_CLIENT) private client: Client,
                private productVariantService: ProductVariantService,
                private jobService: JobService) {}

    /**
     * Updates the search index only for the affected entities.
     */
    @MessagePattern(Message.UpdateProductOrVariant)
    updateProductOrVariant({ ctx: rawContext, productId, variantId }: { ctx: any, productId?: ID, variantId?: ID }): Observable<boolean> {
        const ctx = RequestContext.fromObject(rawContext);
        let updatedProductVariants: ProductVariant[] = [];
        let removedProducts: Product[] = [];
        let updatedVariants: ProductVariant[] = [];
        let removedVariantIds: ID[] = [];

        return defer(async () => {
            if (productId) {
                const product = await this.connection.getRepository(Product).findOne(productId, {
                    relations: ['variants'],
                });
                if (product) {
                    if (product.deletedAt) {
                        removedProducts = [product];
                        removedVariantIds = product.variants.map(v => v.id);
                    } else {
                        const variants = await this.connection
                            .getRepository(ProductVariant)
                            .findByIds(product.variants.map(v => v.id), {
                                relations: variantRelations,
                            });
                        updatedProductVariants = updatedVariants;
                    }
                }
            } else {
                const variant = await this.connection.getRepository(ProductVariant).findOne(variantId, {
                    relations: variantRelations,
                });
                if (variant) {
                    updatedVariants = [variant];
                }
            }
            Logger.verbose(`Updating ${updatedVariants.length} variants`, loggerCtx);
            updatedVariants = this.hydrateVariants(ctx, updatedVariants);

            if (updatedProductVariants.length) {
                const updatedProductIndexItem = this.createProductIndexItem(updatedProductVariants);
                const operations: [BulkOperation, BulkOperationDoc<ProductIndexItem>] = [
                    { update: { _id: updatedProductIndexItem.productId.toString() } },
                    { doc: updatedProductIndexItem },
                ];
                await this.executeBulkOperations(PRODUCT_INDEX_NAME, PRODUCT_INDEX_TYPE, operations);
            }
            if (updatedVariants.length) {
                const operations = updatedVariants.reduce((ops, variant) => {
                    return [
                        ...ops,
                        { update: { _id: variant.id.toString() } },
                        { doc: this.createVariantIndexItem(variant) },
                    ];
                }, [] as Array<BulkOperation | BulkOperationDoc<VariantIndexItem>>);
                await this.executeBulkOperations(VARIANT_INDEX_NAME, VARIANT_INDEX_TYPE, operations);
            }
            if (removedVariantIds.length) {
                const operations = removedVariantIds.reduce((ops, id) => {
                    return [
                        ...ops,
                        { delete: { _id: id.toString() } },
                    ];
                }, [] as BulkOperation[]);
                await this.executeBulkOperations(VARIANT_INDEX_NAME, VARIANT_INDEX_TYPE, operations);
            }

            return true;
        });
    }

    @MessagePattern(Message.UpdateVariantsById)
    updateVariantsById({ ctx: rawContext, ids }: { ctx: any, ids: ID[] }): Observable<ReindexMessageResponse> {
        const ctx = RequestContext.fromObject(rawContext);
        const { batchSize } = this.options;

        return new Observable(observer => {
            (async () => {
                const timeStart = Date.now();
                if (ids.length) {
                    const batches = Math.ceil(ids.length / batchSize);
                    Logger.verbose(`Updating ${ids.length} variants...`);

                    for (let i = 0; i < batches; i++) {
                        const begin = i * batchSize;
                        const end = begin + batchSize;
                        Logger.verbose(`Updating ids from index ${begin} to ${end}`);
                        const batchIds = ids.slice(begin, end);
                        const batch = await this.getBatchByIds(ctx, batchIds);
                        const operations = batch.reduce((ops, variant) => {
                            return [
                                ...ops,
                                { update: { _id: variant.id.toString() } },
                                { doc: this.createVariantIndexItem(variant) },
                            ];
                        }, [] as Array<BulkOperation | BulkOperationDoc<VariantIndexItem>>);
                        await this.executeBulkOperations(VARIANT_INDEX_NAME, VARIANT_INDEX_TYPE, operations);
                        observer.next({
                            total: ids.length,
                            completed: Math.min((i + 1) * batchSize, ids.length),
                            duration: +new Date() - timeStart,
                        });
                    }
                }
                Logger.verbose(`Completed reindexing!`);
                observer.next({
                    total: ids.length,
                    completed: ids.length,
                    duration: +new Date() - timeStart,
                });
                observer.complete();
            })();
        });
    }

    @MessagePattern(Message.Reindex)
    reindex({ ctx: rawContext }: { ctx: any }): Observable<ReindexMessageResponse> {
        const ctx = RequestContext.fromObject(rawContext);
        const { batchSize } = this.options;

        return new Observable(observer => {
                (async () => {
                    const timeStart = Date.now();
                    const qb = this.getSearchIndexQueryBuilder();
                    const count = await qb.where('variants__product.deletedAt IS NULL').getCount();
                    Logger.verbose(`Reindexing ${count} variants`, loggerCtx);

                    const batches = Math.ceil(count / batchSize);
                    let variantsInProduct: ProductVariant[] = [];

                    for (let i = 0; i < batches; i++) {
                        Logger.verbose(`Processing batch ${i + 1} of ${batches}`, loggerCtx);

                        const variants = await this.getBatch(ctx, qb, i);
                        Logger.verbose(`variants count: ${variants.length}`);

                        const variantsToIndex: Array<BulkOperation | VariantIndexItem> = [];
                        const productsToIndex: Array<BulkOperation | ProductIndexItem> = [];

                        // tslint:disable-next-line:prefer-for-of
                        for (let j = 0; j < variants.length; j++) {
                            const variant = variants[j];
                            variantsInProduct.push(variant);
                            variantsToIndex.push({index: {_id: variant.id.toString()}});
                            variantsToIndex.push(this.createVariantIndexItem(variant));

                            const nextVariant = variants[j + 1];
                            if (nextVariant && nextVariant.productId !== variant.productId) {
                                productsToIndex.push({index: {_id: variant.productId.toString()}});
                                productsToIndex.push(this.createProductIndexItem(variantsInProduct) as any);
                                variantsInProduct = [];
                            }
                        }
                        await this.executeBulkOperations(VARIANT_INDEX_NAME, VARIANT_INDEX_TYPE, variantsToIndex);
                        await this.executeBulkOperations(PRODUCT_INDEX_NAME, PRODUCT_INDEX_TYPE, productsToIndex);
                        observer.next({
                            total: count,
                            completed: Math.min((i + 1) * batchSize, count),
                            duration: +new Date() - timeStart,
                        });
                    }
                    Logger.verbose(`Completed reindexing!`);
                    observer.next({
                        total: count,
                        completed: count,
                        duration: +new Date() - timeStart,
                    });
                    observer.complete();
                })();
            },
        );
    }

    private async executeBulkOperations(indexName: string,
                                        indexType: string,
                                        operations: Array<BulkOperation | BulkOperationDoc<VariantIndexItem | ProductIndexItem>>) {
        try {
            const {body}: { body: BulkResponseBody; } = await this.client.bulk({
                refresh: 'true',
                index: this.options.indexPrefix + indexName,
                type: indexType,
                body: operations,
            });

            if (body.errors) {
                Logger.error(`Some errors occurred running bulk operations on ${indexType}! Set logger to "debug" to print all errors.`, loggerCtx);
                body.items.forEach(item => {
                    if (item.index) {
                        Logger.debug(JSON.stringify(item.index.error, null, 2), loggerCtx);
                    }
                    if (item.update) {
                        Logger.debug(JSON.stringify(item.update.error, null, 2), loggerCtx);
                    }
                    if (item.delete) {
                        Logger.debug(JSON.stringify(item.delete.error, null, 2), loggerCtx);
                    }
                });
            } else {
                Logger.verbose(`Executed ${body.items.length} bulk operations on ${indexType}`);
            }
            return body;
        } catch (e) {
            Logger.error(`Error when attempting to run bulk operations [${e.toString()}]`, loggerCtx);
            Logger.error('Error details: ' + JSON.stringify(e.body.error, null, 2), loggerCtx);
        }
    }

    private getSearchIndexQueryBuilder() {
        const qb = this.connection.getRepository(ProductVariant).createQueryBuilder('variants');
        FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, {
            relations: variantRelations,
            order: {
                productId: 'ASC',
            },
        });
        FindOptionsUtils.joinEagerRelations(qb, qb.alias, this.connection.getMetadata(ProductVariant));
        return qb;
    }

    private async getBatch(ctx: RequestContext, qb: SelectQueryBuilder<ProductVariant>, batchNumber: string | number): Promise<ProductVariant[]> {
        const { batchSize } = this.options;
        const i = Number.parseInt(batchNumber.toString(), 10);
        const variants = await qb
            .where('variants__product.deletedAt IS NULL')
            .take(batchSize)
            .skip(i * batchSize)
            .getMany();

        return this.hydrateVariants(ctx, variants);
    }

    private async getBatchByIds(ctx: RequestContext, ids: ID[]) {
        const variants = await this.connection.getRepository(ProductVariant).findByIds(ids, {
            relations: variantRelations,
        });
        return this.hydrateVariants(ctx, variants);
    }
    /**
     * Given an array of ProductVariants, this method applies the correct taxes and translations.
     */
    private hydrateVariants(ctx: RequestContext, variants: ProductVariant[]): ProductVariant[] {
        return variants
            .map(v => this.productVariantService.applyChannelPriceAndTax(v, ctx))
            .map(v => translateDeep(v, ctx.languageCode, ['product']));
    }

    private createVariantIndexItem(v: ProductVariant): VariantIndexItem {
        return {
            sku: v.sku,
            slug: v.product.slug,
            productId: v.product.id as string,
            productName: v.product.name,
            productPreview: v.product.featuredAsset ? v.product.featuredAsset.preview : '',
            productVariantId: v.id as string,
            productVariantName: v.name,
            productVariantPreview: v.featuredAsset ? v.featuredAsset.preview : '',
            price: v.price,
            priceWithTax: v.priceWithTax,
            currencyCode: v.currencyCode,
            description: v.product.description,
            facetIds: this.getFacetIds([v]),
            facetValueIds: this.getFacetValueIds([v]),
            collectionIds: v.collections.map(c => c.id.toString()),
            enabled: v.enabled && v.product.enabled,
        };
    }

    private createProductIndexItem(variants: ProductVariant[]): ProductIndexItem {
        const first = variants[0];
        const prices = variants.map(v => v.price);
        const pricesWithTax = variants.map(v => v.priceWithTax);
        return {
            sku: variants.map(v => v.sku),
            slug: variants.map(v => v.product.slug),
            productId: first.product.id,
            productName: variants.map(v => v.product.name),
            productPreview: first.product.featuredAsset ? first.product.featuredAsset.preview : '',
            productVariantId: variants.map(v => v.id),
            productVariantName: variants.map(v => v.name),
            productVariantPreview: variants.filter(v => v.featuredAsset).map(v => v.featuredAsset.preview),
            priceMin: Math.min(...prices),
            priceMax: Math.max(...prices),
            priceWithTaxMin: Math.min(...pricesWithTax),
            priceWithTaxMax: Math.max(...pricesWithTax),
            currencyCode: first.currencyCode,
            description: first.product.description,
            facetIds: this.getFacetIds(variants),
            facetValueIds: this.getFacetValueIds(variants),
            collectionIds: variants.reduce((ids, v) => [ ...ids, ...v.collections.map(c => c.id)], [] as ID[]),
            enabled: first.product.enabled,
        };
    }

    private getFacetIds(variants: ProductVariant[]): string[] {
        const facetIds = (fv: FacetValue) => fv.facet.id.toString();
        const variantFacetIds = variants.reduce((ids, v) => [ ...ids, ...v.facetValues.map(facetIds)], [] as string[]);
        const productFacetIds = variants[0].product.facetValues.map(facetIds);
        return unique([...variantFacetIds, ...productFacetIds]);
    }

    private getFacetValueIds(variants: ProductVariant[]): string[] {
        const facetValueIds = (fv: FacetValue) => fv.id.toString();
        const variantFacetValueIds = variants.reduce((ids, v) => [ ...ids, ...v.facetValues.map(facetValueIds)], [] as string[]);
        const productFacetValueIds = variants[0].product.facetValues.map(facetValueIds);
        return unique([...variantFacetValueIds, ...productFacetValueIds]);
    }
}
