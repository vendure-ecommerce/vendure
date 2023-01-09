import { ChildEntity, OneToMany } from 'typeorm';

import { Order } from './order.entity';
import { SellerOrder } from './seller-order.entity';

@ChildEntity()
export class AggregateOrder extends Order {
    @OneToMany(type => SellerOrder, sellerOrder => sellerOrder.aggregateOrder)
    sellerOrders: SellerOrder[];
}
