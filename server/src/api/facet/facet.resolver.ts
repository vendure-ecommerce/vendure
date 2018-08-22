import { Query, Resolver } from '@nestjs/graphql';

import { PaginatedList } from '../../../../shared/shared-types';
import { Facet } from '../../entity/facet/facet.entity';
import { Translated } from '../../locale/locale-types';
import { ConfigService } from '../../service/config.service';
import { FacetService } from '../../service/facet.service';

@Resolver('Facet')
export class FacetResolver {
    constructor(private facetService: FacetService) {}

    /**
     * Exposes a subset of the VendureConfig which may be of use to clients.
     */
    @Query()
    facets(obj, args): Promise<PaginatedList<Translated<Facet>>> {
        return this.facetService.findAll(args.languageCode, args.options);
    }
}
