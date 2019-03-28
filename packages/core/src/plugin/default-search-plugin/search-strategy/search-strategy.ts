import { SearchInput, SearchResult } from '../../../../../../shared/generated-types';
import { ID } from '../../../../../../shared/shared-types';
import { RequestContext } from '../../../api';

/**
 * This interface defines the contract that any database-specific search implementations
 * should follow.
 */
export interface SearchStrategy {
    getSearchResults(ctx: RequestContext, input: SearchInput): Promise<SearchResult[]>;
    getTotalCount(ctx: RequestContext, input: SearchInput): Promise<number>;
    /**
     * Returns a map of `facetValueId` => `count`, providing the number of times that
     * facetValue occurs in the result set.
     */
    getFacetValueIds(ctx: RequestContext, input: SearchInput): Promise<Map<ID, number>>;
}
