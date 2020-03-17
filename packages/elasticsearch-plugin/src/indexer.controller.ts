import { Client } from '@elastic/elasticsearch';
import { Controller, Inject, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { InjectConnection } from '@nestjs/typeorm';
import { unique } from '@vendure/common/lib/unique';
import {
    Asset,
    asyncObservable,
    AsyncQueue,
    FacetValue,
    ID,
    JobService,
    Logger,
    Product,
    ProductVariant,
    ProductVariantService,
    RequestContext,
    translateDeep,
} from '@vendure/core';
import { Observable } from 'rxjs';
import { Connection, SelectQueryBuilder } from 'typeorm';
import { FindOptionsUtils } from 'typeorm/find-options/FindOptionsUtils';

import {
    ELASTIC_SEARCH_OPTIONS,
    loggerCtx,
    PRODUCT_INDEX_NAME,
    PRODUCT_INDEX_TYPE,
    VARIANT_INDEX_NAME,
    VARIANT_INDEX_TYPE,
} from './constants';
import { createIndices, deleteByChannel, deleteIndices } from './indexing-utils';
import { ElasticsearchOptions } from './options';
import {
    AssignProductToChannelMessage,
    BulkOperation,
    BulkOperationDoc,
    BulkResponseBody,
    DeleteProductMessage,
    DeleteVariantMessage,
    ProductIndexItem,
    ReindexMessage,
    RemoveProductFromChannelMessage,
    UpdateAssetMessage,
    UpdateProductMessage,
    UpdateVariantMessage,
    UpdateVariantsByIdMessage,
    VariantIndexItem,
} from './types';

export const variantRelations = [
    'product',
    'product.featuredAsset',
    'product.facetValues',
    'product.facetValues.facet',
    'product.channels',
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
export class ElasticsearchIndexerController implements OnModuleInit, OnModuleDestroy {
    private client: Client;
    private asyncQueue = new AsyncQueue('elasticsearch-indexer', 5);

    constructor(
        @InjectConnection() private connection: Connection,
        @Inject(ELASTIC_SEARCH_OPTIONS) private options: Required<ElasticsearchOptions>,
        private productVariantService: ProductVariantService,
        private jobService: JobService,
    ) {}

    onModuleInit(): any {
        const { host, port } = this.options;
        this.client = new Client({
            node: `${host}:${port}`,
        });
    }

    onModuleDestroy(): any {
        return this.client.close();
    }

    /**
     * Updates the search index only for the affected product.
     */
    @MessagePattern(UpdateProductMessage.pattern)
    updateProduct({
        ctx: rawContext,
        productId,
    }: UpdateProductMessage['data']): Observable<UpdateProductMessage['response']> {
        const ctx = RequestContext.fromObject(rawContext);
        return asyncObservable(async () => {
            await this.updateProductInternal(ctx, productId, ctx.channelId);
            return true;
        });
    }

    /**
     * Updates the search index only for the affected product.
     */
    @MessagePattern(DeleteProductMessage.pattern)
    deleteProduct({
        ctx: rawContext,
        productId,
    }: DeleteProductMessage['data']): Observable<DeleteProductMessage['response']> {
        const ctx = RequestContext.fromObject(rawContext);
        return asyncObservable(async () => {
            await this.deleteProductInternal(productId, ctx.channelId);
            const variants = await this.productVariantService.getVariantsByProductId(ctx, productId);
            await this.deleteVariantsInternal(variants.map(v => v.id), ctx.channelId);
            return true;
        });
    }

    /**
     * Updates the search index only for the affected product.
     */
    @MessagePattern(AssignProductToChannelMessage.pattern)
    assignProductsToChannel({
        ctx: rawContext,
        productId,
        channelId,
    }: AssignProductToChannelMessage['data']): Observable<AssignProductToChannelMessage['response']> {
        const ctx = RequestContext.fromObject(rawContext);
        return asyncObservable(async () => {
            await this.updateProductInternal(ctx, productId, channelId);
            const variants = await this.productVariantService.getVariantsByProductId(ctx, productId);
            await this.updateVariantsInternal(ctx, variants.map(v => v.id), channelId);
            return true;
        });
    }

    /**
     * Updates the search index only for the affected product.
     */
    @MessagePattern(RemoveProductFromChannelMessage.pattern)
    removeProductFromChannel({
        ctx: rawContext,
        productId,
        channelId,
    }: RemoveProductFromChannelMessage['data']): Observable<RemoveProductFromChannelMessage['response']> {
        const ctx = RequestContext.fromObject(rawContext);
        return asyncObservable(async () => {
            await this.deleteProductInternal(productId, channelId);
            const variants = await this.productVariantService.getVariantsByProductId(ctx, productId);
            await this.deleteVariantsInternal(variants.map(v => v.id), channelId);
            return true;
        });
    }

    /**
     * Updates the search index only for the affected entities.
     */
    @MessagePattern(UpdateVariantMessage.pattern)
    updateVariants({
        ctx: rawContext,
        variantIds,
    }: UpdateVariantMessage['data']): Observable<UpdateVariantMessage['response']> {
        const ctx = RequestContext.fromObject(rawContext);
        return asyncObservable(async () => {
            return this.asyncQueue.push(async () => {
                await this.updateVariantsInternal(ctx, variantIds, ctx.channelId);
                return true;
            });
        });
    }

    @MessagePattern(DeleteVariantMessage.pattern)
    private deleteVaiants({
        ctx: rawContext,
        variantIds,
    }: DeleteVariantMessage['data']): Observable<DeleteVariantMessage['response']> {
        const ctx = RequestContext.fromObject(rawContext);
        return asyncObservable(async () => {
            const variants = await this.connection
                .getRepository(ProductVariant)
                .findByIds(variantIds, { relations: ['product'] });
            const productIds = unique(variants.map(v => v.product.id));
            for (const productId of productIds) {
                await this.updateProductInternal(ctx, productId, ctx.channelId);
            }
            await this.deleteVariantsInternal(variantIds, ctx.channelId);
            return true;
        });
    }

    @MessagePattern(UpdateVariantsByIdMessage.pattern)
    updateVariantsById({
        ctx: rawContext,
        ids,
    }: UpdateVariantsByIdMessage['data']): Observable<UpdateVariantsByIdMessage['response']> {
        const ctx = RequestContext.fromObject(rawContext);
        const { batchSize } = this.options;

        return asyncObservable(async observer => {
            return this.asyncQueue.push(async () => {
                const timeStart = Date.now();
                if (ids.length) {
                    const batches = Math.ceil(ids.length / batchSize);
                    Logger.verbose(`Updating ${ids.length} variants...`, loggerCtx);

                    let variantsInProduct: ProductVariant[] = [];

                    for (let i = 0; i < batches; i++) {
                        const begin = i * batchSize;
                        const end = begin + batchSize;
                        const batchIds = ids.slice(begin, end);
                        const variants = await this.getVariantsByIds(ctx, batchIds);
                        variantsInProduct = await this.processVariantBatch(
                            variants,
                            variantsInProduct,
                            (operations, variant) => {
                                operations.push(
                                    { update: { _id: this.getId(variant.id, ctx.channelId) } },
                                    { doc: this.createVariantIndexItem(variant, ctx.channelId) },
                                );
                            },
                            (operations, product, _variants) => {
                                operations.push(
                                    { update: { _id: this.getId(product.id, ctx.channelId) } },
                                    { doc: this.createProductIndexItem(_variants, ctx.channelId) },
                                );
                            },
                        );
                        observer.next({
                            total: ids.length,
                            completed: Math.min((i + 1) * batchSize, ids.length),
                            duration: +new Date() - timeStart,
                        });
                    }
                }
                Logger.verbose(`Completed updating variants`, loggerCtx);
                return {
                    total: ids.length,
                    completed: ids.length,
                    duration: +new Date() - timeStart,
                };
            });
        });
    }

    @MessagePattern(ReindexMessage.pattern)
    reindex({
        ctx: rawContext,
        dropIndices,
    }: ReindexMessage['data']): Observable<ReindexMessage['response']> {
        const ctx = RequestContext.fromObject(rawContext);
        const { batchSize } = this.options;

        return asyncObservable(async observer => {
            return this.asyncQueue.push(async () => {
                const timeStart = Date.now();

                if (dropIndices) {
                    await deleteIndices(this.client, this.options.indexPrefix);
                    await createIndices(this.client, this.options.indexPrefix);
                } else {
                    await deleteByChannel(this.client, this.options.indexPrefix, ctx.channelId);
                }

                const qb = this.getSearchIndexQueryBuilder(ctx.channelId);
                const count = await qb.getCount();
                Logger.verbose(`Reindexing ${count} ProductVariants`, loggerCtx);

                const batches = Math.ceil(count / batchSize);
                let variantsInProduct: ProductVariant[] = [];

                for (let i = 0; i < batches; i++) {
                    const variants = await this.getBatch(ctx, qb, i);

                    Logger.verbose(
                        `Processing batch ${i + 1} of ${batches}. ProductVariants count: ${variants.length}`,
                        loggerCtx,
                    );
                    variantsInProduct = await this.processVariantBatch(
                        variants,
                        variantsInProduct,
                        (operations, variant) => {
                            operations.push(
                                { index: { _id: this.getId(variant.id, ctx.channelId) } },
                                this.createVariantIndexItem(variant, ctx.channelId),
                            );
                        },
                        (operations, product, _variants) => {
                            operations.push(
                                { index: { _id: this.getId(product.id, ctx.channelId) } },
                                this.createProductIndexItem(_variants, ctx.channelId),
                            );
                        },
                    );
                    observer.next({
                        total: count,
                        completed: Math.min((i + 1) * batchSize, count),
                        duration: +new Date() - timeStart,
                    });
                }
                Logger.verbose(`Completed reindexing!`, loggerCtx);
                return {
                    total: count,
                    completed: count,
                    duration: +new Date() - timeStart,
                };
            });
        });
    }

    @MessagePattern(UpdateAssetMessage.pattern)
    updateAsset(data: UpdateAssetMessage['data']): Observable<UpdateAssetMessage['response']> {
        return asyncObservable(async () => {
            const result1 = await this.updateAssetForIndex(PRODUCT_INDEX_NAME, data.asset);
            const result2 = await this.updateAssetForIndex(VARIANT_INDEX_NAME, data.asset);
            await this.client.indices.refresh({
                index: [
                    this.options.indexPrefix + PRODUCT_INDEX_NAME,
                    this.options.indexPrefix + VARIANT_INDEX_NAME,
                ],
            });
            return result1 && result2;
        });
    }

    private async updateAssetForIndex(indexName: string, asset: Asset): Promise<boolean> {
        const focalPoint = asset.focalPoint || null;
        const params = { focalPoint };
        const result1 = await this.client.update_by_query({
            index: this.options.indexPrefix + indexName,
            body: {
                script: {
                    source: 'ctx._source.productPreviewFocalPoint = params.focalPoint',
                    params,
                },
                query: {
                    term: {
                        productAssetId: asset.id,
                    },
                },
            },
        });
        for (const failure of result1.body.failures) {
            Logger.error(`${failure.cause.type}: ${failure.cause.reason}`, loggerCtx);
        }
        const result2 = await this.client.update_by_query({
            index: this.options.indexPrefix + indexName,
            body: {
                script: {
                    source: 'ctx._source.productVariantPreviewFocalPoint = params.focalPoint',
                    params,
                },
                query: {
                    term: {
                        productVariantAssetId: asset.id,
                    },
                },
            },
        });
        for (const failure of result1.body.failures) {
            Logger.error(`${failure.cause.type}: ${failure.cause.reason}`, loggerCtx);
        }
        return result1.body.failures.length === 0 && result2.body.failures === 0;
    }

    private async processVariantBatch(
        variants: ProductVariant[],
        variantsInProduct: ProductVariant[],
        processVariants: (
            operations: Array<BulkOperation | BulkOperationDoc<VariantIndexItem> | VariantIndexItem>,
            variant: ProductVariant,
        ) => void,
        processProducts: (
            operations: Array<BulkOperation | BulkOperationDoc<ProductIndexItem> | ProductIndexItem>,
            product: Product,
            variants: ProductVariant[],
        ) => void,
    ) {
        const variantsToIndex: Array<BulkOperation | VariantIndexItem> = [];
        const productsToIndex: Array<BulkOperation | ProductIndexItem> = [];
        const productIdsIndexed = new Set<ID>();
        // tslint:disable-next-line:prefer-for-of
        for (let j = 0; j < variants.length; j++) {
            const variant = variants[j];
            variantsInProduct.push(variant);
            processVariants(variantsToIndex, variant);
            const nextVariant = variants[j + 1];
            const nextVariantIsNewProduct = nextVariant && nextVariant.productId !== variant.productId;
            const thisVariantIsLastAndProductNotAdded =
                !nextVariant && !productIdsIndexed.has(variant.productId);
            if (nextVariantIsNewProduct || thisVariantIsLastAndProductNotAdded) {
                processProducts(productsToIndex, variant.product, variantsInProduct);
                variantsInProduct = [];
                productIdsIndexed.add(variant.productId);
            }
        }
        await this.executeBulkOperations(VARIANT_INDEX_NAME, VARIANT_INDEX_TYPE, variantsToIndex);
        await this.executeBulkOperations(PRODUCT_INDEX_NAME, PRODUCT_INDEX_TYPE, productsToIndex);
        return variantsInProduct;
    }

    private async updateVariantsInternal(ctx: RequestContext, variantIds: ID[], channelId: ID) {
        let updatedVariants: ProductVariant[] = [];

        const productVariants = await this.connection.getRepository(ProductVariant).findByIds(variantIds, {
            relations: variantRelations,
            where: {
                deletedAt: null,
            },
            order: {
                id: 'ASC',
            },
        });
        updatedVariants = this.hydrateVariants(ctx, productVariants);

        if (updatedVariants.length) {
            // When ProductVariants change, we need to update the corresponding Product index
            // since e.g. price changes must be reflected on the Product level too.
            const productIdsOfVariants = unique(updatedVariants.map(v => v.productId));
            for (const variantProductId of productIdsOfVariants) {
                await this.updateProductInternal(ctx, variantProductId, channelId);
            }
            const operations = updatedVariants.reduce(
                (ops, variant) => {
                    return [
                        ...ops,
                        { update: { _id: this.getId(variant.id, channelId) } },
                        { doc: this.createVariantIndexItem(variant, channelId), doc_as_upsert: true },
                    ];
                },
                [] as Array<BulkOperation | BulkOperationDoc<VariantIndexItem>>,
            );
            Logger.verbose(`Updating ${updatedVariants.length} ProductVariants`, loggerCtx);
            await this.executeBulkOperations(VARIANT_INDEX_NAME, VARIANT_INDEX_TYPE, operations);
        }
    }

    private async updateProductInternal(ctx: RequestContext, productId: ID, channelId: ID) {
        let updatedProductVariants: ProductVariant[] = [];
        const product = await this.connection.getRepository(Product).findOne(productId, {
            relations: ['variants'],
        });
        if (product) {
            updatedProductVariants = await this.connection
                .getRepository(ProductVariant)
                .findByIds(product.variants.map(v => v.id), {
                    relations: variantRelations,
                    where: {
                        deletedAt: null,
                    },
                });
            if (product.enabled === false) {
                updatedProductVariants.forEach(v => (v.enabled = false));
            }
        }
        if (updatedProductVariants.length) {
            Logger.verbose(`Updating 1 Product (${productId})`, loggerCtx);
            updatedProductVariants = this.hydrateVariants(ctx, updatedProductVariants);
            const updatedProductIndexItem = this.createProductIndexItem(updatedProductVariants, channelId);
            const operations: [BulkOperation, BulkOperationDoc<ProductIndexItem>] = [
                { update: { _id: this.getId(updatedProductIndexItem.productId, channelId) } },
                { doc: updatedProductIndexItem, doc_as_upsert: true },
            ];
            await this.executeBulkOperations(PRODUCT_INDEX_NAME, PRODUCT_INDEX_TYPE, operations);
        }
    }

    private async deleteProductInternal(productId: ID, channelId: ID) {
        Logger.verbose(`Deleting 1 Product (${productId})`, loggerCtx);
        const operations: BulkOperation[] = [{ delete: { _id: this.getId(productId, channelId) } }];
        await this.executeBulkOperations(PRODUCT_INDEX_NAME, PRODUCT_INDEX_TYPE, operations);
    }

    private async deleteVariantsInternal(variantIds: ID[], channelId: ID) {
        Logger.verbose(`Deleting ${variantIds.length} ProductVariants`, loggerCtx);
        const operations: BulkOperation[] = variantIds.map(id => ({
            delete: { _id: this.getId(id, channelId) },
        }));
        await this.executeBulkOperations(VARIANT_INDEX_NAME, VARIANT_INDEX_TYPE, operations);
    }

    private async executeBulkOperations(
        indexName: string,
        indexType: string,
        operations: Array<BulkOperation | BulkOperationDoc<VariantIndexItem | ProductIndexItem>>,
    ) {
        try {
            const fullIndexName = this.options.indexPrefix + indexName;
            const { body }: { body: BulkResponseBody } = await this.client.bulk({
                refresh: 'true',
                index: fullIndexName,
                type: indexType,
                body: operations,
            });

            if (body.errors) {
                Logger.error(
                    `Some errors occurred running bulk operations on ${indexType}! Set logger to "debug" to print all errors.`,
                    loggerCtx,
                );
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
                Logger.verbose(
                    `Executed ${body.items.length} bulk operations on index [${fullIndexName}]`,
                    loggerCtx,
                );
            }
            return body;
        } catch (e) {
            Logger.error(`Error when attempting to run bulk operations [${e.toString()}]`, loggerCtx);
            Logger.error('Error details: ' + JSON.stringify(e.body && e.body.error, null, 2), loggerCtx);
        }
    }

    private getSearchIndexQueryBuilder(channelId: ID) {
        const qb = this.connection.getRepository(ProductVariant).createQueryBuilder('variants');
        FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, {
            relations: variantRelations,
            order: {
                productId: 'ASC',
            },
        });
        FindOptionsUtils.joinEagerRelations(qb, qb.alias, this.connection.getMetadata(ProductVariant));
        qb.leftJoin('variants.product', '__product')
            .leftJoin('__product.channels', '__channel')
            .where('__channel.id = :channelId', { channelId })
            .andWhere('variants__product.deletedAt IS NULL')
            .andWhere('variants.deletedAt IS NULL');
        return qb;
    }

    private async getBatch(
        ctx: RequestContext,
        qb: SelectQueryBuilder<ProductVariant>,
        batchNumber: string | number,
    ): Promise<ProductVariant[]> {
        const { batchSize } = this.options;
        const i = Number.parseInt(batchNumber.toString(), 10);
        const variants = await qb
            .take(batchSize)
            .skip(i * batchSize)
            .addOrderBy('variants.id', 'ASC')
            .getMany();

        return this.hydrateVariants(ctx, variants);
    }

    private async getVariantsByIds(ctx: RequestContext, ids: ID[]) {
        const variants = await this.connection.getRepository(ProductVariant).findByIds(ids, {
            relations: variantRelations,
            where: {
                deletedAt: null,
            },
            order: {
                id: 'ASC',
            },
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

    private createVariantIndexItem(v: ProductVariant, channelId: ID): VariantIndexItem {
        const productAsset = v.product.featuredAsset;
        const variantAsset = v.featuredAsset;
        const item: VariantIndexItem = {
            channelId,
            productVariantId: v.id as string,
            sku: v.sku,
            slug: v.product.slug,
            productId: v.product.id as string,
            productName: v.product.name,
            productAssetId: productAsset ? productAsset.id : null,
            productPreview: productAsset ? productAsset.preview : '',
            productPreviewFocalPoint: productAsset ? productAsset.focalPoint || null : null,
            productVariantName: v.name,
            productVariantAssetId: variantAsset ? variantAsset.id : null,
            productVariantPreview: variantAsset ? variantAsset.preview : '',
            productVariantPreviewFocalPoint: productAsset ? productAsset.focalPoint || null : null,
            price: v.price,
            priceWithTax: v.priceWithTax,
            currencyCode: v.currencyCode,
            description: v.product.description,
            facetIds: this.getFacetIds([v]),
            channelIds: v.product.channels.map(c => c.id as string),
            facetValueIds: this.getFacetValueIds([v]),
            collectionIds: v.collections.map(c => c.id.toString()),
            enabled: v.enabled && v.product.enabled,
        };
        const customMappings = Object.entries(this.options.customProductVariantMappings);
        for (const [name, def] of customMappings) {
            item[name] = def.valueFn(v);
        }
        return item;
    }

    private createProductIndexItem(variants: ProductVariant[], channelId: ID): ProductIndexItem {
        const first = variants[0];
        const prices = variants.map(v => v.price);
        const pricesWithTax = variants.map(v => v.priceWithTax);
        const productAsset = first.product.featuredAsset;
        const variantAsset = variants.filter(v => v.featuredAsset).length
            ? variants.filter(v => v.featuredAsset)[0].featuredAsset
            : null;
        const item: ProductIndexItem = {
            channelId,
            sku: first.sku,
            slug: first.product.slug,
            productId: first.product.id,
            productName: first.product.name,
            productAssetId: productAsset ? productAsset.id : null,
            productPreview: productAsset ? productAsset.preview : '',
            productPreviewFocalPoint: productAsset ? productAsset.focalPoint || null : null,
            productVariantId: first.id,
            productVariantName: first.name,
            productVariantAssetId: variantAsset ? variantAsset.id : null,
            productVariantPreview: variantAsset ? variantAsset.preview : '',
            productVariantPreviewFocalPoint: productAsset ? productAsset.focalPoint || null : null,
            priceMin: Math.min(...prices),
            priceMax: Math.max(...prices),
            priceWithTaxMin: Math.min(...pricesWithTax),
            priceWithTaxMax: Math.max(...pricesWithTax),
            currencyCode: first.currencyCode,
            description: first.product.description,
            facetIds: this.getFacetIds(variants),
            facetValueIds: this.getFacetValueIds(variants),
            collectionIds: variants.reduce((ids, v) => [...ids, ...v.collections.map(c => c.id)], [] as ID[]),
            channelIds: first.product.channels.map(c => c.id as string),
            enabled: variants.some(v => v.enabled),
        };

        const customMappings = Object.entries(this.options.customProductMappings);
        for (const [name, def] of customMappings) {
            item[name] = def.valueFn(variants[0].product, variants);
        }
        return item;
    }

    private getFacetIds(variants: ProductVariant[]): string[] {
        const facetIds = (fv: FacetValue) => fv.facet.id.toString();
        const variantFacetIds = variants.reduce(
            (ids, v) => [...ids, ...v.facetValues.map(facetIds)],
            [] as string[],
        );
        const productFacetIds = variants[0].product.facetValues.map(facetIds);
        return unique([...variantFacetIds, ...productFacetIds]);
    }

    private getFacetValueIds(variants: ProductVariant[]): string[] {
        const facetValueIds = (fv: FacetValue) => fv.id.toString();
        const variantFacetValueIds = variants.reduce(
            (ids, v) => [...ids, ...v.facetValues.map(facetValueIds)],
            [] as string[],
        );
        const productFacetValueIds = variants[0].product.facetValues.map(facetValueIds);
        return unique([...variantFacetValueIds, ...productFacetValueIds]);
    }

    private getId(entityId: ID, channelId: ID): string {
        return `${channelId.toString()}__${entityId.toString()}`;
    }
}
