import { Entity, ManyToOne, TableInheritance } from 'typeorm';

import { VendureEntity } from '../base/base.entity';
import { User } from '../user/user.entity';

@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class AuthenticationMethod extends VendureEntity {
    @ManyToOne(
        type => User,
        user => user.authenticationMethods,
    )
    user: User;
}
