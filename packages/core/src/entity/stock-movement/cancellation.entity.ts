import { StockMovementType } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { ChildEntity, ManyToOne } from 'typeorm';

import { OrderItem } from '../order-item/order-item.entity';

import { StockMovement } from './stock-movement.entity';

@ChildEntity()
export class Cancellation extends StockMovement {
    readonly type = StockMovementType.CANCELLATION;

    constructor(input: DeepPartial<Cancellation>) {
        super(input);
    }

    @ManyToOne(type => OrderItem, orderItem => orderItem.cancellation)
    orderItem: OrderItem;
}
