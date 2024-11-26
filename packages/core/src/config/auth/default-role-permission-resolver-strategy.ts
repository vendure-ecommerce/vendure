import { ID } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api';
import { Injector } from '../../common';
import { TransactionalConnection } from '../../connection';
import { Role, User } from '../../entity';
import {
    getChannelPermissions,
    UserChannelPermissions,
} from '../../service/helpers/utils/get-user-channels-permissions';

import { RolePermissionResolverStrategy } from './role-permission-resolver-strategy';

export class DefaultRolePermissionResolverStrategy implements RolePermissionResolverStrategy {
    private connection: TransactionalConnection;

    async init(injector: Injector) {
        this.connection = injector.get(TransactionalConnection);
    }

    /**
     * @description TODO
     */
    async persistUserAndTheirRoles(ctx: RequestContext, user: User, roleIds: ID[]): Promise<void> {
        const roles =
            // Empty array is important because that would return every row when used in the query
            roleIds.length === 0
                ? []
                : await this.connection.getRepository(ctx, Role).findBy(roleIds.map(id => ({ id })));
        // Copy so as to not mutate the original user object when setting roles
        const userCopy = new User({ ...user, roles });
        await this.connection.getRepository(ctx, User).save(userCopy, { reload: false });
    }

    async resolvePermissions(user: User): Promise<UserChannelPermissions[]> {
        return getChannelPermissions(user.roles);
    }
}
