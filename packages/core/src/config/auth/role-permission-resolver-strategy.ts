import { CreateAdministratorInput, UpdateAdministratorInput } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api';
import { InjectableStrategy } from '../../common';
import { User } from '../../entity';
import { UserChannelPermissions } from '../../service/helpers/utils/get-user-channels-permissions';

export type ChannelRoleInput = { channelId: ID; roleId: ID };

/**
 * @description
 * A `RolePermissionResolverStrategy` defines how {@link Role}-based {@link Permission}s for a {@link User} should be resolved,
 * more specifically it determines permissions for a given user based on their roles per {@link Channel}.
 *
 * By default {@link DefaultRolePermissionResolverStrategy} is used.
 *
 * :::info
 *
 * This is configured via the `authOptions.rolePermissionResolverStrategy` properties of your VendureConfig.
 *
 * :::
 *
 * @docsCategory auth
 */
export interface RolePermissionResolverStrategy extends InjectableStrategy {
    /**
     * Retrieves {@link Role}-/ and {@link Channel} IDs for a given {@link Administrator} mutation.
     * This abstraction is needed because a custom strategy may extend the inputs and change how these entities relate to each other.
     */
    getChannelIdsFromAdministratorMutationInput<
        T extends CreateAdministratorInput | UpdateAdministratorInput,
    >(
        ctx: RequestContext,
        input: T,
    ): Promise<ChannelRoleInput[]>;

    /**
     * Persists related entities. These may differ for custom strategies. See the specific implementation for relevant details.
     */
    saveUserRoles(ctx: RequestContext, user: User, channelRoles: ChannelRoleInput[]): Promise<void>;

    /**
     * @param user User for which you want to retrieve permissions
     */
    getPermissionsForUser(user: User): Promise<UserChannelPermissions[]>;
}
