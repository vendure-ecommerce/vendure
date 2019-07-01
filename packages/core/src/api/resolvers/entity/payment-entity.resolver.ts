import { Parent, ResolveProperty, Resolver } from '@nestjs/graphql';

import { Translated } from '../../../common/types/locale-types';
import { Collection } from '../../../entity/collection/collection.entity';
import { OrderItem } from '../../../entity/order-item/order-item.entity';
import { Payment } from '../../../entity/payment/payment.entity';
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

@Resolver('Payment')
export class PaymentEntityResolver {
    constructor(
        private orderService: OrderService,
    ) {}

    @ResolveProperty()
    async refunds(
        @Ctx() ctx: RequestContext,
        @Parent() payment: Payment,
    ): Promise<Refund[]> {
        if (payment.refunds) {
            return payment.refunds;
        } else {
            return this.orderService.getPaymentRefunds(payment.id);
        }
    }
}
