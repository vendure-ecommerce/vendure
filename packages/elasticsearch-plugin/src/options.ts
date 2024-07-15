import { ClientOptions } from '@elastic/elasticsearch';
import {
    DeepRequired,
    EntityRelationPaths,
    ID,
    Injector,
    LanguageCode,
    Product,
    ProductVariant,
    RequestContext
} from '@vendure/core';
import deepmerge from 'deepmerge';

import {
    CustomMapping,
    CustomScriptMapping,
    ElasticSearchInput,
    ElasticSearchSortInput,
    GraphQlPrimitive,
    PrimitiveTypeVariations,
} from './types';

/**
 * @description
 * Configuration options for the {@link ElasticsearchPlugin}.
 *
 * @docsCategory core plugins/ElasticsearchPlugin
 * @docsPage ElasticsearchOptions
 */
export interface ElasticsearchOptions {
    /**
     * @description
     * The host of the Elasticsearch server. May also be specified in `clientOptions.node`.
     *
     * @default 'http://localhost'
     */
    host?: string;
    /**
     * @description
     * The port of the Elasticsearch server. May also be specified in `clientOptions.node`.
     *
     * @default 9200
     */
    port?: number;
    /**
     * @description
     * Maximum amount of attempts made to connect to the ElasticSearch server on startup.
     *
     * @default 10
     */
    connectionAttempts?: number;
    /**
     * @description
     * Interval in milliseconds between attempts to connect to the ElasticSearch server on startup.
     *
     * @default 5000
     */
    connectionAttemptInterval?: number;
    /**
     * @description
     * Options to pass directly to the
     * [Elasticsearch Node.js client](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/index.html). For example, to
     * set authentication or other more advanced options.
     * Note that if the `node` or `nodes` option is specified, it will override the values provided in the `host` and `port` options.
     */
    clientOptions?: ClientOptions;
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
     * [These options](https://www.elastic.co/guide/en/elasticsearch/reference/7.x/index-modules.html#index-modules-settings)
     * are directly passed to index settings. To apply some settings indices will be recreated.
     *
     * @example
     * ```ts
     * // Configuring an English stemmer
     * indexSettings: {
     *   analysis: {
     *     analyzer: {
     *       custom_analyzer: {
     *         tokenizer: 'standard',
     *         filter: [
     *           'lowercase',
     *           'english_stemmer'
     *         ]
     *       }
     *     },
     *     filter : {
     *       english_stemmer : {
     *         type : 'stemmer',
     *         name : 'english'
     *       }
     *     }
     *   }
     * },
     * ```
     * A more complete example can be found in the discussion thread
     * [How to make elastic plugin to search by substring with stemming](https://github.com/vendure-ecommerce/vendure/discussions/1066).
     *
     * @since 1.2.0
     * @default
     * {}
     */
    indexSettings?: object;
    /**
     * @description
     * This option allow to redefine or define new properties in mapping. More about elastic
     * [mapping](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping.html)
     * After changing this option indices will be recreated.
     *
     * @example
     * ```ts
     * // Configuring custom analyzer for the `productName` field.
     * indexMappingProperties: {
     *   productName: {
     *     type: 'text',
     *     analyzer:'custom_analyzer',
     *     fields: {
     *       keyword: {
     *         type: 'keyword',
     *         ignore_above: 256,
     *       }
     *     }
     *   }
     * }
     * ```
     *
     * To reference a field defined by `customProductMappings` or `customProductVariantMappings`, you will
     * need to prefix the name with `'product-<name>'` or `'variant-<name>'` respectively, e.g.:
     *
     * @example
     * ```ts
     * customProductMappings: {
     *    variantCount: {
     *        graphQlType: 'Int!',
     *        valueFn: (product, variants) => variants.length,
     *    },
     * },
     * indexMappingProperties: {
     *   'product-variantCount': {
     *     type: 'integer',
     *   }
     * }
     * ```
     *
     * @since 1.2.0
     * @default
     * {}
     */
    indexMappingProperties?: {
        [indexName: string]: object;
    };
    /**
     * @description
     * Products limit chunk size for each loop iteration when indexing products.
     *
     * @default 2500
     * @since 2.1.7
     */
    reindexProductsChunkSize?: number;
    /**
     * @description
     * Index operations are performed in bulk, with each bulk operation containing a number of individual
     * index operations. This option sets the maximum number of operations in the memory buffer before a
     * bulk operation is executed.
     *
     * @default 3000
     * @since 2.1.7
     */
    reindexBulkOperationSizeLimit?: number;
    /**
     * @description
     * Configuration of the internal Elasticsearch query.
     */
    searchConfig?: SearchConfig;
    /**
     * @description
     * Custom mappings may be defined which will add the defined data to the
     * Elasticsearch index and expose that data via the SearchResult GraphQL type,
     * adding a new `customMappings`, `customProductMappings` & `customProductVariantMappings` fields.
     *
     * The `graphQlType` property may be one of `String`, `Int`, `Float`, `Boolean`, `ID` or list
     * versions thereof (`[String!]` etc) and can be appended with a `!` to indicate non-nullable fields.
     *
     * The `public` (default = `true`) property is used to reveal or hide the property in the GraphQL API schema.
     * If this property is set to `false` it's not accessible in the `customMappings` field but it's still getting
     * parsed to the elasticsearch index.
     *
     * This config option defines custom mappings which are accessible when the "groupByProduct"
     * input options is set to `true`. In addition, custom variant mappings can be accessed by using
     * the `customProductVariantMappings` field, which is always available.
     *
     * @example
     * ```ts
     * customProductMappings: {
     *    variantCount: {
     *        graphQlType: 'Int!',
     *        valueFn: (product, variants) => variants.length,
     *    },
     *    reviewRating: {
     *        graphQlType: 'Float',
     *        public: true,
     *        valueFn: product => (product.customFields as any).reviewRating,
     *    },
     *    priority: {
     *        graphQlType: 'Int!',
     *        public: false,
     *        valueFn: product => (product.customFields as any).priority,
     *    },
     * }
     * ```
     *
     * @example
     * ```graphql
     * query SearchProducts($input: SearchInput!) {
     *     search(input: $input) {
     *         totalItems
     *         items {
     *             productId
     *             productName
     *             customProductMappings {
     *                 variantCount
     *                 reviewRating
     *             }
     *             customMappings {
     *                 ...on CustomProductMappings {
     *                     variantCount
     *                     reviewRating
     *                 }
     *             }
     *         }
     *     }
     * }
     * ```
     */
    customProductMappings?: {
        [fieldName: string]: CustomMapping<[Product, ProductVariant[], LanguageCode, Injector, RequestContext]>;
    };
    /**
     * @description
     * This config option defines custom mappings which are accessible when the "groupByProduct"
     * input options is set to `false`. In addition, custom product mappings can be accessed by using
     * the `customProductMappings` field, which is always available.
     *
     * @example
     * ```graphql
     * query SearchProducts($input: SearchInput!) {
     *     search(input: $input) {
     *         totalItems
     *         items {
     *             productId
     *             productName
     *             customProductVariantMappings {
     *                 weight
     *             }
     *             customMappings {
     *                 ...on CustomProductVariantMappings {
     *                     weight
     *                 }
     *             }
     *         }
     *     }
     * }
     * ```
     */
    customProductVariantMappings?: {
        [fieldName: string]: CustomMapping<[ProductVariant, LanguageCode, Injector, RequestContext]>;
    };
    /**
     * @description
     * If set to `true`, updates to Products, ProductVariants and Collections will not immediately
     * trigger an update to the search index. Instead, all these changes will be buffered and will
     * only be run via a call to the `runPendingSearchIndexUpdates` mutation in the Admin API.
     *
     * This is very useful for installations with a large number of ProductVariants and/or
     * Collections, as the buffering allows better control over when these expensive jobs are run,
     * and also performs optimizations to minimize the amount of work that needs to be performed by
     * the worker.
     *
     * @since 1.3.0
     * @default false
     */
    bufferUpdates?: boolean;
    /**
     * @description
     * Additional product relations that will be fetched from DB while reindexing. This can be used
     * in combination with `customProductMappings` to ensure that the required relations are joined
     * before the `product` object is passed to the `valueFn`.
     *
     * @example
     * ```ts
     * {
     *   hydrateProductRelations: ['assets.asset'],
     *   customProductMappings: {
     *     assetPreviews: {
     *       graphQlType: '[String!]',
     *       // Here we can be sure that the `product.assets` array is populated
     *       // with an Asset object
     *       valueFn: (product) => product.assets.map(a => a.asset.preview),
     *     }
     *   }
     * }
     * ```
     *
     * @default []
     * @since 1.3.0
     */
    hydrateProductRelations?: Array<EntityRelationPaths<Product>>;
    /**
     * @description
     * Additional variant relations that will be fetched from DB while reindexing. See
     * `hydrateProductRelations` for more explanation and a usage example.
     *
     * @default []
     * @since 1.3.0
     */
    hydrateProductVariantRelations?: Array<EntityRelationPaths<ProductVariant>>;
    /**
     * @description
     * Allows the `SearchInput` type to be extended with new input fields. This allows arbitrary
     * data to be passed in, which can then be used e.g. in the `mapQuery()` function or
     * custom `scriptFields` functions.
     *
     * @example
     * ```ts
     * extendSearchInputType: {
     *   longitude: 'Float',
     *   latitude: 'Float',
     *   radius: 'Float',
     * }
     * ```
     *
     * This allows the search query to include these new fields:
     *
     * @example
     * ```graphql
     * query {
     *   search(input: {
     *     longitude: 101.7117,
     *     latitude: 3.1584,
     *     radius: 50.00
     *   }) {
     *     items {
     *       productName
     *     }
     *   }
     * }
     * ```
     *
     * @default {}
     * @since 1.3.0
     */
    extendSearchInputType?: {
        [name: string]: PrimitiveTypeVariations<GraphQlPrimitive>;
    };

    /**
     * @description
     * Adds a list of sort parameters. This is mostly important to make the
     * correct sort order values available inside `input` parameter of the `mapSort` option.
     *
     * @example
     * ```ts
     * extendSearchSortType: ["distance"]
     * ```
     *
     * will extend the `SearchResultSortParameter` input type like this:
     *
     * @example
     * ```GraphQl
     * extend input SearchResultSortParameter {
     *      distance: SortOrder
     * }
     * ```
     *
     * @default []
     * @since 1.4.0
     */
    extendSearchSortType?: string[];
}

/**
 * @description
 * Configuration options for the internal Elasticsearch query which is generated when performing a search.
 *
 * @docsCategory core plugins/ElasticsearchPlugin
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

    /**
     * @description
     * The maximum number of Collections to return from the search query. Internally, this
     * value sets the "size" property of an Elasticsearch aggregation.
     *
     * @since 1.1.0
     * @default
     * 50
     */
    collectionMaxSize?: number;

    /**
     * @description
     * The maximum number of totalItems to return from the search query. Internally, this
     * value sets the "track_total_hits" property of an Elasticsearch query.
     * If this parameter is set to "True", accurate count of totalItems will be returned.
     * If this parameter is set to "False", totalItems will be returned as 0.
     * If this parameter is set to integer, accurate count of totalItems will be returned not bigger than integer.
     *
     * @since 1.2.0
     * @default
     * 10000
     */
    totalItemsMaxSize?: number | boolean;

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
    /**
     * @description
     * The interval used to group search results into buckets according to price range. For example, setting this to
     * `2000` will group into buckets every $20.00:
     *
     * ```json
     * {
     *   "data": {
     *     "search": {
     *       "totalItems": 32,
     *       "priceRange": {
     *         "buckets": [
     *           {
     *             "to": 2000,
     *             "count": 21
     *           },
     *           {
     *             "to": 4000,
     *             "count": 7
     *           },
     *           {
     *             "to": 6000,
     *             "count": 3
     *           },
     *           {
     *             "to": 12000,
     *             "count": 1
     *           }
     *         ]
     *       }
     *     }
     *   }
     * }
     * ```
     */
    priceRangeBucketInterval?: number;
    /**
     * @description
     * This config option allows the the modification of the whole (already built) search query. This allows
     * for e.g. wildcard / fuzzy searches on the index.
     *
     * @example
     * ```ts
     * mapQuery: (query, input, searchConfig, channelId, enabledOnly){
     *   if(query.bool.must){
     *     delete query.bool.must;
     *   }
     *   query.bool.should = [
     *     {
     *       query_string: {
     *         query: "*" + term + "*",
     *         fields: [
     *           `productName^${searchConfig.boostFields.productName}`,
     *           `productVariantName^${searchConfig.boostFields.productVariantName}`,
     *         ]
     *       }
     *     },
     *     {
     *       multi_match: {
     *         query: term,
     *         type: searchConfig.multiMatchType,
     *         fields: [
     *           `description^${searchConfig.boostFields.description}`,
     *           `sku^${searchConfig.boostFields.sku}`,
     *         ],
     *       },
     *     },
     *   ];
     *
     *   return query;
     * }
     * ```
     */
    mapQuery?: (
        query: any,
        input: ElasticSearchInput,
        searchConfig: DeepRequired<SearchConfig>,
        channelId: ID,
        enabledOnly: boolean,
    ) => any;
    /**
     * @description
     * Sets `script_fields` inside the elasticsearch body which allows returning a script evaluation for each hit.
     *
     * The script field definition consists of three properties:
     *
     * * `graphQlType`: This is the type that will be returned when this script field is queried
     * via the GraphQL API. It may be one of `String`, `Int`, `Float`, `Boolean`, `ID` or list
     * versions thereof (`[String!]` etc) and can be appended with a `!` to indicate non-nullable fields.
     * * `context`: determines whether this script field is available when grouping by product. Can be
     * `product`, `variant` or `both`.
     * * `scriptFn`: This is the function to run on each hit. Should return an object with a `script` property,
     * as covered in the
     * [Elasticsearch script fields docs](https://www.elastic.co/guide/en/elasticsearch/reference/7.15/search-fields.html#script-fields)
     *
     * @example
     * ```ts
     * extendSearchInputType: {
     *   latitude: 'Float',
     *   longitude: 'Float',
     * },
     * indexMappingProperties: {
     *   // The `product-location` field corresponds to the `location` customProductMapping
     *   // defined below. Here we specify that it would be index as a `geo_point` type,
     *   // which will allow us to perform geo-spacial calculations on it in our script field.
     *   'product-location': {
     *     type: 'geo_point', // contains function arcDistance
     *   },
     * },
     * customProductMappings: {
     *   location: {
     *     graphQlType: 'String',
     *     valueFn: (product: Product) => {
     *       // Assume that the Product entity has this customField defined
     *       const custom = product.customFields.location;
     *       return `${custom.latitude},${custom.longitude}`;
     *     },
     *   }
     * },
     * searchConfig: {
     *   scriptFields: {
     *     distance: {
     *       graphQlType: 'Float!',
     *       // Run this script only when grouping results by product
     *       context: 'product',
     *       scriptFn: (input) => {
     *         // The SearchInput was extended with latitude and longitude
     *         // via the `extendSearchInputType` option above.
     *         const lat = input.latitude;
     *         const lon = input.longitude;
     *         return {
     *           script: `doc['product-location'].arcDistance(${lat}, ${lon})`,
     *         }
     *       }
     *     }
     *   }
     * }
     * ```
     *
     * @since 1.3.0
     */
    scriptFields?: { [fieldName: string]: CustomScriptMapping<[ElasticSearchInput]> };
    /**
     * @description
     * Allows extending the `sort` input of the elasticsearch body as covered in
     * [Elasticsearch sort docs](https://www.elastic.co/guide/en/elasticsearch/reference/current/sort-search-results.html)
     *
     * The `sort` input parameter contains the ElasticSearchSortInput generated for the default sort parameters "name" and "price".
     * If neither of those are applied it will be empty.
     *
     * @example
     * ```ts
     * mapSort: (sort, input) => {
     *     // Assuming `extendSearchSortType: ["priority"]`
     *     // Assuming priority is never undefined
     *     const { priority } = input.sort;
     *     return [
     *          ...sort,
     *          {
     *              // The `product-priority` field corresponds to the `priority` customProductMapping
     *              // Depending on the index type, this field might require a
     *              // more detailed input (example: 'productName.keyword')
     *              ["product-priority"]: {
     *                  order: priority === SortOrder.ASC ? 'asc' : 'desc'
     *              }
     *          }
     *      ];
     * }
     * ```
     *
     * A more generic example would be a sort function based on a product location like this:
     * @example
     * ```ts
     * extendSearchInputType: {
     *   latitude: 'Float',
     *   longitude: 'Float',
     * },
     * extendSearchSortType: ["distance"],
     * indexMappingProperties: {
     *   // The `product-location` field corresponds to the `location` customProductMapping
     *   // defined below. Here we specify that it would be index as a `geo_point` type,
     *   // which will allow us to perform geo-spacial calculations on it in our script field.
     *   'product-location': {
     *     type: 'geo_point',
     *   },
     * },
     * customProductMappings: {
     *   location: {
     *     graphQlType: 'String',
     *     valueFn: (product: Product) => {
     *       // Assume that the Product entity has this customField defined
     *       const custom = product.customFields.location;
     *       return `${custom.latitude},${custom.longitude}`;
     *     },
     *   }
     * },
     * searchConfig: {
     *      mapSort: (sort, input) => {
     *          // Assuming distance is never undefined
     *          const { distance } = input.sort;
     *          return [
     *              ...sort,
     *              {
     *                  ["_geo_distance"]: {
     *                      "product-location": [
     *                          input.longitude,
     *                          input.latitude
     *                      ],
     *                      order: distance === SortOrder.ASC ? 'asc' : 'desc',
     *                      unit: "km"
     *                  }
     *              }
     *          ];
     *      }
     * }
     * ```
     *
     * @default {}
     * @since 1.4.0
     */
    mapSort?: (sort: ElasticSearchSortInput, input: ElasticSearchInput) => ElasticSearchSortInput;
}

/**
 * @description
 * Configuration for [boosting](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-multi-match-query.html#field-boost)
 * the scores of given fields when performing a search against a term.
 *
 * Boosting a field acts as a score multiplier for matches against that field.
 *
 * @docsCategory core plugins/ElasticsearchPlugin
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

export type ElasticsearchRuntimeOptions = DeepRequired<Omit<ElasticsearchOptions, 'clientOptions'>> & {
    clientOptions?: ClientOptions;
};

export const defaultOptions: ElasticsearchRuntimeOptions = {
    host: 'http://localhost',
    port: 9200,
    connectionAttempts: 10,
    connectionAttemptInterval: 5000,
    indexPrefix: 'vendure-',
    indexSettings: {},
    indexMappingProperties: {},
    reindexProductsChunkSize: 2500,
    reindexBulkOperationSizeLimit: 3000,
    searchConfig: {
        facetValueMaxSize: 50,
        collectionMaxSize: 50,
        totalItemsMaxSize: 10000,
        multiMatchType: 'best_fields',
        boostFields: {
            productName: 1,
            productVariantName: 1,
            description: 1,
            sku: 1,
        },
        priceRangeBucketInterval: 1000,
        mapQuery: query => query,
        mapSort: sort => sort,
        scriptFields: {},
    },
    customProductMappings: {},
    customProductVariantMappings: {},
    bufferUpdates: false,
    hydrateProductRelations: [],
    hydrateProductVariantRelations: [],
    extendSearchInputType: {},
    extendSearchSortType: [],
};

export function mergeWithDefaults(userOptions: ElasticsearchOptions): ElasticsearchRuntimeOptions {
    const { clientOptions, ...pluginOptions } = userOptions;
    const merged = deepmerge(defaultOptions, pluginOptions) as ElasticsearchRuntimeOptions;
    return { ...merged, clientOptions };
}
