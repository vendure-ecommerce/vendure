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
import { RelationPaths } from '../../api/index';
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
import { TransactionalConnection } from '../../connection/transactional-connection';
import { Channel } from '../../entity/channel/channel.entity';
import { Role } from '../../entity/role/role.entity';
import { User } from '../../entity/user/user.entity';
import { EventBus } from '../../event-bus';
import { RoleEvent } from '../../event-bus/events/role-event';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { getUserChannelsPermissions } from '../helpers/utils/get-user-channels-permissions';
import { patchEntity } from '../helpers/utils/patch-entity';

import { ChannelService } from './channel.service';

/**
 * @description
 * Contains methods relating to {@link Role} entities.
 *
 * @docsCategory services
 */
@Injectable()
export class RoleService {
    constructor(
        private connection: TransactionalConnection,
        private channelService: ChannelService,
        private listQueryBuilder: ListQueryBuilder,
        private configService: ConfigService,
        private eventBus: EventBus,
    ) {}

    async initRoles() {
        await this.ensureSuperAdminRoleExists();
        await this.ensureCustomerRoleExists();
        await this.ensureRolesHaveValidPermissions();
    }

    findAll(
        ctx: RequestContext,
        options?: ListQueryOptions<Role>,
        relations?: RelationPaths<Role>,
    ): Promise<PaginatedList<Role>> {
        return this.listQueryBuilder
            .build(Role, options, { relations: relations ?? ['channels'], ctx })
            .getManyAndCount()
            .then(([items, totalItems]) => ({
                items,
                totalItems,
            }));
    }

    findOne(ctx: RequestContext, roleId: ID, relations?: RelationPaths<Role>): Promise<Role | undefined> {
        return this.connection.getRepository(ctx, Role).findOne(roleId, {
            relations: relations ?? ['channels'],
        });
    }

    getChannelsForRole(ctx: RequestContext, roleId: ID): Promise<Channel[]> {
        return this.findOne(ctx, roleId).then(role => (role ? role.channels : []));
    }

    /**
     * @description
     * Returns the special SuperAdmin Role, which always exists in Vendure.
     */
    getSuperAdminRole(ctx?: RequestContext): Promise<Role> {
        return this.getRoleByCode(ctx, SUPER_ADMIN_ROLE_CODE).then(role => {
            if (!role) {
                throw new InternalServerError(`error.super-admin-role-not-found`);
            }
            return role;
        });
    }

    /**
     * @description
     * Returns the special Customer Role, which always exists in Vendure.
     */
    getCustomerRole(ctx?: RequestContext): Promise<Role> {
        return this.getRoleByCode(ctx, CUSTOMER_ROLE_CODE).then(role => {
            if (!role) {
                throw new InternalServerError(`error.customer-role-not-found`);
            }
            return role;
        });
    }

    /**
     * @description
     * Returns all the valid Permission values
     */
    getAllPermissions(): string[] {
        return Object.values(Permission);
    }

    /**
     * @description
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
        const role = await this.createRoleForChannels(ctx, input, targetChannels);
        this.eventBus.publish(new RoleEvent(ctx, role, 'created', input));
        return role;
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
        this.eventBus.publish(new RoleEvent(ctx, role, 'updated', input));
        return await assertFound(this.findOne(ctx, role.id));
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
        this.eventBus.publish(new RoleEvent(ctx, role, 'deleted', id));
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

    private getRoleByCode(ctx: RequestContext | undefined, code: string) {
        const repository = ctx 
            ? this.connection.getRepository(ctx, Role) 
            : this.connection.rawConnection.getRepository(Role);

        return repository.findOne({
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
            await this.connection.rawConnection.getRepository(Role).save(superAdminRole, { reload: false });
        } catch (err) {
            const defaultChannel = await this.channelService.getDefaultChannel();
            await this.createRoleForChannels(
                RequestContext.empty(),
                {
                    code: SUPER_ADMIN_ROLE_CODE,
                    description: SUPER_ADMIN_ROLE_DESCRIPTION,
                    permissions: assignablePermissions,
                },
                [defaultChannel],
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
            const defaultChannel = await this.channelService.getDefaultChannel();
            await this.createRoleForChannels(
                RequestContext.empty(),
                {
                    code: CUSTOMER_ROLE_CODE,
                    description: CUSTOMER_ROLE_DESCRIPTION,
                    permissions: [Permission.Authenticated],
                },
                [defaultChannel],
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
        const roles = await this.connection.rawConnection.getRepository(Role).find();
        const assignablePermissions = this.getAllAssignablePermissions();
        for (const role of roles) {
            const invalidPermissions = role.permissions.filter(p => !assignablePermissions.includes(p));
            if (invalidPermissions.length) {
                role.permissions = role.permissions.filter(p => assignablePermissions.includes(p));
                await this.connection.rawConnection.getRepository(Role).save(role);
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
