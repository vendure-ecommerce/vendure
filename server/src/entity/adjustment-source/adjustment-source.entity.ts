import { AdjustmentOperation, AdjustmentType } from 'shared/generated-types';
import { DeepPartial, ID } from 'shared/shared-types';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { ChannelAware } from '../../common/types/common-types';
import { VendureEntity } from '../base/base.entity';
import { Channel } from '../channel/channel.entity';

@Entity()
export class AdjustmentSource extends VendureEntity implements ChannelAware {
    constructor(input?: DeepPartial<AdjustmentSource>) {
        super(input);
    }

    @Column() name: string;

    @Column() enabled: boolean;

    @Column('varchar') type: AdjustmentType;

    @ManyToMany(type => Channel)
    @JoinTable()
    channels: Channel[];

    @Column('simple-json') conditions: AdjustmentOperation[];

    @Column('simple-json') actions: AdjustmentOperation[];
}

export interface Adjustment {
    adjustmentSourceId: ID;
    description: string;
    amount: number;
}
