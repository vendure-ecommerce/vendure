import { ID } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api/index';
import { InjectableStrategy } from '../../common/index';
import { Channel, Order, OrderLine, Payment, ShippingLine, Surcharge } from '../../entity/index';
import { OrderState } from '../../service/index';

export interface SplitOrderContents {
    channelId: ID;
    state: OrderState;
    lines: OrderLine[];
    surcharges: Surcharge[];
    shippingLines: ShippingLine[];
}

export interface OrderSellerStrategy extends InjectableStrategy {
    setOrderLineSellerChannel?(
        ctx: RequestContext,
        orderLine: OrderLine,
    ): Channel | undefined | Promise<Channel | undefined>;
    splitOrder?(ctx: RequestContext, order: Order): SplitOrderContents[] | Promise<SplitOrderContents[]>;
    createSurcharges?(ctx: RequestContext, sellerOrder: Order): Surcharge[] | Promise<Surcharge[]>;
    afterSellerOrdersCreated?(
        ctx: RequestContext,
        aggregateOrder: Order,
        sellerOrders: Order[],
    ): void | Promise<void>;
}
