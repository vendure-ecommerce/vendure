import { Mutation, Query, Resolver } from '@nestjs/graphql';
import { Ctx, RequestContext } from '@vendure/core';

import { IndexingService } from '../service/indexing.service';

@Resolver()
export class IndexResolver {
    constructor(private readonly indexingService: IndexingService) {}

    @Mutation(() => Boolean)
    async triggerGlobalSearchBuildIndex(@Ctx() ctx: RequestContext) {
        await this.indexingService.triggerBuildIndex(ctx);
        return true;
    }

    @Mutation(() => Boolean)
    async triggerGlobalSearchRebuildIndex(@Ctx() ctx: RequestContext) {
        await this.indexingService.triggerRebuildIndex(ctx);
        return true;
    }

    @Query()
    globalSearchIndexableEntities(@Ctx() ctx: RequestContext) {
        return this.indexingService.getIndexableEntities(ctx);
    }
}
