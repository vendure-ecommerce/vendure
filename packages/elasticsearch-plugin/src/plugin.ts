import { NodeOptions } from '@elastic/elasticsearch';
import { OnApplicationBootstrap } from '@nestjs/common';
import {
    AssetEvent,
    CollectionModificationEvent,
    EventBus,
    HealthCheckRegistryService,
    ID,
    idsAreEqual,
    Logger,
    PluginCommonModule,
    ProductChannelEvent,
    ProductEvent,
    ProductVariantChannelEvent,
    ProductVariantEvent,
    TaxRateModificationEvent,
    Type,
    VendurePlugin,
} from '@vendure/core';
import { buffer, debounceTime, delay, filter, map } from 'rxjs/operators';

import { ELASTIC_SEARCH_OPTIONS, loggerCtx } from './constants';
import { CustomMappingsResolver } from './custom-mappings.resolver';
import { ElasticsearchIndexService } from './elasticsearch-index.service';
import { AdminElasticSearchResolver, ShopElasticSearchResolver } from './elasticsearch-resolver';
import { ElasticsearchHealthIndicator } from './elasticsearch.health';
import { ElasticsearchService } from './elasticsearch.service';
import { generateSchemaExtensions } from './graphql-schema-extensions';
import { ElasticsearchIndexerController } from './indexer.controller';
import { ElasticsearchOptions, ElasticsearchRuntimeOptions, mergeWithDefaults } from './options';

/**
 * @description
 * This plugin allows your product search to be powered by [Elasticsearch](https://github.com/elastic/elasticsearch) - a powerful Open Source search
 * engine. This is a drop-in replacement for the DefaultSearchPlugin.
 *
 * ## Installation
 *
 * **Requires Elasticsearch v7.0 or higher.**
 *
 * `yarn add \@elastic/elasticsearch \@vendure/elasticsearch-plugin`
 *
 * or
 *
 * `npm install \@elastic/elasticsearch \@vendure/elasticsearch-plugin`
 *
 * Make sure to remove the `DefaultSearchPlugin` if it is still in the VendureConfig plugins array.
 *
 * Then add the `ElasticsearchPlugin`, calling the `.init()` method with {@link ElasticsearchOptions}:
 *
 * @example
 * ```ts
 * import { ElasticsearchPlugin } from '\@vendure/elasticsearch-plugin';
 *
 * const config: VendureConfig = {
 *   // Add an instance of the plugin to the plugins array
 *   plugins: [
 *     ElasticsearchPlugin.init({
 *       host: 'http://localhost',
 *       port: 9200,
 *     }),
 *   ],
 * };
 * ```
 *
 * ## Search API Extensions
 * This plugin extends the default search query of the Shop API, allowing richer querying of your product data.
 *
 * The [SearchResponse](/docs/graphql-api/admin/object-types/#searchresponse) type is extended with information
 * about price ranges in the result set:
 * ```SDL
 * extend type SearchResponse {
 *     prices: SearchResponsePriceData!
 * }
 *
 * type SearchResponsePriceData {
 *     range: PriceRange!
 *     rangeWithTax: PriceRange!
 *     buckets: [PriceRangeBucket!]!
 *     bucketsWithTax: [PriceRangeBucket!]!
 * }
 *
 * type PriceRangeBucket {
 *     to: Int!
 *     count: Int!
 * }
 *
 * extend input SearchInput {
 *     priceRange: PriceRangeInput
 *     priceRangeWithTax: PriceRangeInput
 * }
 *
 * input PriceRangeInput {
 *     min: Int!
 *     max: Int!
 * }
 * ```
 *
 * This `SearchResponsePriceData` type allows you to query data about the range of prices in the result set.
 *
 * ## Example Request & Response
 *
 * ```SDL
 * {
 *   search (input: {
 *     term: "table easel"
 *     groupByProduct: true
 *     priceRange: {
         min: 500
         max: 7000
       }
 *   }) {
 *     totalItems
 *     prices {
 *       range {
 *         min
 *         max
 *       }
 *       buckets {
 *         to
 *         count
 *       }
 *     }
 *     items {
 *       productName
 *       score
 *       price {
 *         ...on PriceRange {
 *           min
 *           max
 *         }
 *       }
 *     }
 *   }
 * }
 * ```
 *
 * ```JSON
 *{
 *  "data": {
 *    "search": {
 *      "totalItems": 9,
 *      "prices": {
 *        "range": {
 *          "min": 999,
 *          "max": 6396,
 *        },
 *        "buckets": [
 *          {
 *            "to": 1000,
 *            "count": 1
 *          },
 *          {
 *            "to": 2000,
 *            "count": 2
 *          },
 *          {
 *            "to": 3000,
 *            "count": 3
 *          },
 *          {
 *            "to": 4000,
 *            "count": 1
 *          },
 *          {
 *            "to": 5000,
 *            "count": 1
 *          },
 *          {
 *            "to": 7000,
 *            "count": 1
 *          }
 *        ]
 *      },
 *      "items": [
 *        {
 *          "productName": "Loxley Yorkshire Table Easel",
 *          "score": 30.58831,
 *          "price": {
 *            "min": 4984,
 *            "max": 4984
 *          }
 *        },
 *        // ... truncated
 *      ]
 *    }
 *  }
 *}
 * ```
 *
 * @docsCategory ElasticsearchPlugin
 */
