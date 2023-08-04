---
title: "ElasticsearchOptions"
weight: 10
date: 2023-07-14T16:57:50.758Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# ElasticsearchOptions
<div class="symbol">


# ElasticsearchOptions

{{< generation-info sourceFile="packages/elasticsearch-plugin/src/options.ts" sourceLine="22" packageName="@vendure/elasticsearch-plugin">}}

Configuration options for the <a href='/typescript-api/core-plugins/elasticsearch-plugin/#elasticsearchplugin'>ElasticsearchPlugin</a>.

## Signature

```TypeScript
interface ElasticsearchOptions {
  host?: string;
  port?: number;
  connectionAttempts?: number;
  connectionAttemptInterval?: number;
  clientOptions?: ClientOptions;
  indexPrefix?: string;
  indexSettings?: object;
  indexMappingProperties?: {
        [indexName: string]: object;
    };
  batchSize?: number;
  searchConfig?: SearchConfig;
  customProductMappings?: {
        [fieldName: string]: CustomMapping<[Product, ProductVariant[], LanguageCode]>;
    };
  customProductVariantMappings?: {
        [fieldName: string]: CustomMapping<[ProductVariant, LanguageCode]>;
    };
  bufferUpdates?: boolean;
  hydrateProductRelations?: Array<EntityRelationPaths<Product>>;
  hydrateProductVariantRelations?: Array<EntityRelationPaths<ProductVariant>>;
  extendSearchInputType?: {
        [name: string]: PrimitiveTypeVariations<GraphQlPrimitive>;
    };
  extendSearchSortType?: string[];
}
```
## Members

### host

{{< member-info kind="property" type="string" default="'http://localhost'"  >}}

{{< member-description >}}The host of the Elasticsearch server. May also be specified in `clientOptions.node`.{{< /member-description >}}

### port

{{< member-info kind="property" type="number" default="9200"  >}}

{{< member-description >}}The port of the Elasticsearch server. May also be specified in `clientOptions.node`.{{< /member-description >}}

### connectionAttempts

{{< member-info kind="property" type="number" default="10"  >}}

{{< member-description >}}Maximum amount of attempts made to connect to the ElasticSearch server on startup.{{< /member-description >}}

### connectionAttemptInterval

{{< member-info kind="property" type="number" default="5000"  >}}

{{< member-description >}}Interval in milliseconds between attempts to connect to the ElasticSearch server on startup.{{< /member-description >}}

### clientOptions

{{< member-info kind="property" type="ClientOptions"  >}}

