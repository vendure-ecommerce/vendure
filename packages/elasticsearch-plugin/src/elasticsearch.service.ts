import { Client } from '@elastic/elasticsearch';
import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { SearchResult, SearchResultAsset } from '@vendure/common/lib/generated-types';
import {
    Collection,
    CollectionService,
    ConfigService,
    DeepRequired,
    FacetValue,
    FacetValueService,
    InternalServerError,
    Job,
    Logger,
    RequestContext,
    SearchService,
} from '@vendure/core';
import equal from 'fast-deep-equal/es6';

import { buildElasticBody } from './build-elastic-body';
import { ELASTIC_SEARCH_OPTIONS, loggerCtx, VARIANT_INDEX_NAME } from './constants';
import { ElasticsearchIndexService } from './elasticsearch-index.service';
import { createIndices } from './indexing-utils';
import { ElasticsearchOptions } from './options';
import {
    CustomMapping,
    ElasticSearchInput,
    ElasticSearchResponse,
    ProductIndexItem,
    SearchHit,
    SearchPriceData,
    SearchResponseBody,
    VariantIndexItem,
} from './types';

@Injectable()
export class ElasticsearchService implements OnModuleInit, OnModuleDestroy {
    private client: Client;

    constructor(
        @Inject(ELASTIC_SEARCH_OPTIONS) private options: DeepRequired<ElasticsearchOptions>,
        private searchService: SearchService,
        private elasticsearchIndexService: ElasticsearchIndexService,
        private configService: ConfigService,
        private facetValueService: FacetValueService,
        private collectionService: CollectionService,
    ) {
        searchService.adopt(this);
    }

    onModuleInit(): any {
        const { host, port } = this.options;
        const node = this.options.clientOptions?.node ?? `${host}:${port}`;
        this.client = new Client({
            node,
            // `any` cast is there due to a strange error "Property '[Symbol.iterator]' is missing in type... URLSearchParams"
            // which looks like possibly a TS/definitions bug.
            ...(this.options.clientOptions as any),
        });
    }

    onModuleDestroy(): any {
        return this.client.close();
    }

    async checkConnection(): Promise<void> {
        await new Promise<void>(async (resolve, reject) => {
            const { connectionAttempts, connectionAttemptInterval } = this.options;
            let attempts = 0;
            Logger.verbose('Pinging Elasticsearch...', loggerCtx);
            while (attempts < connectionAttempts) {
                attempts++;
                try {
                    const pingResult = await this.client.ping({}, { requestTimeout: 1000 });
                    if (pingResult.body) {
                        Logger.verbose(`Ping to Elasticsearch successful`, loggerCtx);
                        return resolve();
                    }
                } catch (e) {
                    Logger.verbose(`Ping to Elasticsearch failed with error "${e.message}"`, loggerCtx);
                }
                Logger.verbose(
                    `Connection to Elasticsearch could not be made, trying again after ${connectionAttemptInterval}ms (attempt ${attempts} of ${connectionAttempts})`,
                    loggerCtx,
                );
                await new Promise(resolve1 => setTimeout(resolve1, connectionAttemptInterval));
            }
            reject(`Could not connection to Elasticsearch. Aborting bootstrap.`);
        });
    }

