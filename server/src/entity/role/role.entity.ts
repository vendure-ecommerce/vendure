import { DeepPartial } from 'shared/shared-types';
import { Column, Entity, JoinTable, ManyToMany, ManyToOne } from 'typeorm';

import { ChannelAware } from '../../common/types/common-types';
import { VendureEntity } from '../base/base.entity';
import { Channel } from '../channel/channel.entity';
import { User } from '../user/user.entity';

import { Permission } from './permission';

@Entity()
export class Role extends VendureEntity implements ChannelAware {
    constructor(input?: DeepPartial<Role>) {
        super(input);
    }

    @Column() code: string;

    @Column() description: string;

    @Column('simple-array') permissions: Permission[];

    @ManyToMany(type => Channel)
    @JoinTable()
    channels: Channel[];
}
