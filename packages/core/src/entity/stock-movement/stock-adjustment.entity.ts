import { StockMovementType } from '@vendure/common/lib/generated-types';
import { DeepPartial } from '@vendure/common/lib/shared-types';
import { ChildEntity } from 'typeorm';

import { StockMovement } from './stock-movement.entity';

@ChildEntity()
export class StockAdjustment extends StockMovement {
    readonly type = StockMovementType.ADJUSTMENT;

    constructor(input: DeepPartial<StockAdjustment>) {
        super(input);
    }
}
