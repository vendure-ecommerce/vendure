import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { Column, Entity, ManyToOne, Unique } from 'typeorm';

import { HasCustomFields } from '../../../config/index';
import { VendureEntity } from '../../../entity/base/base.entity';
import { Channel } from '../../../entity/channel/channel.entity';
import { CustomChannelRoleFields } from '../../../entity/custom-entity-fields';
import { EntityId } from '../../../entity/index';
import { Role } from '../../../entity/role/role.entity';
import { User } from '../../../entity/user/user.entity';

/**
 * @description
 * TODO
 *
 * @docsCategory entities
 */
@Entity()
@Unique('UNIQUE_CHANNEL_ROLE_PER_USER', ['user', 'channel', 'role'])
export class ChannelRole extends VendureEntity implements HasCustomFields {
    constructor(input?: DeepPartial<ChannelRole>) {
        super(input);
    }

    @Column(type => CustomChannelRoleFields)
    customFields: CustomChannelRoleFields;

    @ManyToOne(type => User, { onDelete: 'CASCADE' })
    user: User;

    @EntityId()
    userId: ID;

    @ManyToOne(type => Channel, { onDelete: 'CASCADE' })
    channel: Channel;

    @EntityId()
    channelId: ID;

    @ManyToOne(type => Role, { onDelete: 'CASCADE' })
    role: Role;

    @EntityId()
    roleId: ID;
}
