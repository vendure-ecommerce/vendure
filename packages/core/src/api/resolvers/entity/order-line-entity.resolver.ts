import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { Translated } from '../../../common/types/locale-types';
import { assertFound } from '../../../common/utils';
import { Asset, OrderLine, ProductVariant } from '../../../entity';
import { AssetService, ProductVariantService } from '../../../service';
import { RequestContext } from '../../common/request-context';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('OrderLine')
export class OrderLineEntityResolver {
    constructor(private productVariantService: ProductVariantService, private assetService: AssetService) {}

    @ResolveField()
    async productVariant(
        @Ctx() ctx: RequestContext,
        @Parent() orderLine: OrderLine,
    ): Promise<Translated<ProductVariant>> {
        return assertFound(this.productVariantService.findOne(ctx, orderLine.productVariant.id));
    }

    @ResolveField()
    async featuredAsset(
        @Ctx() ctx: RequestContext,
        @Parent() orderLine: OrderLine,
    ): Promise<Asset | undefined> {
        if (orderLine.featuredAsset) {
            return orderLine.featuredAsset;
        } else {
            return this.assetService.getFeaturedAsset(orderLine);
        }
    }
}