{{< member-description >}}Options to pass directly to the
[Elasticsearch Node.js client](https://www.elastic.co/guide/en/elasticsearch/client/javascript-api/current/index.html). For example, to
set authentication or other more advanced options.
Note that if the `node` or `nodes` option is specified, it will override the values provided in the `host` and `port` options.{{< /member-description >}}

### indexPrefix

{{< member-info kind="property" type="string" default="'vendure-'"  >}}

{{< member-description >}}Prefix for the indices created by the plugin.{{< /member-description >}}

### indexSettings

{{< member-info kind="property" type="object" default="{}"  since="1.2.0" >}}

{{< member-description >}}[These options](https://www.elastic.co/guide/en/elasticsearch/reference/7.x/index-modules.html#index-modules-settings)
are directly passed to index settings. To apply some settings indices will be recreated.

*Example*

```TypeScript
// Configuring an English stemmer
indexSettings: {
  analysis: {
    analyzer: {
      custom_analyzer: {
        tokenizer: 'standard',
        filter: [
          'lowercase',
          'english_stemmer'
        ]
      }
    },
    filter : {
      english_stemmer : {
        type : 'stemmer',
        name : 'english'
      }
    }
  }
},
```
A more complete example can be found in the discussion thread
[How to make elastic plugin to search by substring with stemming](https://github.com/vendure-ecommerce/vendure/discussions/1066).{{< /member-description >}}

### indexMappingProperties

{{< member-info kind="property" type="{         [indexName: string]: object;     }" default="{}"  since="1.2.0" >}}

{{< member-description >}}This option allow to redefine or define new properties in mapping. More about elastic
[mapping](https://www.elastic.co/guide/en/elasticsearch/reference/current/mapping.html)
After changing this option indices will be recreated.

*Example*

```TypeScript
// Configuring custom analyzer for the `productName` field.
indexMappingProperties: {
  productName: {
    type: 'text',
    analyzer:'custom_analyzer',
    fields: {
      keyword: {
        type: 'keyword',
        ignore_above: 256,
      }
    }
  }
}
```

To reference a field defined by `customProductMappings` or `customProductVariantMappings`, you will
need to prefix the name with `'product-<name>'` or `'variant-<name>'` respectively, e.g.:

*Example*

```TypeScript
customProductMappings: {
   variantCount: {
       graphQlType: 'Int!',
       valueFn: (product, variants) => variants.length,
   },
},
indexMappingProperties: {
  'product-variantCount': {
    type: 'integer',
  }
}
```{{< /member-description >}}

### batchSize

{{< member-info kind="property" type="number" default="2000"  >}}

{{< member-description >}}Batch size for bulk operations (e.g. when rebuilding the indices).{{< /member-description >}}

### searchConfig

{{< member-info kind="property" type="<a href='/typescript-api/core-plugins/elasticsearch-plugin/elasticsearch-options#searchconfig'>SearchConfig</a>"  >}}

{{< member-description >}}Configuration of the internal Elasticsearch query.{{< /member-description >}}

### customProductMappings

{{< member-info kind="property" type="{         [fieldName: string]: CustomMapping&#60;[<a href='/typescript-api/entities/product#product'>Product</a>, <a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>[], <a href='/typescript-api/common/language-code#languagecode'>LanguageCode</a>]&#62;;     }"  >}}

{{< member-description >}}Custom mappings may be defined which will add the defined data to the
Elasticsearch index and expose that data via the SearchResult GraphQL type,
adding a new `customMappings`, `customProductMappings` & `customProductVariantMappings` fields.

The `graphQlType` property may be one of `String`, `Int`, `Float`, `Boolean`, `ID` or list
versions thereof (`[String!]` etc) and can be appended with a `!` to indicate non-nullable fields.

The `public` (default = `true`) property is used to reveal or hide the property in the GraphQL API schema.
If this property is set to `false` it's not accessible in the `customMappings` field but it's still getting
parsed to the elasticsearch index.

This config option defines custom mappings which are accessible when the "groupByProduct"
input options is set to `true`. In addition, custom variant mappings can be accessed by using
the `customProductVariantMappings` field, which is always available.

*Example*

```TypeScript
customProductMappings: {
   variantCount: {
       graphQlType: 'Int!',
       valueFn: (product, variants) => variants.length,
   },
   reviewRating: {
       graphQlType: 'Float',
       public: true,
       valueFn: product => (product.customFields as any).reviewRating,
   },
   priority: {
       graphQlType: 'Int!',
       public: false,
       valueFn: product => (product.customFields as any).priority,
   },
}
```

*Example*

```SDL
query SearchProducts($input: SearchInput!) {
    search(input: $input) {
        totalItems
        items {
            productId
            productName
            customProductMappings {
                variantCount
                reviewRating
            }
            customMappings {
                ...on CustomProductMappings {
                    variantCount
                    reviewRating
                }
            }
        }
    }
}
```{{< /member-description >}}

### customProductVariantMappings

{{< member-info kind="property" type="{         [fieldName: string]: CustomMapping&#60;[<a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>, <a href='/typescript-api/common/language-code#languagecode'>LanguageCode</a>]&#62;;     }"  >}}

{{< member-description >}}This config option defines custom mappings which are accessible when the "groupByProduct"
input options is set to `false`. In addition, custom product mappings can be accessed by using
the `customProductMappings` field, which is always available.

*Example*

```SDL
query SearchProducts($input: SearchInput!) {
    search(input: $input) {
        totalItems
        items {
            productId
            productName
            customProductVariantMappings {
                weight
            }
            customMappings {
                ...on CustomProductVariantMappings {
                    weight
                }
            }
        }
    }
}
```{{< /member-description >}}

### bufferUpdates

{{< member-info kind="property" type="boolean" default="false"  since="1.3.0" >}}

{{< member-description >}}If set to `true`, updates to Products, ProductVariants and Collections will not immediately
trigger an update to the search index. Instead, all these changes will be buffered and will
only be run via a call to the `runPendingSearchIndexUpdates` mutation in the Admin API.

This is very useful for installations with a large number of ProductVariants and/or
Collections, as the buffering allows better control over when these expensive jobs are run,
and also performs optimizations to minimize the amount of work that needs to be performed by
the worker.{{< /member-description >}}

### hydrateProductRelations

{{< member-info kind="property" type="Array&#60;<a href='/typescript-api/common/entity-relation-paths#entityrelationpaths'>EntityRelationPaths</a>&#60;<a href='/typescript-api/entities/product#product'>Product</a>&#62;&#62;" default="[]"  since="1.3.0" >}}

{{< member-description >}}Additional product relations that will be fetched from DB while reindexing. This can be used
in combination with `customProductMappings` to ensure that the required relations are joined
before the `product` object is passed to the `valueFn`.

*Example*

```TypeScript
{
  hydrateProductRelations: ['assets.asset'],
  customProductMappings: {
    assetPreviews: {
      graphQlType: '[String!]',
      // Here we can be sure that the `product.assets` array is populated
      // with an Asset object
      valueFn: (product) => product.assets.map(a => a.asset.preview),
    }
  }
}
```{{< /member-description >}}

### hydrateProductVariantRelations

{{< member-info kind="property" type="Array&#60;<a href='/typescript-api/common/entity-relation-paths#entityrelationpaths'>EntityRelationPaths</a>&#60;<a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62;&#62;" default="[]"  since="1.3.0" >}}

{{< member-description >}}Additional variant relations that will be fetched from DB while reindexing. See
`hydrateProductRelations` for more explanation and a usage example.{{< /member-description >}}

### extendSearchInputType

{{< member-info kind="property" type="{         [name: string]: PrimitiveTypeVariations&#60;GraphQlPrimitive&#62;;     }" default="{}"  since="1.3.0" >}}

{{< member-description >}}Allows the `SearchInput` type to be extended with new input fields. This allows arbitrary
data to be passed in, which can then be used e.g. in the `mapQuery()` function or
custom `scriptFields` functions.

*Example*

```TypeScript
extendSearchInputType: {
  longitude: 'Float',
  latitude: 'Float',
  radius: 'Float',
}
```

This allows the search query to include these new fields:

*Example*

```GraphQl
query {
  search(input: {
    longitude: 101.7117,
    latitude: 3.1584,
    radius: 50.00
  }) {
    items {
      productName
    }
  }
}
```{{< /member-description >}}

### extendSearchSortType

{{< member-info kind="property" type="string[]" default="[]"  since="1.4.0" >}}

{{< member-description >}}Adds a list of sort parameters. This is mostly important to make the
correct sort order values available inside `input` parameter of the `mapSort` option.

*Example*

```TypeScript
extendSearchSortType: ["distance"]
```

will extend the `SearchResultSortParameter` input type like this:

*Example*

```GraphQl
extend input SearchResultSortParameter {
     distance: SortOrder
}
```{{< /member-description >}}


</div>
<div class="symbol">


# SearchConfig

{{< generation-info sourceFile="packages/elasticsearch-plugin/src/options.ts" sourceLine="377" packageName="@vendure/elasticsearch-plugin">}}

Configuration options for the internal Elasticsearch query which is generated when performing a search.

## Signature

```TypeScript
interface SearchConfig {
  facetValueMaxSize?: number;
  collectionMaxSize?: number;
  totalItemsMaxSize?: number | boolean;
  multiMatchType?: 'best_fields' | 'most_fields' | 'cross_fields' | 'phrase' | 'phrase_prefix' | 'bool_prefix';
  boostFields?: BoostFieldsConfig;
  priceRangeBucketInterval?: number;
  mapQuery?: (
        query: any,
        input: ElasticSearchInput,
        searchConfig: DeepRequired<SearchConfig>,
        channelId: ID,
        enabledOnly: boolean,
    ) => any;
  scriptFields?: { [fieldName: string]: CustomScriptMapping<[ElasticSearchInput]> };
  mapSort?: (sort: ElasticSearchSortInput, input: ElasticSearchInput) => ElasticSearchSortInput;
}
```
## Members

### facetValueMaxSize

{{< member-info kind="property" type="number" default="50"  >}}

{{< member-description >}}The maximum number of FacetValues to return from the search query. Internally, this
value sets the "size" property of an Elasticsearch aggregation.{{< /member-description >}}

### collectionMaxSize

{{< member-info kind="property" type="number" default="50"  since="1.1.0" >}}

{{< member-description >}}The maximum number of Collections to return from the search query. Internally, this
value sets the "size" property of an Elasticsearch aggregation.{{< /member-description >}}

### totalItemsMaxSize

{{< member-info kind="property" type="number | boolean" default="10000"  since="1.2.0" >}}

{{< member-description >}}The maximum number of totalItems to return from the search query. Internally, this
value sets the "track_total_hits" property of an Elasticsearch query.
If this parameter is set to "True", accurate count of totalItems will be returned.
If this parameter is set to "False", totalItems will be returned as 0.
If this parameter is set to integer, accurate count of totalItems will be returned not bigger than integer.{{< /member-description >}}

### multiMatchType

{{< member-info kind="property" type="'best_fields' | 'most_fields' | 'cross_fields' | 'phrase' | 'phrase_prefix' | 'bool_prefix'" default="'best_fields'"  >}}

{{< member-description >}}Defines the
[multi match type](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-multi-match-query.html#multi-match-types)
used when matching against a search term.{{< /member-description >}}

### boostFields

{{< member-info kind="property" type="<a href='/typescript-api/core-plugins/elasticsearch-plugin/elasticsearch-options#boostfieldsconfig'>BoostFieldsConfig</a>"  >}}

{{< member-description >}}Set custom boost values for particular fields when matching against a search term.{{< /member-description >}}

### priceRangeBucketInterval

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}The interval used to group search results into buckets according to price range. For example, setting this to
`2000` will group into buckets every $20.00:

```JSON
{
  "data": {
    "search": {
      "totalItems": 32,
      "priceRange": {
        "buckets": [
          {
            "to": 2000,
            "count": 21
          },
          {
            "to": 4000,
            "count": 7
          },
          {
            "to": 6000,
            "count": 3
          },
          {
            "to": 12000,
            "count": 1
          }
        ]
      }
    }
  }
}
```{{< /member-description >}}

### mapQuery

{{< member-info kind="property" type="(         query: any,         input: ElasticSearchInput,         searchConfig: DeepRequired&#60;<a href='/typescript-api/core-plugins/elasticsearch-plugin/elasticsearch-options#searchconfig'>SearchConfig</a>&#62;,         channelId: <a href='/typescript-api/common/id#id'>ID</a>,         enabledOnly: boolean,     ) =&#62; any"  >}}

{{< member-description >}}This config option allows the the modification of the whole (already built) search query. This allows
for e.g. wildcard / fuzzy searches on the index.

*Example*

```TypeScript
mapQuery: (query, input, searchConfig, channelId, enabledOnly){
  if(query.bool.must){
    delete query.bool.must;
  }
  query.bool.should = [
    {
      query_string: {
        query: "*" + term + "*",
        fields: [
          `productName^${searchConfig.boostFields.productName}`,
          `productVariantName^${searchConfig.boostFields.productVariantName}`,
        ]
      }
    },
    {
      multi_match: {
        query: term,
        type: searchConfig.multiMatchType,
        fields: [
          `description^${searchConfig.boostFields.description}`,
          `sku^${searchConfig.boostFields.sku}`,
        ],
      },
    },
  ];

  return query;
}
```{{< /member-description >}}

### scriptFields

{{< member-info kind="property" type="{ [fieldName: string]: CustomScriptMapping&#60;[ElasticSearchInput]&#62; }"  since="1.3.0" >}}

{{< member-description >}}Sets `script_fields` inside the elasticsearch body which allows returning a script evaluation for each hit.

The script field definition consists of three properties:

* `graphQlType`: This is the type that will be returned when this script field is queried
via the GraphQL API. It may be one of `String`, `Int`, `Float`, `Boolean`, `ID` or list
versions thereof (`[String!]` etc) and can be appended with a `!` to indicate non-nullable fields.
* `context`: determines whether this script field is available when grouping by product. Can be
`product`, `variant` or `both`.
* `scriptFn`: This is the function to run on each hit. Should return an object with a `script` property,
as covered in the
[Elasticsearch script fields docs](https://www.elastic.co/guide/en/elasticsearch/reference/7.15/search-fields.html#script-fields)

*Example*

```TypeScript
extendSearchInputType: {
  latitude: 'Float',
  longitude: 'Float',
},
indexMappingProperties: {
  // The `product-location` field corresponds to the `location` customProductMapping
  // defined below. Here we specify that it would be index as a `geo_point` type,
  // which will allow us to perform geo-spacial calculations on it in our script field.
  'product-location': {
    type: 'geo_point', // contains function arcDistance
  },
},
customProductMappings: {
  location: {
    graphQlType: 'String',
    valueFn: (product: Product) => {
      // Assume that the Product entity has this customField defined
      const custom = product.customFields.location;
      return `${custom.latitude},${custom.longitude}`;
    },
  }
},
searchConfig: {
  scriptFields: {
    distance: {
      graphQlType: 'Float!',
      // Run this script only when grouping results by product
      context: 'product',
      scriptFn: (input) => {
        // The SearchInput was extended with latitude and longitude
        // via the `extendSearchInputType` option above.
        const lat = input.latitude;
        const lon = input.longitude;
        return {
          script: `doc['product-location'].arcDistance(${lat}, ${lon})`,
        }
      }
    }
  }
}
```{{< /member-description >}}

### mapSort

{{< member-info kind="property" type="(sort: ElasticSearchSortInput, input: ElasticSearchInput) =&#62; ElasticSearchSortInput" default="{}"  since="1.4.0" >}}

{{< member-description >}}Allows extending the `sort` input of the elasticsearch body as covered in
[Elasticsearch sort docs](https://www.elastic.co/guide/en/elasticsearch/reference/current/sort-search-results.html)

The `sort` input parameter contains the ElasticSearchSortInput generated for the default sort parameters "name" and "price".
If neither of those are applied it will be empty.

*Example*

```TS
mapSort: (sort, input) => {
    // Assuming `extendSearchSortType: ["priority"]`
    // Assuming priority is never undefined
    const { priority } = input.sort;
    return [
         ...sort,
         {
             // The `product-priority` field corresponds to the `priority` customProductMapping
             // Depending on the index type, this field might require a
             // more detailed input (example: 'productName.keyword')
             ["product-priority"]: {
                 order: priority === SortOrder.ASC ? 'asc' : 'desc'
             }
         }
     ];
}
```

A more generic example would be a sort function based on a product location like this:

*Example*

```TS
extendSearchInputType: {
  latitude: 'Float',
  longitude: 'Float',
},
extendSearchSortType: ["distance"],
indexMappingProperties: {
  // The `product-location` field corresponds to the `location` customProductMapping
  // defined below. Here we specify that it would be index as a `geo_point` type,
  // which will allow us to perform geo-spacial calculations on it in our script field.
  'product-location': {
    type: 'geo_point',
  },
},
customProductMappings: {
  location: {
    graphQlType: 'String',
    valueFn: (product: Product) => {
      // Assume that the Product entity has this customField defined
      const custom = product.customFields.location;
      return `${custom.latitude},${custom.longitude}`;
    },
  }
},
searchConfig: {
     mapSort: (sort, input) => {
         // Assuming distance is never undefined
         const { distance } = input.sort;
         return [
             ...sort,
             {
                 ["_geo_distance"]: {
                     "product-location": [
                         input.longitude,
                         input.latitude
                     ],
                     order: distance === SortOrder.ASC ? 'asc' : 'desc',
                     unit: "km"
                 }
             }
         ];
     }
}
```{{< /member-description >}}


</div>
<div class="symbol">


# BoostFieldsConfig

{{< generation-info sourceFile="packages/elasticsearch-plugin/src/options.ts" sourceLine="662" packageName="@vendure/elasticsearch-plugin">}}

Configuration for [boosting](https://www.elastic.co/guide/en/elasticsearch/reference/current/query-dsl-multi-match-query.html#field-boost)
the scores of given fields when performing a search against a term.

Boosting a field acts as a score multiplier for matches against that field.

## Signature

```TypeScript
interface BoostFieldsConfig {
  productName?: number;
  productVariantName?: number;
  description?: number;
  sku?: number;
}
```
## Members

### productName

{{< member-info kind="property" type="number" default="1"  >}}

{{< member-description >}}Defines the boost factor for the productName field.{{< /member-description >}}

### productVariantName

{{< member-info kind="property" type="number" default="1"  >}}

{{< member-description >}}Defines the boost factor for the productVariantName field.{{< /member-description >}}

### description

{{< member-info kind="property" type="number" default="1"  >}}

{{< member-description >}}Defines the boost factor for the description field.{{< /member-description >}}

### sku

{{< member-info kind="property" type="number" default="1"  >}}

{{< member-description >}}Defines the boost factor for the sku field.{{< /member-description >}}


</div>
