import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { FacetValue } from '../../../entity/facet-value/facet-value.entity';
import { Facet } from '../../../entity/facet/facet.entity';
import { FacetValueService } from '../../../service/services/facet-value.service';
import { RequestContext } from '../../common/request-context';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('Facet')
export class FacetEntityResolver {
    constructor(private facetValueService: FacetValueService) {}

    @ResolveField()
    async values(@Ctx() ctx: RequestContext, @Parent() facet: Facet): Promise<FacetValue[]> {
        if (facet.values) {
            return facet.values;
        }
        return this.facetValueService.findByFacetId(ctx, facet.id);
    }
}
