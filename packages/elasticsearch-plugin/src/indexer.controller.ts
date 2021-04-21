import { Client } from '@elastic/elasticsearch';
import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { unique } from '@vendure/common/lib/unique';
import {
    Asset,
    asyncObservable,
    AsyncQueue,
    Channel,
    Collection,
    ConfigService,
    FacetValue,
    ID,
    LanguageCode,
    Logger,
    Product,
    ProductVariant,
    ProductVariantService,
    RequestContext,
    TransactionalConnection,
    Translatable,
    Translation,
} from '@vendure/core';
import { Observable } from 'rxjs';

import { ELASTIC_SEARCH_OPTIONS, loggerCtx, PRODUCT_INDEX_NAME, VARIANT_INDEX_NAME } from './constants';
import { createIndices, deleteIndices } from './indexing-utils';
import { ElasticsearchOptions } from './options';
import {
    BulkOperation,
    BulkOperationDoc,
    BulkResponseBody,
    ProductChannelMessageData,
    ProductIndexItem,
    ReindexMessageData,
    UpdateAssetMessageData,
    UpdateProductMessageData,
    UpdateVariantMessageData,
    UpdateVariantsByIdMessageData,
    VariantChannelMessageData,
    VariantIndexItem,
} from './types';

export const productRelations = [
    'variants',
    'featuredAsset',
    'facetValues',
    'facetValues.facet',
    'channels',
    'channels.defaultTaxZone',
];

export const variantRelations = [
    'featuredAsset',
    'facetValues',
    'facetValues.facet',
    'collections',
    'taxCategory',
    'channels',
    'channels.defaultTaxZone',
];

export interface ReindexMessageResponse {
    total: number;
    completed: number;
    duration: number;
}

@Injectable()
export class ElasticsearchIndexerController implements OnModuleInit, OnModuleDestroy {
    private client: Client;
    private asyncQueue = new AsyncQueue('elasticsearch-indexer', 5);

