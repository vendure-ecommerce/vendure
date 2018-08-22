import { Query, Resolver } from '@nestjs/graphql';

import { PaginatedList } from '../../../../shared/shared-types';
import { Facet } from '../../entity/facet/facet.entity';
import { Product } from '../../entity/product/product.entity';
import { Translated } from '../../locale/locale-types';
import { ConfigService } from '../../service/config.service';
import { FacetService } from '../../service/facet.service';
import { ApplyIdCodec } from '../common/apply-id-codec-decorator';

@Resolver('Facet')
export class FacetResolver {
    constructor(private facetService: FacetService) {}

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
}
