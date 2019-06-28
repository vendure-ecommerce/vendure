import { StockMovementType } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { ChildEntity, OneToOne } from 'typeorm';

import { OrderLine } from '../order-line/order-line.entity';

import { StockMovement } from './stock-movement.entity';

@ChildEntity()
export class Sale extends StockMovement {
    readonly type = StockMovementType.SALE;

    constructor(input: DeepPartial<Sale>) {
        super(input);
    }

    @OneToOne(type => OrderLine)
    orderLine: OrderLine;
}
