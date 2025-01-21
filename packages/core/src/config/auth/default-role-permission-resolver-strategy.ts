import { CreateAdministratorInput } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api';
import { EntityNotFoundError, Injector } from '../../common';
import { TransactionalConnection } from '../../connection';
import { Role, User } from '../../entity';
import {
    getChannelPermissions,
    UserChannelPermissions,
} from '../../service/helpers/utils/get-user-channels-permissions';

import { ChannelRoleInput, RolePermissionResolverStrategy } from './role-permission-resolver-strategy';

export class DefaultRolePermissionResolverStrategy implements RolePermissionResolverStrategy {
    private connection: TransactionalConnection;

    async init(injector: Injector) {
        this.connection = injector.get(TransactionalConnection);
    }

    async getChannelIdsFromCreateAdministratorInput(ctx: RequestContext, input: CreateAdministratorInput) {
        const roles = await this.getRolesFromIds(ctx, input.roleIds);
        const channelRoles = [];
        for (const role of roles) {
            for (const channel of role.channels) {
                channelRoles.push({ roleId: role.id, channelId: channel.id });
            }
        }
        return channelRoles;
    }

    /**
     * @description TODO
     */
    async persistUserAndTheirRoles(
        ctx: RequestContext,
        user: User,
        channelRoles: ChannelRoleInput[],
    ): Promise<void> {
        const roleIds = channelRoles.map(channelRole => channelRole.roleId);
        const roles = await this.getRolesFromIds(ctx, roleIds);
        // Copy so as to not mutate the original user object when setting roles
        const userCopy = new User({ ...user, roles });
        await this.connection.getRepository(ctx, User).save(userCopy, { reload: false });
    }

    private async getRolesFromIds(ctx: RequestContext, roleIds: ID[]): Promise<Role[]> {
        const roles =
            // Empty array is important because that would return every row when used in the query
            roleIds.length === 0
                ? []
                : await this.connection.getRepository(ctx, Role).findBy(roleIds.map(id => ({ id })));
        for (const roleId of roleIds) {
            const foundRole = roles.find(role => role.id === roleId);
            if (!foundRole) throw new EntityNotFoundError('Role', roleId);
        }
        return roles;
    }

    async resolvePermissions(user: User): Promise<UserChannelPermissions[]> {
        return getChannelPermissions(user.roles);
    }
}
