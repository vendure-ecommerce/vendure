import { DeepPartial } from 'shared/shared-types';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { ChannelAware } from '../../common/types/common-types';
import { VendureEntity } from '../base/base.entity';
import { Channel } from '../channel/channel.entity';

export enum AdjustmentType {
    Tax,
    Shipping,
    Promotion,
}

@Entity()
export class AdjustmentSource extends VendureEntity implements ChannelAware {
    constructor(input?: DeepPartial<AdjustmentSource>) {
        super(input);
    }

    @Column() name: string;

    @Column('varchar') type: AdjustmentType;

    @ManyToMany(type => Channel)
    @JoinTable()
    channels: Channel[];
}
