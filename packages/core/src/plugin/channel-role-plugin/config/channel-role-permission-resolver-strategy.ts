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
    private channelRoleService: ChannelRoleService;

    // eslint-disable-next-line @typescript-eslint/require-await
    async init(injector: Injector) {
        this.connection = injector.get(TransactionalConnection);
        this.channelRoleService = injector.get(ChannelRoleService);
    }

    // eslint-disable-next-line @typescript-eslint/require-await
    async getChannelIdsFromAdministratorMutationInput<
        T extends CreateAdministratorInput | UpdateAdministratorInput,
    >(ctx: RequestContext, input: T & { channelRoles: ChannelRoleInput[] }): Promise<ChannelRoleInput[]> {
        /**
         * I dislike how the property on input is hardcoded and must conform to the api extension of the plugin
         */
        return input.channelRoles ?? [];
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
