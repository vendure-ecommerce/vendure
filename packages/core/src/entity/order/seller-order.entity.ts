import { ChildEntity, ManyToOne } from 'typeorm';

import { AggregateOrder } from './aggregate-order.entity';
import { Order } from './order.entity';

@ChildEntity()
export class SellerOrder extends Order {
    @ManyToOne(type => AggregateOrder, aggregateOrder => aggregateOrder.sellerOrders)
    aggregateOrder: AggregateOrder;
}
