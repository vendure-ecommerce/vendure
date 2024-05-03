import { Inject, Injectable } from '@nestjs/common';
import { JobState, LanguageCode } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { notNullOrUndefined } from '@vendure/common/lib/shared-utils';
import { unique } from '@vendure/common/lib/unique';
import { Observable } from 'rxjs';
import { FindManyOptions, In } from 'typeorm';

import { RequestContext } from '../../../api/common/request-context';
import { RequestContextCacheService } from '../../../cache/request-context-cache.service';
import { AsyncQueue } from '../../../common/async-queue';
import { Translatable, Translation } from '../../../common/types/locale-types';
import { asyncObservable, idsAreEqual } from '../../../common/utils';
import { ConfigService } from '../../../config/config.service';
import { Logger } from '../../../config/logger/vendure-logger';
import { TransactionalConnection } from '../../../connection/transactional-connection';
import { Channel } from '../../../entity/channel/channel.entity';
import { FacetValue } from '../../../entity/facet-value/facet-value.entity';
import { Product } from '../../../entity/product/product.entity';
import { ProductVariant } from '../../../entity/product-variant/product-variant.entity';
import { Job } from '../../../job-queue/job';
import { EntityHydrator } from '../../../service/helpers/entity-hydrator/entity-hydrator.service';
import { ProductPriceApplicator } from '../../../service/helpers/product-price-applicator/product-price-applicator';
import { ProductVariantService } from '../../../service/services/product-variant.service';
import { PLUGIN_INIT_OPTIONS } from '../constants';
import { SearchIndexItem } from '../entities/search-index-item.entity';
import {
    DefaultSearchPluginInitOptions,
    ProductChannelMessageData,
    ReindexMessageResponse,
    UpdateAssetMessageData,
    UpdateIndexQueueJobData,
    UpdateProductMessageData,
    UpdateVariantMessageData,
    UpdateVariantsByIdJobData,
    VariantChannelMessageData,
} from '../types';

import { MutableRequestContext } from './mutable-request-context';

