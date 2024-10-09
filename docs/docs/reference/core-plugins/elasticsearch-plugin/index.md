---
title: 'ElasticsearchPlugin'
isDefaultIndex: false
generated: true
---

<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';

## ElasticsearchPlugin

<GenerationInfo sourceFile="packages/elasticsearch-plugin/src/plugin.ts" sourceLine="223" packageName="@vendure/elasticsearch-plugin" />

This plugin allows your product search to be powered by [Elasticsearch](https://github.com/elastic/elasticsearch) - a powerful Open Source search
engine. This is a drop-in replacement for the DefaultSearchPlugin which exposes many powerful configuration options enabling your storefront
to support a wide range of use-cases such as indexing of custom properties, fine control over search index configuration, and to leverage
advanced Elasticsearch features like spacial search.

## Installation

~~**Requires Elasticsearch v7.0 < required Elasticsearch version < 7.10 **~~
~~Elasticsearch version 7.10.2 will throw error due to incompatibility with elasticsearch-js client.~~
~~[Check here for more info](https://github.com/elastic/elasticsearch-js/issues/1519).~~

_The above mentioned version issue has since been resolved (Doc update: 10/8/2024)_

**Important information about versions and ElasticSearch security:**
The version of ElasticSearch that is deployed, the version of the JS library @elastic/elasticsearch installed in your Vendure project and the version of the JS library @elastic/elasticsearch used in the @vendure/elasticsearch-plugin must all match to avoid any issues. ElasticSearch does not allow @latest in its repository so these versions must be updated regularly.

| Package  | Version |
| ------------- | ------------- |
| ElasticSearch  | v8.13.1  |
| @elastic/elastisearch  | v8.13.1  |
| @vendure/elasticsearch-plugin | v3.0.5 |
| Last updated | Oct 8, 2024 |

With ElasticSearch v8+, basic authentication, SSL, and TLS are enabled by default and may result in your client and plugin not being able to connect to ElasticSearch successfully if your client is not configured appropriately. You must also set ```xpack.license.self_generated.type=basic``` if you are using the free Community Edition of ElasticSearch.

Review the ElasticSearch docker [example](<https://github.com/LeftoversTodayAppAdmin/vendure/blob/fix(default-search-plugin%2C-elasticsearch-plugin)-Adding-StockMovementEvent-to-search/packages/elasticsearch-plugin/docker-compose.yml>) here for development and testing without authentication and security enabled.

`yarn add @elastic/elasticsearch @vendure/elasticsearch-plugin`

or

`npm install @elastic/elasticsearch @vendure/elasticsearch-plugin`

Make sure to remove the `DefaultSearchPlugin` if it is still in the VendureConfig plugins array.

Then add the `ElasticsearchPlugin`, calling the `.init()` method with <a href='/reference/core-plugins/elasticsearch-plugin/elasticsearch-options#elasticsearchoptions'>ElasticsearchOptions</a>:

_Example_

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

_Additionally, if you have basic authentication and SSL/TLS enabled you need to provide the credentials and the ca.crt certificate to the client, ensure the hostnames use HTTPS and match the hostname the certificate was generated for_
[Documentation and example with Docker](https://www.elastic.co/blog/getting-started-with-the-elastic-stack-and-docker-compose)

```ts
import { ElasticsearchPlugin } from '@vendure/elasticsearch-plugin';

const config: VendureConfig = {
    // Add an instance of the plugin to the plugins array
    plugins: [
        ElasticsearchPlugin.init({
            host: 'https://localhost:9200',
            port: 9200,
            clientOptions: {
                auth: {
                    username: '<username>',
                    password: '<password>',
                },
                node: process.env.'https://localhost:9200',
                ssl: {
                    ca: '<path to ELASTICSEARCH_CA_CERT>',
                    rejectUnauthorized: false,
                },
            },
        }),
    ],
};
```

## Search API Extensions

This plugin extends the default search query of the Shop API, allowing richer querying of your product data.

The [SearchResponse](/reference/graphql-api/admin/object-types/#searchresponse) type is extended with information
about price ranges in the result set:

```graphql
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

```graphql
{
    search(input: { term: "table easel", groupByProduct: true, priceRange: { min: 500, max: 7000 } }) {
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
                ... on PriceRange {
                    min
                    max
                }
            }
        }
    }
}
```

```json
{
    "data": {
        "search": {
            "totalItems": 9,
            "prices": {
                "range": {
                    "min": 999,
                    "max": 6396
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
                }
                // ... truncated
            ]
        }
    }
}
```

```ts title="Signature"
class ElasticsearchPlugin implements OnApplicationBootstrap {
    init(options: ElasticsearchOptions) => Type<ElasticsearchPlugin>;
}
```

-   Implements: <code>OnApplicationBootstrap</code>

<div className="members-wrapper">

### init

<MemberInfo kind="method" type={`(options: <a href='/reference/core-plugins/elasticsearch-plugin/elasticsearch-options#elasticsearchoptions'>ElasticsearchOptions</a>) => Type&#60;<a href='/reference/core-plugins/elasticsearch-plugin/#elasticsearchplugin'>ElasticsearchPlugin</a>&#62;`} />

</div>
