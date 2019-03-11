import { Args, Context, Mutation, Query, ResolveProperty, Resolver } from '@nestjs/graphql';

import { Permission, SearchQueryArgs, SearchResponse } from '../../../../shared/generated-types';
import { Omit } from '../../../../shared/omit';
import { Decode } from '../../api';
import { RequestContext } from '../../api/common/request-context';
import { Allow } from '../../api/decorators/allow.decorator';
import { Ctx } from '../../api/decorators/request-context.decorator';
import { SearchResolver as BaseSearchResolver } from '../../api/resolvers/admin/search.resolver';
import { Translated } from '../../common/types/locale-types';
import { FacetValue } from '../../entity';

import { DefaultSearchReindexResponse } from './default-search-plugin';
import { FulltextSearchService } from './fulltext-search.service';

@Resolver('SearchResponse')
export class ShopFulltextSearchResolver implements Omit<BaseSearchResolver, 'reindex'> {
    constructor(private fulltextSearchService: FulltextSearchService) {}

    @Query()
    @Allow(Permission.Public)
    @Decode('facetIds', 'collectionId')
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
}

@Resolver('SearchResponse')
export class AdminFulltextSearchResolver implements BaseSearchResolver {
    constructor(private fulltextSearchService: FulltextSearchService) {}

    @Query()
    @Allow(Permission.ReadCatalog)
    @Decode('facetIds', 'collectionId')
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
    async reindex(@Ctx() ctx: RequestContext): Promise<DefaultSearchReindexResponse> {
        return this.fulltextSearchService.reindex(ctx.languageCode);
    }
}
