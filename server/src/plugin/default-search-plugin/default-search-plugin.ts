import gql from 'graphql-tag';

import { SearchReindexResponse } from '../../../../shared/generated-types';
import { Type } from '../../../../shared/shared-types';
import { DEFAULT_LANGUAGE_CODE } from '../../common/constants';
import { APIExtensionDefinition, InjectorFn, VendurePlugin } from '../../config';

import { AdminFulltextSearchResolver, ShopFulltextSearchResolver } from './fulltext-search.resolver';
import { FulltextSearchService } from './fulltext-search.service';
import { SearchIndexItem } from './search-index-item.entity';

export interface DefaultSearceReindexResonse extends SearchReindexResponse {
    timeTaken: number;
    indexedItemCount: number;
}

export class DefaultSearchPlugin implements VendurePlugin {
    async onBootstrap(inject: InjectorFn): Promise<void> {
        const searchService = inject(FulltextSearchService);
        await searchService.checkIndex(DEFAULT_LANGUAGE_CODE);
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

    defineProviders(): Array<Type<any>> {
        return [FulltextSearchService];
    }
}
