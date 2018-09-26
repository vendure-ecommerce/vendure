import { DeepPartial } from 'shared/shared-types';
import { ChildEntity, ManyToOne } from 'typeorm';

import { Order } from '../order/order.entity';

import { Adjustment } from './adjustment.entity';

@ChildEntity()
export class OrderAdjustment extends Adjustment {
    constructor(input?: DeepPartial<OrderAdjustment>) {
        super(input);
    }

    @ManyToOne(type => Order)
    target: Order;
}
