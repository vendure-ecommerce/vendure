import { Parent, ResolveProperty, Resolver } from '@nestjs/graphql';
import { Option } from 'commander';

import { Translated } from '../../../common/types/locale-types';
import { ProductOption } from '../../../entity';
import { ProductVariant } from '../../../entity/product-variant/product-variant.entity';
import { ProductOptionService } from '../../../service';
import { ProductVariantService } from '../../../service/services/product-variant.service';
import { IdCodecService } from '../../common/id-codec.service';
import { RequestContext } from '../../common/request-context';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('ProductVariant')
export class ProductVariantEntityResolver {
    constructor(
        private productVariantService: ProductVariantService,
        private idCodecService: IdCodecService,
    ) {}

    @ResolveProperty()
    async options(
        @Ctx() ctx: RequestContext,
        @Parent() productVariant: ProductVariant,
    ): Promise<Array<Translated<ProductOption>>> {
        if (productVariant.options) {
            return productVariant.options as Array<Translated<ProductOption>>;
        }
        const productId = this.idCodecService.decode(productVariant.id);
        return this.productVariantService.getOptionsForVariant(ctx, productId);
    }
}
