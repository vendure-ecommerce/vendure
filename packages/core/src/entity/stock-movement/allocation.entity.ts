import { StockMovementType } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { ChildEntity, ManyToOne } from 'typeorm';

import { OrderLine } from '../order-line/order-line.entity';

import { StockMovement } from './stock-movement.entity';

@ChildEntity()
export class Allocation extends StockMovement {
    readonly type = StockMovementType.ALLOCATION;

    constructor(input: DeepPartial<Allocation>) {
        super(input);
    }

    @ManyToOne(type => OrderLine)
    orderLine: OrderLine;
}
