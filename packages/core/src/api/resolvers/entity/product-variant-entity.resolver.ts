import { Parent, ResolveProperty, Resolver } from '@nestjs/graphql';

import { Translated } from '../../../common/types/locale-types';
import { FacetValue, ProductOption } from '../../../entity';
import { ProductVariant } from '../../../entity/product-variant/product-variant.entity';
import { ProductVariantService } from '../../../service/services/product-variant.service';
import { RequestContext } from '../../common/request-context';
import { Api, ApiType } from '../../decorators/api.decorator';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('ProductVariant')
export class ProductVariantEntityResolver {
    constructor(private productVariantService: ProductVariantService) {}

    @ResolveProperty()
    async options(
        @Ctx() ctx: RequestContext,
        @Parent() productVariant: ProductVariant,
    ): Promise<Array<Translated<ProductOption>>> {
        if (productVariant.options) {
            return productVariant.options as Array<Translated<ProductOption>>;
        }
        return this.productVariantService.getOptionsForVariant(ctx, productVariant.id);
    }

    @ResolveProperty()
    async facetValues(
        @Ctx() ctx: RequestContext,
        @Parent() productVariant: ProductVariant,
        @Api() apiType: ApiType,
    ): Promise<Array<Translated<FacetValue>>> {
        let facetValues: Array<Translated<FacetValue>>;
        if (productVariant.facetValues) {
            facetValues = productVariant.facetValues as Array<Translated<FacetValue>>;
        } else {
            facetValues = await this.productVariantService.getFacetValuesForVariant(ctx, productVariant.id);
        }
        if (apiType === 'shop') {
            facetValues = facetValues.filter(fv => !fv.facet.isPrivate);
        }
        return facetValues;
    }
}
