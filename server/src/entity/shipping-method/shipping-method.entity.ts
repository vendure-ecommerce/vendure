import { AdjustmentOperation } from 'shared/generated-types';
import { DeepPartial } from 'shared/shared-types';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { ChannelAware } from '../../common/types/common-types';
import { VendureEntity } from '../base/base.entity';
import { Channel } from '../channel/channel.entity';

@Entity()
export class ShippingMethod extends VendureEntity implements ChannelAware {
    constructor(input?: DeepPartial<ShippingMethod>) {
        super(input);
    }

    @Column() code: string;

    @Column() description: string;

    @Column('simple-json') checker: AdjustmentOperation;

    @Column('simple-json') calculator: AdjustmentOperation;

    @ManyToMany(type => Channel)
    @JoinTable()
    channels: Channel[];
}
