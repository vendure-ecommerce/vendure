import { SearchInput, SearchResult } from '../../../../../shared/generated-types';
import { ID } from '../../../../../shared/shared-types';
import { RequestContext } from '../../../api';

/**
 * This interface defines the contract that any database-specific search implementations
 * should follow.
 */
export interface SearchStrategy {
    getSearchResults(ctx: RequestContext, input: SearchInput): Promise<SearchResult[]>;
    getTotalCount(ctx: RequestContext, input: SearchInput): Promise<number>;
    getFacetValueIds(ctx: RequestContext, input: SearchInput): Promise<ID[]>;
}
