import { DeepPartial } from '@vendure/common/lib/shared-types';
import { ChildEntity, ManyToOne } from 'typeorm';

import { OrderLine } from '../order-line/order-line.entity';

import { StockMovement } from './stock-movement.entity';

@ChildEntity()
export class Cancellation extends StockMovement {
    constructor(input: DeepPartial<Cancellation>) {
        super(input);
    }

    @ManyToOne(type => OrderLine)
    orderLine: OrderLine;
}
