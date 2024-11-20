import { User } from '../../entity';
import {
    getChannelPermissions,
    UserChannelPermissions,
} from '../../service/helpers/utils/get-user-channels-permissions';

import { RolePermissionResolverStrategy } from './role-permission-resolver-strategy';

export class DefaultRolePermissionResolverStrategy implements RolePermissionResolverStrategy {
    async resolvePermissions(user: User): Promise<UserChannelPermissions[]> {
        return getChannelPermissions(user.roles);
    }
}
