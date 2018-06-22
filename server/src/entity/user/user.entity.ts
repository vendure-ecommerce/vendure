import { Column, Entity } from 'typeorm';
import { Role } from '../../auth/role';
import { DeepPartial } from '../../common/common-types';
import { VendureEntity } from '../base/base.entity';

@Entity()
export class User extends VendureEntity {
    constructor(input?: DeepPartial<User>) {
        super(input);
    }

    @Column({ unique: true })
    identifier: string;

    @Column() passwordHash: string;

    @Column('simple-array') roles: Role[];

    @Column() lastLogin: string;
}
