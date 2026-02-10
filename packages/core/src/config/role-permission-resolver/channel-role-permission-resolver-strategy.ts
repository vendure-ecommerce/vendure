import { Permission } from '@vendure/common/lib/generated-types';

import { Injector } from '../../common/injector';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { User } from '../../entity/user/user.entity';
import {
    getUserChannelsPermissions,
    UserChannelPermissions,
} from '../../service/helpers/utils/get-user-channels-permissions';
import { ChannelRoleService } from '../../service/services/channel-role.service';

import { RolePermissionResolverStrategy } from './role-permission-resolver-strategy';

/**
 * @description
 * A strategy that uses the {@link ChannelRole} bridge entity to resolve permissions.
 * Instead of deriving channel-permission mappings from Role → Channels, this strategy
 * uses explicit User → ChannelRole → (Channel, Role) associations.
 *
 * This is useful for multi-vendor marketplaces where the same Role definition
 * should be shared across multiple users on different channels, avoiding the need
 * to duplicate roles per channel.
 *
 * @example
 * ```ts
 * import { ChannelRolePermissionResolverStrategy, VendureConfig } from '\@vendure/core';
 *
 * export const config: VendureConfig = {
 *     authOptions: {
 *         rolePermissionResolverStrategy: new ChannelRolePermissionResolverStrategy(),
 *     },
 * };
 * ```
 *
 * @docsCategory auth
 * @docsPage RolePermissionResolverStrategy
 * @since 3.3.0
 */
export class ChannelRolePermissionResolverStrategy implements RolePermissionResolverStrategy {
    private channelRoleService: ChannelRoleService;
    private connection: TransactionalConnection;

    init(injector: Injector) {
        this.channelRoleService = injector.get(ChannelRoleService);
        this.connection = injector.get(TransactionalConnection);
    }

    async resolvePermissions(user: User): Promise<UserChannelPermissions[]> {
        // Users with the SuperAdmin permission (e.g. the default superadmin account)
        // should always retain full access, even when the channel-role strategy is active.
        // These users are created via the traditional role system and won't have
        // ChannelRole entries.
        let roles = user.roles;
        if (!roles) {
            const fullUser = await this.connection.rawConnection.getRepository(User).findOne({
                where: { id: user.id },
                relations: ['roles', 'roles.channels'],
            });
            roles = fullUser?.roles ?? [];
        }
        const isSuperAdmin = roles.some(role => role.permissions.includes(Permission.SuperAdmin));
        if (isSuperAdmin) {
            user.roles = roles;
            return getUserChannelsPermissions(user);
        }
        return this.channelRoleService.getMergedPermissionsPerChannel(undefined, user.id);
    }
}
