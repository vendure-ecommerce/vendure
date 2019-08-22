import { Client } from '@elastic/elasticsearch';
import { Inject, Injectable } from '@nestjs/common';
import { JobInfo, SearchInput, SearchResponse, SearchResult } from '@vendure/common/lib/generated-types';
import { FacetValue, FacetValueService, Logger, RequestContext, SearchService } from '@vendure/core';

import { buildElasticBody } from './build-elastic-body';
import {
    ELASTIC_SEARCH_CLIENT,
    ELASTIC_SEARCH_OPTIONS,
    loggerCtx,
    PRODUCT_INDEX_NAME,
    PRODUCT_INDEX_TYPE,
    VARIANT_INDEX_NAME,
    VARIANT_INDEX_TYPE,
} from './constants';
import { ElasticsearchIndexService } from './elasticsearch-index.service';
import { ElasticsearchOptions } from './plugin';
import { ProductIndexItem, SearchHit, SearchResponseBody, VariantIndexItem } from './types';

@Injectable()
export class ElasticsearchService {
    constructor(
        @Inject(ELASTIC_SEARCH_OPTIONS) private options: Required<ElasticsearchOptions>,
        @Inject(ELASTIC_SEARCH_CLIENT) private client: Client,
        private searchService: SearchService,
        private elasticsearchIndexService: ElasticsearchIndexService,
        private facetValueService: FacetValueService,
    ) {
        searchService.adopt(this);
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
                await this.createIndices(indexPrefix);
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
        input: SearchInput,
        enabledOnly: boolean = false,
    ): Promise<Omit<SearchResponse, 'facetValues'>> {
        const { indexPrefix } = this.options;
        const { groupByProduct } = input;
        const elasticSearchBody = buildElasticBody(input, enabledOnly);
        if (groupByProduct) {
            const { body }: { body: SearchResponseBody<ProductIndexItem> } = await this.client.search({
                index: indexPrefix + PRODUCT_INDEX_NAME,
                type: PRODUCT_INDEX_TYPE,
                body: elasticSearchBody,
            });
            return {
                items: body.hits.hits.map(this.mapProductToSearchResult),
                totalItems: body.hits.total.value,
            };
        } else {
            const { body }: { body: SearchResponseBody<VariantIndexItem> } = await this.client.search({
                index: indexPrefix + VARIANT_INDEX_NAME,
                type: VARIANT_INDEX_TYPE,
                body: elasticSearchBody,
            });
            return {
                items: body.hits.hits.map(this.mapVariantToSearchResult),
                totalItems: body.hits.total.value,
            };
        }
    }

    /**
     * Return a list of all FacetValues which appear in the result set.
     */
    async facetValues(
        ctx: RequestContext,
        input: SearchInput,
        enabledOnly: boolean = false,
    ): Promise<Array<{ facetValue: FacetValue; count: number }>> {
        const { indexPrefix } = this.options;
        const elasticSearchBody = buildElasticBody(input, enabledOnly);
        elasticSearchBody.from = 0;
        elasticSearchBody.size = 0;
        elasticSearchBody.aggs = {
            facetValue: {
                terms: { field: 'facetValueIds.keyword' },
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
            return {
                facetValue,
                count: buckets[index].doc_count,
            };
        });
    }

    /**
     * Rebuilds the full search index.
     */
    async reindex(ctx: RequestContext): Promise<JobInfo> {
        const { indexPrefix } = this.options;
        await this.deleteIndices(indexPrefix);
        await this.createIndices(indexPrefix);
        const job = this.elasticsearchIndexService.reindex(ctx);
        job.start();
        return job;
    }

    private async createIndices(prefix: string) {
        try {
            const index = prefix + VARIANT_INDEX_NAME;
            await this.client.indices.create({ index });
            Logger.verbose(`Created index "${index}"`, loggerCtx);
        } catch (e) {
            Logger.error(JSON.stringify(e, null, 2), loggerCtx);
        }
        try {
            const index = prefix + PRODUCT_INDEX_NAME;
            await this.client.indices.create({ index });
            Logger.verbose(`Created index "${index}"`, loggerCtx);
        } catch (e) {
            Logger.error(JSON.stringify(e, null, 2), loggerCtx);
        }
    }

    private async deleteIndices(prefix: string) {
        try {
            const index = prefix + VARIANT_INDEX_NAME;
            await this.client.indices.delete({ index });
            Logger.verbose(`Deleted index "${index}"`, loggerCtx);
        } catch (e) {
            Logger.error(e, loggerCtx);
        }
        try {
            const index = prefix + PRODUCT_INDEX_NAME;
            await this.client.indices.delete({ index });
            Logger.verbose(`Deleted index "${index}"`, loggerCtx);
        } catch (e) {
            Logger.error(e, loggerCtx);
        }
    }

    private mapVariantToSearchResult(hit: SearchHit<VariantIndexItem>): SearchResult {
        const source = hit._source;
        return {
            ...source,
            price: {
                value: source.price,
            },
            priceWithTax: {
                value: source.priceWithTax,
            },
            score: hit._score,
        };
    }

    private mapProductToSearchResult(hit: SearchHit<ProductIndexItem>): SearchResult {
        const source = hit._source;
        return {
            ...source,
            productId: source.productId.toString(),
            productName: source.productName[0],
            productVariantId: source.productVariantId[0].toString(),
            productVariantName: source.productVariantName[0],
            productVariantPreview: source.productVariantPreview[0],
            facetIds: source.facetIds as string[],
            facetValueIds: source.facetValueIds as string[],
            collectionIds: source.collectionIds as string[],
            sku: source.sku[0],
            slug: source.slug[0],
            price: {
                min: source.priceMin,
                max: source.priceMax,
            },
            priceWithTax: {
                min: source.priceWithTaxMin,
                max: source.priceWithTaxMax,
            },
            score: hit._score,
        };
    }
}
