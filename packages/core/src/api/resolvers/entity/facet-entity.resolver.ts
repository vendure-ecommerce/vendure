import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { RequestContextCacheService } from '../../../cache/request-context-cache.service';
import { FacetValue } from '../../../entity/facet-value/facet-value.entity';
import { Facet } from '../../../entity/facet/facet.entity';
import { LocaleStringHydrator } from '../../../service/helpers/locale-string-hydrator/locale-string-hydrator';
import { FacetValueService } from '../../../service/services/facet-value.service';
import { RequestContext } from '../../common/request-context';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('Facet')
export class FacetEntityResolver {
    constructor(
        private facetValueService: FacetValueService,
        private localeStringHydrator: LocaleStringHydrator,
        private requestContextCache: RequestContextCacheService,
    ) {}

    @ResolveField()
    name(@Ctx() ctx: RequestContext, @Parent() facetValue: FacetValue): Promise<string> {
        return this.localeStringHydrator.hydrateLocaleStringField(ctx, facetValue, 'name');
    }

    @ResolveField()
    async values(@Ctx() ctx: RequestContext, @Parent() facet: Facet): Promise<FacetValue[]> {
        if (facet.values) {
            return facet.values;
        }
        return this.requestContextCache.get(ctx, `FacetEntityResolver.values(${facet.id})`, () =>
            this.facetValueService.findByFacetId(ctx, facet.id),
        );
    }
}
