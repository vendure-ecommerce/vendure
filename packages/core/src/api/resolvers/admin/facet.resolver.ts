import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    CreateFacetMutationArgs,
    CreateFacetValuesMutationArgs,
    DeleteFacetMutationArgs,
    DeleteFacetValuesMutationArgs,
    DeletionResponse,
    FacetQueryArgs,
    FacetsQueryArgs,
    Permission,
    UpdateFacetMutationArgs,
    UpdateFacetValuesMutationArgs,
} from '@vendure/common/lib/generated-types';
import { PaginatedList } from '@vendure/common/lib/shared-types';

import { DEFAULT_LANGUAGE_CODE } from '../../../common/constants';
import { EntityNotFoundError } from '../../../common/error/errors';
import { Translated } from '../../../common/types/locale-types';
import { FacetValue } from '../../../entity/facet-value/facet-value.entity';
import { Facet } from '../../../entity/facet/facet.entity';
import { FacetValueService } from '../../../service/services/facet-value.service';
import { FacetService } from '../../../service/services/facet.service';
import { RequestContext } from '../../common/request-context';
import { Allow } from '../../decorators/allow.decorator';
import { Decode } from '../../decorators/decode.decorator';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('Facet')
export class FacetResolver {
    constructor(private facetService: FacetService, private facetValueService: FacetValueService) {}

    @Query()
    @Allow(Permission.ReadCatalog)
    facets(
        @Ctx() ctx: RequestContext,
        @Args() args: FacetsQueryArgs,
    ): Promise<PaginatedList<Translated<Facet>>> {
        return this.facetService.findAll(ctx.languageCode, args.options || undefined);
    }

    @Query()
    @Allow(Permission.ReadCatalog)
    async facet(
        @Ctx() ctx: RequestContext,
        @Args() args: FacetQueryArgs,
    ): Promise<Translated<Facet> | undefined> {
        return this.facetService.findOne(args.id, ctx.languageCode);
    }

    @Mutation()
    @Allow(Permission.CreateCatalog)
    async createFacet(@Args() args: CreateFacetMutationArgs): Promise<Translated<Facet>> {
        const { input } = args;
        const facet = await this.facetService.create(args.input);

        if (input.values && input.values.length) {
            for (const value of input.values) {
                const newValue = await this.facetValueService.create(facet, value);
                facet.values.push(newValue);
            }
        }
        return facet;
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog)
    async updateFacet(@Args() args: UpdateFacetMutationArgs): Promise<Translated<Facet>> {
        const { input } = args;
        return this.facetService.update(args.input);
    }

    @Mutation()
    @Allow(Permission.DeleteCatalog)
    async deleteFacet(
        @Ctx() ctx: RequestContext,
        @Args() args: DeleteFacetMutationArgs,
    ): Promise<DeletionResponse> {
        return this.facetService.delete(ctx, args.id, args.force || false);
    }

    @Mutation()
    @Allow(Permission.CreateCatalog)
    @Decode('facetId')
    async createFacetValues(
        @Args() args: CreateFacetValuesMutationArgs,
    ): Promise<Array<Translated<FacetValue>>> {
        const { input } = args;
        const facetId = input[0].facetId;
        const facet = await this.facetService.findOne(facetId, DEFAULT_LANGUAGE_CODE);
        if (!facet) {
            throw new EntityNotFoundError('Facet', facetId);
        }
        return Promise.all(input.map(facetValue => this.facetValueService.create(facet, facetValue)));
    }

    @Mutation()
    @Allow(Permission.UpdateCatalog)
    async updateFacetValues(
        @Args() args: UpdateFacetValuesMutationArgs,
    ): Promise<Array<Translated<FacetValue>>> {
        const { input } = args;
        return Promise.all(input.map(facetValue => this.facetValueService.update(facetValue)));
    }

    @Mutation()
    @Allow(Permission.DeleteCatalog)
    @Decode('ids')
    async deleteFacetValues(
        @Ctx() ctx: RequestContext,
        @Args() args: DeleteFacetValuesMutationArgs,
    ): Promise<DeletionResponse[]> {
        return Promise.all(args.ids.map(id => this.facetValueService.delete(ctx, id, args.force || false)));
    }
}
