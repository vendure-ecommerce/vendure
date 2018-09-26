import { DeepPartial } from 'shared/shared-types';
import { ChildEntity, ManyToOne } from 'typeorm';

import { OrderItem } from '../order-item/order-item.entity';

import { Adjustment } from './adjustment.entity';

@ChildEntity()
export class OrderItemAdjustment extends Adjustment {
    constructor(input?: DeepPartial<OrderItemAdjustment>) {
        super(input);
    }

    @ManyToOne(type => OrderItem)
    target: OrderItem;
}
