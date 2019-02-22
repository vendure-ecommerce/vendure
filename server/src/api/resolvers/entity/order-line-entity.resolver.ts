import { Parent, ResolveProperty, Resolver } from '@nestjs/graphql';

import { Translated } from '../../../common/types/locale-types';
import { assertFound } from '../../../common/utils';
import { OrderLine, ProductVariant } from '../../../entity';
import { ProductVariantService } from '../../../service';
import { IdCodecService } from '../../common/id-codec.service';
import { RequestContext } from '../../common/request-context';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('OrderLine')
export class OrderLineEntityResolver {
    constructor(
        private productVariantService: ProductVariantService,
        private idCodecService: IdCodecService,
    ) {}

    @ResolveProperty()
    async productVariant(
        @Ctx() ctx: RequestContext,
        @Parent() orderLine: OrderLine,
    ): Promise<Translated<ProductVariant>> {
        const id = this.idCodecService.decode(orderLine.productVariant.id);
        return assertFound(this.productVariantService.findOne(ctx, id));
    }
}
