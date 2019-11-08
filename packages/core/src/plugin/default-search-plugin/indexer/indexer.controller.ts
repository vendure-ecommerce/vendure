import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { InjectConnection } from '@nestjs/typeorm';
import { LanguageCode } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { unique } from '@vendure/common/lib/unique';
import { defer, Observable } from 'rxjs';
import { Connection } from 'typeorm';
import { FindOptionsUtils } from 'typeorm/find-options/FindOptionsUtils';

import { RequestContext } from '../../../api/common/request-context';
import { Logger } from '../../../config/logger/vendure-logger';
import { FacetValue } from '../../../entity/facet-value/facet-value.entity';
import { ProductVariant } from '../../../entity/product-variant/product-variant.entity';
import { Product } from '../../../entity/product/product.entity';
import { translateDeep } from '../../../service/helpers/utils/translate-entity';
import { ProductVariantService } from '../../../service/services/product-variant.service';
import { TaxRateService } from '../../../service/services/tax-rate.service';
import { AsyncQueue } from '../async-queue';
import { SearchIndexItem } from '../search-index-item.entity';
import {
    DeleteProductMessage,
    DeleteVariantMessage,
    ReindexMessage,
    UpdateProductMessage,
    UpdateVariantMessage,
    UpdateVariantsByIdMessage,
} from '../types';

export const BATCH_SIZE = 1000;
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

export const workerLoggerCtx = 'DefaultSearchPlugin Worker';

@Controller()
export class IndexerController {
    private queue = new AsyncQueue('search-index');

    constructor(
        @InjectConnection() private connection: Connection,
        private productVariantService: ProductVariantService,
        private taxRateService: TaxRateService,
    ) {}

    @MessagePattern(ReindexMessage.pattern)
    reindex({ ctx: rawContext }: ReindexMessage['data']): Observable<ReindexMessage['response']> {
        const ctx = RequestContext.fromObject(rawContext);
        return new Observable(observer => {
            (async () => {
                const timeStart = Date.now();
                const qb = this.getSearchIndexQueryBuilder(ctx.channelId);
                const count = await qb.getCount();
                Logger.verbose(
                    `Reindexing ${count} variants for channel ${ctx.channel.code}`,
                    workerLoggerCtx,
                );
                const batches = Math.ceil(count / BATCH_SIZE);

                // Ensure tax rates are up-to-date.
                await this.taxRateService.updateActiveTaxRates();

                await this.connection
                    .getRepository(SearchIndexItem)
                    .delete({ languageCode: ctx.languageCode, channelId: ctx.channelId });
                Logger.verbose('Deleted existing index items', workerLoggerCtx);

                for (let i = 0; i < batches; i++) {
                    Logger.verbose(`Processing batch ${i + 1} of ${batches}`, workerLoggerCtx);

                    const variants = await qb
                        .andWhere('variants__product.deletedAt IS NULL')
                        .take(BATCH_SIZE)
                        .skip(i * BATCH_SIZE)
                        .getMany();
                    const hydratedVariants = this.hydrateVariants(ctx, variants);
                    await this.saveVariants(ctx, hydratedVariants);
                    observer.next({
                        total: count,
                        completed: Math.min((i + 1) * BATCH_SIZE, count),
                        duration: +new Date() - timeStart,
                    });
                }
                Logger.verbose(`Completed reindexing`, workerLoggerCtx);
                observer.next({
                    total: count,
                    completed: count,
                    duration: +new Date() - timeStart,
                });
                observer.complete();
            })();
        });
    }

