import { DeepRequired } from '@vendure/core';
import deepmerge from 'deepmerge';

/**
 * @description
 * Configuration options for the {@link ElasticsearchPlugin}.
 *
 * @docsCategory ElasticsearchPlugin
 * @docsPage ElasticsearchOptions
 */
export interface ElasticsearchOptions {
    /**
     * @description
     * The host of the Elasticsearch server.
     */
    host: string;
    /**
     * @description
     * The port of the Elasticsearch server.
     */
    port: number;
    /**
     * @description
     * Prefix for the indices created by the plugin.
     *
     * @default
     * 'vendure-'
     */
    indexPrefix?: string;
    /**
     * @description
     * Batch size for bulk operations (e.g. when rebuilding the indices).
     *
     * @default
     * 2000
     */
    batchSize?: number;
    /**
     * @description
     * Configuration of the internal Elasticseach query.
     */
    searchConfig?: SearchConfig;
}

/**
 * @description
 * Configuration options for the internal Elasticsearch query which is generated when performing a search.
 *
 * @docsCategory ElasticsearchPlugin
 * @docsPage ElasticsearchOptions
 */
export interface SearchConfig {
    /**
     * @description
     * The maximum number of FacetValues to return from the search query. Internally, this
     * value sets the "size" property of an Elasticsearch aggregation.
     *
     * @default
     * 50
     */
    facetValueMaxSize?: number;

    // prettier-ignore
    /**
     * @description
     * Defines the
     * [multi match type](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-multi-match-query.html#multi-match-types)
     * used when matching against a search term.
     *
     * @default
     * 'best_fields'
     */
    multiMatchType?: 'best_fields' | 'most_fields' | 'cross_fields' | 'phrase' | 'phrase_prefix' | 'bool_prefix';
    /**
     * @description
     * Set custom boost values for particular fields when matching against a search term.
     */
    boostFields?: BoostFieldsConfig;
}

/**
 * @description
 * Configuration for [boosting](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-multi-match-query.html#field-boost)
 * the scores of given fields when performing a search against a term.
 *
 * Boosting a field acts as a score multiplier for matches against that field.
 *
 * @docsCategory ElasticsearchPlugin
 * @docsPage ElasticsearchOptions
 */
export interface BoostFieldsConfig {
    /**
     * @description
     * Defines the boost factor for the productName field.
     *
     * @default 1
     */
    productName?: number;
    /**
     * @description
     * Defines the boost factor for the productVariantName field.
     *
     * @default 1
     */
    productVariantName?: number;
    /**
     * @description
     * Defines the boost factor for the description field.
     *
     * @default 1
     */
    description?: number;
    /**
     * @description
     * Defines the boost factor for the sku field.
     *
     * @default 1
     */
    sku?: number;
}

export const defaultOptions: DeepRequired<ElasticsearchOptions> = {
    host: 'http://localhost',
    port: 9200,
    indexPrefix: 'vendure-',
    batchSize: 2000,
    searchConfig: {
        facetValueMaxSize: 50,
        multiMatchType: 'best_fields',
        boostFields: {
            productName: 1,
            productVariantName: 1,
            description: 1,
            sku: 1,
        },
    },
};

export function mergeWithDefaults(userOptions: ElasticsearchOptions): DeepRequired<ElasticsearchOptions> {
    return deepmerge(defaultOptions, userOptions) as DeepRequired<ElasticsearchOptions>;
}
