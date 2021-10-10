import { Inject, OnApplicationBootstrap } from '@nestjs/common';
import { SearchReindexResponse } from '@vendure/common/lib/generated-types';
import { ID, Type } from '@vendure/common/lib/shared-types';
import { buffer, debounceTime, delay, filter, map } from 'rxjs/operators';

import { idsAreEqual } from '../../common/utils';
import { EventBus } from '../../event-bus/event-bus';
import { AssetEvent } from '../../event-bus/events/asset-event';
import { CollectionModificationEvent } from '../../event-bus/events/collection-modification-event';
import { ProductChannelEvent } from '../../event-bus/events/product-channel-event';
import { ProductEvent } from '../../event-bus/events/product-event';
import { ProductVariantChannelEvent } from '../../event-bus/events/product-variant-channel-event';
import { ProductVariantEvent } from '../../event-bus/events/product-variant-event';
import { TaxRateModificationEvent } from '../../event-bus/events/tax-rate-modification-event';
import { JobBufferService } from '../../job-queue/job-buffer/job-buffer.service';
import { JobQueueService } from '../../job-queue/job-queue.service';
import { PluginCommonModule } from '../plugin-common.module';
import { VendurePlugin } from '../vendure-plugin';

import { PLUGIN_INIT_OPTIONS } from './constants';
import { AdminFulltextSearchResolver, ShopFulltextSearchResolver } from './fulltext-search.resolver';
import { FulltextSearchService } from './fulltext-search.service';
import { IndexerController } from './indexer/indexer.controller';
import { SearchIndexService } from './indexer/search-index.service';
import { SearchIndexItem } from './search-index-item.entity';
import { CollectionJobBuffer } from './search-job-buffer/collection-job-buffer';
import { SearchIndexJobBuffer } from './search-job-buffer/search-index-job-buffer';
import { SearchJobBufferService } from './search-job-buffer/search-job-buffer.service';
import { DefaultSearchPluginInitOptions } from './types';

export interface DefaultSearchReindexResponse extends SearchReindexResponse {
    timeTaken: number;
    indexedItemCount: number;
}

/**
 * @description
 * The DefaultSearchPlugin provides a full-text Product search based on the full-text searching capabilities of the
 * underlying database.
 *
 * The DefaultSearchPlugin is bundled with the `\@vendure/core` package. If you are not using an alternative search
 * plugin, then make sure this one is used, otherwise you will not be able to search products via the
 * [`search` query](/docs/graphql-api/shop/queries#search).
 *
 * {{% alert "warning" %}}
 * Note that the quality of the fulltext search capabilities varies depending on the underlying database being used. For example,
 * the MySQL & Postgres implementations will typically yield better results than the SQLite implementation.
 * {{% /alert %}}
 *
 *
 * @example
 * ```ts
 * import { DefaultSearchPlugin, VendureConfig } from '\@vendure/core';
 *
 * export const config: VendureConfig = {
 *   // Add an instance of the plugin to the plugins array
 *   plugins: [
 *     DefaultSearchPlugin,
 *   ],
 * };
 * ```
 *
 * @docsCategory DefaultSearchPlugin
 */
@VendurePlugin({
    imports: [PluginCommonModule],
    providers: [
        FulltextSearchService,
        SearchIndexService,
        IndexerController,
        SearchJobBufferService,
        { provide: PLUGIN_INIT_OPTIONS, useFactory: () => DefaultSearchPlugin.options },
    ],
    adminApiExtensions: { resolvers: [AdminFulltextSearchResolver] },
    shopApiExtensions: { resolvers: [ShopFulltextSearchResolver] },
    entities: [SearchIndexItem],
})
export class DefaultSearchPlugin implements OnApplicationBootstrap {
    static options: DefaultSearchPluginInitOptions = {};

    /** @internal */
    constructor(
        private eventBus: EventBus,
        private searchIndexService: SearchIndexService,
        private jobQueueService: JobQueueService,
    ) {}

    static init(options: DefaultSearchPluginInitOptions): Type<DefaultSearchPlugin> {
        this.options = options;
        return DefaultSearchPlugin;
    }

    /** @internal */
    async onApplicationBootstrap() {
        this.eventBus.ofType(ProductEvent).subscribe(event => {
            if (event.type === 'deleted') {
                return this.searchIndexService.deleteProduct(event.ctx, event.product);
            } else {
                return this.searchIndexService.updateProduct(event.ctx, event.product);
            }
        });
        this.eventBus.ofType(ProductVariantEvent).subscribe(event => {
            if (event.type === 'deleted') {
                return this.searchIndexService.deleteVariant(event.ctx, event.variants);
            } else {
                return this.searchIndexService.updateVariants(event.ctx, event.variants);
            }
        });
        this.eventBus.ofType(AssetEvent).subscribe(event => {
            if (event.type === 'updated') {
                return this.searchIndexService.updateAsset(event.ctx, event.asset);
            }
            if (event.type === 'deleted') {
                return this.searchIndexService.deleteAsset(event.ctx, event.asset);
            }
        });
        this.eventBus.ofType(ProductChannelEvent).subscribe(event => {
            if (event.type === 'assigned') {
                return this.searchIndexService.assignProductToChannel(
                    event.ctx,
                    event.product.id,
                    event.channelId,
                );
            } else {
                return this.searchIndexService.removeProductFromChannel(
                    event.ctx,
                    event.product.id,
                    event.channelId,
                );
            }
        });
        this.eventBus.ofType(ProductVariantChannelEvent).subscribe(event => {
            if (event.type === 'assigned') {
                return this.searchIndexService.assignVariantToChannel(
                    event.ctx,
                    event.productVariant.id,
                    event.channelId,
                );
            } else {
                return this.searchIndexService.removeVariantFromChannel(
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
                return this.searchIndexService.updateVariantsById(events.ctx, events.ids);
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
                    return this.searchIndexService.reindex(event.ctx);
                }
            });
    }
}
