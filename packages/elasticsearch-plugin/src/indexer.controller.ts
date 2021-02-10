import { Client } from '@elastic/elasticsearch';
import { Controller, Inject, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { unique } from '@vendure/common/lib/unique';
import {
    Asset,
    asyncObservable,
    AsyncQueue,
    Collection,
    ConfigService,
    FacetValue,
    ID,
    idsAreEqual,
    LanguageCode,
    Logger,
    Product,
    ProductVariant,
    ProductVariantService,
    RequestContext,
    TransactionalConnection,
    Translatable,
    translateDeep,
    Translation,
} from '@vendure/core';
import { Observable } from 'rxjs';
import { SelectQueryBuilder } from 'typeorm';
import { FindOptionsUtils } from 'typeorm/find-options/FindOptionsUtils';

import { ELASTIC_SEARCH_OPTIONS, loggerCtx, PRODUCT_INDEX_NAME, VARIANT_INDEX_NAME } from './constants';
import { createIndices, deleteByChannel, deleteIndices } from './indexing-utils';
import { ElasticsearchOptions } from './options';
import {
    AssignProductToChannelMessage,
    AssignVariantToChannelMessage,
    BulkOperation,
    BulkOperationDoc,
    BulkResponseBody,
    DeleteAssetMessage,
    DeleteProductMessage,
    DeleteVariantMessage,
    ProductIndexItem,
    ReindexMessage,
    RemoveProductFromChannelMessage,
    RemoveVariantFromChannelMessage,
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
    'channels',
    'channels.defaultTaxZone',
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
    @MessagePattern(UpdateProductMessage.pattern)
    updateProduct({
        ctx: rawContext,
        productId,
    }: UpdateProductMessage['data']): Observable<UpdateProductMessage['response']> {
        const ctx = RequestContext.deserialize(rawContext);
        return asyncObservable(async () => {
            await this.updateProductInternal(ctx, productId);
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
        const ctx = RequestContext.deserialize(rawContext);
        return asyncObservable(async () => {
            const product = await this.connection.getRepository(Product).findOne(productId);
            if (!product) {
                return false;
            }
            await this.deleteProductInternal(product, ctx.channelId);
            const variants = await this.productVariantService.getVariantsByProductId(ctx, productId);
            await this.deleteVariantsInternal(variants, ctx.channelId);
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
        const ctx = RequestContext.deserialize(rawContext);
        return asyncObservable(async () => {
            await this.updateProductInternal(ctx, productId);
            const variants = await this.productVariantService.getVariantsByProductId(ctx, productId);
            await this.updateVariantsInternal(
                ctx,
                variants.map(v => v.id),
                channelId,
            );
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
        const ctx = RequestContext.deserialize(rawContext);
        return asyncObservable(async () => {
            const product = await this.connection.getRepository(Product).findOne(productId);
            if (!product) {
                return false;
            }
            await this.deleteProductInternal(product, channelId);
            const variants = await this.productVariantService.getVariantsByProductId(ctx, productId);
            await this.deleteVariantsInternal(variants, channelId);
            return true;
        });
    }

    @MessagePattern(AssignVariantToChannelMessage.pattern)
    assignVariantToChannel({
        ctx: rawContext,
        productVariantId,
        channelId,
    }: AssignVariantToChannelMessage['data']): Observable<AssignVariantToChannelMessage['response']> {
        const ctx = RequestContext.deserialize(rawContext);
        return asyncObservable(async () => {
            await this.updateVariantsInternal(ctx, [productVariantId], channelId);
            return true;
        });
    }

    @MessagePattern(RemoveVariantFromChannelMessage.pattern)
    removeVariantFromChannel({
        ctx: rawContext,
        productVariantId,
        channelId,
    }: RemoveVariantFromChannelMessage['data']): Observable<RemoveVariantFromChannelMessage['response']> {
        const ctx = RequestContext.deserialize(rawContext);
        return asyncObservable(async () => {
            const productVariant = await this.connection.getEntityOrThrow(
                ctx,
                ProductVariant,
                productVariantId,
                { relations: ['product', 'product.channels'] },
            );
            await this.deleteVariantsInternal([productVariant], channelId);

            if (!productVariant.product.channels.find(c => idsAreEqual(c.id, channelId))) {
                await this.deleteProductInternal(productVariant.product, channelId);
            }
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
        const ctx = RequestContext.deserialize(rawContext);
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
        const ctx = RequestContext.deserialize(rawContext);
        return asyncObservable(async () => {
            const variants = await this.connection
                .getRepository(ProductVariant)
                .findByIds(variantIds, { relations: ['product'] });
            const productIds = unique(variants.map(v => v.product.id));
            for (const productId of productIds) {
                await this.updateProductInternal(ctx, productId);
            }
            await this.deleteVariantsInternal(variants, ctx.channelId);
            return true;
        });
    }

    @MessagePattern(UpdateVariantsByIdMessage.pattern)
    updateVariantsById({
        ctx: rawContext,
        ids,
    }: UpdateVariantsByIdMessage['data']): Observable<UpdateVariantsByIdMessage['response']> {
        const ctx = RequestContext.deserialize(rawContext);
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
                                const languageVariants = variant.translations.map(t => t.languageCode);
                                for (const languageCode of languageVariants) {
                                    operations.push(
                                        {
                                            update: {
                                                _id: this.getId(variant.id, ctx.channelId, languageCode),
                                            },
                                        },
                                        {
                                            doc: this.createVariantIndexItem(
                                                variant,
                                                ctx.channelId,
                                                languageCode,
                                            ),
                                        },
                                    );
                                }
                            },
                            (operations, product, _variants) => {
                                const languageVariants = product.translations.map(t => t.languageCode);
                                for (const languageCode of languageVariants) {
                                    operations.push(
                                        {
                                            update: {
                                                _id: this.getId(product.id, ctx.channelId, languageCode),
                                            },
                                        },
                                        {
                                            doc: this.createProductIndexItem(
                                                _variants,
                                                ctx.channelId,
                                                languageCode,
                                            ),
                                        },
                                    );
                                }
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
        const ctx = RequestContext.deserialize(rawContext);
        const { batchSize } = this.options;

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
                            const languageVariants = variant.translations.map(t => t.languageCode);
                            for (const languageCode of languageVariants) {
                                operations.push(
                                    { index: { _id: this.getId(variant.id, ctx.channelId, languageCode) } },
                                    this.createVariantIndexItem(variant, ctx.channelId, languageCode),
                                );
                            }
                        },
                        (operations, product, _variants) => {
                            const languageVariants = product.translations.map(t => t.languageCode);
                            for (const languageCode of languageVariants) {
                                operations.push(
                                    { index: { _id: this.getId(product.id, ctx.channelId, languageCode) } },
                                    this.createProductIndexItem(_variants, ctx.channelId, languageCode),
                                );
                            }
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
            const result1 = await this.updateAssetFocalPointForIndex(PRODUCT_INDEX_NAME, data.asset);
            const result2 = await this.updateAssetFocalPointForIndex(VARIANT_INDEX_NAME, data.asset);
            await this.client.indices.refresh({
                index: [
                    this.options.indexPrefix + PRODUCT_INDEX_NAME,
                    this.options.indexPrefix + VARIANT_INDEX_NAME,
                ],
            });
            return result1 && result2;
        });
    }

    @MessagePattern(DeleteAssetMessage.pattern)
    deleteAsset(data: DeleteAssetMessage['data']): Observable<DeleteAssetMessage['response']> {
        return asyncObservable(async () => {
            const result1 = await this.deleteAssetForIndex(PRODUCT_INDEX_NAME, data.asset);
            const result2 = await this.deleteAssetForIndex(VARIANT_INDEX_NAME, data.asset);
            await this.client.indices.refresh({
                index: [
                    this.options.indexPrefix + PRODUCT_INDEX_NAME,
                    this.options.indexPrefix + VARIANT_INDEX_NAME,
                ],
            });
            return result1 && result2;
        });
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
        await this.executeBulkOperations(VARIANT_INDEX_NAME, variantsToIndex);
        await this.executeBulkOperations(PRODUCT_INDEX_NAME, productsToIndex);
        return variantsInProduct;
    }

    private async updateVariantsInternal(ctx: RequestContext, variantIds: ID[], channelId: ID) {
        const productVariants = await this.connection.getRepository(ProductVariant).findByIds(variantIds, {
            relations: variantRelations,
            where: {
                deletedAt: null,
            },
            order: {
                id: 'ASC',
            },
        });

        if (productVariants.length) {
            // When ProductVariants change, we need to update the corresponding Product index
            // since e.g. price changes must be reflected on the Product level too.
            const productIdsOfVariants = unique(productVariants.map(v => v.productId));
            for (const variantProductId of productIdsOfVariants) {
                await this.updateProductInternal(ctx, variantProductId);
            }
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
                    this.productVariantService.applyChannelPriceAndTax(variant, ctx);
                    for (const languageCode of languageVariants) {
                        operations.push(
                            { update: { _id: this.getId(variant.id, channel.id, languageCode) } },
                            {
                                doc: this.createVariantIndexItem(variant, channel.id, languageCode),
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

    private async updateProductInternal(ctx: RequestContext, productId: ID) {
        const product = await this.connection.getRepository(Product).findOne(productId, {
            relations: ['variants', 'channels', 'channels.defaultTaxZone'],
        });
        if (product) {
            const updatedProductVariants = await this.connection.getRepository(ProductVariant).findByIds(
                product.variants.map(v => v.id),
                {
                    relations: variantRelations,
                    where: {
                        deletedAt: null,
                    },
                },
            );
            if (product.enabled === false) {
                updatedProductVariants.forEach(v => (v.enabled = false));
            }
            const operations: Array<BulkOperation | BulkOperationDoc<ProductIndexItem>> = [];

            if (updatedProductVariants.length) {
                Logger.verbose(`Updating 1 Product (${productId})`, loggerCtx);
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
                        v.channels.map(c => c.id).includes(channel.id),
                    );
                    for (const variant of variantsInChannel) {
                        this.productVariantService.applyChannelPriceAndTax(variant, channelCtx);
                    }

                    for (const languageCode of languageVariants) {
                        const updatedProductIndexItem = this.createProductIndexItem(
                            variantsInChannel,
                            channel.id,
                            languageCode,
                        );
                        operations.push(
                            {
                                update: {
                                    _id: this.getId(
                                        updatedProductIndexItem.productId,
                                        channel.id,
                                        languageCode,
                                    ),
                                },
                            },
                            { doc: updatedProductIndexItem, doc_as_upsert: true },
                        );
                    }
                }
            } else {
                const syntheticIndexItem = this.createSyntheticProductIndexItem(ctx, product);
                operations.push(
                    {
                        update: {
                            _id: this.getId(syntheticIndexItem.productId, ctx.channelId, ctx.languageCode),
                        },
                    },
                    { doc: syntheticIndexItem, doc_as_upsert: true },
                );
            }
            await this.executeBulkOperations(PRODUCT_INDEX_NAME, operations);
        }
    }

    private async deleteProductInternal(product: Product, channelId: ID) {
        Logger.verbose(`Deleting 1 Product (${product.id})`, loggerCtx);
        const operations: BulkOperation[] = [];
        const languageVariants = product.translations.map(t => t.languageCode);
        for (const languageCode of languageVariants) {
            operations.push({ delete: { _id: this.getId(product.id, channelId, languageCode) } });
        }
        await this.executeBulkOperations(PRODUCT_INDEX_NAME, operations);
    }

    private async deleteVariantsInternal(variants: ProductVariant[], channelId: ID) {
        Logger.verbose(`Deleting ${variants.length} ProductVariants`, loggerCtx);
        const operations: BulkOperation[] = [];
        for (const variant of variants) {
            const languageVariants = variant.translations.map(t => t.languageCode);
            for (const languageCode of languageVariants) {
                operations.push({
                    delete: { _id: this.getId(variant.id, channelId, languageCode) },
                });
            }
        }
        await this.executeBulkOperations(VARIANT_INDEX_NAME, operations);
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

    private getSearchIndexQueryBuilder(channelId: ID) {
        const qb = this.connection.getRepository(ProductVariant).createQueryBuilder('variants');
        FindOptionsUtils.applyFindManyOptionsOrConditionsToQueryBuilder(qb, {
            relations: variantRelations,
            order: {
                productId: 'ASC',
            },
        });
        FindOptionsUtils.joinEagerRelations(
            qb,
            qb.alias,
            this.connection.rawConnection.getMetadata(ProductVariant),
        );
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
            .map(v => translateDeep(v, ctx.languageCode, ['product', 'collections']));
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
    private createSyntheticProductIndexItem(ctx: RequestContext, product: Product): ProductIndexItem {
        const productTranslation = this.getTranslation(product, ctx.languageCode);
        return {
            channelId: ctx.channelId,
            languageCode: ctx.languageCode,
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