    async createIndicesIfNotExists() {
        const { indexPrefix } = this.options;

        const createIndex = async (indexName: string) => {
            const index = indexPrefix + indexName;
            const result = await this.client.indices.exists({ index });

            if (!result.body) {
                Logger.verbose(`Index "${index}" does not exist. Creating...`, loggerCtx);
                await createIndices(
                    this.client,
                    indexPrefix,
                    this.options.indexSettings,
                    this.options.indexMappingProperties,
                    this.configService.entityIdStrategy.primaryKeyType,
                );
            } else {
                Logger.verbose(`Index "${index}" exists`, loggerCtx);

                const existingIndexSettingsResult = await this.client.indices.getSettings({ index });
                const existingIndexSettings =
                    existingIndexSettingsResult.body[Object.keys(existingIndexSettingsResult.body)[0]]
                        .settings.index;

                const tempName = new Date().getTime();
                const nameSalt = Math.random().toString(36).substring(7);
                const tempPrefix = `temp-` + `${tempName}-${nameSalt}-`;
                const tempIndex = tempPrefix + indexName;

                await createIndices(
                    this.client,
                    tempPrefix,
                    this.options.indexSettings,
                    this.options.indexMappingProperties,
                    this.configService.entityIdStrategy.primaryKeyType,
                    false,
                );
                const tempIndexSettingsResult = await this.client.indices.getSettings({ index: tempIndex });
                const tempIndexSettings = tempIndexSettingsResult.body[tempIndex].settings.index;

                const indexParamsToExclude = [
                    `routing`,
                    `number_of_shards`,
                    `provided_name`,
                    `creation_date`,
                    `number_of_replicas`,
                    `uuid`,
                    `version`,
                ];
                for (const param of indexParamsToExclude) {
                    delete tempIndexSettings[param];
                    delete existingIndexSettings[param];
                }
                if (!equal(tempIndexSettings, existingIndexSettings))
                    Logger.warn(
                        `Index "${index}" settings differs from index setting in vendure config! Consider re-indexing the data.`,
                        loggerCtx,
                    );
                else {
                    const existingIndexMappingsResult = await this.client.indices.getMapping({ index });
                    const existingIndexMappings =
                        existingIndexMappingsResult.body[Object.keys(existingIndexMappingsResult.body)[0]]
                            .mappings;

                    const tempIndexMappingsResult = await this.client.indices.getMapping({
                        index: tempIndex,
                    });
                    const tempIndexMappings = tempIndexMappingsResult.body[tempIndex].mappings;
                    if (!equal(tempIndexMappings, existingIndexMappings))
                        // tslint:disable-next-line:max-line-length
                        Logger.warn(
                            `Index "${index}" mapping differs from index mapping in vendure config! Consider re-indexing the data.`,
                            loggerCtx,
                        );
                }

                await this.client.indices.delete({
                    index: [tempPrefix + `variants`],
                });
            }
        };

        await createIndex(VARIANT_INDEX_NAME);
    }

    /**
     * Perform a fulltext search according to the provided input arguments.
     */
    async search(
        ctx: RequestContext,
        input: ElasticSearchInput,
        enabledOnly: boolean = false,
    ): Promise<Omit<ElasticSearchResponse, 'facetValues' | 'collections' | 'priceRange'>> {
        const { indexPrefix } = this.options;
        const { groupByProduct } = input;
        const elasticSearchBody = buildElasticBody(
            input,
            this.options.searchConfig,
            ctx.channelId,
            ctx.languageCode,
            enabledOnly,
        );
        if (groupByProduct) {
            try {
                const { body }: { body: SearchResponseBody<VariantIndexItem> } = await this.client.search({
                    index: indexPrefix + VARIANT_INDEX_NAME,
                    body: elasticSearchBody,
                });
                const totalItems = await this.totalHits(ctx, input, groupByProduct);
                return {
                    items: body.hits.hits.map(hit => this.mapProductToSearchResult(hit)),
                    totalItems,
                };
            } catch (e) {
                Logger.error(e.message, loggerCtx, e.stack);
                throw e;
            }
        } else {
            try {
                const { body }: { body: SearchResponseBody<VariantIndexItem> } = await this.client.search({
                    index: indexPrefix + VARIANT_INDEX_NAME,
                    body: elasticSearchBody,
                });
                return {
                    items: body.hits.hits.map(hit => this.mapVariantToSearchResult(hit)),
                    totalItems: body.hits.total ? body.hits.total.value : 0,
                };
            } catch (e) {
                Logger.error(e.message, loggerCtx, e.stack);
                throw e;
            }
        }
    }

    async totalHits(
        ctx: RequestContext,
        input: ElasticSearchInput,
        enabledOnly: boolean = false,
    ): Promise<number> {
        const { indexPrefix, searchConfig } = this.options;
        const elasticSearchBody = buildElasticBody(
            input,
            searchConfig,
            ctx.channelId,
            ctx.languageCode,
            enabledOnly,
        );
        elasticSearchBody.from = 0;
        elasticSearchBody.size = 0;
        elasticSearchBody.aggs = {
            total: {
                cardinality: {
                    field: `productId`,
                },
            },
        };
        const { body }: { body: SearchResponseBody<VariantIndexItem> } = await this.client.search({
            index: indexPrefix + VARIANT_INDEX_NAME,
            body: elasticSearchBody,
        });

        const { aggregations } = body;
        if (!aggregations) {
            throw new InternalServerError(
                'An error occurred when querying Elasticsearch for priceRange aggregations',
            );
        }
        return aggregations.total ? aggregations.total.value : 0;
    }