@VendurePlugin({
    imports: [PluginCommonModule],
    providers: [
        ElasticsearchIndexService,
        ElasticsearchService,
        ElasticsearchHealthIndicator,
        { provide: ELASTIC_SEARCH_OPTIONS, useFactory: () => ElasticsearchPlugin.options },
    ],
    adminApiExtensions: { resolvers: [AdminElasticSearchResolver] },
    shopApiExtensions: {
        resolvers: () => {
            const { options } = ElasticsearchPlugin;
            const requiresUnionResolver =
                0 < Object.keys(options.customProductMappings || {}).length &&
                0 < Object.keys(options.customProductVariantMappings || {}).length;
            return requiresUnionResolver
                ? [ShopElasticSearchResolver, CustomMappingsResolver]
                : [ShopElasticSearchResolver];
        },
        // `any` cast is there due to a strange error "Property '[Symbol.iterator]' is missing in type... URLSearchParams"
        // which looks like possibly a TS/definitions bug.
        schema: () => generateSchemaExtensions(ElasticsearchPlugin.options as any),
    },
    workers: [ElasticsearchIndexerController],
})
export class ElasticsearchPlugin implements OnApplicationBootstrap {
    private static options: ElasticsearchRuntimeOptions;

    /** @internal */
    constructor(
        private eventBus: EventBus,
        private elasticsearchService: ElasticsearchService,
        private elasticsearchIndexService: ElasticsearchIndexService,
        private elasticsearchHealthIndicator: ElasticsearchHealthIndicator,
        private healthCheckRegistryService: HealthCheckRegistryService,
    ) {}

    /**
     * Set the plugin options.
     */
    static init(options: ElasticsearchOptions): Type<ElasticsearchPlugin> {
        this.options = mergeWithDefaults(options);
        return ElasticsearchPlugin;
    }

