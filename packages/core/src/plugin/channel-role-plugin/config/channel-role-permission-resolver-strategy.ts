import { CreateAdministratorInput, UpdateAdministratorInput } from '@vendure/common/lib/generated-types';
import { DEFAULT_CHANNEL_CODE } from '@vendure/common/lib/shared-constants';

import { RequestContext } from '../../../api/index';
import { EntityNotFoundError, idsAreEqual, Injector } from '../../../common/index';
import {
    ChannelRoleInput,
    RolePermissionResolverStrategy,
} from '../../../config/auth/role-permission-resolver-strategy';
import { TransactionalConnection } from '../../../connection/index';
import { Channel, Role, User } from '../../../entity/index';
import { UserChannelPermissions } from '../../../service/helpers/utils/get-user-channels-permissions';
import { ChannelRole } from '../entities/channel-role.entity';
import { ChannelRoleService } from '../services/channel-role.service';

export class ChannelRolePermissionResolverStrategy implements RolePermissionResolverStrategy {
    private connection: TransactionalConnection;
    // If the UserService is imported directly Nest crashes with a "Nest can't resolve dependencies of the AdministratorService"-Error
    private userService: import('../../../service/services/user.service').UserService;

    private channelRoleService: ChannelRoleService;

    async init(injector: Injector) {
        this.connection = injector.get(TransactionalConnection);
        this.userService = injector.get(
            (await import('../../../service/services/user.service.js')).UserService,
        );
        this.channelRoleService = injector.get(ChannelRoleService);
    }

    async getChannelIdsFromAdministratorMutationInput<
        T extends CreateAdministratorInput | UpdateAdministratorInput,
    >(ctx: RequestContext, input: T & { channelRoleIds: ChannelRoleInput[] }): Promise<ChannelRoleInput[]> {
        return input.channelRoleIds;
    }

    /**
     * @description Persists changes to the junction table of {@link Channel}, {@link Role} and {@link User}.
     */
    async saveUserRoles(ctx: RequestContext, user: User, channelRoles: ChannelRoleInput[]): Promise<void> {
        const currentChannelRoles = await this.connection
            .getRepository(ctx, ChannelRole)
            .find({ where: { user: { id: user.id } } });

        // What needs to be added
        for (const channelRole of channelRoles) {
            if (
                !currentChannelRoles.find(
                    cr =>
                        idsAreEqual(cr.roleId, channelRole.roleId) &&
                        idsAreEqual(cr.channelId, channelRole.channelId),
                )
            ) {
                // New channel role assignment found
                await this.channelRoleService.create(ctx, {
                    userId: user.id,
                    channelId: channelRole.channelId,
                    roleId: channelRole.roleId,
                });
            }
        }

        // What needs to be removed
        for (const channelRole of currentChannelRoles) {
            if (
                !channelRoles.find(
                    cr =>
                        idsAreEqual(cr.roleId, channelRole.roleId) &&
                        idsAreEqual(cr.channelId, channelRole.channelId),
                )
            ) {
                // A channel role need to be removed
                await this.channelRoleService.delete(ctx, channelRole.id);
            }
        }

        // TODO: recycle this: @daniel <3

        const roleIds = channelRoles.map(cr => cr.roleId);
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

    async getPermissionsForUser(user: User): Promise<UserChannelPermissions[]> {
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
        // TODO: Is this needed?
        channelRoleEntries.sort((a, b) => (a.id < b.id ? -1 : 1));

        return channelRolePermissions;
    }
}
