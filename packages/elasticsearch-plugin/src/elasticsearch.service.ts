import { Client } from '@elastic/elasticsearch';
import { Inject, Injectable, OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { JobInfo, SearchResult, SearchResultAsset } from '@vendure/common/lib/generated-types';
import {
    DeepRequired,
    FacetValue,
    FacetValueService,
    InternalServerError,
    Logger,
    RequestContext,
    SearchService,
} from '@vendure/core';

import { buildElasticBody } from './build-elastic-body';
import {
    ELASTIC_SEARCH_OPTIONS,
    loggerCtx,
    PRODUCT_INDEX_NAME,
    PRODUCT_INDEX_TYPE,
    VARIANT_INDEX_NAME,
    VARIANT_INDEX_TYPE,
} from './constants';
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
        private facetValueService: FacetValueService,
    ) {
        searchService.adopt(this);
    }

    onModuleInit(): any {
        const { host, port } = this.options;
        this.client = new Client({
            node: `${host}:${port}`,
        });
    }

    onModuleDestroy(): any {
        return this.client.close();
    }

    checkConnection() {
        return this.client.ping({}, { requestTimeout: 1000 });
    }

    async createIndicesIfNotExists() {
        const { indexPrefix } = this.options;

        const createIndex = async (indexName: string) => {
            const index = indexPrefix + indexName;
            const result = await this.client.indices.exists({ index });

            if (result.body === false) {
                Logger.verbose(`Index "${index}" does not exist. Creating...`, loggerCtx);
                await createIndices(this.client, indexPrefix);
            } else {
                Logger.verbose(`Index "${index}" exists`, loggerCtx);
            }
        };

        await createIndex(VARIANT_INDEX_NAME);
        await createIndex(PRODUCT_INDEX_NAME);
    }

    /**
     * Perform a fulltext search according to the provided input arguments.
     */
    async search(
        ctx: RequestContext,
        input: ElasticSearchInput,
        enabledOnly: boolean = false,
    ): Promise<Omit<ElasticSearchResponse, 'facetValues' | 'priceRange'>> {
        const { indexPrefix } = this.options;
        const { groupByProduct } = input;
        const elasticSearchBody = buildElasticBody(
            input,
            this.options.searchConfig,
            ctx.channelId,
            enabledOnly,
        );
        if (groupByProduct) {
            const { body }: { body: SearchResponseBody<ProductIndexItem> } = await this.client.search({
                index: indexPrefix + PRODUCT_INDEX_NAME,
                type: PRODUCT_INDEX_TYPE,
                body: elasticSearchBody,
            });
            return {
                items: body.hits.hits.map(hit => this.mapProductToSearchResult(hit)),
                totalItems: body.hits.total.value,
            };
        } else {
            const { body }: { body: SearchResponseBody<VariantIndexItem> } = await this.client.search({
                index: indexPrefix + VARIANT_INDEX_NAME,
                type: VARIANT_INDEX_TYPE,
                body: elasticSearchBody,
            });
            return {
                items: body.hits.hits.map(hit => this.mapVariantToSearchResult(hit)),
                totalItems: body.hits.total.value,
            };
        }
    }

    /**
     * Return a list of all FacetValues which appear in the result set.
     */
    async facetValues(
        ctx: RequestContext,
        input: ElasticSearchInput,
        enabledOnly: boolean = false,
    ): Promise<Array<{ facetValue: FacetValue; count: number }>> {
        const { indexPrefix } = this.options;
        const elasticSearchBody = buildElasticBody(
            input,
            this.options.searchConfig,
            ctx.channelId,
            enabledOnly,
        );
        elasticSearchBody.from = 0;
        elasticSearchBody.size = 0;
        elasticSearchBody.aggs = {
            facetValue: {
                terms: {
                    field: 'facetValueIds.keyword',
                    size: this.options.searchConfig.facetValueMaxSize,
                },
            },
        };
        const { body }: { body: SearchResponseBody<VariantIndexItem> } = await this.client.search({
            index: indexPrefix + (input.groupByProduct ? PRODUCT_INDEX_NAME : VARIANT_INDEX_NAME),
            type: input.groupByProduct ? PRODUCT_INDEX_TYPE : VARIANT_INDEX_TYPE,
            body: elasticSearchBody,
        });

        const buckets = body.aggregations ? body.aggregations.facetValue.buckets : [];

        const facetValues = await this.facetValueService.findByIds(buckets.map(b => b.key), ctx.languageCode);
        return facetValues.map((facetValue, index) => {
            const bucket = buckets.find(b => b.key.toString() === facetValue.id.toString());
            return {
                facetValue,
                count: bucket ? bucket.doc_count : 0,
            };
        });
    }

    async priceRange(ctx: RequestContext, input: ElasticSearchInput): Promise<SearchPriceData> {
        const { indexPrefix, searchConfig } = this.options;
        const { groupByProduct } = input;
        const elasticSearchBody = buildElasticBody(input, searchConfig, ctx.channelId, true);
        elasticSearchBody.from = 0;
        elasticSearchBody.size = 0;
        elasticSearchBody.aggs = {
            minPrice: {
                min: {
                    field: groupByProduct ? 'priceMin' : 'price',
                },
            },
            minPriceWithTax: {
                min: {
                    field: groupByProduct ? 'priceWithTaxMin' : 'priceWithTax',
                },
            },
            maxPrice: {
                max: {
                    field: groupByProduct ? 'priceMax' : 'price',
                },
            },
            maxPriceWithTax: {
                max: {
                    field: groupByProduct ? 'priceWithTaxMax' : 'priceWithTax',
                },
            },
            prices: {
                histogram: {
                    field: groupByProduct ? 'priceMin' : 'price',
                    interval: searchConfig.priceRangeBucketInterval,
                },
            },
            pricesWithTax: {
                histogram: {
                    field: groupByProduct ? 'priceWithTaxMin' : 'priceWithTax',
                    interval: searchConfig.priceRangeBucketInterval,
                },
            },
        };
        const { body }: { body: SearchResponseBody<VariantIndexItem> } = await this.client.search({
            index: indexPrefix + (input.groupByProduct ? PRODUCT_INDEX_NAME : VARIANT_INDEX_NAME),
            type: input.groupByProduct ? PRODUCT_INDEX_TYPE : VARIANT_INDEX_TYPE,
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
    async reindex(ctx: RequestContext, dropIndices = true): Promise<JobInfo> {
        const { indexPrefix } = this.options;
        const job = this.elasticsearchIndexService.reindex(ctx, dropIndices);
        job.start();
        return job;
    }

    /**
     * Reindexes all in current Channel without dropping indices.
     */
    async updateAll(ctx: RequestContext): Promise<JobInfo> {
        const job = this.elasticsearchIndexService.reindex(ctx, false);
        job.start();
        return job;
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
            score: hit._score,
        };

        this.addCustomMappings(result, source, this.options.customProductVariantMappings);
        return result;
    }

    private mapProductToSearchResult(hit: SearchHit<ProductIndexItem>): SearchResult {
        const source = hit._source;
        const { productAsset, productVariantAsset } = this.getSearchResultAssets(source);
        const result = {
            ...source,
            productAsset,
            productVariantAsset,
            productId: source.productId.toString(),
            productName: source.productName,
            productPreview: source.productPreview || '', // TODO: deprecated and to be removed
            productVariantId: source.productVariantId.toString(),
            productVariantName: source.productVariantName,
            productVariantPreview: source.productVariantPreview || '', // TODO: deprecated and to be removed
            facetIds: source.facetIds as string[],
            facetValueIds: source.facetValueIds as string[],
            collectionIds: source.collectionIds as string[],
            sku: source.sku,
            slug: source.slug,
            price: {
                min: source.priceMin,
                max: source.priceMax,
            },
            priceWithTax: {
                min: source.priceWithTaxMin,
                max: source.priceWithTaxMax,
            },
            channelIds: [],
            score: hit._score,
        };
        this.addCustomMappings(result, source, this.options.customProductMappings);
        return result;
    }

    private getSearchResultAssets(
        source: ProductIndexItem | VariantIndexItem,
    ): { productAsset: SearchResultAsset | null; productVariantAsset: SearchResultAsset | null } {
        const productAsset: SearchResultAsset | null = source.productAssetId
            ? {
                  id: source.productAssetId.toString(),
                  preview: source.productPreview,
                  focalPoint: source.productPreviewFocalPoint,
              }
            : null;
        const productVariantAsset: SearchResultAsset | null = source.productVariantAssetId
            ? {
                  id: source.productVariantAssetId.toString(),
                  preview: source.productVariantPreview,
                  focalPoint: source.productVariantPreviewFocalPoint,
              }
            : null;
        return { productAsset, productVariantAsset };
    }

    private addCustomMappings(
        result: any,
        source: any,
        mappings: { [fieldName: string]: CustomMapping<any> },
    ): any {
        const customMappings = Object.keys(mappings);
        if (customMappings.length) {
            const customMappingsResult: any = {};
            for (const name of customMappings) {
                customMappingsResult[name] = (source as any)[name];
            }
            (result as any).customMappings = customMappingsResult;
        }
        return result;
    }
}
