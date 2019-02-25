import { Parent, ResolveProperty, Resolver } from '@nestjs/graphql';

import { Translated } from '../../../common/types/locale-types';
import { ProductVariant } from '../../../entity/product-variant/product-variant.entity';
import { Product } from '../../../entity/product/product.entity';
import { ProductVariantService } from '../../../service/services/product-variant.service';
import { RequestContext } from '../../common/request-context';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('Product')
export class ProductEntityResolver {
    constructor(private productVariantService: ProductVariantService) {}

    @ResolveProperty()
    async variants(
        @Ctx() ctx: RequestContext,
        @Parent() product: Product,
    ): Promise<Array<Translated<ProductVariant>>> {
        return this.productVariantService.getVariantsByProductId(ctx, product.id);
    }
}
