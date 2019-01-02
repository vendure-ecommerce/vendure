import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';

import { Permission } from '../../../../shared/generated-types';
import { RequestContext } from '../../api/common/request-context';
import { Allow } from '../../api/decorators/allow.decorator';
import { Ctx } from '../../api/decorators/request-context.decorator';
import { SearchResolver as BaseSearchResolver } from '../../api/resolvers/search.resolver';

import { FulltextSearchService } from './fulltext-search.service';

@Resolver()
export class FulltextSearchResolver extends BaseSearchResolver {
    constructor(private fulltextSearchService: FulltextSearchService) {
        super();
    }

    @Query()
    @Allow(Permission.Public)
    async search(@Ctx() ctx: RequestContext, @Args() args: any) {
        return this.fulltextSearchService.search(ctx, args.input.term);
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog)
    async reindex(@Ctx() ctx: RequestContext): Promise<boolean> {
        return this.fulltextSearchService.reindex(ctx);
    }
}