    constructor(
        private connection: TransactionalConnection,
        @Inject(ELASTIC_SEARCH_OPTIONS) private options: Required<ElasticsearchOptions>,
        private productVariantService: ProductVariantService,
        private configService: ConfigService,
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
    async updateProduct({ ctx: rawContext, productId }: UpdateProductMessageData): Promise<boolean> {
        await this.updateProductsInternal([productId]);
        return true;
    }

    /**
     * Updates the search index only for the affected product.
     */
    async deleteProduct({ ctx: rawContext, productId }: UpdateProductMessageData): Promise<boolean> {
        await this.deleteProductInternal(productId);
        return true;
    }

    /**
     * Updates the search index only for the affected product.
     */
    async assignProductToChannel({
        ctx: rawContext,
        productId,
        channelId,
    }: ProductChannelMessageData): Promise<boolean> {
        await this.updateProductsInternal([productId]);
        return true;
    }

    /**
     * Updates the search index only for the affected product.
     */
    async removeProductFromChannel({
        ctx: rawContext,
        productId,
        channelId,
    }: ProductChannelMessageData): Promise<boolean> {
        await this.updateProductsInternal([productId]);
        return true;
    }

    async assignVariantToChannel({
        ctx: rawContext,
        productVariantId,
        channelId,
    }: VariantChannelMessageData): Promise<boolean> {
        const productIds = await this.getProductIdsByVariantIds([productVariantId]);
        await this.updateProductsInternal(productIds);
        return true;
    }

    async removeVariantFromChannel({
        ctx: rawContext,
        productVariantId,
        channelId,
    }: VariantChannelMessageData): Promise<boolean> {
        const productIds = await this.getProductIdsByVariantIds([productVariantId]);
        await this.updateProductsInternal(productIds);
        return true;
    }

    /**
     * Updates the search index only for the affected entities.
     */
    async updateVariants({ ctx: rawContext, variantIds }: UpdateVariantMessageData): Promise<boolean> {
        return this.asyncQueue.push(async () => {
            const productIds = await this.getProductIdsByVariantIds(variantIds);
            await this.updateProductsInternal(productIds);
            return true;
        });
    }

    async deleteVariants({ ctx: rawContext, variantIds }: UpdateVariantMessageData): Promise<boolean> {
        const productIds = await this.getProductIdsByVariantIds(variantIds);
        for (const productId of productIds) {
            await this.deleteProductInternal(productId);
        }
        return true;
    }

    updateVariantsById({
        ctx: rawContext,
        ids,
    }: UpdateVariantsByIdMessageData): Observable<ReindexMessageResponse> {
        return asyncObservable(async observer => {
            return this.asyncQueue.push(async () => {
                const timeStart = Date.now();
                const productIds = await this.getProductIdsByVariantIds(ids);
                if (productIds.length) {
                    let finishedProductsCount = 0;
                    for (const productId of productIds) {
                        await this.updateProductsInternal([productId]);
                        finishedProductsCount++;
                        observer.next({
                            total: productIds.length,
                            completed: Math.min(finishedProductsCount, productIds.length),
                            duration: +new Date() - timeStart,
                        });
                    }
                }
                Logger.verbose(`Completed updating variants`, loggerCtx);
                return {
                    total: productIds.length,
                    completed: productIds.length,
                    duration: +new Date() - timeStart,
                };
            });
        });
    }

    reindex({ ctx: rawContext, dropIndices }: ReindexMessageData): Observable<ReindexMessageResponse> {
        return asyncObservable(async observer => {
            return this.asyncQueue.push(async () => {
                const timeStart = Date.now();

                if (dropIndices) {
                    await deleteIndices(this.client, this.options.indexPrefix);
                    await createIndices(
                        this.client,
                        this.options.indexPrefix,
                        this.configService.entityIdStrategy.primaryKeyType,
                    );
                }

                const deletedProductIds = await this.connection
                    .getRepository(Product)
                    .createQueryBuilder('product')
                    .select('product.id')
                    .where('product.deletedAt IS NOT NULL')
                    .getMany();

                for (const { id: deletedProductId } of deletedProductIds) {
                    await this.deleteProductInternal(deletedProductId);
                }

                const productIds = await this.connection
                    .getRepository(Product)
                    .createQueryBuilder('product')
                    .select('product.id')
                    .where('product.deletedAt IS NULL')
                    .getMany();

                let finishedProductsCount = 0;
                for (const { id: productId } of productIds) {
                    await this.updateProductsInternal([productId]);
                    finishedProductsCount++;
                    observer.next({
                        total: productIds.length,
                        completed: Math.min(finishedProductsCount, productIds.length),
                        duration: +new Date() - timeStart,
                    });
                }
                Logger.verbose(`Completed reindexing!`, loggerCtx);
                return {
                    total: productIds.length,
                    completed: productIds.length,
                    duration: +new Date() - timeStart,
                };
            });
        });
    }

    async updateAsset(data: UpdateAssetMessageData): Promise<boolean> {
        const result1 = await this.updateAssetFocalPointForIndex(PRODUCT_INDEX_NAME, data.asset);
        const result2 = await this.updateAssetFocalPointForIndex(VARIANT_INDEX_NAME, data.asset);
        await this.client.indices.refresh({
            index: [
                this.options.indexPrefix + PRODUCT_INDEX_NAME,
                this.options.indexPrefix + VARIANT_INDEX_NAME,
            ],
        });
        return result1 && result2;
    }

    async deleteAsset(data: UpdateAssetMessageData): Promise<boolean> {
        const result1 = await this.deleteAssetForIndex(PRODUCT_INDEX_NAME, data.asset);
        const result2 = await this.deleteAssetForIndex(VARIANT_INDEX_NAME, data.asset);
        await this.client.indices.refresh({
            index: [
                this.options.indexPrefix + PRODUCT_INDEX_NAME,
                this.options.indexPrefix + VARIANT_INDEX_NAME,
            ],
        });
        return result1 && result2;
    }

    private async updateAssetFocalPointForIndex(indexName: string, asset: Asset): Promise<boolean> {
        const focalPoint = asset.focalPoint || null;
        const params = { focalPoint };
        return this.updateAssetForIndex(
            indexName,
            asset,
            {
                source: 'ctx._source.productPreviewFocalPoint = params.focalPoint',
                params,
            },
            {
                source: 'ctx._source.productVariantPreviewFocalPoint = params.focalPoint',
                params,
            },
        );
    }

    private async deleteAssetForIndex(indexName: string, asset: Asset): Promise<boolean> {
        return this.updateAssetForIndex(
            indexName,
            asset,
            { source: 'ctx._source.productAssetId = null' },
            { source: 'ctx._source.productVariantAssetId = null' },
        );
    }

    private async updateAssetForIndex(
        indexName: string,
        asset: Asset,
        updateProductScript: { source: string; params?: any },
        updateVariantScript: { source: string; params?: any },
    ): Promise<boolean> {
        const result1 = await this.client.update_by_query({
            index: this.options.indexPrefix + indexName,
            body: {
                script: updateProductScript,
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
                script: updateVariantScript,
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

    private async updateVariantsInternal(productVariants: ProductVariant[]) {
        if (productVariants.length) {
            const operations: Array<BulkOperation | BulkOperationDoc<VariantIndexItem>> = [];
            for (const variant of productVariants) {
                const languageVariants = variant.translations.map(t => t.languageCode);
                for (const channel of variant.channels) {
                    const channelCtx = new RequestContext({
                        channel,
                        apiType: 'admin',
                        authorizedAsOwnerOnly: false,
                        isAuthorized: true,
                        session: {} as any,
                    });
                    await this.productVariantService.applyChannelPriceAndTax(variant, channelCtx);
                    for (const languageCode of languageVariants) {
                        operations.push(
                            { update: { _id: this.getId(variant.id, channelCtx.channelId, languageCode) } },
                            {
                                doc: this.createVariantIndexItem(variant, channelCtx.channelId, languageCode),
                                doc_as_upsert: true,
                            },
                        );
                    }
                }
            }
            Logger.verbose(`Updating ${productVariants.length} ProductVariants`, loggerCtx);
            await this.executeBulkOperations(VARIANT_INDEX_NAME, operations);
        }
    }

    private async updateProductsInternal(productIds: ID[]) {
        Logger.verbose(`Updating ${productIds.length} Products`, loggerCtx);
        const operations: Array<BulkOperation | BulkOperationDoc<ProductIndexItem>> = [];

        for (const productId of productIds) {
            await this.deleteProductInternal(productId);
            const product = await this.connection.getRepository(Product).findOne(productId, {
                relations: productRelations,
                where: {
                    deletedAt: null,
                },
            });
            if (product) {
                const updatedProductVariants = await this.connection.getRepository(ProductVariant).findByIds(
                    product.variants.map(v => v.id),
                    {
                        relations: variantRelations,
                        where: {
                            deletedAt: null,
                        },
                        order: {
                            id: 'ASC',
                        },
                    },
                );
                updatedProductVariants.forEach(variant => (variant.product = product));
                if (product.enabled === false) {
                    updatedProductVariants.forEach(v => (v.enabled = false));
                }
                Logger.verbose(`Updating Product (${productId})`, loggerCtx);
                if (updatedProductVariants.length) await this.updateVariantsInternal(updatedProductVariants);

                const languageVariants = product.translations.map(t => t.languageCode);

                for (const channel of product.channels) {
                    const channelCtx = new RequestContext({
                        channel,
                        apiType: 'admin',
                        authorizedAsOwnerOnly: false,
                        isAuthorized: true,
                        session: {} as any,
                    });

                    const variantsInChannel = updatedProductVariants.filter(v =>
                        v.channels.map(c => c.id).includes(channelCtx.channelId),
                    );
                    for (const variant of variantsInChannel) {
                        await this.productVariantService.applyChannelPriceAndTax(variant, channelCtx);
                    }
                    for (const languageCode of languageVariants) {
                        operations.push(
                            {
                                update: {
                                    _id: this.getId(product.id, channelCtx.channelId, languageCode),
                                },
                            },
                            {
                                doc: variantsInChannel.length
                                    ? this.createProductIndexItem(
                                          variantsInChannel,
                                          channelCtx.channelId,
                                          languageCode,
                                      )
                                    : this.createSyntheticProductIndexItem(channelCtx, product, languageCode),
                                doc_as_upsert: true,
                            },
                        );
                    }
                }
            }
        }
        await this.executeBulkOperations(PRODUCT_INDEX_NAME, operations);
    }

    private async deleteProductInternal(productId: ID) {
        Logger.verbose(`Deleting 1 Product (${productId})`, loggerCtx);
        const channels = await this.connection
            .getRepository(Channel)
            .createQueryBuilder('channel')
            .select('channel.id')
            .getMany();
        const product = await this.connection.getRepository(Product).findOne(productId, {
            relations: ['variants'],
        });
        if (product) {
            const operations: BulkOperation[] = [];
            for (const { id: channelId } of channels) {
                const languageVariants = product.translations.map(t => t.languageCode);
                for (const languageCode of languageVariants) {
                    operations.push({ delete: { _id: this.getId(product.id, channelId, languageCode) } });
                }
            }
            await this.deleteVariantsInternal(
                product.variants,
                channels.map(c => c.id),
            );
            await this.executeBulkOperations(PRODUCT_INDEX_NAME, operations);
        }
    }

    private async deleteVariantsInternal(variants: ProductVariant[], channelIds: ID[]) {
        Logger.verbose(`Deleting ${variants.length} ProductVariants`, loggerCtx);
        const operations: BulkOperation[] = [];
        for (const variant of variants) {
            for (const channelId of channelIds) {
                const languageVariants = variant.translations.map(t => t.languageCode);
                for (const languageCode of languageVariants) {
                    operations.push({
                        delete: { _id: this.getId(variant.id, channelId, languageCode) },
                    });
                }
            }
        }
        await this.executeBulkOperations(VARIANT_INDEX_NAME, operations);
    }

    private async getProductIdsByVariantIds(variantIds: ID[]): Promise<ID[]> {
        const variants = await this.connection.getRepository(ProductVariant).findByIds(variantIds, {
            relations: ['product'],
            loadEagerRelations: false,
        });
        return unique(variants.map(v => v.product.id));
    }

    private async executeBulkOperations(
        indexName: string,
        operations: Array<BulkOperation | BulkOperationDoc<VariantIndexItem | ProductIndexItem>>,
    ) {
        try {
            const fullIndexName = this.options.indexPrefix + indexName;
            const { body }: { body: BulkResponseBody } = await this.client.bulk({
                refresh: true,
                index: fullIndexName,
                body: operations,
            });

            if (body.errors) {
                Logger.error(
                    `Some errors occurred running bulk operations on ${fullIndexName}! Set logger to "debug" to print all errors.`,
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

    private createVariantIndexItem(
        v: ProductVariant,
        channelId: ID,
        languageCode: LanguageCode,
    ): VariantIndexItem {
        const productAsset = v.product.featuredAsset;
        const variantAsset = v.featuredAsset;
        const productTranslation = this.getTranslation(v.product, languageCode);
        const variantTranslation = this.getTranslation(v, languageCode);
        const collectionTranslations = v.collections.map(c => this.getTranslation(c, languageCode));

        const item: VariantIndexItem = {
            channelId,
            languageCode,
            productVariantId: v.id,
            sku: v.sku,
            slug: productTranslation.slug,
            productId: v.product.id,
            productName: productTranslation.name,
            productAssetId: productAsset ? productAsset.id : undefined,
            productPreview: productAsset ? productAsset.preview : '',
            productPreviewFocalPoint: productAsset ? productAsset.focalPoint || undefined : undefined,
            productVariantName: variantTranslation.name,
            productVariantAssetId: variantAsset ? variantAsset.id : undefined,
            productVariantPreview: variantAsset ? variantAsset.preview : '',
            productVariantPreviewFocalPoint: productAsset ? productAsset.focalPoint || undefined : undefined,
            price: v.price,
            priceWithTax: v.priceWithTax,
            currencyCode: v.currencyCode,
            description: productTranslation.description,
            facetIds: this.getFacetIds([v]),
            channelIds: v.channels.map(c => c.id),
            facetValueIds: this.getFacetValueIds([v]),
            collectionIds: v.collections.map(c => c.id.toString()),
            collectionSlugs: collectionTranslations.map(c => c.slug),
            enabled: v.enabled && v.product.enabled,
        };
        const customMappings = Object.entries(this.options.customProductVariantMappings);
        for (const [name, def] of customMappings) {
            item[name] = def.valueFn(v, languageCode);
        }
        return item;
    }

    private createProductIndexItem(
        variants: ProductVariant[],
        channelId: ID,
        languageCode: LanguageCode,
    ): ProductIndexItem {
        const first = variants[0];
        const prices = variants.map(v => v.price);
        const pricesWithTax = variants.map(v => v.priceWithTax);
        const productAsset = first.product.featuredAsset;
        const variantAsset = variants.filter(v => v.featuredAsset).length
            ? variants.filter(v => v.featuredAsset)[0].featuredAsset
            : null;
        const productTranslation = this.getTranslation(first.product, languageCode);
        const variantTranslation = this.getTranslation(first, languageCode);
        const collectionTranslations = variants.reduce(
            (translations, variant) => [
                ...translations,
                ...variant.collections.map(c => this.getTranslation(c, languageCode)),
            ],
            [] as Array<Translation<Collection>>,
        );

        const item: ProductIndexItem = {
            channelId,
            languageCode,
            sku: first.sku,
            slug: productTranslation.slug,
            productId: first.product.id,
            productName: productTranslation.name,
            productAssetId: productAsset ? productAsset.id : undefined,
            productPreview: productAsset ? productAsset.preview : '',
            productPreviewFocalPoint: productAsset ? productAsset.focalPoint || undefined : undefined,
            productVariantId: first.id,
            productVariantName: variantTranslation.name,
            productVariantAssetId: variantAsset ? variantAsset.id : undefined,
            productVariantPreview: variantAsset ? variantAsset.preview : '',
            productVariantPreviewFocalPoint: productAsset ? productAsset.focalPoint || undefined : undefined,
            priceMin: Math.min(...prices),
            priceMax: Math.max(...prices),
            priceWithTaxMin: Math.min(...pricesWithTax),
            priceWithTaxMax: Math.max(...pricesWithTax),
            currencyCode: first.currencyCode,
            description: productTranslation.description,
            facetIds: this.getFacetIds(variants),
            facetValueIds: this.getFacetValueIds(variants),
            collectionIds: variants.reduce((ids, v) => [...ids, ...v.collections.map(c => c.id)], [] as ID[]),
            collectionSlugs: collectionTranslations.map(c => c.slug),
            channelIds: first.product.channels.map(c => c.id),
            enabled: variants.some(v => v.enabled) && first.product.enabled,
        };

        const customMappings = Object.entries(this.options.customProductMappings);
        for (const [name, def] of customMappings) {
            item[name] = def.valueFn(variants[0].product, variants, languageCode);
        }
        return item;
    }

    /**
     * If a Product has no variants, we create a synthetic variant for the purposes
     * of making that product visible via the search query.
     */
    private createSyntheticProductIndexItem(
        ctx: RequestContext,
        product: Product,
        languageCode: LanguageCode,
    ): ProductIndexItem {
        const productTranslation = this.getTranslation(product, ctx.languageCode);
        return {
            channelId: ctx.channelId,
            languageCode: languageCode,
            sku: '',
            slug: productTranslation.slug,
            productId: product.id,
            productName: productTranslation.name,
            productAssetId: product.featuredAsset?.id ?? undefined,
            productPreview: product.featuredAsset?.preview ?? '',
            productPreviewFocalPoint: product.featuredAsset?.focalPoint ?? undefined,
            productVariantId: 0,
            productVariantName: productTranslation.name,
            productVariantAssetId: undefined,
            productVariantPreview: '',
            productVariantPreviewFocalPoint: undefined,
            priceMin: 0,
            priceMax: 0,
            priceWithTaxMin: 0,
            priceWithTaxMax: 0,
            currencyCode: ctx.channel.currencyCode,
            description: productTranslation.description,
            facetIds: product.facetValues?.map(fv => fv.facet.id.toString()) ?? [],
            facetValueIds: product.facetValues?.map(fv => fv.id.toString()) ?? [],
            collectionIds: [],
            collectionSlugs: [],
            channelIds: [ctx.channelId],
            enabled: false,
        };
    }

    private getTranslation<T extends Translatable>(
        translatable: T,
        languageCode: LanguageCode,
    ): Translation<T> {
        return ((translatable.translations.find(t => t.languageCode === languageCode) ||
            translatable.translations.find(t => t.languageCode === this.configService.defaultLanguageCode) ||
            translatable.translations[0]) as unknown) as Translation<T>;
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

    private getId(entityId: ID, channelId: ID, languageCode: LanguageCode): string {
        return `${channelId.toString()}_${entityId.toString()}_${languageCode}`;
    }
}
