import { DeepPartial } from '@vendure/common/lib/shared-types';
import { ChildEntity, OneToMany } from 'typeorm';

import { Order } from './order.entity';
import { SellerOrder } from './seller-order.entity';

@ChildEntity()
export class AggregateOrder extends Order {
    constructor(input?: DeepPartial<AggregateOrder>) {
        super(input);
    }

    @OneToMany(type => SellerOrder, sellerOrder => sellerOrder.aggregateOrder)
    sellerOrders: SellerOrder[];
}
