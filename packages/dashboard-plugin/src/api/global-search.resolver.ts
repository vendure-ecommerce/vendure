import { Args, Query, Resolver } from '@nestjs/graphql';
import { GlobalSearchInput, GlobalSearchResult } from '@vendure/common/lib/generated-types';
import { Ctx, RequestContext } from '@vendure/core';

import { SearchService } from '../service/search.service';

@Resolver()
export class GlobalSearchResolver {
    constructor(private readonly searchService: SearchService) {}

    @Query()
    globalSearch(@Ctx() ctx: RequestContext, @Args() args: GlobalSearchInput): Promise<GlobalSearchResult[]> {
        return this.searchService.search(ctx, args);
    }
}
