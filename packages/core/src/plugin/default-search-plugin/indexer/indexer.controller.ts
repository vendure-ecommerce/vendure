import { Injectable } from '@nestjs/common';
import { LanguageCode } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { unique } from '@vendure/common/lib/unique';
import { Observable } from 'rxjs';
import { FindOptionsUtils } from 'typeorm/find-options/FindOptionsUtils';

import { RequestContext } from '../../../api/common/request-context';
import { AsyncQueue } from '../../../common/async-queue';
import { Translatable, Translation } from '../../../common/types/locale-types';
import { idsAreEqual } from '../../../common/utils';
import { ConfigService } from '../../../config/config.service';
import { Logger } from '../../../config/logger/vendure-logger';
import { FacetValue } from '../../../entity/facet-value/facet-value.entity';
import { ProductVariant } from '../../../entity/product-variant/product-variant.entity';
import { Product } from '../../../entity/product/product.entity';
import { ProductVariantService } from '../../../service/services/product-variant.service';
import { TransactionalConnection } from '../../../service/transaction/transactional-connection';
import { asyncObservable } from '../../../worker/async-observable';
import { SearchIndexItem } from '../search-index-item.entity';
import {
    ProductChannelMessageData,
    ReindexMessageData,
    ReindexMessageResponse,
    UpdateAssetMessageData,
    UpdateProductMessageData,
    UpdateVariantMessageData,
    UpdateVariantsByIdMessageData,
    VariantChannelMessageData,
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
    'channels',
    'channels.defaultTaxZone',
];

export const workerLoggerCtx = 'DefaultSearchPlugin Worker';

@Injectable()
export class IndexerController {
    private queue = new AsyncQueue('search-index');

    constructor(
        private connection: TransactionalConnection,
        private productVariantService: ProductVariantService,
        private configService: ConfigService,
    ) {}

