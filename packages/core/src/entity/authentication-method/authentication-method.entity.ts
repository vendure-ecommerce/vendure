import { Entity, Index, ManyToOne, TableInheritance } from 'typeorm';

import { VendureEntity } from '../base/base.entity';
import { User } from '../user/user.entity';

/**
 * @description
 * An AuthenticationMethod represents the means by which a {@link User} is authenticated. There are two kinds:
 * {@link NativeAuthenticationMethod} and {@link ExternalAuthenticationMethod}.
 *
 * @docsCategory entities
 * @docsPage AuthenticationMethod
 */
@Entity()
@TableInheritance({ column: { type: 'varchar', name: 'type' } })
export abstract class AuthenticationMethod extends VendureEntity {
    @Index()
    @ManyToOne(type => User, user => user.authenticationMethods)
    user: User;
}
