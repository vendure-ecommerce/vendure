import { Adjustment, AdjustmentType } from '@vendure/common/generated-types';

import { VendureEntity } from '../../entity/base/base.entity';

export abstract class AdjustmentSource extends VendureEntity {
    type: AdjustmentType;

    getSourceId(): string {
        return `${this.type}:${this.id}`;
    }

    abstract test(...args: any[]): boolean | Promise<boolean>;
    abstract apply(...args: any[]): Adjustment | undefined | Promise<Adjustment | undefined>;
}
