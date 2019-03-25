import { Provider } from '@nestjs/common';
import gql from 'graphql-tag';

import { SearchReindexResponse } from '../../../../shared/generated-types';
import { Type } from '../../../../shared/shared-types';
import { idsAreEqual } from '../../common/utils';
import { APIExtensionDefinition, VendurePlugin } from '../../config';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';
import { Product } from '../../entity/product/product.entity';
import { EventBus } from '../../event-bus/event-bus';
import { CatalogModificationEvent } from '../../event-bus/events/catalog-modification-event';
import { CollectionModificationEvent } from '../../event-bus/events/collection-modification-event';
import { TaxRateModificationEvent } from '../../event-bus/events/tax-rate-modification-event';
import { SearchService } from '../../service/services/search.service';

import { AdminFulltextSearchResolver, ShopFulltextSearchResolver } from './fulltext-search.resolver';
import { FulltextSearchService } from './fulltext-search.service';
import { SearchIndexItem } from './search-index-item.entity';

export interface DefaultSearchReindexResponse extends SearchReindexResponse {
    timeTaken: number;
    indexedItemCount: number;
}

export class DefaultSearchPlugin implements VendurePlugin {
    onBootstrap(inject: <T>(type: Type<T>) => T): void | Promise<void> {
        const eventBus = inject(EventBus);
        const fulltextSearchService = inject(FulltextSearchService);
        eventBus.subscribe(CatalogModificationEvent, event => {
            if (event.entity instanceof Product || event.entity instanceof ProductVariant) {
                return fulltextSearchService.updateProductOrVariant(event.ctx, event.entity);
            }
        });
        eventBus.subscribe(CollectionModificationEvent, event => {
            return fulltextSearchService.updateVariantsById(event.ctx, event.productVariantIds);
        });
        eventBus.subscribe(TaxRateModificationEvent, event => {
            const defaultTaxZone = event.ctx.channel.defaultTaxZone;
            if (defaultTaxZone && idsAreEqual(defaultTaxZone.id, event.taxRate.zone.id)) {
                return fulltextSearchService.reindex(event.ctx);
            }
        });
    }

    extendAdminAPI(): APIExtensionDefinition {
        return {
            resolvers: [AdminFulltextSearchResolver],
            schema: gql`
                extend type SearchReindexResponse {
                    timeTaken: Int!
                    indexedItemCount: Int!
                }
            `,
        };
    }

    extendShopAPI(): APIExtensionDefinition {
        return {
            resolvers: [ShopFulltextSearchResolver],
            schema: gql`
                extend type SearchReindexResponse {
                    timeTaken: Int!
                    indexedItemCount: Int!
                }
            `,
        };
    }

    defineEntities(): Array<Type<any>> {
        return [SearchIndexItem];
    }

    defineProviders(): Provider[] {
        return [FulltextSearchService, { provide: SearchService, useClass: FulltextSearchService }];
    }
}
