import { CreateAdministratorInput, UpdateAdministratorInput } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api';
import { InjectableStrategy } from '../../common';
import { User } from '../../entity';
import { UserChannelPermissions } from '../../service/helpers/utils/get-user-channels-permissions';

export type ChannelRoleInput = { channelId: ID; roleId: ID };

/**
 * @description TODO
 */
export interface RolePermissionResolverStrategy extends InjectableStrategy {
    getChannelIdsFromCreateAdministratorInput<T extends CreateAdministratorInput | UpdateAdministratorInput>(
        ctx: RequestContext,
        input: T,
    ): Promise<ChannelRoleInput[]>;

    /**
     * TODO
     */
    persistUserAndTheirRoles(
        ctx: RequestContext,
        user: User,
        channelRoles: ChannelRoleInput[],
    ): Promise<void>;

    /**
     * @param user User for which you want to retrieve permissions
     */
    resolvePermissions(user: User): Promise<UserChannelPermissions[]>;
}
