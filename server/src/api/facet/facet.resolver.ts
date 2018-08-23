import { Mutation, Query, Resolver } from '@nestjs/graphql';

import { PaginatedList } from '../../../../shared/shared-types';
import { Facet } from '../../entity/facet/facet.entity';
import { Translated } from '../../locale/locale-types';
import { FacetValueService } from '../../service/facet-value.service';
import { FacetService } from '../../service/facet.service';
import { ApplyIdCodec } from '../common/apply-id-codec-decorator';

@Resolver('Facet')
export class FacetResolver {
    constructor(private facetService: FacetService, private facetValueService: FacetValueService) {}

    @Query()
    @ApplyIdCodec()
    facets(obj, args): Promise<PaginatedList<Translated<Facet>>> {
        return this.facetService.findAll(args.languageCode, args.options);
    }

    @Query()
    @ApplyIdCodec()
    async facet(obj, args): Promise<Translated<Facet> | undefined> {
        return this.facetService.findOne(args.id, args.languageCode);
    }

    @Mutation()
    @ApplyIdCodec()
    async createFacet(_, args): Promise<Translated<Facet>> {
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
    @ApplyIdCodec()
    async updateFacet(_, args): Promise<Translated<Facet>> {
        const { input } = args;
        return this.facetService.update(args.input);
    }
}
