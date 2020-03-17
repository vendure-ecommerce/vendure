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
import { AsyncQueue } from '../../../common/async-queue';
import { Logger } from '../../../config/logger/vendure-logger';
import { FacetValue } from '../../../entity/facet-value/facet-value.entity';
import { ProductVariant } from '../../../entity/product-variant/product-variant.entity';
import { Product } from '../../../entity/product/product.entity';
import { translateDeep } from '../../../service/helpers/utils/translate-entity';
import { ProductVariantService } from '../../../service/services/product-variant.service';
import { asyncObservable } from '../../../worker/async-observable';
import { SearchIndexItem } from '../search-index-item.entity';
import {
    AssignProductToChannelMessage,
    DeleteProductMessage,
    DeleteVariantMessage,
    ReindexMessage,
    RemoveProductFromChannelMessage,
    UpdateAssetMessage,
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
    ) {}

    @MessagePattern(ReindexMessage.pattern)
    reindex({ ctx: rawContext }: ReindexMessage['data']): Observable<ReindexMessage['response']> {
        const ctx = RequestContext.fromObject(rawContext);
        return asyncObservable(async observer => {
            const timeStart = Date.now();
            const qb = this.getSearchIndexQueryBuilder(ctx.channelId);
            const count = await qb.getCount();
            Logger.verbose(`Reindexing ${count} variants for channel ${ctx.channel.code}`, workerLoggerCtx);
            const batches = Math.ceil(count / BATCH_SIZE);

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
                await this.saveVariants(ctx.languageCode, ctx.channelId, hydratedVariants);
                observer.next({
                    total: count,
                    completed: Math.min((i + 1) * BATCH_SIZE, count),
                    duration: +new Date() - timeStart,
                });
            }
            Logger.verbose(`Completed reindexing`, workerLoggerCtx);
            return {
                total: count,
                completed: count,
                duration: +new Date() - timeStart,
            };
        });
    }

    @MessagePattern(UpdateVariantsByIdMessage.pattern)
    updateVariantsById({
        ctx: rawContext,
        ids,
    }: UpdateVariantsByIdMessage['data']): Observable<UpdateVariantsByIdMessage['response']> {
        const ctx = RequestContext.fromObject(rawContext);

        return asyncObservable(async observer => {
            const timeStart = Date.now();
            if (ids.length) {
                const batches = Math.ceil(ids.length / BATCH_SIZE);
                Logger.verbose(`Updating ${ids.length} variants...`);

                for (let i = 0; i < batches; i++) {
                    const begin = i * BATCH_SIZE;
                    const end = begin + BATCH_SIZE;
                    Logger.verbose(`Updating ids from index ${begin} to ${end}`);
                    const batchIds = ids.slice(begin, end);
                    const batch = await this.connection.getRepository(ProductVariant).findByIds(batchIds, {
                        relations: variantRelations,
                        where: { deletedAt: null },
                    });
                    const variants = this.hydrateVariants(ctx, batch);
                    await this.saveVariants(ctx.languageCode, ctx.channelId, variants);
                    observer.next({
                        total: ids.length,
                        completed: Math.min((i + 1) * BATCH_SIZE, ids.length),
                        duration: +new Date() - timeStart,
                    });
                }
            }
            Logger.verbose(`Completed reindexing!`);
            return {
                total: ids.length,
                completed: ids.length,
                duration: +new Date() - timeStart,
            };
        });
    }

    @MessagePattern(UpdateProductMessage.pattern)
    updateProduct(data: UpdateProductMessage['data']): Observable<UpdateProductMessage['response']> {
        const ctx = RequestContext.fromObject(data.ctx);
        return asyncObservable(async () => {
            return this.updateProductInChannel(ctx, data.productId, ctx.channelId);
        });
    }

    @MessagePattern(UpdateVariantMessage.pattern)
    updateVariants(data: UpdateVariantMessage['data']): Observable<UpdateVariantMessage['response']> {
        const ctx = RequestContext.fromObject(data.ctx);
        return asyncObservable(async () => {
            return this.updateVariantsInChannel(ctx, data.variantIds, ctx.channelId);
        });
    }

    @MessagePattern(DeleteProductMessage.pattern)
    deleteProduct(data: DeleteProductMessage['data']): Observable<DeleteProductMessage['response']> {
        const ctx = RequestContext.fromObject(data.ctx);
        return asyncObservable(async () => {
            return this.deleteProductInChannel(ctx, data.productId, ctx.channelId);
        });
    }

    @MessagePattern(DeleteVariantMessage.pattern)
    deleteVariant(data: DeleteVariantMessage['data']): Observable<DeleteVariantMessage['response']> {
        const ctx = RequestContext.fromObject(data.ctx);
        return asyncObservable(async () => {
            const variants = await this.connection.getRepository(ProductVariant).findByIds(data.variantIds);
            if (variants.length) {
                await this.removeSearchIndexItems(ctx.languageCode, ctx.channelId, variants.map(v => v.id));
            }
            return true;
        });
    }

    @MessagePattern(AssignProductToChannelMessage.pattern)
    assignProductToChannel(
        data: AssignProductToChannelMessage['data'],
    ): Observable<AssignProductToChannelMessage['response']> {
        const ctx = RequestContext.fromObject(data.ctx);
        return asyncObservable(async () => {
            return this.updateProductInChannel(ctx, data.productId, data.channelId);
        });
    }

    @MessagePattern(RemoveProductFromChannelMessage.pattern)
    removeProductFromChannel(
        data: RemoveProductFromChannelMessage['data'],
    ): Observable<RemoveProductFromChannelMessage['response']> {
        const ctx = RequestContext.fromObject(data.ctx);
        return asyncObservable(async () => {
            return this.deleteProductInChannel(ctx, data.productId, data.channelId);
        });
    }

    @MessagePattern(UpdateAssetMessage.pattern)
    updateAsset(data: UpdateAssetMessage['data']): Observable<UpdateAssetMessage['response']> {
        return asyncObservable(async () => {
            const id = data.asset.id;
            function getFocalPoint(point?: { x: number; y: number }) {
                return point && point.x && point.y ? point : null;
            }
            const focalPoint = getFocalPoint(data.asset.focalPoint);
            await this.connection
                .getRepository(SearchIndexItem)
                .update({ productAssetId: id }, { productPreviewFocalPoint: focalPoint });
            await this.connection
                .getRepository(SearchIndexItem)
                .update({ productVariantAssetId: id }, { productVariantPreviewFocalPoint: focalPoint });
            return true;
        });
    }

    private async updateProductInChannel(
        ctx: RequestContext,
        productId: ID,
        channelId: ID,
    ): Promise<boolean> {
        const product = await this.connection.getRepository(Product).findOne(productId, {
            relations: ['variants'],
        });
        if (product) {
            let updatedVariants = await this.connection
                .getRepository(ProductVariant)
                .findByIds(product.variants.map(v => v.id), {
                    relations: variantRelations,
                    where: { deletedAt: null },
                });
            if (product.enabled === false) {
                updatedVariants.forEach(v => (v.enabled = false));
            }
            Logger.verbose(`Updating ${updatedVariants.length} variants`, workerLoggerCtx);
            updatedVariants = this.hydrateVariants(ctx, updatedVariants);
            if (updatedVariants.length) {
                await this.saveVariants(ctx.languageCode, channelId, updatedVariants);
            }
        }
        return true;
    }

    private async updateVariantsInChannel(
        ctx: RequestContext,
        variantIds: ID[],
        channelId: ID,
    ): Promise<boolean> {
        const variants = await this.connection.getRepository(ProductVariant).findByIds(variantIds, {
            relations: variantRelations,
            where: { deletedAt: null },
        });
        if (variants) {
            const updatedVariants = this.hydrateVariants(ctx, variants);
            Logger.verbose(`Updating ${updatedVariants.length} variants`, workerLoggerCtx);
            await this.saveVariants(ctx.languageCode, channelId, updatedVariants);
        }
        return true;
    }

    private async deleteProductInChannel(
        ctx: RequestContext,
        productId: ID,
        channelId: ID,
    ): Promise<boolean> {
        const product = await this.connection.getRepository(Product).findOne(productId, {
            relations: ['variants'],
        });
        if (product) {
            const removedVariantIds = product.variants.map(v => v.id);
            if (removedVariantIds.length) {
                await this.removeSearchIndexItems(ctx.languageCode, channelId, removedVariantIds);
            }
        }
        return true;
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
            .andWhere('variants__product.deletedAt IS NULL')
            .andWhere('variants.deletedAt IS NULL');
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

    private async saveVariants(languageCode: LanguageCode, channelId: ID, variants: ProductVariant[]) {
        const items = variants.map(
            (v: ProductVariant) =>
                new SearchIndexItem({
                    productVariantId: v.id,
                    channelId,
                    languageCode,
                    sku: v.sku,
                    enabled: v.enabled,
                    slug: v.product.slug,
                    price: v.price,
                    priceWithTax: v.priceWithTax,
                    productId: v.product.id,
                    productName: v.product.name,
                    description: v.product.description,
                    productVariantName: v.name,
                    productAssetId: v.product.featuredAsset ? v.product.featuredAsset.id : null,
                    productPreviewFocalPoint: v.product.featuredAsset
                        ? v.product.featuredAsset.focalPoint
                        : null,
                    productVariantPreviewFocalPoint: v.featuredAsset ? v.featuredAsset.focalPoint : null,
                    productVariantAssetId: v.featuredAsset ? v.featuredAsset.id : null,
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
    private async removeSearchIndexItems(languageCode: LanguageCode, channelId: ID, variantIds: ID[]) {
        const compositeKeys = variantIds.map(id => ({
            productVariantId: id,
            channelId,
            languageCode,
        })) as any[];
        await this.queue.push(() => this.connection.getRepository(SearchIndexItem).delete(compositeKeys));
    }
}
