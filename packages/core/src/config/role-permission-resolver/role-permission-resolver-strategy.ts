import { InjectableStrategy } from '../../common/types/injectable-strategy';
import { User } from '../../entity/user/user.entity';
import { UserChannelPermissions } from '../../service/helpers/utils/get-user-channels-permissions';

/**
 * @description
 * Defines how permissions are resolved for a given User. The default strategy
 * ({@link DefaultRolePermissionResolverStrategy}) uses the existing User → Roles → Channels
 * relationship to determine channel-specific permissions.
 *
 * An alternative strategy ({@link ChannelRolePermissionResolverStrategy}) uses the
 * ChannelRole bridge entity to allow decoupled role definitions from channel assignments.
 *
 * :::info
 *
 * This is configured via the `authOptions.rolePermissionResolverStrategy` property of
 * your VendureConfig.
 *
 * :::
 *
 * @docsCategory auth
 * @docsPage RolePermissionResolverStrategy
 * @docsWeight 0
 * @since 3.3.0
 */
export interface RolePermissionResolverStrategy extends InjectableStrategy {
    /**
     * @description
     * Resolves channel-specific permissions for the given User.
     *
     * @returns An array of `UserChannelPermissions` representing the permissions
     * the user has on each channel.
     */
    resolvePermissions(user: User): UserChannelPermissions[] | Promise<UserChannelPermissions[]>;
}
