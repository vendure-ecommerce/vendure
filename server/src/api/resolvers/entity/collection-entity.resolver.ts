import { Parent, ResolveProperty, Resolver } from '@nestjs/graphql';

import { Translated } from '../../../common/types/locale-types';
import { Collection } from '../../../entity/collection/collection.entity';
import { FacetValue } from '../../../entity/facet-value/facet-value.entity';
import { CollectionService } from '../../../service/services/collection.service';
import { FacetValueService } from '../../../service/services/facet-value.service';
import { RequestContext } from '../../common/request-context';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('Collection')
export class CollectionEntityResolver {
    constructor(private collectionService: CollectionService, private facetValueService: FacetValueService) {}

    @ResolveProperty()
    async descendantFacetValues(
        @Ctx() ctx: RequestContext,
        @Parent() category: Collection,
    ): Promise<Array<Translated<FacetValue>>> {
        const descendants = await this.collectionService.getDescendants(ctx, category.id);
        return this.facetValueService.findByCategoryIds(ctx, descendants.map(d => d.id));
    }

    @ResolveProperty()
    async ancestorFacetValues(
        @Ctx() ctx: RequestContext,
        @Parent() category: Collection,
    ): Promise<Array<Translated<FacetValue>>> {
        const ancestors = await this.collectionService.getAncestors(category.id, ctx);
        return this.facetValueService.findByCategoryIds(ctx, ancestors.map(d => d.id));
    }
}
