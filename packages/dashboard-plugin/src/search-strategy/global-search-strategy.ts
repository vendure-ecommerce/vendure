import { GlobalSearchInput, GlobalSearchResult } from '@vendure/common/lib/generated-types';
import { InjectableStrategy, RequestContext } from '@vendure/core';

export interface GlobalSearchStrategy extends InjectableStrategy {
    getSearchResults(ctx: RequestContext, input: GlobalSearchInput): Promise<GlobalSearchResult[]>;
    getTotalCount(ctx: RequestContext, input: GlobalSearchInput): Promise<number>;
}
