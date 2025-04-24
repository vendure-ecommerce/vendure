import {
    GlobalSearchInput,
    GlobalSearchResult,
    GlobalSearchResultItem,
} from '@vendure/common/lib/generated-types';
import { InjectableStrategy, PaginatedList, RequestContext } from '@vendure/core';

export interface GlobalSearchStrategy extends InjectableStrategy {
    getSearchResults(
        ctx: RequestContext,
        input: GlobalSearchInput,
    ): Promise<PaginatedList<GlobalSearchResultItem>>;
}
