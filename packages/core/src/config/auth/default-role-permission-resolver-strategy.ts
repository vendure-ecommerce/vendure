import { CreateAdministratorInput, UpdateAdministratorInput } from '@vendure/common/lib/generated-types';
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

    // eslint-disable-next-line @typescript-eslint/require-await
    async init(injector: Injector) {
        this.connection = injector.get(TransactionalConnection);
    }

    async getChannelIdsFromAdministratorMutationInput<
        T extends CreateAdministratorInput | UpdateAdministratorInput,
    >(ctx: RequestContext, input: T): Promise<ChannelRoleInput[]> {
        const channelRoles: ChannelRoleInput[] = [];
        if (!input.roleIds) return channelRoles;

        const roles = await this.getRolesFromIds(ctx, input.roleIds);

        for (const role of roles) {
            for (const channel of role.channels) {
                channelRoles.push({ roleId: role.id, channelId: channel.id });
            }
        }
        return channelRoles;
    }

    /**
     * @description Persists changes to the junction table between {@link User} and {@link Role}.
     */
    async saveUserRoles(ctx: RequestContext, user: User, channelRoles: ChannelRoleInput[]): Promise<void> {
        const roleIds = channelRoles.map(channelRole => channelRole.roleId);
        const roles = await this.getRolesFromIds(ctx, roleIds);
        // Copy so as to not mutate the original user object when setting roles
        const userCopy = new User({ ...user, roles });
        await this.connection.getRepository(ctx, User).save(userCopy, { reload: false });
    }

    /**
     * Does what the name implies but with the addition of throwing an error for missing roles.
     *
     * @throws EntityNotFoundError
     */
    private async getRolesFromIds(ctx: RequestContext, roleIds: ID[]): Promise<Role[]> {
        const roles =
            // Empty array is important because that would return every row when used in the query
            roleIds.length === 0
                ? []
                : await this.connection.getRepository(ctx, Role).findBy(roleIds.map(id => ({ id })));

        // Early exit if we found all corresponding roles
        if (roles.length === roleIds.length) return roles;

        // Differing lengths means some role could not be found, report back which one
        for (const roleId of roleIds) {
            const foundRole = roles.find(role => role.id === roleId);
            if (!foundRole) throw new EntityNotFoundError('Role', roleId);
        }
        return roles;
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    async getPermissionsForUser(user: User): Promise<UserChannelPermissions[]> {
        return getChannelPermissions(user.roles);
    }
}
