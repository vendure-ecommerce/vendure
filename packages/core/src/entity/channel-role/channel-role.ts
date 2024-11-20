import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Column, Entity, ManyToOne } from 'typeorm';

import { HasCustomFields } from '../../config';
import { VendureEntity } from '../base/base.entity';
import { Channel } from '../channel/channel.entity';
import { CustomChannelRoleFields } from '../custom-entity-fields';
import { Role } from '../role/role.entity';
import { User } from '../user/user.entity';

/**
 * @description
 * TODO
 *
 * @docsCategory entities
 */
@Entity()
export class ChannelRole extends VendureEntity implements HasCustomFields {
    constructor(input?: DeepPartial<ChannelRole>) {
        super(input);
    }

    @Column(type => CustomChannelRoleFields)
    customFields: CustomChannelRoleFields;

    @ManyToOne(type => User)
    user: User;

    @ManyToOne(type => Channel)
    channel: Channel;

    @ManyToOne(type => Role)
    role: Role;
}
