import { ID } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api/index';
import { InjectableStrategy } from '../../common/index';
import { Order, OrderLine, OrderLineSellerData, Payment, ShippingLine, Surcharge } from '../../entity/index';
import { OrderState } from '../../service/index';

export interface PartialOrder {
    channelId: ID;
    state: OrderState;
    lines: OrderLine[];
    surcharges: Surcharge[];
    payments: Payment[];
    shippingLines: ShippingLine[];
}

export interface OrderSellerStrategy extends InjectableStrategy {
    setOrderLineSellerData?(
        ctx: RequestContext,
        orderLine: OrderLine,
    ): OrderLineSellerData | Promise<OrderLineSellerData>;
    splitOrder?(ctx: RequestContext, order: Order): PartialOrder[] | Promise<PartialOrder[]>;
}
