import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';

import { SoftDeletable } from '../../common/types/common-types';
import { HasCustomFields } from '../../config/custom-field/custom-field-types';
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
export class User extends VendureEntity implements HasCustomFields, SoftDeletable {
    constructor(input?: DeepPartial<User>) {
        super(input);
    }

    @Column({ type: Date, nullable: true })
    deletedAt: Date | null;

    @Column()
    identifier: string;

    @Column({ select: false }) passwordHash: string;

    @Column({ default: false })
    verified: boolean;

    @Column({ type: 'varchar', nullable: true })
    verificationToken: string | null;

    @Column({ type: 'varchar', nullable: true })
    passwordResetToken: string | null;

    /**
     * @description
     * A token issued when a User requests to change their identifier (typically
     * an email address)
     */
    @Column({ type: 'varchar', nullable: true })
    identifierChangeToken: string | null;

    /**
     * @description
     * When a request has been made to change the User's identifier, the new identifier
     * will be stored here until it has been verified, after which it will
     * replace the current value of the `identifier` field.
     */
    @Column({ type: 'varchar', nullable: true })
    pendingIdentifier: string | null;

    @ManyToMany(type => Role)
    @JoinTable()
    roles: Role[];

    @Column({ nullable: true })
    lastLogin: string;

    @Column(type => CustomUserFields)
    customFields: CustomUserFields;
}
