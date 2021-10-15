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
    EntityRelationPaths,
    FacetValue,
    ID,
    LanguageCode,
    Logger,
    Product,
    ProductPriceApplicator,
    ProductVariant,
    ProductVariantService,
    RequestContext,
    RequestContextCacheService,
    TransactionalConnection,
    Translatable,
    Translation,
} from '@vendure/core';
import { Observable } from 'rxjs';

import { ELASTIC_SEARCH_OPTIONS, loggerCtx, VARIANT_INDEX_NAME } from '../constants';
import { ElasticsearchOptions } from '../options';
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
} from '../types';

import { createIndices, getClient, getIndexNameByAlias } from './indexing-utils';
import { MutableRequestContext } from './mutable-request-context';

export const defaultProductRelations: Array<EntityRelationPaths<Product>> = [
    'variants',
    'featuredAsset',
    'facetValues',
    'facetValues.facet',
    'channels',
    'channels.defaultTaxZone',
];

export const defaultVariantRelations: Array<EntityRelationPaths<ProductVariant>> = [
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

type BulkVariantOperation = {
    index: typeof VARIANT_INDEX_NAME;
    operation: BulkOperation | BulkOperationDoc<VariantIndexItem>;
};

@Injectable()
export class ElasticsearchIndexerController implements OnModuleInit, OnModuleDestroy {
    private client: Client;
    private asyncQueue = new AsyncQueue('elasticsearch-indexer', 5);
    private productRelations: Array<EntityRelationPaths<Product>>;
    private variantRelations: Array<EntityRelationPaths<ProductVariant>>;

    constructor(
        private connection: TransactionalConnection,
        @Inject(ELASTIC_SEARCH_OPTIONS) private options: Required<ElasticsearchOptions>,
        private productPriceApplicator: ProductPriceApplicator,
        private configService: ConfigService,
        private productVariantService: ProductVariantService,
        private requestContextCache: RequestContextCacheService,
    ) {}

    onModuleInit(): any {
        this.client = getClient(this.options);
        this.productRelations = this.getReindexRelationsRelations(
            defaultProductRelations,
            this.options.hydrateProductRelations,
        );
        this.variantRelations = this.getReindexRelationsRelations(
            defaultVariantRelations,
            this.options.hydrateProductVariantRelations,
        );
    }

    onModuleDestroy(): any {
        return this.client.close();
    }

    /**
     * Updates the search index only for the affected product.
     */
    async updateProduct({ ctx: rawContext, productId }: UpdateProductMessageData): Promise<boolean> {
        const ctx = MutableRequestContext.deserialize(rawContext);
        await this.updateProductsInternal(ctx, [productId]);
        return true;
    }

    /**
     * Updates the search index only for the affected product.
     */
    async deleteProduct({ ctx: rawContext, productId }: UpdateProductMessageData): Promise<boolean> {
        const operations = await this.deleteProductOperations(
            RequestContext.deserialize(rawContext),
            productId,
        );
        await this.executeBulkOperations(operations);
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
        const ctx = MutableRequestContext.deserialize(rawContext);
        await this.updateProductsInternal(ctx, [productId]);
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
        const ctx = MutableRequestContext.deserialize(rawContext);
        await this.updateProductsInternal(ctx, [productId]);
        return true;
    }

    async assignVariantToChannel({
        ctx: rawContext,
        productVariantId,
        channelId,
    }: VariantChannelMessageData): Promise<boolean> {
        const productIds = await this.getProductIdsByVariantIds([productVariantId]);
        const ctx = MutableRequestContext.deserialize(rawContext);
        await this.updateProductsInternal(ctx, productIds);
        return true;
    }

    async removeVariantFromChannel({
        ctx: rawContext,
        productVariantId,
        channelId,
    }: VariantChannelMessageData): Promise<boolean> {
        const productIds = await this.getProductIdsByVariantIds([productVariantId]);
        const ctx = MutableRequestContext.deserialize(rawContext);
        await this.updateProductsInternal(ctx, productIds);
        return true;
    }

    /**
     * Updates the search index only for the affected entities.
     */
    async updateVariants({ ctx: rawContext, variantIds }: UpdateVariantMessageData): Promise<boolean> {
        const ctx = MutableRequestContext.deserialize(rawContext);
        return this.asyncQueue.push(async () => {
            const productIds = await this.getProductIdsByVariantIds(variantIds);
            await this.updateProductsInternal(ctx, productIds);
            return true;
        });
    }

    async deleteVariants({ ctx: rawContext, variantIds }: UpdateVariantMessageData): Promise<boolean> {
        const ctx = MutableRequestContext.deserialize(rawContext);
        const productIds = await this.getProductIdsByVariantIds(variantIds);
        for (const productId of productIds) {
            await this.updateProductsInternal(ctx, [productId]);
        }
        return true;
    }

    updateVariantsById({
        ctx: rawContext,
        ids,
    }: UpdateVariantsByIdMessageData): Observable<ReindexMessageResponse> {
        const ctx = MutableRequestContext.deserialize(rawContext);
        return asyncObservable(async observer => {
            return this.asyncQueue.push(async () => {
                const timeStart = Date.now();
                const productIds = await this.getProductIdsByVariantIds(ids);
                if (productIds.length) {
                    let finishedProductsCount = 0;
                    for (const productId of productIds) {
                        await this.updateProductsInternal(ctx, [productId]);
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

    reindex({ ctx: rawContext }: ReindexMessageData): Observable<ReindexMessageResponse> {
        return asyncObservable(async observer => {
            return this.asyncQueue.push(async () => {
                const timeStart = Date.now();
                const operations: BulkVariantOperation[] = [];
                const ctx = MutableRequestContext.deserialize(rawContext);

                const reindexTempName = new Date().getTime();
                const variantIndexName = this.options.indexPrefix + VARIANT_INDEX_NAME;
                const reindexVariantAliasName = variantIndexName + `-reindex-${reindexTempName}`;
                try {
                    await createIndices(
                        this.client,
                        this.options.indexPrefix,
                        this.options.indexSettings,
                        this.options.indexMappingProperties,
                        true,
                        `-reindex-${reindexTempName}`,
                    );

                    const reindexVariantIndexName = await getIndexNameByAlias(
                        this.client,
                        reindexVariantAliasName,
                    );
                    const originalVariantAliasExist = await this.client.indices.existsAlias({
                        name: variantIndexName,
                    });
                    const originalVariantIndexExist = await this.client.indices.exists({
                        index: variantIndexName,
                    });

                    const originalVariantIndexName = await getIndexNameByAlias(this.client, variantIndexName);

                    if (originalVariantAliasExist.body || originalVariantIndexExist.body) {
                        await this.client.reindex({
                            refresh: true,
                            body: {
                                source: {
                                    index: variantIndexName,
                                },
                                dest: {
                                    index: reindexVariantAliasName,
                                },
                            },
                        });
                    }

                    const actions = [
                        {
                            remove: {
                                index: reindexVariantIndexName,
                                alias: reindexVariantAliasName,
                            },
                        },
                        {
                            add: {
                                index: reindexVariantIndexName,
                                alias: variantIndexName,
                            },
                        },
                    ];

                    if (originalVariantAliasExist.body) {
                        actions.push({
                            remove: {
                                index: originalVariantIndexName,
                                alias: variantIndexName,
                            },
                        });
                    } else if (originalVariantIndexExist.body) {
                        await this.client.indices.delete({
                            index: [variantIndexName],
                        });
                    }

                    await this.client.indices.updateAliases({
                        body: {
                            actions,
                        },
                    });

                    if (originalVariantAliasExist.body) {
                        await this.client.indices.delete({
                            index: [originalVariantIndexName],
                        });
                    }
                } catch (e) {
                    Logger.warn(
                        `Could not recreate indices. Reindexing continue with existing indices.`,
                        loggerCtx,
                    );
                    Logger.warn(JSON.stringify(e), loggerCtx);
                } finally {
                    const reindexVariantAliasExist = await this.client.indices.existsAlias({
                        name: reindexVariantAliasName,
                    });
                    if (reindexVariantAliasExist.body) {
                        const reindexVariantAliasResult = await this.client.indices.getAlias({
                            name: reindexVariantAliasName,
                        });
                        const reindexVariantIndexName = Object.keys(reindexVariantAliasResult.body)[0];
                        await this.client.indices.delete({
                            index: [reindexVariantIndexName],
                        });
                    }
                }

                const deletedProductIds = await this.connection
                    .getRepository(Product)
                    .createQueryBuilder('product')
                    .select('product.id')
                    .where('product.deletedAt IS NOT NULL')
                    .getMany();

                for (const { id: deletedProductId } of deletedProductIds) {
                    operations.push(...(await this.deleteProductOperations(ctx, deletedProductId)));
                }

                const productIds = await this.connection
                    .getRepository(Product)
                    .createQueryBuilder('product')
                    .select('product.id')
                    .where('product.deletedAt IS NULL')
                    .getMany();

                Logger.verbose(`Reindexing ${productIds.length} Products`, loggerCtx);

                let finishedProductsCount = 0;
                for (const { id: productId } of productIds) {
                    operations.push(...(await this.updateProductsOperations(ctx, [productId])));
                    finishedProductsCount++;
                    observer.next({
                        total: productIds.length,
                        completed: Math.min(finishedProductsCount, productIds.length),
                        duration: +new Date() - timeStart,
                    });
                }
                Logger.verbose(`Will execute ${operations.length} bulk update operations`, loggerCtx);
                await this.executeBulkOperations(operations);
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
        const result = await this.updateAssetFocalPointForIndex(VARIANT_INDEX_NAME, data.asset);
        await this.client.indices.refresh({
            index: [this.options.indexPrefix + VARIANT_INDEX_NAME],
        });
        return result;
    }

    async deleteAsset(data: UpdateAssetMessageData): Promise<boolean> {
        const result = await this.deleteAssetForIndex(VARIANT_INDEX_NAME, data.asset);
        await this.client.indices.refresh({
            index: [this.options.indexPrefix + VARIANT_INDEX_NAME],
        });
        return result;
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

    private async updateProductsInternal(ctx: MutableRequestContext, productIds: ID[]) {
        const operations = await this.updateProductsOperations(ctx, productIds);
        await this.executeBulkOperations(operations);
    }

    private async updateProductsOperations(
        ctx: MutableRequestContext,
        productIds: ID[],
    ): Promise<BulkVariantOperation[]> {
        Logger.debug(`Updating ${productIds.length} Products`, loggerCtx);
        const operations: BulkVariantOperation[] = [];

        for (const productId of productIds) {
            operations.push(...(await this.deleteProductOperations(ctx, productId)));

            let product: Product | undefined;
            try {
                product = await this.connection.getRepository(Product).findOne(productId, {
                    relations: this.productRelations,
                    where: {
                        deletedAt: null,
                    },
                });
            } catch (e) {
                Logger.error(e.message, loggerCtx, e.stack);
                throw e;
            }
            if (product) {
                const updatedProductVariants = await this.connection.getRepository(ProductVariant).findByIds(
                    product.variants.map(v => v.id),
                    {
                        relations: this.variantRelations,
                        where: {
                            deletedAt: null,
                        },
                        order: {
                            id: 'ASC',
                        },
                    },
                );
                // tslint:disable-next-line:no-non-null-assertion
                updatedProductVariants.forEach(variant => (variant.product = product!));
                if (!product.enabled) {
                    updatedProductVariants.forEach(v => (v.enabled = false));
                }
                Logger.debug(`Updating Product (${productId})`, loggerCtx);
                const languageVariants: LanguageCode[] = [];
                languageVariants.push(...product.translations.map(t => t.languageCode));
                for (const variant of product.variants) {
                    languageVariants.push(...variant.translations.map(t => t.languageCode));
                }
                const uniqueLanguageVariants = unique(languageVariants);

                for (const channel of product.channels) {
                    ctx.setChannel(channel);

                    const variantsInChannel = updatedProductVariants.filter(v =>
                        v.channels.map(c => c.id).includes(ctx.channelId),
                    );
                    for (const variant of variantsInChannel) {
                        await this.productPriceApplicator.applyChannelPriceAndTax(variant, ctx);
                    }
                    for (const languageCode of uniqueLanguageVariants) {
                        if (variantsInChannel.length) {
                            for (const variant of variantsInChannel) {
                                operations.push(
                                    {
                                        index: VARIANT_INDEX_NAME,
                                        operation: {
                                            update: {
                                                _id: ElasticsearchIndexerController.getId(
                                                    variant.id,
                                                    ctx.channelId,
                                                    languageCode,
                                                ),
                                            },
                                        },
                                    },
                                    {
                                        index: VARIANT_INDEX_NAME,
                                        operation: {
                                            doc: await this.createVariantIndexItem(
                                                variant,
                                                variantsInChannel,
                                                ctx,
                                                languageCode,
                                            ),
                                            doc_as_upsert: true,
                                        },
                                    },
                                );
                            }
                        } else {
                            operations.push(
                                {
                                    index: VARIANT_INDEX_NAME,
                                    operation: {
                                        update: {
                                            _id: ElasticsearchIndexerController.getId(
                                                -product.id,
                                                ctx.channelId,
                                                languageCode,
                                            ),
                                        },
                                    },
                                },
                                {
                                    index: VARIANT_INDEX_NAME,
                                    operation: {
                                        doc: this.createSyntheticProductIndexItem(product, ctx, languageCode),
                                        doc_as_upsert: true,
                                    },
                                },
                            );
                        }
                    }
                }
            }
        }
        return operations;
    }

    /**
     * Takes the default relations, and combines them with any extra relations specified in the
     * `hydrateProductRelations` and `hydrateProductVariantRelations`. This method also ensures
     * that the relation values are unique and that paths are fully expanded.
     *
     * This means that if a `hydrateProductRelations` value of `['assets.asset']` is specified,
     * this method will also add `['assets']` to the relations array, otherwise TypeORM would
     * throw an error trying to join a 2nd-level deep relation without the first level also
     * being joined.
     */
    private getReindexRelationsRelations<T extends Product | ProductVariant>(
        defaultRelations: Array<EntityRelationPaths<T>>,
        hydratedRelations: Array<EntityRelationPaths<T>>,
    ): Array<EntityRelationPaths<T>> {
        const uniqueRelations = unique([...defaultRelations, ...hydratedRelations]);
        for (const relation of hydratedRelations) {
            const path = relation.split('.');
            const pathToPart: string[] = [];
            for (const part of path) {
                pathToPart.push(part);
                const joinedPath = pathToPart.join('.') as EntityRelationPaths<T>;
                if (!uniqueRelations.includes(joinedPath)) {
                    uniqueRelations.push(joinedPath);
                }
            }
        }
        return uniqueRelations;
    }

    private async deleteProductOperations(
        ctx: RequestContext,
        productId: ID,
    ): Promise<BulkVariantOperation[]> {
        const channels = await this.requestContextCache.get(ctx, `elastic-index-all-channels`, () =>
            this.connection
                .getRepository(Channel)
                .createQueryBuilder('channel')
                .select('channel.id')
                .getMany(),
        );
        const product = await this.connection.getRepository(Product).findOne(productId, {
            relations: ['variants'],
        });
        if (!product) {
            return [];
        }

        Logger.debug(`Deleting 1 Product (id: ${productId})`, loggerCtx);
        const operations: BulkVariantOperation[] = [];
        const languageVariants: LanguageCode[] = [];
        languageVariants.push(...product.translations.map(t => t.languageCode));
        for (const variant of product.variants) {
            languageVariants.push(...variant.translations.map(t => t.languageCode));
        }
        const uniqueLanguageVariants = unique(languageVariants);

        for (const { id: channelId } of channels) {
            for (const languageCode of uniqueLanguageVariants) {
                operations.push({
                    index: VARIANT_INDEX_NAME,
                    operation: {
                        delete: {
                            _id: ElasticsearchIndexerController.getId(-product.id, channelId, languageCode),
                        },
                    },
                });
            }
        }
        operations.push(
            ...(await this.deleteVariantsInternalOperations(
                product.variants,
                channels.map(c => c.id),
                uniqueLanguageVariants,
            )),
        );
        return operations;
    }

    private async deleteVariantsInternalOperations(
        variants: ProductVariant[],
        channelIds: ID[],
        languageVariants: LanguageCode[],
    ): Promise<BulkVariantOperation[]> {
        Logger.debug(`Deleting ${variants.length} ProductVariants`, loggerCtx);
        const operations: BulkVariantOperation[] = [];
        for (const variant of variants) {
            for (const channelId of channelIds) {
                for (const languageCode of languageVariants) {
                    operations.push({
                        index: VARIANT_INDEX_NAME,
                        operation: {
                            delete: {
                                _id: ElasticsearchIndexerController.getId(
                                    variant.id,
                                    channelId,
                                    languageCode,
                                ),
                            },
                        },
                    });
                }
            }
        }
        return operations;
    }

    private async getProductIdsByVariantIds(variantIds: ID[]): Promise<ID[]> {
        const variants = await this.connection.getRepository(ProductVariant).findByIds(variantIds, {
            relations: ['product'],
            loadEagerRelations: false,
        });
        return unique(variants.map(v => v.product.id));
    }

    private async executeBulkOperations(operations: BulkVariantOperation[]) {
        const variantOperations: Array<BulkOperation | BulkOperationDoc<VariantIndexItem>> = [];

        for (const operation of operations) {
            variantOperations.push(operation.operation);
        }

        return Promise.all([this.runBulkOperationsOnIndex(VARIANT_INDEX_NAME, variantOperations)]);
    }

    private async runBulkOperationsOnIndex(
        indexName: string,
        operations: Array<BulkOperation | BulkOperationDoc<VariantIndexItem | ProductIndexItem>>,
    ) {
        if (operations.length === 0) {
            return;
        }
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
                Logger.debug(
                    `Executed ${body.items.length} bulk operations on index [${fullIndexName}]`,
                    loggerCtx,
                );
            }
            return body;
        } catch (e) {
            Logger.error(`Error when attempting to run bulk operations [${e.toString()}]`, loggerCtx);
            Logger.error('Error details: ' + JSON.stringify(e.body?.error, null, 2), loggerCtx);
        }
    }

    private async createVariantIndexItem(
        v: ProductVariant,
        variants: ProductVariant[],
        ctx: RequestContext,
        languageCode: LanguageCode,
    ): Promise<VariantIndexItem> {
        try {
            const productAsset = v.product.featuredAsset;
            const variantAsset = v.featuredAsset;
            const productTranslation = this.getTranslation(v.product, languageCode);
            const variantTranslation = this.getTranslation(v, languageCode);
            const collectionTranslations = v.collections.map(c => this.getTranslation(c, languageCode));

            const productCollectionTranslations = variants.reduce(
                (translations, variant) => [
                    ...translations,
                    ...variant.collections.map(c => this.getTranslation(c, languageCode)),
                ],
                [] as Array<Translation<Collection>>,
            );
            const prices = variants.map(variant => variant.price);
            const pricesWithTax = variants.map(variant => variant.priceWithTax);

            const item: VariantIndexItem = {
                channelId: ctx.channelId,
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
                productVariantPreviewFocalPoint: variantAsset
                    ? variantAsset.focalPoint || undefined
                    : undefined,
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
                productEnabled: variants.some(variant => variant.enabled) && v.product.enabled,
                productPriceMin: Math.min(...prices),
                productPriceMax: Math.max(...prices),
                productPriceWithTaxMin: Math.min(...pricesWithTax),
                productPriceWithTaxMax: Math.max(...pricesWithTax),
                productFacetIds: this.getFacetIds(variants),
                productFacetValueIds: this.getFacetValueIds(variants),
                productCollectionIds: unique(
                    variants.reduce(
                        (ids, variant) => [...ids, ...variant.collections.map(c => c.id)],
                        [] as ID[],
                    ),
                ),
                productCollectionSlugs: unique(productCollectionTranslations.map(c => c.slug)),
                productChannelIds: v.product.channels.map(c => c.id),
                inStock: 0 < (await this.productVariantService.getSaleableStockLevel(ctx, v)),
                productInStock: await this.getProductInStockValue(ctx, variants),
            };
            const variantCustomMappings = Object.entries(this.options.customProductVariantMappings);
            for (const [name, def] of variantCustomMappings) {
                item[`variant-${name}`] = def.valueFn(v, languageCode);
            }

            const productCustomMappings = Object.entries(this.options.customProductMappings);
            for (const [name, def] of productCustomMappings) {
                item[`product-${name}`] = def.valueFn(v.product, variants, languageCode);
            }
            return item;
        } catch (err) {
            Logger.error(err.toString());
            throw Error(`Error while reindexing!`);
        }
    }

    private async getProductInStockValue(ctx: RequestContext, variants: ProductVariant[]): Promise<boolean> {
        return this.requestContextCache.get(
            ctx,
            `elastic-index-product-in-stock-${variants.map(v => v.id).join(',')}`,
            async () => {
                const stockLevels = await Promise.all(
                    variants.map(variant => this.productVariantService.getSaleableStockLevel(ctx, variant)),
                );
                return stockLevels.some(stockLevel => 0 < stockLevel);
            },
        );
    }

    /**
     * If a Product has no variants, we create a synthetic variant for the purposes
     * of making that product visible via the search query.
     */
    private createSyntheticProductIndexItem(
        product: Product,
        ctx: RequestContext,
        languageCode: LanguageCode,
    ): VariantIndexItem {
        const productTranslation = this.getTranslation(product, languageCode);
        const productAsset = product.featuredAsset;

        const item: VariantIndexItem = {
            channelId: ctx.channelId,
            languageCode,
            productVariantId: 0,
            sku: '',
            slug: productTranslation.slug,
            productId: product.id,
            productName: productTranslation.name,
            productAssetId: productAsset ? productAsset.id : undefined,
            productPreview: productAsset ? productAsset.preview : '',
            productPreviewFocalPoint: productAsset ? productAsset.focalPoint || undefined : undefined,
            productVariantName: productTranslation.name,
            productVariantAssetId: undefined,
            productVariantPreview: '',
            productVariantPreviewFocalPoint: undefined,
            price: 0,
            priceWithTax: 0,
            currencyCode: ctx.channel.currencyCode,
            description: productTranslation.description,
            facetIds: product.facetValues?.map(fv => fv.facet.id.toString()) ?? [],
            channelIds: [ctx.channelId],
            facetValueIds: product.facetValues?.map(fv => fv.id.toString()) ?? [],
            collectionIds: [],
            collectionSlugs: [],
            enabled: false,
            productEnabled: false,
            productPriceMin: 0,
            productPriceMax: 0,
            productPriceWithTaxMin: 0,
            productPriceWithTaxMax: 0,
            productFacetIds: product.facetValues?.map(fv => fv.facet.id.toString()) ?? [],
            productFacetValueIds: product.facetValues?.map(fv => fv.id.toString()) ?? [],
            productCollectionIds: [],
            productCollectionSlugs: [],
            productChannelIds: product.channels.map(c => c.id),
            inStock: false,
            productInStock: false,
        };
        const productCustomMappings = Object.entries(this.options.customProductMappings);
        for (const [name, def] of productCustomMappings) {
            item[`product-${name}`] = def.valueFn(product, [], languageCode);
        }
        return item;
    }

    private getTranslation<T extends Translatable>(
        translatable: T,
        languageCode: LanguageCode,
    ): Translation<T> {
        return (translatable.translations.find(t => t.languageCode === languageCode) ||
            translatable.translations.find(t => t.languageCode === this.configService.defaultLanguageCode) ||
            translatable.translations[0]) as unknown as Translation<T>;
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

    private static getId(entityId: ID, channelId: ID, languageCode: LanguageCode): string {
        return `${channelId.toString()}_${entityId.toString()}_${languageCode}`;
    }
}
