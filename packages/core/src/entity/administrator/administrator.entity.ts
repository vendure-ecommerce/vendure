import { DeepPartial } from '@vendure/common/lib/shared-types';
import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { SoftDeletable } from '../../common/types/common-types';
import { VendureEntity } from '../base/base.entity';
import { User } from '../user/user.entity';

/**
 * @description
 * An administrative user who has access to the admin ui.
 *
 * @docsCategory entities
 */
@Entity()
export class Administrator extends VendureEntity implements SoftDeletable {
    constructor(input?: DeepPartial<Administrator>) {
        super(input);
    }

    @Column({ type: Date, nullable: true })
    deletedAt: Date | null;

    @Column() firstName: string;

    @Column() lastName: string;

    @Column({ unique: true })
    emailAddress: string;

    @OneToOne((type) => User)
    @JoinColumn()
    user: User;
}
