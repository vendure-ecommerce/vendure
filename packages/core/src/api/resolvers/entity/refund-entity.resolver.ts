import { Parent, ResolveProperty, Resolver } from '@nestjs/graphql';

import { Translated } from '../../../common/types/locale-types';
import { Collection } from '../../../entity/collection/collection.entity';
import { OrderItem } from '../../../entity/order-item/order-item.entity';
import { ProductVariant } from '../../../entity/product-variant/product-variant.entity';
import { Product } from '../../../entity/product/product.entity';
import { Refund } from '../../../entity/refund/refund.entity';
import { CollectionService } from '../../../service/services/collection.service';
import { OrderService } from '../../../service/services/order.service';
import { ProductVariantService } from '../../../service/services/product-variant.service';
import { ApiType } from '../../common/get-api-type';
import { RequestContext } from '../../common/request-context';
import { Api } from '../../decorators/api.decorator';
import { Ctx } from '../../decorators/request-context.decorator';

@Resolver('Refund')
export class RefundEntityResolver {
    constructor(
        private orderService: OrderService,
    ) {}

    @ResolveProperty()
    async orderItems(
        @Ctx() ctx: RequestContext,
        @Parent() refund: Refund,
    ): Promise<OrderItem[]> {
        if (refund.orderItems) {
            return refund.orderItems;
        } else {
            return this.orderService.getRefundOrderItems(refund.id);
        }
    }
}
