import { Column, Entity, JoinColumn, OneToOne } from 'typeorm';

import { DeepPartial } from '../../../../shared/shared-types';
import { VendureEntity } from '../base/base.entity';
import { User } from '../user/user.entity';

@Entity()
export class Administrator extends VendureEntity {
    constructor(input?: DeepPartial<Administrator>) {
        super(input);
    }

    @Column() firstName: string;

    @Column() lastName: string;

    @Column({ unique: true })
    emailAddress: string;

    @OneToOne(type => User)
    @JoinColumn()
    user: User;
}
