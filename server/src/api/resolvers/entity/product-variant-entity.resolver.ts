import { Parent, ResolveProperty, Resolver } from '@nestjs/graphql';

import { Translated } from '../../../common/types/locale-types';
import { FacetValue, ProductOption } from '../../../entity';
import { ProductVariant } from '../../../entity/product-variant/product-variant.entity';
import { ProductVariantService } from '../../../service/services/product-variant.service';
import { RequestContext } from '../../common/request-context';
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
    ): Promise<Array<Translated<FacetValue>>> {
        if (productVariant.facetValues) {
            return productVariant.facetValues as Array<Translated<FacetValue>>;
        }
        return this.productVariantService.getFacetValuesForVariant(ctx, productVariant.id);
    }
}