    @MessagePattern(UpdateVariantsByIdMessage.pattern)
    updateVariantsById({
        ctx: rawContext,
        ids,
    }: UpdateVariantsByIdMessage['data']): Observable<UpdateVariantsByIdMessage['response']> {
        const ctx = RequestContext.fromObject(rawContext);

        return new Observable(observer => {
            (async () => {
                const timeStart = Date.now();
                if (ids.length) {
                    const batches = Math.ceil(ids.length / BATCH_SIZE);
                    Logger.verbose(`Updating ${ids.length} variants...`);

                    for (let i = 0; i < batches; i++) {
                        const begin = i * BATCH_SIZE;
                        const end = begin + BATCH_SIZE;
                        Logger.verbose(`Updating ids from index ${begin} to ${end}`);
                        const batchIds = ids.slice(begin, end);
                        const batch = await this.connection
                            .getRepository(ProductVariant)
                            .findByIds(batchIds, {
                                relations: variantRelations,
                            });
                        const variants = this.hydrateVariants(ctx, batch);
                        await this.saveVariants(ctx, variants);
                        observer.next({
                            total: ids.length,
                            completed: Math.min((i + 1) * BATCH_SIZE, ids.length),
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

    @MessagePattern(UpdateProductMessage.pattern)
    updateProduct(data: UpdateProductMessage['data']): Observable<UpdateProductMessage['response']> {
        const ctx = RequestContext.fromObject(data.ctx);
        return defer(async () => {
            const product = await this.connection.getRepository(Product).findOne(data.productId, {
                relations: ['variants'],
            });
            if (product) {
                let updatedVariants = await this.connection
                    .getRepository(ProductVariant)
                    .findByIds(product.variants.map(v => v.id), {
                        relations: variantRelations,
                    });
                if (product.enabled === false) {
                    updatedVariants.forEach(v => (v.enabled = false));
                }
                Logger.verbose(`Updating ${updatedVariants.length} variants`, workerLoggerCtx);
                updatedVariants = this.hydrateVariants(ctx, updatedVariants);
                if (updatedVariants.length) {
                    await this.saveVariants(ctx, updatedVariants);
                }
            }
            return true;
        });
    }

    @MessagePattern(UpdateVariantMessage.pattern)
    updateVariants(data: UpdateVariantMessage['data']): Observable<UpdateVariantMessage['response']> {
        const ctx = RequestContext.fromObject(data.ctx);
        return defer(async () => {
            const variants = await this.connection.getRepository(ProductVariant).findByIds(data.variantIds, {
                relations: variantRelations,
            });
            if (variants) {
                const updatedVariants = this.hydrateVariants(ctx, variants);
                Logger.verbose(`Updating ${updatedVariants.length} variants`, workerLoggerCtx);
                await this.saveVariants(ctx, updatedVariants);
            }
            return true;
        });
    }

    @MessagePattern(DeleteProductMessage.pattern)
    deleteProduct(data: DeleteProductMessage['data']): Observable<DeleteProductMessage['response']> {
        const ctx = RequestContext.fromObject(data.ctx);
        return defer(async () => {
            const product = await this.connection.getRepository(Product).findOne(data.productId, {
                relations: ['variants'],
            });
            if (product && product.deletedAt) {
                const removedVariantIds = product.variants.map(v => v.id);
                if (removedVariantIds.length) {
                    await this.removeSearchIndexItems(ctx, removedVariantIds);
                }
            }
            return true;
        });
    }

    @MessagePattern(DeleteVariantMessage.pattern)
    deleteVariant(data: DeleteVariantMessage['data']): Observable<DeleteVariantMessage['response']> {
        const ctx = RequestContext.fromObject(data.ctx);
        return defer(async () => {
            const variants = await this.connection.getRepository(ProductVariant).findByIds(data.variantIds);
            if (variants.length) {
                await this.removeSearchIndexItems(ctx, variants.map(v => v.id));
            }
            return true;
        });
    }

    private getSearchIndexQueryBuilder(channelId: ID) {
        const qb = this.connection.getRepository(ProductVariant).createQueryBuilder('variants');
        FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, {
            relations: variantRelations,
        });
        FindOptionsUtils.joinEagerRelations(qb, qb.alias, this.connection.getMetadata(ProductVariant));
        qb.leftJoin('variants.product', 'product')
            .leftJoin('product.channels', 'channel')
            .where('channel.id = :channelId', { channelId })
            .andWhere('variants__product.deletedAt IS NULL');
        return qb;
    }

    /**
     * Given an array of ProductVariants, this method applies the correct taxes and translations.
     */
    private hydrateVariants(ctx: RequestContext, variants: ProductVariant[]): ProductVariant[] {
        return variants
            .map(v => this.productVariantService.applyChannelPriceAndTax(v, ctx))
            .map(v => translateDeep(v, ctx.languageCode, ['product']));
    }

    private async saveVariants(ctx: RequestContext, variants: ProductVariant[]) {
        const items = variants.map(
            (v: ProductVariant) =>
                new SearchIndexItem({
                    productVariantId: v.id,
                    channelId: ctx.channelId,
                    languageCode: ctx.languageCode,
                    sku: v.sku,
                    enabled: v.enabled,
                    slug: v.product.slug,
                    price: v.price,
                    priceWithTax: v.priceWithTax,
                    productId: v.product.id,
                    productName: v.product.name,
                    description: v.product.description,
                    productVariantName: v.name,
                    productPreview: v.product.featuredAsset ? v.product.featuredAsset.preview : '',
                    productVariantPreview: v.featuredAsset ? v.featuredAsset.preview : '',
                    channelIds: v.product.channels.map(c => c.id as string),
                    facetIds: this.getFacetIds(v),
                    facetValueIds: this.getFacetValueIds(v),
                    collectionIds: v.collections.map(c => c.id.toString()),
                }),
        );
        await this.queue.push(() => this.connection.getRepository(SearchIndexItem).save(items));
    }

    private getFacetIds(variant: ProductVariant): string[] {
        const facetIds = (fv: FacetValue) => fv.facet.id.toString();
        const variantFacetIds = variant.facetValues.map(facetIds);
        const productFacetIds = variant.product.facetValues.map(facetIds);
        return unique([...variantFacetIds, ...productFacetIds]);
    }

    private getFacetValueIds(variant: ProductVariant): string[] {
        const facetValueIds = (fv: FacetValue) => fv.id.toString();
        const variantFacetValueIds = variant.facetValues.map(facetValueIds);
        const productFacetValueIds = variant.product.facetValues.map(facetValueIds);
        return unique([...variantFacetValueIds, ...productFacetValueIds]);
    }

    /**
     * Remove items from the search index
     */
    private async removeSearchIndexItems(ctx: RequestContext, variantIds: ID[]) {
        const compositeKeys = variantIds.map(id => ({
            productVariantId: id,
            channelId: ctx.channelId,
            languageCode: ctx.languageCode,
        })) as any[];
        await this.queue.push(() => this.connection.getRepository(SearchIndexItem).delete(compositeKeys));
    }
}
