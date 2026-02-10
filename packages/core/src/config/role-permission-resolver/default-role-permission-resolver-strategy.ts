import { User } from '../../entity/user/user.entity';
import {
    getUserChannelsPermissions,
    UserChannelPermissions,
} from '../../service/helpers/utils/get-user-channels-permissions';

import { RolePermissionResolverStrategy } from './role-permission-resolver-strategy';

/**
 * @description
 * The default strategy that preserves the existing behavior: permissions are derived
 * from the User's Roles, where each Role is associated with one or more Channels.
 *
 * User → Roles → Role.channels + Role.permissions
 *
 * @docsCategory auth
 * @docsPage RolePermissionResolverStrategy
 * @since 3.3.0
 */
export class DefaultRolePermissionResolverStrategy implements RolePermissionResolverStrategy {
    resolvePermissions(user: User): UserChannelPermissions[] {
        return getUserChannelsPermissions(user);
    }
}
