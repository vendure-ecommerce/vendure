import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Column, Entity, Index, ManyToOne, Unique } from 'typeorm';

import { HasCustomFields } from '../../config/custom-field/custom-field-types';
import { VendureEntity } from '../base/base.entity';
import { Channel } from '../channel/channel.entity';
import { CustomChannelRoleFields } from '../custom-entity-fields';
import { User } from '../user/user.entity';

import { Role } from './role.entity';

/**
 * @description
 * A ChannelRole is a bridge entity that associates a {@link User} with a {@link Role}
 * on a specific {@link Channel}. This allows the same Role definition to be shared
 * across multiple users on different channels, rather than duplicating roles per channel.
 *
 * Used when the `ChannelRolePermissionResolverStrategy` is configured.
 *
 * @docsCategory entities
 * @since 3.3.0
 */
@Entity()
@Unique('channel_role_unique', ['user', 'channel', 'role'])
export class ChannelRole extends VendureEntity implements HasCustomFields {
    constructor(input?: DeepPartial<ChannelRole>) {
        super(input);
    }

    @Index()
    @ManyToOne(type => User, { onDelete: 'CASCADE' })
    user: User;

    @Index()
    @ManyToOne(type => Channel, { onDelete: 'CASCADE' })
    channel: Channel;

    @Index()
    @ManyToOne(type => Role, { onDelete: 'CASCADE' })
    role: Role;

    @Column(type => CustomChannelRoleFields)
    customFields: CustomChannelRoleFields;
}
