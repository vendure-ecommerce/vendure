import { Args, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import {
    Job as GraphQLJob,
    Permission,
    QuerySearchArgs,
    SearchResponse,
} from '@vendure/common/lib/generated-types';
import { Omit } from '@vendure/common/lib/omit';
import {
    Allow,
    Collection,
    Ctx,
    FacetValue,
    RequestContext,
    SearchJobBufferService,
    SearchResolver,
} from '@vendure/core';

import { ElasticsearchService } from '../elasticsearch.service';
import { ElasticSearchInput, SearchPriceData } from '../types';

@Resolver('SearchResponse')
export class ShopElasticSearchResolver implements Pick<SearchResolver, 'search'> {
    constructor(private elasticsearchService: ElasticsearchService) {}

    @Query()
    @Allow(Permission.Public)
    async search(
        @Ctx() ctx: RequestContext,
        @Args() args: QuerySearchArgs,
    ): Promise<Omit<SearchResponse, 'facetValues' | 'collections'>> {
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
export class AdminElasticSearchResolver implements Pick<SearchResolver, 'search' | 'reindex'> {
    constructor(
        private elasticsearchService: ElasticsearchService,
        private searchJobBufferService: SearchJobBufferService,
    ) {}

    @Query()
    @Allow(Permission.ReadCatalog, Permission.ReadProduct)
    async search(
        @Ctx() ctx: RequestContext,
        @Args() args: QuerySearchArgs,
    ): Promise<Omit<SearchResponse, 'facetValues' | 'collections'>> {
        const result = await this.elasticsearchService.search(ctx, args.input, false);
        // ensure the facetValues property resolver has access to the input args
        (result as any).input = args.input;
        return result;
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog, Permission.UpdateProduct)
    async reindex(@Ctx() ctx: RequestContext): Promise<GraphQLJob> {
        return this.elasticsearchService.reindex(ctx) as unknown as GraphQLJob;
    }

    @Query()
    @Allow(Permission.ReadCatalog, Permission.ReadProduct)
    async pendingSearchIndexUpdates(...args: any[]): Promise<any> {
        return this.searchJobBufferService.getPendingSearchUpdates();
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog, Permission.UpdateProduct)
    async runPendingSearchIndexUpdates(...args: any[]): Promise<any> {
        // Intentionally not awaiting this method call
        void this.searchJobBufferService.runPendingSearchUpdates();
        return { success: true };
    }
}

@Resolver('SearchResponse')
export class EntityElasticSearchResolver implements Pick<SearchResolver, 'facetValues' | 'collections'> {
    constructor(private elasticsearchService: ElasticsearchService) {}

    @ResolveField()
    async facetValues(
        @Ctx() ctx: RequestContext,
        @Parent() parent: Omit<SearchResponse, 'facetValues' | 'collections'>,
    ): Promise<Array<{ facetValue: FacetValue; count: number }>> {
        const facetValues = await this.elasticsearchService.facetValues(ctx, (parent as any).input, true);
        return facetValues.filter(i => !i.facetValue.facet.isPrivate);
    }

    @ResolveField()
    async collections(
        @Ctx() ctx: RequestContext,
        @Parent() parent: Omit<SearchResponse, 'facetValues' | 'collections'>,
    ): Promise<Array<{ collection: Collection; count: number }>> {
        const collections = await this.elasticsearchService.collections(ctx, (parent as any).input, true);
        return collections.filter(i => !i.collection.isPrivate);
    }
}
