import { Adjustment, AdjustmentType } from 'shared/generated-types';
import { ID } from 'shared/shared-types';

import { VendureEntity } from '../../entity/base/base.entity';

export abstract class AdjustmentSource extends VendureEntity {
    type: AdjustmentType;

    getSourceId(): string {
        return `${this.type}:${this.id}`;
    }

    abstract test(...args: any[]): boolean;
    abstract apply(...args: any[]): Adjustment;
}
