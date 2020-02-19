import { SearchReindexResponse } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { buffer, debounceTime, filter, map } from 'rxjs/operators';

import { idsAreEqual } from '../../common/utils';
import { EventBus } from '../../event-bus/event-bus';
import { AssetEvent } from '../../event-bus/events/asset-event';
import { CollectionModificationEvent } from '../../event-bus/events/collection-modification-event';
import { ProductChannelEvent } from '../../event-bus/events/product-channel-event';
import { ProductEvent } from '../../event-bus/events/product-event';
import { ProductVariantEvent } from '../../event-bus/events/product-variant-event';
import { TaxRateModificationEvent } from '../../event-bus/events/tax-rate-modification-event';
import { PluginCommonModule } from '../plugin-common.module';
import { OnVendureBootstrap, VendurePlugin } from '../vendure-plugin';

import { AdminFulltextSearchResolver, ShopFulltextSearchResolver } from './fulltext-search.resolver';
import { FulltextSearchService } from './fulltext-search.service';
import { IndexerController } from './indexer/indexer.controller';
import { SearchIndexService } from './indexer/search-index.service';
import { SearchIndexItem } from './search-index-item.entity';

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
 * import { DefaultSearchPlugin } from '\@vendure/core';
 *
 * const config: VendureConfig = {
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
    providers: [FulltextSearchService, SearchIndexService],
    adminApiExtensions: { resolvers: [AdminFulltextSearchResolver] },
    shopApiExtensions: { resolvers: [ShopFulltextSearchResolver] },
    entities: [SearchIndexItem],
    workers: [IndexerController],
})
export class DefaultSearchPlugin implements OnVendureBootstrap {
    /** @internal */
    constructor(private eventBus: EventBus, private searchIndexService: SearchIndexService) {}

    /** @internal */
    async onVendureBootstrap() {
        this.eventBus.ofType(ProductEvent).subscribe(event => {
            if (event.type === 'deleted') {
                return this.searchIndexService.deleteProduct(event.ctx, event.product).start();
            } else {
                return this.searchIndexService.updateProduct(event.ctx, event.product).start();
            }
        });
        this.eventBus.ofType(ProductVariantEvent).subscribe(event => {
            if (event.type === 'deleted') {
                return this.searchIndexService.deleteVariant(event.ctx, event.variants).start();
            } else {
                return this.searchIndexService.updateVariants(event.ctx, event.variants).start();
            }
        });
        this.eventBus.ofType(AssetEvent).subscribe(event => {
            if (event.type === 'updated') {
                return this.searchIndexService.updateAsset(event.ctx, event.asset).start();
            }
        });
        this.eventBus.ofType(ProductChannelEvent).subscribe(event => {
            if (event.type === 'assigned') {
                return this.searchIndexService
                    .assignProductToChannel(event.ctx, event.product.id, event.channelId)
                    .start();
            } else {
                return this.searchIndexService
                    .removeProductFromChannel(event.ctx, event.product.id, event.channelId)
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
                return this.searchIndexService.updateVariantsById(events.ctx, events.ids).start();
            });

        this.eventBus.ofType(TaxRateModificationEvent).subscribe(event => {
            const defaultTaxZone = event.ctx.channel.defaultTaxZone;
            if (defaultTaxZone && idsAreEqual(defaultTaxZone.id, event.taxRate.zone.id)) {
                return this.searchIndexService.reindex(event.ctx).start();
            }
        });
    }
}
