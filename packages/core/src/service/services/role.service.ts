import { Injectable } from '@nestjs/common';
import {
    CreateRoleInput,
    DeletionResponse,
    DeletionResult,
    Permission,
    UpdateRoleInput,
} from '@vendure/common/lib/generated-types';
import {
    CUSTOMER_ROLE_CODE,
    CUSTOMER_ROLE_DESCRIPTION,
    SUPER_ADMIN_ROLE_CODE,
    SUPER_ADMIN_ROLE_DESCRIPTION,
} from '@vendure/common/lib/shared-constants';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { unique } from '@vendure/common/lib/unique';

import { RequestContext } from '../../api/common/request-context';
import {
    EntityNotFoundError,
    ForbiddenError,
    InternalServerError,
    UserInputError,
} from '../../common/error/errors';
import { ListQueryOptions } from '../../common/types/common-types';
import { assertFound, idsAreEqual } from '../../common/utils';
import { Channel } from '../../entity/channel/channel.entity';
import { ProductOptionGroup } from '../../entity/product-option-group/product-option-group.entity';
import { Role } from '../../entity/role/role.entity';
import { User } from '../../entity/user/user.entity';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { getEntityOrThrow } from '../helpers/utils/get-entity-or-throw';
import { getUserChannelsPermissions } from '../helpers/utils/get-user-channels-permissions';
import { patchEntity } from '../helpers/utils/patch-entity';
import { TransactionalConnection } from '../transaction/transactional-connection';

import { ChannelService } from './channel.service';

@Injectable()
export class RoleService {
    constructor(
        private connection: TransactionalConnection,
        private channelService: ChannelService,
        private listQueryBuilder: ListQueryBuilder,
    ) {}

    async initRoles() {
        await this.ensureSuperAdminRoleExists();
        await this.ensureCustomerRoleExists();
    }

    findAll(ctx: RequestContext, options?: ListQueryOptions<Role>): Promise<PaginatedList<Role>> {
        return this.listQueryBuilder
            .build(Role, options, { relations: ['channels'], ctx })
            .getManyAndCount()
            .then(([items, totalItems]) => ({
                items,
                totalItems,
            }));
    }

    findOne(ctx: RequestContext, roleId: ID): Promise<Role | undefined> {
        return this.connection.getRepository(ctx, Role).findOne(roleId, {
            relations: ['channels'],
        });
    }

    getChannelsForRole(ctx: RequestContext, roleId: ID): Promise<Channel[]> {
        return this.findOne(ctx, roleId).then(role => (role ? role.channels : []));
    }

    getSuperAdminRole(): Promise<Role> {
        return this.getRoleByCode(SUPER_ADMIN_ROLE_CODE).then(role => {
            if (!role) {
                throw new InternalServerError(`error.super-admin-role-not-found`);
            }
            return role;
        });
    }

    getCustomerRole(): Promise<Role> {
        return this.getRoleByCode(CUSTOMER_ROLE_CODE).then(role => {
            if (!role) {
                throw new InternalServerError(`error.customer-role-not-found`);
            }
            return role;
        });
    }

    /**
     * Returns all the valid Permission values
     */
    getAllPermissions(): string[] {
        return Object.values(Permission);
    }

    /**
     * Returns true if the User has the specified permission on that Channel
     */
    async userHasPermissionOnChannel(
        userId: ID | null | undefined,
        channelId: ID,
        permission: Permission,
    ): Promise<boolean> {
        if (userId == null) {
            return false;
        }
        const user = await getEntityOrThrow(this.connection, User, userId, {
            relations: ['roles', 'roles.channels'],
        });
        const userChannels = getUserChannelsPermissions(user);
        const channel = userChannels.find(c => idsAreEqual(c.id, channelId));
        if (!channel) {
            return false;
        }
        return channel.permissions.includes(permission);
    }

    async create(ctx: RequestContext, input: CreateRoleInput): Promise<Role> {
        if (!ctx.activeUserId) {
            throw new ForbiddenError();
        }
        this.checkPermissionsAreValid(input.permissions);

        let targetChannels: Channel[] = [];
        if (input.channelIds) {
            targetChannels = await this.getPermittedChannels(input.channelIds, ctx.activeUserId);
        } else {
            targetChannels = [ctx.channel];
        }
        return this.createRoleForChannels(ctx, input, targetChannels);
    }