    /**
     * Return a list of all FacetValues which appear in the result set.
     */
    async facetValues(
        ctx: RequestContext,
        input: ElasticSearchInput,
        enabledOnly: boolean = false,
    ): Promise<Array<{ facetValue: FacetValue; count: number }>> {
        const { groupByProduct } = input;
        const buckets = await this.getDistinctBucketsOfField(ctx, input, enabledOnly, `facetValueIds`);

        const facetValues = await this.facetValueService.findByIds(
            ctx,
            buckets.map(b => b.key),
        );
        return facetValues.map(facetValue => {
            const bucket = buckets.find(b => b.key.toString() === facetValue.id.toString());
            let count;
            if (groupByProduct) {
                count = bucket ? bucket.total.value : 0;
            } else {
                count = bucket ? bucket.doc_count : 0;
            }
            return {
                facetValue,
                count,
            };
        });
    }

    /**
     * Return a list of all Collections which appear in the result set.
     */
    async collections(
        ctx: RequestContext,
        input: ElasticSearchInput,
        enabledOnly: boolean = false,
    ): Promise<Array<{ collection: Collection; count: number }>> {
        const { groupByProduct } = input;
        const buckets = await this.getDistinctBucketsOfField(ctx, input, enabledOnly, `collectionIds`);

        const collections = await this.collectionService.findByIds(
            ctx,
            buckets.map(b => b.key),
        );
        return collections.map(collection => {
            const bucket = buckets.find(b => b.key.toString() === collection.id.toString());
            let count;
            if (groupByProduct) {
                count = bucket ? bucket.total.value : 0;
            } else {
                count = bucket ? bucket.doc_count : 0;
            }
            return {
                collection,
                count,
            };
        });
    }

    async getDistinctBucketsOfField(
        ctx: RequestContext,
        input: ElasticSearchInput,
        enabledOnly: boolean = false,
        field: string,
    ): Promise<Array<{ key: string; doc_count: number; total: { value: number } }>> {
        const { indexPrefix } = this.options;
        const { groupByProduct } = input;
        const elasticSearchBody = buildElasticBody(
            input,
            this.options.searchConfig,
            ctx.channelId,
            ctx.languageCode,
            enabledOnly,
        );
        elasticSearchBody.from = 0;
        elasticSearchBody.size = 0;
        elasticSearchBody.aggs = {
            collection: {
                terms: {
                    field,
                    size: this.options.searchConfig.collectionMaxSize,
                },
            },
        };

        if (groupByProduct) {
            elasticSearchBody.aggs.collection.aggs = {
                total: {
                    cardinality: {
                        field: `productId`,
                    },
                },
            };
        }

        let body: SearchResponseBody<VariantIndexItem>;
        try {
            const result = await this.client.search<SearchResponseBody<VariantIndexItem>>({
                index: indexPrefix + VARIANT_INDEX_NAME,
                body: elasticSearchBody,
            });
            body = result.body;
        } catch (e) {
            Logger.error(e.message, loggerCtx, e.stack);
            throw e;
        }

        return body.aggregations ? body.aggregations.collection.buckets : [];
    }

