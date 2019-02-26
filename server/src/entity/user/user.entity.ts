import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { DeepPartial, HasCustomFields } from '../../../../shared/shared-types';
import { VendureEntity } from '../base/base.entity';
import { CustomUserFields } from '../custom-entity-fields';
import { Role } from '../role/role.entity';

/**
 * @description
 * A User represents any authenticated user of the Vendure API. This includes both
 * {@link Administrator}s as well as registered {@link Customer}s.
 *
 * @docsCategory entities
 */
@Entity()
export class User extends VendureEntity implements HasCustomFields {
    constructor(input?: DeepPartial<User>) {
        super(input);
    }

    @Column({ unique: true })
    identifier: string;

    @Column() passwordHash: string;

    @Column({ default: false })
    verified: boolean;

    @Column({ type: 'varchar', nullable: true })
    verificationToken: string | null;

    @Column({ type: 'varchar', nullable: true })
    passwordResetToken: string | null;

    @ManyToMany(type => Role)
    @JoinTable()
    roles: Role[];

    @Column({ nullable: true })
    lastLogin: string;

    @Column(type => CustomUserFields)
    customFields: CustomUserFields;
}
