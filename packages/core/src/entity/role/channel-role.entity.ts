import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { Column, Entity, ManyToOne, Unique } from 'typeorm';

import { HasCustomFields } from '../../config/index';
import { VendureEntity } from '../base/base.entity';
import { Channel } from '../channel/channel.entity';
import { CustomChannelRoleFields } from '../custom-entity-fields';
import { EntityId } from '../entity-id.decorator';
import { Role } from '../role/role.entity';
import { User } from '../user/user.entity';

/**
 * @description
 * A `ChannelRole` ties {@link Channel}s, {@link Role}s and {@link User}s together to
 * determine the authorization level of a {@link User} on a given set of {@link Channel}s.
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
