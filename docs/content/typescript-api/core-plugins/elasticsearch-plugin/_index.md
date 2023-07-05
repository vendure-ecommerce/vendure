---
title: "ElasticsearchPlugin"
weight: 10
date: 2023-07-04T11:02:13.899Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# ElasticsearchPlugin
<div class="symbol">


# ElasticsearchPlugin

{{< generation-info sourceFile="packages/elasticsearch-plugin/src/plugin.ts" sourceLine="222" packageName="@vendure/elasticsearch-plugin">}}

This plugin allows your product search to be powered by [Elasticsearch](https://github.com/elastic/elasticsearch) - a powerful Open Source search
engine. This is a drop-in replacement for the DefaultSearchPlugin which exposes many powerful configuration options enabling your storefront
to support a wide range of use-cases such as indexing of custom properties, fine control over search index configuration, and to leverage
advanced Elasticsearch features like spacial search.

## Installation

**Requires Elasticsearch v7.0 < required Elasticsearch version < 7.10 **
Elasticsearch version 7.10.2 will throw error due to incompatibility with elasticsearch-js client.
[Check here for more info](https://github.com/elastic/elasticsearch-js/issues/1519)
`yarn add @elastic/elasticsearch @vendure/elasticsearch-plugin`

or

`npm install @elastic/elasticsearch @vendure/elasticsearch-plugin`

Make sure to remove the `DefaultSearchPlugin` if it is still in the VendureConfig plugins array.

Then add the `ElasticsearchPlugin`, calling the `.init()` method with <a href='/typescript-api/core-plugins/elasticsearch-plugin/elasticsearch-options#elasticsearchoptions'>ElasticsearchOptions</a>:

*Example*

```ts
import { ElasticsearchPlugin } from '@vendure/elasticsearch-plugin';

const config: VendureConfig = {
  // Add an instance of the plugin to the plugins array
  plugins: [
    ElasticsearchPlugin.init({
      host: 'http://localhost',
      port: 9200,
    }),
  ],
};
```

## Search API Extensions
This plugin extends the default search query of the Shop API, allowing richer querying of your product data.

The [SearchResponse](/docs/graphql-api/admin/object-types/#searchresponse) type is extended with information
about price ranges in the result set:
```SDL
extend type SearchResponse {
    prices: SearchResponsePriceData!
}

type SearchResponsePriceData {
    range: PriceRange!
    rangeWithTax: PriceRange!
    buckets: [PriceRangeBucket!]!
    bucketsWithTax: [PriceRangeBucket!]!
}

type PriceRangeBucket {
    to: Int!
    count: Int!
}

extend input SearchInput {
    priceRange: PriceRangeInput
    priceRangeWithTax: PriceRangeInput
}

input PriceRangeInput {
    min: Int!
    max: Int!
}
```

This `SearchResponsePriceData` type allows you to query data about the range of prices in the result set.

## Example Request & Response

```SDL
{
  search (input: {
    term: "table easel"
    groupByProduct: true
    priceRange: {
      min: 500
      max: 7000
    }
  }) {
    totalItems
    prices {
      range {
        min
        max
      }
      buckets {
        to
        count
      }
    }
    items {
      productName
      score
      price {
        ...on PriceRange {
          min
          max
        }
      }
    }
  }
}
```

```JSON
{
 "data": {
   "search": {
     "totalItems": 9,
     "prices": {
       "range": {
         "min": 999,
         "max": 6396,
       },
       "buckets": [
         {
           "to": 1000,
           "count": 1
         },
         {
           "to": 2000,
           "count": 2
         },
         {
           "to": 3000,
           "count": 3
         },
         {
           "to": 4000,
           "count": 1
         },
         {
           "to": 5000,
           "count": 1
         },
         {
           "to": 7000,
           "count": 1
         }
       ]
     },
     "items": [
       {
         "productName": "Loxley Yorkshire Table Easel",
         "score": 30.58831,
         "price": {
           "min": 4984,
           "max": 4984
         }
       },
       // ... truncated
     ]
   }
 }
}
```

## Signature

```TypeScript
class ElasticsearchPlugin implements OnApplicationBootstrap {
  static init(options: ElasticsearchOptions) => Type<ElasticsearchPlugin>;
}
```
## Implements

 * OnApplicationBootstrap


## Members

### init

{{< member-info kind="method" type="(options: <a href='/typescript-api/core-plugins/elasticsearch-plugin/elasticsearch-options#elasticsearchoptions'>ElasticsearchOptions</a>) => Type&#60;<a href='/typescript-api/core-plugins/elasticsearch-plugin/#elasticsearchplugin'>ElasticsearchPlugin</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
