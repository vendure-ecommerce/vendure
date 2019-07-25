import { Client } from '@elastic/elasticsearch';
import {
    CatalogModificationEvent,
    CollectionModificationEvent,
    EventBus,
    idsAreEqual,
    Logger,
    OnVendureBootstrap,
    OnVendureClose,
    PluginCommonModule,
    Product,
    ProductVariant,
    SearchService,
    TaxRateModificationEvent,
    Type,
    VendurePlugin,
} from '@vendure/core';

import { ELASTIC_SEARCH_CLIENT, ELASTIC_SEARCH_OPTIONS, loggerCtx } from './constants';
import { ElasticsearchIndexService } from './elasticsearch-index.service';
import { AdminElasticSearchResolver, ShopElasticSearchResolver } from './elasticsearch-resolver';
import { ElasticsearchService } from './elasticsearch.service';
import { ElasticsearchIndexerController } from './indexer.controller';

/**
 * @description
 * Configuration options for the {@link ElasticsearchPlugin}.
 *
 * @docsCategory ElasticsearchPlugin
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
     * Batch size for bulk operations (e.g. when rebuilding the indices)
     *
     * @default
     * 2000
     */
    batchSize?: number;
}

/**
 * @description
 * This plugin allows your product search to be powered by [Elasticsearch](https://github.com/elastic/elasticsearch) - a powerful Open Source search
 * engine. This is a drop-in replacement for the DefaultSearchPlugin.
 *
 * ## Installation
 *
 * `yarn add \@vendure/elasticsearch-plugin`
 *
 * or
 *
 * `npm install \@vendure/elasticsearch-plugin`
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
 * @docsCategory ElasticsearchPlugin
 */
@VendurePlugin({
    imports: [PluginCommonModule],
    providers: [
        ElasticsearchIndexService,
        ElasticsearchService,
        { provide: ELASTIC_SEARCH_OPTIONS, useFactory: () => ElasticsearchPlugin.options },
        { provide: ELASTIC_SEARCH_CLIENT, useFactory: () => ElasticsearchPlugin.client },
    ],
    adminApiExtensions: { resolvers: [AdminElasticSearchResolver] },
    shopApiExtensions: { resolvers: [ShopElasticSearchResolver] },
    workers: [ElasticsearchIndexerController],
})
export class ElasticsearchPlugin implements OnVendureBootstrap, OnVendureClose {
    private static options: Required<ElasticsearchOptions>;
    private static client: Client;

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
        const { host, port } = options;
        this.options = { indexPrefix: 'vendure-', batchSize: 2000, ...options };
        this.client = new Client({
            node: `${host}:${port}`,
        });
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

        this.eventBus.subscribe(CatalogModificationEvent, event => {
            if (event.entity instanceof Product || event.entity instanceof ProductVariant) {
                return this.elasticsearchIndexService.updateProductOrVariant(event.ctx, event.entity).start();
            }
        });
        this.eventBus.subscribe(CollectionModificationEvent, event => {
            return this.elasticsearchIndexService
                .updateVariantsById(event.ctx, event.productVariantIds)
                .start();
        });
        this.eventBus.subscribe(TaxRateModificationEvent, event => {
            const defaultTaxZone = event.ctx.channel.defaultTaxZone;
            if (defaultTaxZone && idsAreEqual(defaultTaxZone.id, event.taxRate.zone.id)) {
                return this.elasticsearchService.reindex(event.ctx);
            }
        });
    }

    /** @internal */
    onVendureClose() {
        return ElasticsearchPlugin.client.close();
    }
}
