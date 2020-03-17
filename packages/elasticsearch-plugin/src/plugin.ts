import {
    AssetEvent,
    CollectionModificationEvent,
    DeepRequired,
    EventBus,
    ID,
    idsAreEqual,
    Logger,
    OnVendureBootstrap,
    PluginCommonModule,
    ProductChannelEvent,
    ProductEvent,
    ProductVariantEvent,
    TaxRateModificationEvent,
    Type,
    VendurePlugin,
} from '@vendure/core';
import { buffer, debounceTime, filter, map } from 'rxjs/operators';

import { ELASTIC_SEARCH_OPTIONS, loggerCtx } from './constants';
import { CustomMappingsResolver } from './custom-mappings.resolver';
import { ElasticsearchIndexService } from './elasticsearch-index.service';
import { AdminElasticSearchResolver, ShopElasticSearchResolver } from './elasticsearch-resolver';
import { ElasticsearchService } from './elasticsearch.service';
import { generateSchemaExtensions } from './graphql-schema-extensions';
import { ElasticsearchIndexerController } from './indexer.controller';
import { ElasticsearchOptions, mergeWithDefaults } from './options';

/**
 * @description
 * This plugin allows your product search to be powered by [Elasticsearch](https://github.com/elastic/elasticsearch) - a powerful Open Source search
 * engine. This is a drop-in replacement for the DefaultSearchPlugin.
 *
 * ## Installation
 *
 * **Requires Elasticsearch v7.0 or higher.**
 *
 * `yarn add \@vendure/elasticsearch-plugin`
 *
 * or
 *
 * `npm install \@vendure/elasticsearch-plugin`
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
        schema: () => generateSchemaExtensions(ElasticsearchPlugin.options),
    },
    workers: [ElasticsearchIndexerController],
})
export class ElasticsearchPlugin implements OnVendureBootstrap {
    private static options: DeepRequired<ElasticsearchOptions>;

    /** @internal */
    constructor(
        private eventBus: EventBus,
        private elasticsearchService: ElasticsearchService,
        private elasticsearchIndexService: ElasticsearchIndexService,
    ) {}

    /**
     * Set the plugin options.
     */
    static init(options: ElasticsearchOptions): Type<ElasticsearchPlugin> {
        this.options = mergeWithDefaults(options);
        return ElasticsearchPlugin;
    }

    /** @internal */
    async onVendureBootstrap(): Promise<void> {
        const { host, port } = ElasticsearchPlugin.options;
        try {
            const pingResult = await this.elasticsearchService.checkConnection();
        } catch (e) {
            Logger.error(`Could not connect to Elasticsearch instance at "${host}:${port}"`, loggerCtx);
            Logger.error(JSON.stringify(e), loggerCtx);
            return;
        }
        Logger.info(`Sucessfully connected to Elasticsearch instance at "${host}:${port}"`, loggerCtx);

        await this.elasticsearchService.createIndicesIfNotExists();

        this.eventBus.ofType(ProductEvent).subscribe(event => {
            if (event.type === 'deleted') {
                return this.elasticsearchIndexService.deleteProduct(event.ctx, event.product).start();
            } else {
                return this.elasticsearchIndexService.updateProduct(event.ctx, event.product).start();
            }
        });
        this.eventBus.ofType(ProductVariantEvent).subscribe(event => {
            if (event.type === 'deleted') {
                return this.elasticsearchIndexService.deleteVariant(event.ctx, event.variants).start();
            } else {
                return this.elasticsearchIndexService.updateVariants(event.ctx, event.variants).start();
            }
        });
        this.eventBus.ofType(AssetEvent).subscribe(event => {
            if (event.type === 'updated') {
                return this.elasticsearchIndexService.updateAsset(event.ctx, event.asset).start();
            }
        });

        this.eventBus.ofType(ProductChannelEvent).subscribe(event => {
            if (event.type === 'assigned') {
                return this.elasticsearchIndexService
                    .assignProductToChannel(event.ctx, event.product, event.channelId)
                    .start();
            } else {
                return this.elasticsearchIndexService
                    .removeProductFromChannel(event.ctx, event.product, event.channelId)
                    .start();
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
                return this.elasticsearchIndexService.updateVariantsById(events.ctx, events.ids).start();
            });

        this.eventBus.ofType(TaxRateModificationEvent).subscribe(event => {
            const defaultTaxZone = event.ctx.channel.defaultTaxZone;
            if (defaultTaxZone && idsAreEqual(defaultTaxZone.id, event.taxRate.zone.id)) {
                return this.elasticsearchService.updateAll(event.ctx);
            }
        });
    }
}
