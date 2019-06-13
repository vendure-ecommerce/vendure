import { Client } from '@elastic/elasticsearch';
import { Provider } from '@nestjs/common';
import {
    APIExtensionDefinition,
    CatalogModificationEvent,
    CollectionModificationEvent,
    EventBus,
    idsAreEqual,
    Logger,
    Product,
    ProductVariant,
    SearchService,
    TaxRateModificationEvent,
    Type,
    VendurePlugin,
} from '@vendure/core';
import { gql } from 'apollo-server-core';

import { ELASTIC_SEARCH_CLIENT, ELASTIC_SEARCH_OPTIONS, loggerCtx } from './constants';
import { ElasticsearchIndexService } from './elasticsearch-index.service';
import { AdminElasticSearchResolver, ShopElasticSearchResolver } from './elasticsearch-resolver';
import { ElasticsearchService } from './elasticsearch.service';

export interface ElasticsearchOptions {
    host: string;
    port: number;
    indexPrefix?: string;
}

export class ElasticsearchPlugin implements VendurePlugin {
    private readonly options: Required<ElasticsearchOptions>;
    private readonly client: Client;

    constructor(options: ElasticsearchOptions) {
        this.options = { indexPrefix: 'vendure-', ...options };
        const { host, port } = options;
        this.client = new Client({
            node: `${host}:${port}`,
        });
    }

    async onBootstrap(inject: <T>(type: Type<T>) => T): Promise<void> {
        const elasticsearchService = inject(ElasticsearchService);
        const elasticsearchIndexService = inject(ElasticsearchIndexService);
        const { host, port } = this.options;
        try {
            const pingResult = await elasticsearchService.checkConnection();
        } catch (e) {
            Logger.error(`Could not connect to Elasticsearch instance at "${host}:${port}"`, loggerCtx);
            Logger.error(JSON.stringify(e), loggerCtx);
            return;
        }
        Logger.info(`Sucessfully connected to Elasticsearch instance at "${host}:${port}"`, loggerCtx);

        await elasticsearchService.createIndicesIfNotExists();

        const eventBus = inject(EventBus);
        eventBus.subscribe(CatalogModificationEvent, event => {
            if (event.entity instanceof Product || event.entity instanceof ProductVariant) {
                return elasticsearchIndexService.updateProductOrVariant(event.ctx, event.entity);
            }
        });
        eventBus.subscribe(CollectionModificationEvent, event => {
            return elasticsearchIndexService.updateVariantsById(event.ctx, event.productVariantIds);
        });
        eventBus.subscribe(TaxRateModificationEvent, event => {
            const defaultTaxZone = event.ctx.channel.defaultTaxZone;
            if (defaultTaxZone && idsAreEqual(defaultTaxZone.id, event.taxRate.zone.id)) {
                return elasticsearchService.reindex(event.ctx);
            }
        });
    }

    /** @internal */
    extendAdminAPI(): APIExtensionDefinition {
        return {
            resolvers: [AdminElasticSearchResolver],
            schema: gql`
                extend type SearchReindexResponse {
                    timeTaken: Int!
                    indexedItemCount: Int!
                }
            `,
        };
    }

    /** @internal */
    extendShopAPI(): APIExtensionDefinition {
        return {
            resolvers: [ShopElasticSearchResolver],
            schema: gql`
                extend type SearchReindexResponse {
                    timeTaken: Int!
                    indexedItemCount: Int!
                }
            `,
        };
    }

    defineProviders(): Provider[] {
        return [
            { provide: ElasticsearchIndexService, useClass: ElasticsearchIndexService },
            AdminElasticSearchResolver,
            ShopElasticSearchResolver,
            ElasticsearchService,
            { provide: SearchService, useClass: ElasticsearchService },
            { provide: ELASTIC_SEARCH_OPTIONS, useFactory: () => this.options },
            { provide: ELASTIC_SEARCH_CLIENT, useFactory: () => this.client },
        ];
    }
}
