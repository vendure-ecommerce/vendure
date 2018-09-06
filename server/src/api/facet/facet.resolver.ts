import { Mutation, Query, Resolver } from '@nestjs/graphql';
import {
    CreateFacetValuesVariables,
    CreateFacetVariables,
    UpdateFacetValuesVariables,
    UpdateFacetVariables,
} from 'shared/generated-types';
import { PaginatedList } from 'shared/shared-types';

import { DEFAULT_LANGUAGE_CODE } from '../../common/constants';
import { Translated } from '../../common/types/locale-types';
import { FacetValue } from '../../entity/facet-value/facet-value.entity';
import { Facet } from '../../entity/facet/facet.entity';
import { Permission } from '../../entity/role/permission';
import { I18nError } from '../../i18n/i18n-error';
import { FacetValueService } from '../../service/facet-value.service';
import { FacetService } from '../../service/facet.service';
import { ApplyIdCodec } from '../common/apply-id-codec-decorator';
import { RolesGuard } from '../roles-guard';

@Resolver('Facet')
export class FacetResolver {
    constructor(private facetService: FacetService, private facetValueService: FacetValueService) {}

    @Query()
    @RolesGuard([Permission.ReadCatalog])
    @ApplyIdCodec()
    facets(obj, args): Promise<PaginatedList<Translated<Facet>>> {
        return this.facetService.findAll(args.languageCode, args.options);
    }

    @Query()
    @RolesGuard([Permission.ReadCatalog])
    @ApplyIdCodec()
    async facet(obj, args): Promise<Translated<Facet> | undefined> {
        return this.facetService.findOne(args.id, args.languageCode);
    }

    @Mutation()
    @RolesGuard([Permission.CreateCatalog])
    @ApplyIdCodec()
    async createFacet(_, args: CreateFacetVariables): Promise<Translated<Facet>> {
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
    @RolesGuard([Permission.UpdateCatalog])
    @ApplyIdCodec()
    async updateFacet(_, args: UpdateFacetVariables): Promise<Translated<Facet>> {
        const { input } = args;
        return this.facetService.update(args.input);
    }

    @Mutation()
    @RolesGuard([Permission.CreateCatalog])
    @ApplyIdCodec()
    async createFacetValues(_, args: CreateFacetValuesVariables): Promise<Array<Translated<FacetValue>>> {
        const { input } = args;
        const facetId = input[0].facetId;
        const facet = await this.facetService.findOne(facetId, DEFAULT_LANGUAGE_CODE);
        if (!facet) {
            throw new I18nError('error.entity-with-id-not-found', { entityName: 'Facet', id: facetId });
        }
        return Promise.all(input.map(facetValue => this.facetValueService.create(facet, facetValue)));
    }

    @Mutation()
    @RolesGuard([Permission.UpdateCatalog])
    @ApplyIdCodec()
    async updateFacetValues(_, args: UpdateFacetValuesVariables): Promise<Array<Translated<FacetValue>>> {
        const { input } = args;
        return Promise.all(input.map(facetValue => this.facetValueService.update(facetValue)));
    }
}
