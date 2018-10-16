import { Adjustment, AdjustmentOperation, AdjustmentType } from 'shared/generated-types';
import { DeepPartial } from 'shared/shared-types';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { AdjustmentSource } from '../../common/types/adjustment-source';
import { VendureEntity } from '../base/base.entity';
import { Channel } from '../channel/channel.entity';

@Entity()
export class Promotion extends AdjustmentSource {
    type = AdjustmentType.PROMOTION;

    constructor(input?: DeepPartial<Promotion>) {
        super(input);
    }

    @Column() name: string;

    @Column() enabled: boolean;

    @ManyToMany(type => Channel)
    @JoinTable()
    channels: Channel[];

    @Column('simple-json') conditions: AdjustmentOperation[];

    @Column('simple-json') actions: AdjustmentOperation[];

    apply(): Adjustment {
        return {} as any;
    }

    test(): boolean {
        return false;
    }
}
