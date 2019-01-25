import { Args, Context, Mutation, Query, ResolveProperty, Resolver } from '@nestjs/graphql';

import { Permission, SearchQueryArgs, SearchResponse } from '../../../../shared/generated-types';
import { Omit } from '../../../../shared/omit';
import { RequestContext } from '../../api/common/request-context';
import { Allow } from '../../api/decorators/allow.decorator';
import { Ctx } from '../../api/decorators/request-context.decorator';
import { SearchResolver as BaseSearchResolver } from '../../api/resolvers/search.resolver';
import { Translated } from '../../common/types/locale-types';
import { FacetValue } from '../../entity';

import { DefaultSearceReindexResonse } from './default-search-plugin';
import { FulltextSearchService } from './fulltext-search.service';

@Resolver('SearchResponse')
export class FulltextSearchResolver extends BaseSearchResolver {
    constructor(private fulltextSearchService: FulltextSearchService) {
        super();
    }

    @Query()
    @Allow(Permission.Public)
    async search(
        @Ctx() ctx: RequestContext,
        @Args() args: SearchQueryArgs,
    ): Promise<Omit<SearchResponse, 'facetValues'>> {
        return this.fulltextSearchService.search(ctx, args.input);
    }

    @ResolveProperty()
    async facetValues(
        @Ctx() ctx: RequestContext,
        @Context() context: any,
    ): Promise<Array<Translated<FacetValue>>> {
        return this.fulltextSearchService.facetValues(ctx, context.req.body.variables.input);
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog)
    async reindex(@Ctx() ctx: RequestContext): Promise<DefaultSearceReindexResonse> {
        return this.fulltextSearchService.reindex(ctx.languageCode);
    }
}
