import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import {
    Job as GraphQLJob,
    Permission,
    QuerySearchArgs,
    SearchResponse,
} from '@vendure/common/lib/generated-types';
import { Omit } from '@vendure/common/lib/omit';
import { Allow, Ctx, FacetValue, RequestContext, SearchResolver } from '@vendure/core';

import { ElasticsearchService } from './elasticsearch.service';
import { ElasticSearchInput, SearchPriceData } from './types';

@Resolver('SearchResponse')
export class ShopElasticSearchResolver implements Omit<SearchResolver, 'facetValues' | 'reindex'> {
    constructor(private elasticsearchService: ElasticsearchService) {}

    @Query()
    @Allow(Permission.Public)
    async search(
        @Ctx() ctx: RequestContext,
        @Args() args: QuerySearchArgs,
    ): Promise<Omit<SearchResponse, 'facetValues'>> {
        const result = await this.elasticsearchService.search(ctx, args.input, true);
        // ensure the facetValues property resolver has access to the input args
        (result as any).input = args.input;
        return result;
    }

    @ResolveField()
    async prices(
        @Ctx() ctx: RequestContext,
        @Parent() parent: { input: ElasticSearchInput },
    ): Promise<SearchPriceData> {
        return this.elasticsearchService.priceRange(ctx, parent.input);
    }
}

@Resolver('SearchResponse')
export class AdminElasticSearchResolver implements Omit<SearchResolver, 'facetValues'> {
    constructor(private elasticsearchService: ElasticsearchService) {}

    @Query()
    @Allow(Permission.ReadCatalog, Permission.ReadProduct)
    async search(
        @Ctx() ctx: RequestContext,
        @Args() args: QuerySearchArgs,
    ): Promise<Omit<SearchResponse, 'facetValues'>> {
        const result = await this.elasticsearchService.search(ctx, args.input, false);
        // ensure the facetValues property resolver has access to the input args
        (result as any).input = args.input;
        return result;
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog, Permission.UpdateProduct)
    async reindex(@Ctx() ctx: RequestContext): Promise<GraphQLJob> {
        return (this.elasticsearchService.reindex(ctx, false) as unknown) as GraphQLJob;
    }
}

@Resolver('SearchResponse')
export class EntityElasticSearchResolver implements Pick<SearchResolver, 'facetValues'> {
    constructor(private elasticsearchService: ElasticsearchService) {}

    @ResolveField()
    async facetValues(
        @Ctx() ctx: RequestContext,
        @Parent() parent: Omit<SearchResponse, 'facetValues'>,
    ): Promise<Array<{ facetValue: FacetValue; count: number }>> {
        const facetValues = await this.elasticsearchService.facetValues(ctx, (parent as any).input, true);
        return facetValues.filter(i => !i.facetValue.facet.isPrivate);
    }
}
