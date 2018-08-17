import { Column, Entity } from 'typeorm';

import { DeepPartial } from '../../../../shared/shared-types';
import { HasCustomFields } from '../../../../shared/shared-types';
import { Role } from '../../auth/role';
import { VendureEntity } from '../base/base.entity';
import { CustomUserFields } from '../custom-entity-fields';

@Entity()
export class User extends VendureEntity implements HasCustomFields {
    constructor(input?: DeepPartial<User>) {
        super(input);
    }

    @Column({ unique: true })
    identifier: string;

    @Column() passwordHash: string;

    @Column('simple-array') roles: Role[];

    @Column() lastLogin: string;

    @Column(type => CustomUserFields)
    customFields: CustomUserFields;
}
