import { Parent, ResolveProperty, Resolver } from '@nestjs/graphql';

import { Translated } from '../../../common/types/locale-types';
import { FacetValue } from '../../../entity/facet-value/facet-value.entity';
import { ProductCategory } from '../../../entity/product-category/product-category.entity';
import { FacetValueService } from '../../../service/services/facet-value.service';
import { ProductCategoryService } from '../../../service/services/product-category.service';
import { IdCodecService } from '../../common/id-codec.service';
import { RequestContext } from '../../common/request-context';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('ProductCategory')
export class ProductCategoryEntityResolver {
    constructor(
        private productCategoryService: ProductCategoryService,
        private facetValueService: FacetValueService,
        private idCodecService: IdCodecService,
    ) {}

    @ResolveProperty()
    async descendantFacetValues(
        @Ctx() ctx: RequestContext,
        @Parent() category: ProductCategory,
    ): Promise<Array<Translated<FacetValue>>> {
        const categoryId = this.idCodecService.decode(category.id);
        const descendants = await this.productCategoryService.getDescendants(ctx, categoryId);
        return this.facetValueService.findByCategoryIds(ctx, descendants.map(d => d.id));
    }

    @ResolveProperty()
    async ancestorFacetValues(
        @Ctx() ctx: RequestContext,
        @Parent() category: ProductCategory,
    ): Promise<Array<Translated<FacetValue>>> {
        const categoryId = this.idCodecService.decode(category.id);
        const ancestors = await this.productCategoryService.getAncestors(categoryId, ctx);
        return this.facetValueService.findByCategoryIds(ctx, ancestors.map(d => d.id));
    }
}
