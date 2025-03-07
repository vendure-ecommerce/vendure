import {
    CreateAdministratorInput,
    DeletionResult,
    UpdateAdministratorInput,
} from '@vendure/common/lib/generated-types';

import { RequestContext } from '../../../api/index';
import { idsAreEqual, Injector } from '../../../common/index';
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

    // eslint-disable-next-line @typescript-eslint/require-await
    async getChannelIdsFromAdministratorMutationInput<
        T extends CreateAdministratorInput | UpdateAdministratorInput,
    >(ctx: RequestContext, input: T & { channelRoleIds: ChannelRoleInput[] }): Promise<ChannelRoleInput[]> {
        return input.channelRoleIds;
    }

    /**
     * @description Persists changes to the junction table of {@link Channel}, {@link Role} and {@link User}.
     */
    async saveUserRoles(ctx: RequestContext, user: User, input: ChannelRoleInput[]): Promise<void> {
        const currentChannelRoles = await this.connection
            .getRepository(ctx, ChannelRole)
            .find({ where: { user: { id: user.id } } });

        const toAddPairs: ChannelRoleInput[] = [];
        for (const channelRole of input) {
            if (
                !currentChannelRoles.find(
                    cr =>
                        idsAreEqual(cr.roleId, channelRole.roleId) &&
                        idsAreEqual(cr.channelId, channelRole.channelId),
                )
            ) {
                toAddPairs.push(channelRole);
            }
        }

        const toRemoveChannelRoles: ChannelRole[] = [];
        for (const channelRole of currentChannelRoles) {
            if (
                !input.find(
                    cr =>
                        idsAreEqual(cr.roleId, channelRole.roleId) &&
                        idsAreEqual(cr.channelId, channelRole.channelId),
                )
            ) {
                toRemoveChannelRoles.push(channelRole);
            }
        }

        // TODO maybe just make it sequential
        await Promise.all(
            toAddPairs.map(pair =>
                this.channelRoleService.create(ctx, {
                    channelId: pair.channelId,
                    roleId: pair.roleId,
                    userId: user.id,
                }),
            ),
        );

        // TODO should we parallelize like above, does that even actually help?
        // try it out later
        for (const channelRole of toRemoveChannelRoles) {
            const response = await this.channelRoleService.delete(ctx, channelRole.id);
            if (response.result === DeletionResult.NOT_DELETED) {
                // TODO Throw InternalServerError here?
            }
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
