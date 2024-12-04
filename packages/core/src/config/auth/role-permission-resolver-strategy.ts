import { ID } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api';
import { InjectableStrategy } from '../../common';
import { User } from '../../entity';
import { UserChannelPermissions } from '../../service/helpers/utils/get-user-channels-permissions';

/**
 * @description TODO
 */
export interface RolePermissionResolverStrategy extends InjectableStrategy {
    /**
     * TODO
     */
    persistUserAndTheirRoles(
        ctx: RequestContext,
        user: User,
        /* channelIds: ID[], */ roleIds: ID[],
    ): Promise<void>;
    /**
     * @param user User for which you want to retrieve permissions
     */
    resolvePermissions(user: User): Promise<UserChannelPermissions[]>;
}