    async update(ctx: RequestContext, input: UpdateRoleInput): Promise<Role> {
        this.checkPermissionsAreValid(input.permissions);
        const role = await this.findOne(ctx, input.id);
        if (!role) {
            throw new EntityNotFoundError('Role', input.id);
        }
        if (role.code === SUPER_ADMIN_ROLE_CODE || role.code === CUSTOMER_ROLE_CODE) {
            throw new InternalServerError(`error.cannot-modify-role`, { roleCode: role.code });
        }
        const updatedRole = patchEntity(role, {
            code: input.code,
            description: input.description,
            permissions: input.permissions
                ? unique([Permission.Authenticated, ...input.permissions])
                : undefined,
        });
        if (input.channelIds && ctx.activeUserId) {
            updatedRole.channels = await this.getPermittedChannels(input.channelIds, ctx.activeUserId);
        }
        await this.connection.getRepository(ctx, Role).save(updatedRole, { reload: false });
        return assertFound(this.findOne(ctx, role.id));
    }

    async delete(ctx: RequestContext, id: ID): Promise<DeletionResponse> {
        const role = await this.findOne(ctx, id);
        if (!role) {
            throw new EntityNotFoundError('Role', id);
        }
        if (role.code === SUPER_ADMIN_ROLE_CODE || role.code === CUSTOMER_ROLE_CODE) {
            throw new InternalServerError(`error.cannot-delete-role`, { roleCode: role.code });
        }
        await this.connection.getRepository(ctx, Role).remove(role);
        return {
            result: DeletionResult.DELETED,
        };
    }

    async assignRoleToChannel(ctx: RequestContext, roleId: ID, channelId: ID) {
        await this.channelService.assignToChannels(ctx, Role, roleId, [channelId]);
    }

    private async getPermittedChannels(channelIds: ID[], activeUserId: ID): Promise<Channel[]> {
        let permittedChannels: Channel[] = [];
        for (const channelId of channelIds) {
            const channel = await getEntityOrThrow(this.connection, Channel, channelId);
            const hasPermission = await this.userHasPermissionOnChannel(
                activeUserId,
                channelId,
                Permission.CreateAdministrator,
            );
            if (!hasPermission) {
                throw new ForbiddenError();
            }
            permittedChannels = [...permittedChannels, channel];
        }
        return permittedChannels;
    }

    private checkPermissionsAreValid(permissions?: string[] | null) {
        if (!permissions) {
            return;
        }
        const allPermissions = this.getAllPermissions();
        for (const permission of permissions) {
            if (!allPermissions.includes(permission)) {
                throw new UserInputError('error.permission-invalid', { permission });
            }
        }
    }

    private getRoleByCode(code: string): Promise<Role | undefined> {
        return this.connection.getRepository(Role).findOne({
            where: { code },
        });
    }

    /**
     * Ensure that the SuperAdmin role exists and that it has all possible Permissions.
     */
    private async ensureSuperAdminRoleExists() {
        const allPermissions = Object.values(Permission).filter(p => p !== Permission.Owner);
        try {
            const superAdminRole = await this.getSuperAdminRole();
            const hasAllPermissions = allPermissions.every(permission =>
                superAdminRole.permissions.includes(permission),
            );
            if (!hasAllPermissions) {
                superAdminRole.permissions = allPermissions;
                await this.connection.getRepository(Role).save(superAdminRole, { reload: false });
            }
        } catch (err) {
            await this.createRoleForChannels(
                RequestContext.empty(),
                {
                    code: SUPER_ADMIN_ROLE_CODE,
                    description: SUPER_ADMIN_ROLE_DESCRIPTION,
                    permissions: allPermissions,
                },
                [this.channelService.getDefaultChannel()],
            );
        }
    }

    private async ensureCustomerRoleExists() {
        try {
            await this.getCustomerRole();
        } catch (err) {
            await this.createRoleForChannels(
                RequestContext.empty(),
                {
                    code: CUSTOMER_ROLE_CODE,
                    description: CUSTOMER_ROLE_DESCRIPTION,
                    permissions: [Permission.Authenticated],
                },
                [this.channelService.getDefaultChannel()],
            );
        }
    }

    private createRoleForChannels(ctx: RequestContext, input: CreateRoleInput, channels: Channel[]) {
        const role = new Role({
            code: input.code,
            description: input.description,
            permissions: unique([Permission.Authenticated, ...input.permissions]),
        });
        role.channels = channels;
        return this.connection.getRepository(ctx, Role).save(role);
    }
}
