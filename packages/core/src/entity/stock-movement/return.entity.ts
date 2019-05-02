import { DeepPartial } from '@vendure/common/lib/shared-types';
import { ChildEntity } from 'typeorm';

import { StockMovement } from './stock-movement.entity';

@ChildEntity()
export class Return extends StockMovement {
    constructor(input: DeepPartial<Return>) {
        super(input);
    }
}