    reindex({ ctx: rawContext }: ReindexMessageData): Observable<ReindexMessageResponse> {
        const ctx = RequestContext.deserialize(rawContext);
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
                await this.saveVariants(variants);
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

    updateVariantsById({
        ctx: rawContext,
        ids,
    }: UpdateVariantsByIdMessageData): Observable<ReindexMessageResponse> {
        const ctx = RequestContext.deserialize(rawContext);

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
                    await this.saveVariants(batch);
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

    async updateProduct(data: UpdateProductMessageData): Promise<boolean> {
        const ctx = RequestContext.deserialize(data.ctx);
        return this.updateProductInChannel(ctx, data.productId, ctx.channelId);
    }

    async updateVariants(data: UpdateVariantMessageData): Promise<boolean> {
        const ctx = RequestContext.deserialize(data.ctx);
        return this.updateVariantsInChannel(ctx, data.variantIds, ctx.channelId);
    }

    async deleteProduct(data: UpdateProductMessageData): Promise<boolean> {
        const ctx = RequestContext.deserialize(data.ctx);
        return this.deleteProductInChannel(ctx, data.productId, ctx.channelId);
    }

    async deleteVariant(data: UpdateVariantMessageData): Promise<boolean> {
        const ctx = RequestContext.deserialize(data.ctx);
        const variants = await this.connection.getRepository(ProductVariant).findByIds(data.variantIds);
        if (variants.length) {
            await this.removeSearchIndexItems(
                ctx.languageCode,
                ctx.channelId,
                variants.map(v => v.id),
            );
        }
        return true;
    }

    async assignProductToChannel(data: ProductChannelMessageData): Promise<boolean> {
        const ctx = RequestContext.deserialize(data.ctx);
        return this.updateProductInChannel(ctx, data.productId, data.channelId);
    }

    async removeProductFromChannel(data: ProductChannelMessageData): Promise<boolean> {
        const ctx = RequestContext.deserialize(data.ctx);
        return this.deleteProductInChannel(ctx, data.productId, data.channelId);
    }

    async assignVariantToChannel(data: VariantChannelMessageData): Promise<boolean> {
        const ctx = RequestContext.deserialize(data.ctx);
        return this.updateVariantsInChannel(ctx, [data.productVariantId], data.channelId);
    }

    async removeVariantFromChannel(data: VariantChannelMessageData): Promise<boolean> {
        const ctx = RequestContext.deserialize(data.ctx);
        await this.removeSearchIndexItems(ctx.languageCode, data.channelId, [data.productVariantId]);
        return true;
    }

    async updateAsset(data: UpdateAssetMessageData): Promise<boolean> {
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
    }

    async deleteAsset(data: UpdateAssetMessageData): Promise<boolean> {
        const id = data.asset.id;
        await this.connection
            .getRepository(SearchIndexItem)
            .update({ productAssetId: id }, { productAssetId: null });
        await this.connection
            .getRepository(SearchIndexItem)
            .update({ productVariantAssetId: id }, { productVariantAssetId: null });
        return true;
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
            const updatedVariants = await this.connection.getRepository(ProductVariant).findByIds(
                product.variants.map(v => v.id),
                {
                    relations: variantRelations,
                    where: { deletedAt: null },
                },
            );
            if (updatedVariants.length === 0) {
                await this.saveSyntheticVariant(ctx, product);
            } else {
                if (product.enabled === false) {
                    updatedVariants.forEach(v => (v.enabled = false));
                }
                const variantsInCurrentChannel = updatedVariants.filter(
                    v => !!v.channels.find(c => idsAreEqual(c.id, ctx.channelId)),
                );
                Logger.verbose(`Updating ${variantsInCurrentChannel.length} variants`, workerLoggerCtx);
                if (variantsInCurrentChannel.length) {
                    await this.saveVariants(variantsInCurrentChannel);
                }
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
            Logger.verbose(`Updating ${variants.length} variants`, workerLoggerCtx);
            await this.saveVariants(variants);
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
        FindOptionsUtils.joinEagerRelations(
            qb,
            qb.alias,
            this.connection.rawConnection.getMetadata(ProductVariant),
        );
        qb.leftJoin('variants.product', 'product')
            .leftJoin('product.channels', 'channel')
            .where('channel.id = :channelId', { channelId })
            .andWhere('variants__product.deletedAt IS NULL')
            .andWhere('variants.deletedAt IS NULL');
        return qb;
    }

    private async saveVariants(variants: ProductVariant[]) {
        const items: SearchIndexItem[] = [];

        await this.removeSyntheticVariants(variants);

        for (const variant of variants) {
            const languageVariants = unique([
                ...variant.translations.map(t => t.languageCode),
                ...variant.product.translations.map(t => t.languageCode),
            ]);
            for (const languageCode of languageVariants) {
                const productTranslation = this.getTranslation(variant.product, languageCode);
                const variantTranslation = this.getTranslation(variant, languageCode);
                const collectionTranslations = variant.collections.map(c =>
                    this.getTranslation(c, languageCode),
                );

                for (const channel of variant.channels) {
                    const ctx = new RequestContext({
                        channel,
                        apiType: 'admin',
                        authorizedAsOwnerOnly: false,
                        isAuthorized: true,
                        session: {} as any,
                    });
                    await this.productVariantService.applyChannelPriceAndTax(variant, ctx);
                    items.push(
                        new SearchIndexItem({
                            channelId: channel.id,
                            languageCode,
                            productVariantId: variant.id,
                            price: variant.price,
                            priceWithTax: variant.priceWithTax,
                            sku: variant.sku,
                            enabled: variant.product.enabled === false ? false : variant.enabled,
                            slug: productTranslation.slug,
                            productId: variant.product.id,
                            productName: productTranslation.name,
                            description: productTranslation.description,
                            productVariantName: variantTranslation.name,
                            productAssetId: variant.product.featuredAsset
                                ? variant.product.featuredAsset.id
                                : null,
                            productPreviewFocalPoint: variant.product.featuredAsset
                                ? variant.product.featuredAsset.focalPoint
                                : null,
                            productVariantPreviewFocalPoint: variant.featuredAsset
                                ? variant.featuredAsset.focalPoint
                                : null,
                            productVariantAssetId: variant.featuredAsset ? variant.featuredAsset.id : null,
                            productPreview: variant.product.featuredAsset
                                ? variant.product.featuredAsset.preview
                                : '',
                            productVariantPreview: variant.featuredAsset ? variant.featuredAsset.preview : '',
                            channelIds: variant.channels.map(c => c.id as string),
                            facetIds: this.getFacetIds(variant),
                            facetValueIds: this.getFacetValueIds(variant),
                            collectionIds: variant.collections.map(c => c.id.toString()),
                            collectionSlugs: collectionTranslations.map(c => c.slug),
                        }),
                    );
                }
            }
        }

        await this.queue.push(() => this.connection.getRepository(SearchIndexItem).save(items));
    }

    /**
     * If a Product has no variants, we create a synthetic variant for the purposes
     * of making that product visible via the search query.
     */
    private async saveSyntheticVariant(ctx: RequestContext, product: Product) {
        const productTranslation = this.getTranslation(product, ctx.languageCode);
        const item = new SearchIndexItem({
            channelId: ctx.channelId,
            languageCode: ctx.languageCode,
            productVariantId: 0,
            price: 0,
            priceWithTax: 0,
            sku: '',
            enabled: false,
            slug: productTranslation.slug,
            productId: product.id,
            productName: productTranslation.name,
            description: productTranslation.description,
            productVariantName: productTranslation.name,
            productAssetId: product.featuredAsset?.id ?? null,
            productPreviewFocalPoint: product.featuredAsset?.focalPoint ?? null,
            productVariantPreviewFocalPoint: null,
            productVariantAssetId: null,
            productPreview: product.featuredAsset?.preview ?? '',
            productVariantPreview: '',
            channelIds: [ctx.channelId.toString()],
            facetIds: product.facetValues?.map(fv => fv.facet.id.toString()) ?? [],
            facetValueIds: product.facetValues?.map(fv => fv.id.toString()) ?? [],
            collectionIds: [],
            collectionSlugs: [],
        });
        await this.queue.push(() => this.connection.getRepository(SearchIndexItem).save(item));
    }

    /**
     * Removes any synthetic variants for the given product
     */
    private async removeSyntheticVariants(variants: ProductVariant[]) {
        const prodIds = unique(variants.map(v => v.productId));
        for (const productId of prodIds) {
            await this.queue.push(() =>
                this.connection.getRepository(SearchIndexItem).delete({
                    productId,
                    sku: '',
                    price: 0,
                }),
            );
        }
    }

    private getTranslation<T extends Translatable>(
        translatable: T,
        languageCode: LanguageCode,
    ): Translation<T> {
        return ((translatable.translations.find(t => t.languageCode === languageCode) ||
            translatable.translations.find(t => t.languageCode === this.configService.defaultLanguageCode) ||
            translatable.translations[0]) as unknown) as Translation<T>;
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
