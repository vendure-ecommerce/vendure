import { DeepPartial } from '@vendure/common/lib/shared-types';
import { ChildEntity, ManyToOne } from 'typeorm';

import { AggregateOrder } from './aggregate-order.entity';
import { Order } from './order.entity';

@ChildEntity()
export class SellerOrder extends Order {
    constructor(input?: DeepPartial<SellerOrder>) {
        super(input);
    }
    @ManyToOne(type => AggregateOrder, aggregateOrder => aggregateOrder.sellerOrders)
    aggregateOrder: AggregateOrder;
}
