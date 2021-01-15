import { StockMovementType } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { ChildEntity, ManyToOne } from 'typeorm';

import { OrderItem } from '../order-item/order-item.entity';

import { StockMovement } from './stock-movement.entity';

@ChildEntity()
export class Release extends StockMovement {
    readonly type = StockMovementType.RELEASE;

    constructor(input: DeepPartial<Release>) {
        super(input);
    }

    @ManyToOne(type => OrderItem)
    orderItem: OrderItem;
}
