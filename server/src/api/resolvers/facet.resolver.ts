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
import { Translated } from '../../common/types/locale-types';
import { FacetValue } from '../../entity/facet-value/facet-value.entity';
import { Facet } from '../../entity/facet/facet.entity';
import { I18nError } from '../../i18n/i18n-error';
import { FacetValueService } from '../../service/providers/facet-value.service';
import { FacetService } from '../../service/providers/facet.service';
import { Allow } from '../common/auth-guard';
import { RequestContext } from '../common/request-context';
import { Ctx } from '../common/request-context.decorator';

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
            throw new I18nError('error.entity-with-id-not-found', { entityName: 'Facet', id: facetId });
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
