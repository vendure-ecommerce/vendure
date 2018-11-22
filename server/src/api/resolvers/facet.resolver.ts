import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    CreateFacetMutationArgs,
    CreateFacetValuesMutationArgs,
    FacetQueryArgs,
    FacetsQueryArgs,
    Permission,
    UpdateFacetMutationArgs,
    UpdateFacetValuesMutationArgs,
} from 'shared/generated-types';
import { PaginatedList } from 'shared/shared-types';

import { DEFAULT_LANGUAGE_CODE } from '../../common/constants';
import { EntityNotFoundError } from '../../common/error/errors';
import { Translated } from '../../common/types/locale-types';
import { FacetValue } from '../../entity/facet-value/facet-value.entity';
import { Facet } from '../../entity/facet/facet.entity';
import { FacetValueService } from '../../service/services/facet-value.service';
import { FacetService } from '../../service/services/facet.service';
import { RequestContext } from '../common/request-context';
import { Allow } from '../decorators/allow.decorator';
import { Ctx } from '../decorators/request-context.decorator';

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
    @Allow(Permission.CreateCatalog)
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
}
