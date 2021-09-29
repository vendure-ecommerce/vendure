import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    DeletionResponse,
    MutationCreateFacetArgs,
    MutationCreateFacetValuesArgs,
    MutationDeleteFacetArgs,
    MutationDeleteFacetValuesArgs,
    MutationUpdateFacetArgs,
    MutationUpdateFacetValuesArgs,
    Permission,
    QueryFacetArgs,
    QueryFacetsArgs,
} from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';

import { EntityNotFoundError } from '../../../common/error/errors';
import { Translated } from '../../../common/types/locale-types';
import { ConfigService } from '../../../config/config.service';
import { FacetValue } from '../../../entity/facet-value/facet-value.entity';
import { Facet } from '../../../entity/facet/facet.entity';
import { FacetValueService } from '../../../service/services/facet-value.service';
import { FacetService } from '../../../service/services/facet.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { Ctx } from '../../decorators/request-context.decorator';
import { Transaction } from '../../decorators/transaction.decorator';

@Resolver('Facet')
export class FacetResolver {
    constructor(
        private facetService: FacetService,
        private facetValueService: FacetValueService,
        private configService: ConfigService,
    ) {}

    @Query()
    @Allow(Permission.ReadCatalog, Permission.ReadProduct, Permission.ReadFacet)
    facets(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryFacetsArgs,
    ): Promise<PaginatedList<Translated<Facet>>> {
        return this.facetService.findAll(ctx, args.options || undefined);
    }

    @Query()
    @Allow(Permission.ReadCatalog, Permission.ReadProduct, Permission.ReadFacet)
    async facet(
        @Ctx() ctx: RequestContext,
        @Args() args: QueryFacetArgs,
    ): Promise<Translated<Facet> | undefined> {
        return this.facetService.findOne(ctx, args.id);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.CreateCatalog, Permission.CreateFacet)
    async createFacet(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationCreateFacetArgs,
    ): Promise<Translated<Facet>> {
        const { input } = args;
        const facet = await this.facetService.create(ctx, args.input);

        if (input.values && input.values.length) {
            for (const value of input.values) {
                const newValue = await this.facetValueService.create(ctx, facet, value);
                facet.values.push(newValue);
            }
        }
        return facet;
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdateCatalog, Permission.UpdateFacet)
    async updateFacet(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationUpdateFacetArgs,
    ): Promise<Translated<Facet>> {
        const { input } = args;
        return this.facetService.update(ctx, args.input);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.DeleteCatalog, Permission.DeleteFacet)
    async deleteFacet(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationDeleteFacetArgs,
    ): Promise<DeletionResponse> {
        return this.facetService.delete(ctx, args.id, args.force || false);
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.CreateCatalog, Permission.CreateFacet)
    async createFacetValues(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationCreateFacetValuesArgs,
    ): Promise<Array<Translated<FacetValue>>> {
        const { input } = args;
        const facetId = input[0].facetId;
        const facet = await this.facetService.findOne(ctx, facetId);
        if (!facet) {
            throw new EntityNotFoundError('Facet', facetId);
        }
        const facetValues: Array<Translated<FacetValue>> = [];
        for (const facetValue of input) {
            const res = await this.facetValueService.create(ctx, facet, facetValue);
            facetValues.push(res);
        }
        return facetValues;
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.UpdateCatalog, Permission.UpdateFacet)
    async updateFacetValues(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationUpdateFacetValuesArgs,
    ): Promise<Array<Translated<FacetValue>>> {
        const { input } = args;
        return Promise.all(input.map(facetValue => this.facetValueService.update(ctx, facetValue)));
    }

    @Transaction()
    @Mutation()
    @Allow(Permission.DeleteCatalog, Permission.DeleteFacet)
    async deleteFacetValues(
        @Ctx() ctx: RequestContext,
        @Args() args: MutationDeleteFacetValuesArgs,
    ): Promise<DeletionResponse[]> {
        // return Promise.all(args.ids.map(id => this.facetValueService.delete(ctx, id, args.force || false)));
        const results: DeletionResponse[] = [];
        for (const id of args.ids) {
            results.push(await this.facetValueService.delete(ctx, id, args.force || false));
        }
        return results;
    }
}
