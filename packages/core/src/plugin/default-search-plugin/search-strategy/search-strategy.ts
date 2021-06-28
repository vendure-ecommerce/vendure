import { SearchInput, SearchResult } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../../api';

/**
 * This interface defines the contract that any database-specific search implementations
 * should follow.
 */
export interface SearchStrategy {
    getSearchResults(ctx: RequestContext, input: SearchInput, enabledOnly: boolean): Promise<SearchResult[]>;
    getTotalCount(ctx: RequestContext, input: SearchInput, enabledOnly: boolean): Promise<number>;
    /**
     * Returns a map of `facetValueId` => `count`, providing the number of times that
     * facetValue occurs in the result set.
     */
    getFacetValueIds(ctx: RequestContext, input: SearchInput, enabledOnly: boolean): Promise<Map<ID, number>>;
    /**
     * Returns a map of `collectionId` => `count`, providing the number of times that
     * collection occurs in the result set.
     */
    getCollectionIds(ctx: RequestContext, input: SearchInput, enabledOnly: boolean): Promise<Map<ID, number>>;
}