export const BATCH_SIZE = 1000;
export const productRelations = ['featuredAsset', 'facetValues', 'facetValues.facet', 'channels'];
export const variantRelations = [
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
        private entityHydrator: EntityHydrator,
        private productPriceApplicator: ProductPriceApplicator,
        private configService: ConfigService,
        private requestContextCache: RequestContextCacheService,
        private productVariantService: ProductVariantService,
        @Inject(PLUGIN_INIT_OPTIONS) private options: DefaultSearchPluginInitOptions,
    ) {}

    reindex(job: Job<UpdateIndexQueueJobData>): Observable<ReindexMessageResponse> {
        const { ctx: rawContext } = job.data;
        const ctx = MutableRequestContext.deserialize(rawContext);
        return asyncObservable(async observer => {
            const timeStart = Date.now();
            const channel = ctx.channel ?? (await this.loadChannel(ctx, ctx.channelId));
            const qb = this.getSearchIndexQueryBuilder(ctx, channel);
            const count = await qb.getCount();
            Logger.verbose(`Reindexing ${count} variants for channel ${ctx.channel.code}`, workerLoggerCtx);
            const batches = Math.ceil(count / BATCH_SIZE);

            await this.connection.getRepository(ctx, SearchIndexItem).delete({ channelId: ctx.channelId });
            Logger.verbose('Deleted existing index items', workerLoggerCtx);

            for (let i = 0; i < batches; i++) {
                if (job.state === JobState.CANCELLED) {
                    throw new Error('reindex job was cancelled');
                }
                Logger.verbose(`Processing batch ${i + 1} of ${batches}`, workerLoggerCtx);
                const variants = await qb
                    .take(BATCH_SIZE)
                    .skip(i * BATCH_SIZE)
                    .getMany();
                await this.saveVariants(ctx, variants);
                observer.next({
                    total: count,
                    completed: Math.min((i + 1) * BATCH_SIZE, count),
                    duration: +new Date() - timeStart,
                });
            }
            Logger.verbose('Completed reindexing', workerLoggerCtx);

            return {
                total: count,
                completed: count,
                duration: +new Date() - timeStart,
            };
        });
    }

    updateVariantsById(job: Job<UpdateVariantsByIdJobData>): Observable<ReindexMessageResponse> {
        const { ctx: rawContext, ids } = job.data;
        const ctx = MutableRequestContext.deserialize(rawContext);

        return asyncObservable(async observer => {
            const timeStart = Date.now();
            if (ids.length) {
                const batches = Math.ceil(ids.length / BATCH_SIZE);
                Logger.verbose(`Updating ${ids.length} variants...`);

                for (let i = 0; i < batches; i++) {
                    if (job.state === JobState.CANCELLED) {
                        throw new Error('updateVariantsById job was cancelled');
                    }
                    const begin = i * BATCH_SIZE;
                    const end = begin + BATCH_SIZE;
                    Logger.verbose(`Updating ids from index ${begin} to ${end}`);
                    const batchIds = ids.slice(begin, end);
                    const batch = await this.getSearchIndexQueryBuilder(
                        ctx,
                        ...(await this.getAllChannels(ctx)),
                    )
                        .where('variants.deletedAt IS NULL AND variants.id IN (:...ids)', { ids: batchIds })
                        .getMany();

                    await this.saveVariants(ctx, batch);
                    observer.next({
                        total: ids.length,
                        completed: Math.min((i + 1) * BATCH_SIZE, ids.length),
                        duration: +new Date() - timeStart,
                    });
                }
            }
            Logger.verbose('Completed reindexing!');
            return {
                total: ids.length,
                completed: ids.length,
                duration: +new Date() - timeStart,
            };
        });
    }

    async updateProduct(data: UpdateProductMessageData): Promise<boolean> {
        const ctx = MutableRequestContext.deserialize(data.ctx);
        return this.updateProductInChannel(ctx, data.productId, ctx.channelId);
    }

    async updateVariants(data: UpdateVariantMessageData): Promise<boolean> {
        const ctx = MutableRequestContext.deserialize(data.ctx);
        return this.updateVariantsInChannel(ctx, data.variantIds, ctx.channelId);
    }

    async deleteProduct(data: UpdateProductMessageData): Promise<boolean> {
        const ctx = MutableRequestContext.deserialize(data.ctx);
        return this.deleteProductInChannel(
            ctx,
            data.productId,
            (await this.getAllChannels(ctx)).map(x => x.id),
        );
    }

    async deleteVariant(data: UpdateVariantMessageData): Promise<boolean> {
        const ctx = MutableRequestContext.deserialize(data.ctx);
        const variants = await this.connection.getRepository(ctx, ProductVariant).find({
            where: { id: In(data.variantIds) },
        });
        if (variants.length) {
            await this.removeSearchIndexItems(
                ctx,
                variants.map(v => v.id),
                (await this.getAllChannels(ctx)).map(c => c.id),
            );
        }
        return true;
    }

    async assignProductToChannel(data: ProductChannelMessageData): Promise<boolean> {
        const ctx = MutableRequestContext.deserialize(data.ctx);
        return this.updateProductInChannel(ctx, data.productId, data.channelId);
    }

    async removeProductFromChannel(data: ProductChannelMessageData): Promise<boolean> {
        const ctx = MutableRequestContext.deserialize(data.ctx);
        return this.deleteProductInChannel(ctx, data.productId, [data.channelId]);
    }

    async assignVariantToChannel(data: VariantChannelMessageData): Promise<boolean> {
        const ctx = MutableRequestContext.deserialize(data.ctx);
        return this.updateVariantsInChannel(ctx, [data.productVariantId], data.channelId);
    }

    async removeVariantFromChannel(data: VariantChannelMessageData): Promise<boolean> {
        const ctx = MutableRequestContext.deserialize(data.ctx);
        const variant = await this.connection
            .getRepository(ctx, ProductVariant)
            .findOne({ where: { id: data.productVariantId } });
        const languageVariants = variant?.translations.map(t => t.languageCode) ?? [];
        await this.removeSearchIndexItems(ctx, [data.productVariantId], [data.channelId]);
        return true;
    }

    async updateAsset(data: UpdateAssetMessageData): Promise<boolean> {
        const id = data.asset.id;
        const ctx = MutableRequestContext.deserialize(data.ctx);

        function getFocalPoint(point?: { x: number; y: number }) {
            return point && point.x && point.y ? point : null;
        }

        const focalPoint = getFocalPoint(data.asset.focalPoint);
        await this.connection
            .getRepository(ctx, SearchIndexItem)
            .update({ productAssetId: id }, { productPreviewFocalPoint: focalPoint });
        await this.connection
            .getRepository(ctx, SearchIndexItem)
            .update({ productVariantAssetId: id }, { productVariantPreviewFocalPoint: focalPoint });
        return true;
    }

    async deleteAsset(data: UpdateAssetMessageData): Promise<boolean> {
        const id = data.asset.id;
        const ctx = MutableRequestContext.deserialize(data.ctx);

        await this.connection
            .getRepository(ctx, SearchIndexItem)
            .update({ productAssetId: id }, { productAssetId: null });
        await this.connection
            .getRepository(ctx, SearchIndexItem)
            .update({ productVariantAssetId: id }, { productVariantAssetId: null });
        return true;
    }

    private async updateProductInChannel(
        ctx: MutableRequestContext,
        productId: ID,
        channelId: ID,
    ): Promise<boolean> {
        const channel = await this.loadChannel(ctx, channelId);
        ctx.setChannel(channel);
        const product = await this.getProductInChannelQueryBuilder(ctx, productId, channel).getOneOrFail();
        if (product) {
            const affectedChannels = await this.getAllChannels(ctx, {
                where: {
                    availableLanguageCodes: In(product.translations.map(t => t.languageCode)),
                },
            });
            const updatedVariants = await this.getSearchIndexQueryBuilder(
                ctx,
                ...unique(affectedChannels.concat(channel)),
            )
                .andWhere('variants.productId = :productId', { productId })
                .getMany();
            if (updatedVariants.length === 0) {
                const clone = new Product({ id: product.id });
                await this.entityHydrator.hydrate(ctx, clone, { relations: ['translations' as never] });
                product.translations = clone.translations;
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
                    await this.saveVariants(ctx, variantsInCurrentChannel);
                }
            }
        }
        return true;
    }

    private async updateVariantsInChannel(
        ctx: MutableRequestContext,
        variantIds: ID[],
        channelId: ID,
    ): Promise<boolean> {
        const channel = await this.loadChannel(ctx, channelId);
        ctx.setChannel(channel);
        const variants = await this.getSearchIndexQueryBuilder(ctx, channel)
            .andWhere('variants.deletedAt IS NULL AND variants.id IN (:...variantIds)', { variantIds })
            .getMany();

        if (variants) {
            Logger.verbose(`Updating ${variants.length} variants`, workerLoggerCtx);
            await this.saveVariants(ctx, variants);
        }
        return true;
    }

    private async deleteProductInChannel(
        ctx: RequestContext,
        productId: ID,
        channelIds: ID[],
    ): Promise<boolean> {
        const channels = await Promise.all(channelIds.map(channelId => this.loadChannel(ctx, channelId)));
        const product = await this.getProductInChannelQueryBuilder(ctx, productId, ...channels)
            .leftJoinAndSelect('product.variants', 'variants')
            .leftJoinAndSelect('variants.translations', 'variants_translations')
            .getOne();

        if (product) {
            const removedVariantIds = product.variants.map(v => v.id);
            if (removedVariantIds.length) {
                await this.removeSearchIndexItems(ctx, removedVariantIds, channelIds);
            }
        }
        return true;
    }

    private async loadChannel(ctx: RequestContext, channelId: ID): Promise<Channel> {
        return await this.connection.getRepository(ctx, Channel).findOneOrFail({ where: { id: channelId } });
    }

    private async getAllChannels(
        ctx: RequestContext,
        options?: FindManyOptions<Channel> | undefined,
    ): Promise<Channel[]> {
        return await this.connection.getRepository(ctx, Channel).find(options);
    }

    private getSearchIndexQueryBuilder(ctx: RequestContext, ...channels: Channel[]) {
        const channelLanguages = unique(
            channels.flatMap(c => c.availableLanguageCodes).concat(this.configService.defaultLanguageCode),
        );
        const qb = this.connection
            .getRepository(ctx, ProductVariant)
            .createQueryBuilder('variants')
            .setFindOptions({
                loadEagerRelations: false,
            })
            .leftJoinAndSelect(
                'variants.channels',
                'variant_channels',
                'variant_channels.id IN (:...channelId)',
                {
                    channelId: channels.map(x => x.id),
                },
            )
            .leftJoinAndSelect('variant_channels.defaultTaxZone', 'variant_channel_tax_zone')
            .leftJoinAndSelect('variants.taxCategory', 'variant_tax_category')
            .leftJoinAndSelect(
                'variants.productVariantPrices',
                'product_variant_prices',
                'product_variant_prices.channelId IN (:...channelId)',
                { channelId: channels.map(x => x.id) },
            )
            .leftJoinAndSelect(
                'variants.translations',
                'product_variant_translation',
                'product_variant_translation.baseId = variants.id AND product_variant_translation.languageCode IN (:...channelLanguages)',
                {
                    channelLanguages,
                },
            )
            .leftJoin('variants.product', 'product')
            .leftJoinAndSelect('variants.facetValues', 'variant_facet_values')
            .leftJoinAndSelect(
                'variant_facet_values.translations',
                'variant_facet_value_translations',
                'variant_facet_value_translations.languageCode IN (:...channelLanguages)',
                {
                    channelLanguages,
                },
            )
            .leftJoinAndSelect('variant_facet_values.facet', 'facet_values_facet')
            .leftJoinAndSelect(
                'facet_values_facet.translations',
                'facet_values_facet_translations',
                'facet_values_facet_translations.languageCode IN (:...channelLanguages)',
                {
                    channelLanguages,
                },
            )
            .leftJoinAndSelect('variants.collections', 'collections')
            .leftJoinAndSelect(
                'collections.channels',
                'collection_channels',
                'collection_channels.id IN (:...channelId)',
                { channelId: channels.map(x => x.id) },
            )
            .leftJoinAndSelect(
                'collections.translations',
                'collection_translations',
                'collection_translations.languageCode IN (:...channelLanguages)',
                {
                    channelLanguages,
                },
            )
            .leftJoin('product.channels', 'channel')
            .where('channel.id IN (:...channelId)', { channelId: channels.map(x => x.id) })
            .andWhere('product.deletedAt IS NULL')
            .andWhere('variants.deletedAt IS NULL');
        return qb;
    }

    private getProductInChannelQueryBuilder(ctx: RequestContext, productId: ID, ...channels: Channel[]) {
        const channelLanguages = unique(
            channels.flatMap(c => c.availableLanguageCodes).concat(this.configService.defaultLanguageCode),
        );
        return this.connection
            .getRepository(ctx, Product)
            .createQueryBuilder('product')
            .setFindOptions({
                loadEagerRelations: false,
            })
            .leftJoinAndSelect(
                'product.translations',
                'translations',
                'translations.languageCode IN (:...channelLanguages)',
                {
                    channelLanguages,
                },
            )
            .leftJoinAndSelect('product.featuredAsset', 'product_featured_asset')
            .leftJoinAndSelect('product.facetValues', 'product_facet_values')
            .leftJoinAndSelect(
                'product_facet_values.translations',
                'product_facet_value_translations',
                'product_facet_value_translations.languageCode IN (:...channelLanguages)',
                {
                    channelLanguages,
                },
            )
            .leftJoinAndSelect('product_facet_values.facet', 'product_facet')
            .leftJoinAndSelect(
                'product_facet.translations',
                'product_facet_translations',
                'product_facet_translations.languageCode IN (:...channelLanguages)',
                {
                    channelLanguages,
                },
            )
            .leftJoinAndSelect('product.channels', 'channel', 'channel.id IN (:...channelId)', {
                channelId: channels.map(x => x.id),
            })
            .where('product.id = :productId', { productId });
    }

    private async saveVariants(ctx: MutableRequestContext, variants: ProductVariant[]) {
        const items: SearchIndexItem[] = [];

        await this.removeSyntheticVariants(ctx, variants);
        const productMap = new Map<ID, Product>();

        for (const variant of variants) {
            let product = productMap.get(variant.productId);
            if (!product) {
                product = await this.getProductInChannelQueryBuilder(
                    ctx,
                    variant.productId,
                    ctx.channel,
                ).getOneOrFail();
                productMap.set(variant.productId, product);
            }
            const availableLanguageCodes = unique(ctx.channel.availableLanguageCodes);
            for (const languageCode of availableLanguageCodes) {
                const productTranslation = this.getTranslation(product, languageCode);
                const variantTranslation = this.getTranslation(variant, languageCode);
                const collectionTranslations = variant.collections.map(c =>
                    this.getTranslation(c, languageCode),
                );
                let channelIds = variant.channels.map(x => x.id);
                const clone = new ProductVariant({ id: variant.id });
                await this.entityHydrator.hydrate(ctx, clone, {
                    relations: ['channels', 'channels.defaultTaxZone'],
                });
                channelIds.push(
                    ...clone.channels
                        .filter(x => x.availableLanguageCodes.includes(languageCode))
                        .map(x => x.id),
                );
                channelIds = unique(channelIds);

                for (const channel of variant.channels) {
                    ctx.setChannel(channel);
                    await this.productPriceApplicator.applyChannelPriceAndTax(variant, ctx);
                    const item = new SearchIndexItem({
                        channelId: ctx.channelId,
                        languageCode,
                        productVariantId: variant.id,
                        price: variant.price,
                        priceWithTax: variant.priceWithTax,
                        sku: variant.sku,
                        enabled: product.enabled === false ? false : variant.enabled,
                        slug: productTranslation?.slug ?? '',
                        productId: product.id,
                        productName: productTranslation?.name ?? '',
                        description: this.constrainDescription(productTranslation?.description ?? ''),
                        productVariantName: variantTranslation?.name ?? '',
                        productAssetId: product.featuredAsset ? product.featuredAsset.id : null,
                        productPreviewFocalPoint: product.featuredAsset
                            ? product.featuredAsset.focalPoint
                            : null,
                        productVariantPreviewFocalPoint: variant.featuredAsset
                            ? variant.featuredAsset.focalPoint
                            : null,
                        productVariantAssetId: variant.featuredAsset ? variant.featuredAsset.id : null,
                        productPreview: product.featuredAsset ? product.featuredAsset.preview : '',
                        productVariantPreview: variant.featuredAsset ? variant.featuredAsset.preview : '',
                        channelIds: channelIds.map(x => x.toString()),
                        facetIds: this.getFacetIds(variant, product),
                        facetValueIds: this.getFacetValueIds(variant, product),
                        collectionIds: variant.collections.map(c => c.id.toString()),
                        collectionSlugs:
                            collectionTranslations.map(c => c?.slug).filter(notNullOrUndefined) ?? [],
                    });
                    if (this.options.indexStockStatus) {
                        item.inStock =
                            0 < (await this.productVariantService.getSaleableStockLevel(ctx, variant));
                        const productInStock = await this.requestContextCache.get(
                            ctx,
                            `productVariantsStock-${variant.productId}`,
                            () =>
                                this.connection
                                    .getRepository(ctx, ProductVariant)
                                    .find({
                                        loadEagerRelations: false,
                                        where: {
                                            productId: variant.productId,
                                        },
                                    })
                                    .then(_variants =>
                                        Promise.all(
                                            _variants.map(v =>
                                                this.productVariantService.getSaleableStockLevel(ctx, v),
                                            ),
                                        ),
                                    )
                                    .then(stockLevels => stockLevels.some(stockLevel => 0 < stockLevel)),
                        );
                        item.productInStock = productInStock;
                    }
                    items.push(item);
                }
            }
        }

        await this.queue.push(() =>
            this.connection.getRepository(ctx, SearchIndexItem).save(items, { chunk: 2500 }),
        );
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
            description: this.constrainDescription(productTranslation.description),
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
        await this.queue.push(() => this.connection.getRepository(ctx, SearchIndexItem).save(item));
    }

    /**
     * Removes any synthetic variants for the given product
     */
    private async removeSyntheticVariants(ctx: RequestContext, variants: ProductVariant[]) {
        const prodIds = unique(variants.map(v => v.productId));
        for (const productId of prodIds) {
            await this.queue.push(() =>
                this.connection.getRepository(ctx, SearchIndexItem).delete({
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
        return (translatable.translations.find(t => t.languageCode === languageCode) ||
            translatable.translations.find(t => t.languageCode === this.configService.defaultLanguageCode) ||
            translatable.translations[0]) as unknown as Translation<T>;
    }

    private getFacetIds(variant: ProductVariant, product: Product): string[] {
        const facetIds = (fv: FacetValue) => fv.facet.id.toString();
        const variantFacetIds = variant.facetValues.map(facetIds);
        const productFacetIds = product.facetValues.map(facetIds);
        return unique([...variantFacetIds, ...productFacetIds]);
    }

    private getFacetValueIds(variant: ProductVariant, product: Product): string[] {
        const facetValueIds = (fv: FacetValue) => fv.id.toString();
        const variantFacetValueIds = variant.facetValues.map(facetValueIds);
        const productFacetValueIds = product.facetValues.map(facetValueIds);
        return unique([...variantFacetValueIds, ...productFacetValueIds]);
    }

    /**
     * Remove items from the search index
     */
    private async removeSearchIndexItems(
        ctx: RequestContext,
        variantIds: ID[],
        channelIds: ID[],
        ...languageCodes: LanguageCode[]
    ) {
        const keys: Array<Partial<SearchIndexItem>> = [];
        for (const productVariantId of variantIds) {
            for (const channelId of channelIds) {
                if (languageCodes.length > 0) {
                    for (const languageCode of languageCodes) {
                        keys.push({
                            productVariantId,
                            channelId,
                            languageCode,
                        });
                    }
                } else {
                    keys.push({
                        productVariantId,
                        channelId,
                    });
                }
            }
        }
        await this.queue.push(() => this.connection.getRepository(ctx, SearchIndexItem).delete(keys as any));
    }

    /**
     * Prevent postgres errors from too-long indices
     * https://github.com/vendure-ecommerce/vendure/issues/745
     */
    private constrainDescription(description: string): string {
        const { type } = this.connection.rawConnection.options;
        const isPostgresLike = type === 'postgres' || type === 'aurora-postgres' || type === 'cockroachdb';
        if (isPostgresLike) {
            return description.substring(0, 2600);
        }
        return description;
    }
}
