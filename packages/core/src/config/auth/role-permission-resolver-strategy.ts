import { InjectableStrategy } from '../../common';
import { User } from '../../entity';
import { UserChannelPermissions } from '../../service/helpers/utils/get-user-channels-permissions';

/**
 * @description TODO
 */
export interface RolePermissionResolverStrategy extends InjectableStrategy {
    resolvePermissions(user: User): Promise<UserChannelPermissions[]>;
}
