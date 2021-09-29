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
import { getAllPermissionsMetadata } from '../../common/constants';
import {
    EntityNotFoundError,
    ForbiddenError,
    InternalServerError,
    UserInputError,
} from '../../common/error/errors';
import { ListQueryOptions } from '../../common/types/common-types';
import { assertFound, idsAreEqual } from '../../common/utils';
import { ConfigService } from '../../config/config.service';
import { Channel } from '../../entity/channel/channel.entity';
import { Role } from '../../entity/role/role.entity';
import { User } from '../../entity/user/user.entity';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
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
        private configService: ConfigService,
    ) {}

    async initRoles() {
        await this.ensureSuperAdminRoleExists();
        await this.ensureCustomerRoleExists();
        await this.ensureRolesHaveValidPermissions();
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
        ctx: RequestContext,
        channelId: ID,
        permission: Permission,
    ): Promise<boolean> {
        if (ctx.activeUserId == null) {
            return false;
        }
        const user = await this.connection.getEntityOrThrow(ctx, User, ctx.activeUserId, {
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
        this.checkPermissionsAreValid(input.permissions);

        let targetChannels: Channel[] = [];
        if (input.channelIds) {
            targetChannels = await this.getPermittedChannels(ctx, input.channelIds);
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
            updatedRole.channels = await this.getPermittedChannels(ctx, input.channelIds);
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

    private async getPermittedChannels(ctx: RequestContext, channelIds: ID[]): Promise<Channel[]> {
        let permittedChannels: Channel[] = [];
        for (const channelId of channelIds) {
            const channel = await this.connection.getEntityOrThrow(ctx, Channel, channelId);
            const hasPermission = await this.userHasPermissionOnChannel(
                ctx,
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

    private checkPermissionsAreValid(permissions?: Permission[] | null) {
        if (!permissions) {
            return;
        }
        const allAssignablePermissions = this.getAllAssignablePermissions();
        for (const permission of permissions) {
            if (!allAssignablePermissions.includes(permission) || permission === Permission.SuperAdmin) {
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
        const assignablePermissions = this.getAllAssignablePermissions();
        try {
            const superAdminRole = await this.getSuperAdminRole();
            superAdminRole.permissions = assignablePermissions;
            await this.connection.getRepository(Role).save(superAdminRole, { reload: false });
        } catch (err) {
            await this.createRoleForChannels(
                RequestContext.empty(),
                {
                    code: SUPER_ADMIN_ROLE_CODE,
                    description: SUPER_ADMIN_ROLE_DESCRIPTION,
                    permissions: assignablePermissions,
                },
                [this.channelService.getDefaultChannel()],
            );
        }
    }

    /**
     * The Customer Role is a special case which must always exist.
     */
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

    /**
     * Since custom permissions can be added and removed by config, there may exist one or more Roles with
     * invalid permissions (i.e. permissions that were set previously to a custom permission, which has been
     * subsequently removed from config). This method should run on startup to ensure that any such invalid
     * permissions are removed from those Roles.
     */
    private async ensureRolesHaveValidPermissions() {
        const roles = await this.connection.getRepository(Role).find();
        const assignablePermissions = this.getAllAssignablePermissions();
        for (const role of roles) {
            const invalidPermissions = role.permissions.filter(p => !assignablePermissions.includes(p));
            if (invalidPermissions.length) {
                role.permissions = role.permissions.filter(p => assignablePermissions.includes(p));
                await this.connection.getRepository(Role).save(role);
            }
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

    private getAllAssignablePermissions(): Permission[] {
        return getAllPermissionsMetadata(this.configService.authOptions.customPermissions)
            .filter(p => p.assignable)
            .map(p => p.name as Permission);
    }
}
