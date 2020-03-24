import { Parent, ResolveField, Resolver } from '@nestjs/graphql';

import { Translated } from '../../../common/types/locale-types';
import { assertFound } from '../../../common/utils';
import { OrderLine, ProductVariant } from '../../../entity';
import { ProductVariantService } from '../../../service';
import { RequestContext } from '../../common/request-context';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('OrderLine')
export class OrderLineEntityResolver {
    constructor(private productVariantService: ProductVariantService) {}

    @ResolveField()
    async productVariant(
        @Ctx() ctx: RequestContext,
        @Parent() orderLine: OrderLine,
    ): Promise<Translated<ProductVariant>> {
        return assertFound(this.productVariantService.findOne(ctx, orderLine.productVariant.id));
    }
}
