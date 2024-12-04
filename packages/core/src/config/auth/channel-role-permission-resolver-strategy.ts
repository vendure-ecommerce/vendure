import { DEFAULT_CHANNEL_CODE } from '@vendure/common/lib/shared-constants';
import { ID } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api';
import { EntityNotFoundError, Injector } from '../../common';
import { TransactionalConnection } from '../../connection';
import { Channel, Role, User } from '../../entity';
import { ChannelRole } from '../../entity/channel-role/channel-role.entity';
import { UserChannelPermissions } from '../../service/helpers/utils/get-user-channels-permissions';

import { RolePermissionResolverStrategy } from './role-permission-resolver-strategy';

export class ChannelRolePermissionResolverStrategy implements RolePermissionResolverStrategy {
    private connection: TransactionalConnection;
    private userService: import('../../service/services/user.service').UserService;

    async init(injector: Injector) {
        this.connection = injector.get(TransactionalConnection);
        this.userService = injector.get((await import('../../service/services/user.service.js')).UserService);
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
        for (const roleId of roleIds) {
            const foundRole = roles.find(role => role.id === roleId);
            if (!foundRole) throw new EntityNotFoundError('Role', roleId);
        }

        // TODO we are relying here on the `roles` relation existing, it could be missing if you query
        // user entries without supplying the relations argument, for example:
        // this happens when you create a new user via `.save()` because the default reloading doesnt fetch relations
        // Q: Should we simply refetch inside her to be more fault tolerant? Could be fixed on the outside too
        const currentUser = user.roles ? user : await this.userService.getUserById(ctx, user.id);
        if (!currentUser) throw new EntityNotFoundError('User', user.id);

        const rolesAdded = roles.filter(role => !currentUser.roles.some(userRole => userRole.id === role.id));
        const rolesRemoved = currentUser.roles.filter(role => roleIds.indexOf(role.id) === -1);

        // Copy so as to not mutate the original user object when setting roles
        const userCopy = new User({ ...currentUser, roles });
        // Lets keep the roles on the user eventhough this strategy technically doesnt need them there
        // This makes it possible to switch back to the default strategy without breaking anything
        const newUser = await this.connection.getRepository(ctx, User).save(userCopy);

        if (rolesAdded.length > 0) {
            // TODO these would come from the new `channelIds` argument from the UI
            // For now as proof of concept, lets just always assign the default channel
            // Test the permissions by manually creating rows for your channels
            const channels = await this.connection
                .getRepository(ctx, Channel)
                .findBy([{ code: DEFAULT_CHANNEL_CODE }]);

            const newChannelRoleEntries = channels.flatMap(channel =>
                rolesAdded.map(role => new ChannelRole({ user: newUser, channel, role })),
            );

            await this.connection
                .getRepository(ctx, ChannelRole)
                .save(newChannelRoleEntries, { reload: false });
        }

        // TODO could be reduced to one query
        // potentially improve later once we're happy with the `persistUserAndTheirRoles` level of abstraction
        for (const role of rolesRemoved) {
            await this.connection
                .getRepository(ctx, ChannelRole)
                .delete({ role: { id: role.id }, user: { id: user.id } });
        }
    }

    async resolvePermissions(user: User): Promise<UserChannelPermissions[]> {
        const channelRoleEntries = await this.connection.rawConnection.getRepository(ChannelRole).find({
            where: { user: { id: user.id } },
            relations: ['user', 'channel', 'role'],
        });

        const channelRolePermissions = new Array<UserChannelPermissions>(channelRoleEntries.length);
        for (let i = 0; i < channelRoleEntries.length; i++) {
            channelRolePermissions[i] = {
                id: channelRoleEntries[i].channel.id,
                token: channelRoleEntries[i].channel.token,
                code: channelRoleEntries[i].channel.code,
                permissions: channelRoleEntries[i].role.permissions,
            };
        }
        channelRoleEntries.sort((a, b) => (a.id < b.id ? -1 : 1));

        return channelRolePermissions;
    }
}