    /** @internal */
    async onApplicationBootstrap(): Promise<void> {
        const { host, port } = ElasticsearchPlugin.options;
        const nodeName = this.nodeName();
        try {
            const pingResult = await this.elasticsearchService.checkConnection();
        } catch (e) {
            Logger.error(`Could not connect to Elasticsearch instance at "${nodeName}"`, loggerCtx);
            Logger.error(JSON.stringify(e), loggerCtx);
            this.healthCheckRegistryService.registerIndicatorFunction(() =>
                this.elasticsearchHealthIndicator.startupCheckFailed(e.message),
            );
            return;
        }
        Logger.info(`Successfully connected to Elasticsearch instance at "${nodeName}"`, loggerCtx);

        await this.elasticsearchService.createIndicesIfNotExists();
        this.elasticsearchIndexService.initJobQueue();
        this.healthCheckRegistryService.registerIndicatorFunction(() =>
            this.elasticsearchHealthIndicator.isHealthy(),
        );

        this.eventBus.ofType(ProductEvent).subscribe(event => {
            if (event.type === 'deleted') {
                return this.elasticsearchIndexService.deleteProduct(event.ctx, event.product);
            } else {
                return this.elasticsearchIndexService.updateProduct(event.ctx, event.product);
            }
        });
        this.eventBus.ofType(ProductVariantEvent).subscribe(event => {
            if (event.type === 'deleted') {
                return this.elasticsearchIndexService.deleteVariant(event.ctx, event.variants);
            } else {
                return this.elasticsearchIndexService.updateVariants(event.ctx, event.variants);
            }
        });
        this.eventBus.ofType(AssetEvent).subscribe(event => {
            if (event.type === 'updated') {
                return this.elasticsearchIndexService.updateAsset(event.ctx, event.asset);
            }
            if (event.type === 'deleted') {
                return this.elasticsearchIndexService.deleteAsset(event.ctx, event.asset);
            }
        });

        this.eventBus.ofType(ProductChannelEvent).subscribe(event => {
            if (event.type === 'assigned') {
                return this.elasticsearchIndexService.assignProductToChannel(
                    event.ctx,
                    event.product,
                    event.channelId,
                );
            } else {
                return this.elasticsearchIndexService.removeProductFromChannel(
                    event.ctx,
                    event.product,
                    event.channelId,
                );
            }
        });

        this.eventBus.ofType(ProductVariantChannelEvent).subscribe(event => {
            if (event.type === 'assigned') {
                return this.elasticsearchIndexService.assignVariantToChannel(
                    event.ctx,
                    event.productVariant.id,
                    event.channelId,
                );
            } else {
                return this.elasticsearchIndexService.removeVariantFromChannel(
                    event.ctx,
                    event.productVariant.id,
                    event.channelId,
                );
            }
        });

        const collectionModification$ = this.eventBus.ofType(CollectionModificationEvent);
        const closingNotifier$ = collectionModification$.pipe(debounceTime(50));
        collectionModification$
            .pipe(
                buffer(closingNotifier$),
                filter(events => 0 < events.length),
                map(events => ({
                    ctx: events[0].ctx,
                    ids: events.reduce((ids, e) => [...ids, ...e.productVariantIds], [] as ID[]),
                })),
                filter(e => 0 < e.ids.length),
            )
            .subscribe(events => {
                return this.elasticsearchIndexService.updateVariantsById(events.ctx, events.ids);
            });

        this.eventBus
            .ofType(TaxRateModificationEvent)
            // The delay prevents a "TransactionNotStartedError" (in SQLite/sqljs) by allowing any existing
            // transactions to complete before a new job is added to the queue (assuming the SQL-based
            // JobQueueStrategy).
            .pipe(delay(1))
            .subscribe(event => {
                const defaultTaxZone = event.ctx.channel.defaultTaxZone;
                if (defaultTaxZone && idsAreEqual(defaultTaxZone.id, event.taxRate.zone.id)) {
                    return this.elasticsearchService.updateAll(event.ctx);
                }
            });
    }

    /**
     * Returns a string representation of the target node(s) that the Elasticsearch
     * client is configured to connect to.
     */
    private nodeName(): string {
        const { host, port, clientOptions } = ElasticsearchPlugin.options;
        const node = clientOptions?.node;
        const nodes = clientOptions?.nodes;
        if (nodes) {
            return [...(Array.isArray(nodes) ? nodes : [nodes])].join(', ');
        }
        if (node) {
            if (Array.isArray(node)) {
                return (node as any[])
                    .map((n: string | NodeOptions) => {
                        return typeof n === 'string' ? n : n.url.toString();
                    })
                    .join(', ');
            } else {
                return typeof node === 'string' ? node : node.url.toString();
            }
        }
        return `${host}:${port}`;
    }
}
