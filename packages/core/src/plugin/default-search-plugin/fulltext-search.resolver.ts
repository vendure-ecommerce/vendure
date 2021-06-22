import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import {
    Permission,
    QuerySearchArgs,
    SearchInput,
    SearchResponse,
} from '@vendure/common/lib/generated-types';
import { Omit } from '@vendure/common/lib/omit';

import { RequestContext } from '../../api/common/request-context';
import { Allow } from '../../api/decorators/allow.decorator';
import { Ctx } from '../../api/decorators/request-context.decorator';
import { SearchResolver as BaseSearchResolver } from '../../api/resolvers/admin/search.resolver';
import { Collection, FacetValue } from '../../entity';

import { FulltextSearchService } from './fulltext-search.service';

@Resolver('SearchResponse')
export class ShopFulltextSearchResolver implements Omit<BaseSearchResolver, 'reindex'> {
    constructor(private fulltextSearchService: FulltextSearchService) {}

    @Query()
    @Allow(Permission.Public)
    async search(
        @Ctx() ctx: RequestContext,
        @Args() args: QuerySearchArgs,
    ): Promise<Omit<SearchResponse, 'facetValues' | 'collections'>> {
        const result = await this.fulltextSearchService.search(ctx, args.input, true);
        // ensure the facetValues property resolver has access to the input args
        (result as any).input = args.input;
        return result;
    }

    @ResolveField()
    async facetValues(
        @Ctx() ctx: RequestContext,
        @Parent() parent: { input: SearchInput },
    ): Promise<Array<{ facetValue: FacetValue; count: number }>> {
        const facetValues = await this.fulltextSearchService.facetValues(ctx, parent.input, true);
        return facetValues.filter(i => !i.facetValue.facet.isPrivate);
    }

    @ResolveField()
    async collections(
        @Ctx() ctx: RequestContext,
        @Parent() parent: { input: SearchInput },
    ): Promise<Array<{ collection: Collection; count: number }>> {
        const collections = await this.fulltextSearchService.collections(ctx, parent.input, true);
        return collections.filter(i => !i.collection.isPrivate);
    }
}

@Resolver('SearchResponse')
export class AdminFulltextSearchResolver implements BaseSearchResolver {
    constructor(private fulltextSearchService: FulltextSearchService) {}

    @Query()
    @Allow(Permission.ReadCatalog, Permission.ReadProduct)
    async search(
        @Ctx() ctx: RequestContext,
        @Args() args: QuerySearchArgs,
    ): Promise<Omit<SearchResponse, 'facetValues'| 'collections'>> {
        const result = await this.fulltextSearchService.search(ctx, args.input, false);
        // ensure the facetValues property resolver has access to the input args
        (result as any).input = args.input;
        return result;
    }

    @ResolveField()
    async facetValues(
        @Ctx() ctx: RequestContext,
        @Parent() parent: { input: SearchInput },
    ): Promise<Array<{ facetValue: FacetValue; count: number }>> {
        return this.fulltextSearchService.facetValues(ctx, parent.input, false);
    }

    @ResolveField()
    async collections(
        @Ctx() ctx: RequestContext,
        @Parent() parent: { input: SearchInput },
    ): Promise<Array<{ collection: Collection; count: number }>> {
        return this.fulltextSearchService.collections(ctx, parent.input, false);
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog, Permission.UpdateProduct)
    async reindex(@Ctx() ctx: RequestContext) {
        return this.fulltextSearchService.reindex(ctx);
    }
}
