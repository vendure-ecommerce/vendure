import { DeepPartial } from '@vendure/common/lib/shared-types';
import { ChildEntity, ManyToOne } from 'typeorm';

import { OrderItem } from '../order-item/order-item.entity';

import { StockMovement } from './stock-movement.entity';

@ChildEntity()
export class StockAdjustment extends StockMovement {
    constructor(input: DeepPartial<StockAdjustment>) {
        super(input);
    }

    @ManyToOne(type => OrderItem)
    orderItem: OrderItem;
}