    async priceRange(ctx: RequestContext, input: ElasticSearchInput): Promise<SearchPriceData> {
        const { indexPrefix, searchConfig } = this.options;
        const elasticSearchBody = buildElasticBody(
            input,
            searchConfig,
            ctx.channelId,
            ctx.languageCode,
            true,
        );
        elasticSearchBody.from = 0;
        elasticSearchBody.size = 0;
        elasticSearchBody.aggs = {
            minPrice: {
                min: {
                    field: 'price',
                },
            },
            minPriceWithTax: {
                min: {
                    field: 'priceWithTax',
                },
            },
            maxPrice: {
                max: {
                    field: 'price',
                },
            },
            maxPriceWithTax: {
                max: {
                    field: 'priceWithTax',
                },
            },
            prices: {
                histogram: {
                    field: 'price',
                    interval: searchConfig.priceRangeBucketInterval,
                },
            },
            pricesWithTax: {
                histogram: {
                    field: 'priceWithTax',
                    interval: searchConfig.priceRangeBucketInterval,
                },
            },
        };
        const { body }: { body: SearchResponseBody<VariantIndexItem> } = await this.client.search({
            index: indexPrefix + VARIANT_INDEX_NAME,
            body: elasticSearchBody,
        });

        const { aggregations } = body;
        if (!aggregations) {
            throw new InternalServerError(
                'An error occurred when querying Elasticsearch for priceRange aggregations',
            );
        }
        const mapPriceBuckets = (b: { key: string; doc_count: number }) => ({
            to: Number.parseInt(b.key, 10) + searchConfig.priceRangeBucketInterval,
            count: b.doc_count,
        });

        return {
            range: {
                min: aggregations.minPrice.value || 0,
                max: aggregations.maxPrice.value || 0,
            },
            rangeWithTax: {
                min: aggregations.minPriceWithTax.value || 0,
                max: aggregations.maxPriceWithTax.value || 0,
            },
            buckets: aggregations.prices.buckets.map(mapPriceBuckets).filter(x => 0 < x.count),
            bucketsWithTax: aggregations.prices.buckets.map(mapPriceBuckets).filter(x => 0 < x.count),
        };
    }

    /**
     * Rebuilds the full search index.
     */
    async reindex(ctx: RequestContext): Promise<Job> {
        const job = await this.elasticsearchIndexService.reindex(ctx);
        // tslint:disable-next-line:no-non-null-assertion
        return job!;
    }

    private mapVariantToSearchResult(hit: SearchHit<VariantIndexItem>): SearchResult {
        const source = hit._source;
        const { productAsset, productVariantAsset } = this.getSearchResultAssets(source);
        const result = {
            ...source,
            productAsset,
            productVariantAsset,
            price: {
                value: source.price,
            },
            priceWithTax: {
                value: source.priceWithTax,
            },
            score: hit._score || 0,
        };

        ElasticsearchService.addCustomMappings(
            result,
            source,
            this.options.customProductVariantMappings,
            false,
        );
        return result;
    }

    private mapProductToSearchResult(hit: SearchHit<VariantIndexItem>): SearchResult {
        const source = hit._source;
        const { productAsset, productVariantAsset } = this.getSearchResultAssets(source);
        const result = {
            ...source,
            productAsset,
            productVariantAsset,
            enabled: source.productEnabled,
            productId: source.productId.toString(),
            productName: source.productName,
            productVariantId: source.productVariantId.toString(),
            productVariantName: source.productVariantName,
            facetIds: source.productFacetIds as string[],
            facetValueIds: source.productFacetValueIds as string[],
            collectionIds: source.productCollectionIds as string[],
            sku: source.sku,
            slug: source.slug,
            price: {
                min: source.productPriceMin,
                max: source.productPriceMax,
            },
            priceWithTax: {
                min: source.productPriceWithTaxMin,
                max: source.productPriceWithTaxMax,
            },
            channelIds: [],
            score: hit._score || 0,
        };
        ElasticsearchService.addCustomMappings(result, source, this.options.customProductMappings, true);
        return result;
    }

    private getSearchResultAssets(source: ProductIndexItem | VariantIndexItem): {
        productAsset: SearchResultAsset | undefined;
        productVariantAsset: SearchResultAsset | undefined;
    } {
        const productAsset: SearchResultAsset | undefined = source.productAssetId
            ? {
                  id: source.productAssetId.toString(),
                  preview: source.productPreview,
                  focalPoint: source.productPreviewFocalPoint,
              }
            : undefined;
        const productVariantAsset: SearchResultAsset | undefined = source.productVariantAssetId
            ? {
                  id: source.productVariantAssetId.toString(),
                  preview: source.productVariantPreview,
                  focalPoint: source.productVariantPreviewFocalPoint,
              }
            : undefined;
        return { productAsset, productVariantAsset };
    }

    private static addCustomMappings(
        result: any,
        source: any,
        mappings: { [fieldName: string]: CustomMapping<any> },
        groupByProduct: boolean,
    ): any {
        const customMappings = Object.keys(mappings);
        if (customMappings.length) {
            const customMappingsResult: any = {};
            for (const name of customMappings) {
                customMappingsResult[name] = (source as any)[
                    groupByProduct ? `product-${name}` : `variant-${name}`
                ];
            }
            (result as any).customMappings = customMappingsResult;
        }
        return result;
    }
}
