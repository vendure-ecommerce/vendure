import { Injectable } from '@nestjs/common';
import {
    ChannelRoleInput,
    CreateChannelAdministratorInput,
    DeletionResult,
    UpdateChannelAdministratorInput,
} from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { In, IsNull, Not } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { RelationPaths } from '../../api/decorators/relations.decorator';
import { Instrument } from '../../common';
import { EntityNotFoundError, InternalServerError, UserInputError } from '../../common/error/errors';
import { ListQueryOptions } from '../../common/types/common-types';
import { assertFound, idsAreEqual, normalizeEmailAddress } from '../../common/utils';
import { ConfigService } from '../../config';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { Role } from '../../entity';
import { Administrator } from '../../entity/administrator/administrator.entity';
import { NativeAuthenticationMethod } from '../../entity/authentication-method/native-authentication-method.entity';
import { ChannelRole } from '../../entity/role/channel-role.entity';
import { User } from '../../entity/user/user.entity';
import { EventBus } from '../../event-bus';
import { AdministratorEvent } from '../../event-bus/events/administrator-event';
import { RoleChangeEvent } from '../../event-bus/events/role-change-event';
import { CustomFieldRelationService } from '../helpers/custom-field-relation/custom-field-relation.service';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { PasswordCipher } from '../helpers/password-cipher/password-cipher';
import { RequestContextService } from '../helpers/request-context/request-context.service';
import { patchEntity } from '../helpers/utils/patch-entity';

import { ChannelRoleService } from './channel-role.service';
import { ChannelService } from './channel.service';
import { RoleService } from './role.service';
import { UserService } from './user.service';

/**
 * @description
 * Contains methods relating to {@link Administrator} entities.
 *
 * @docsCategory services
 */
@Injectable()
@Instrument()
export class AdministratorService {
    constructor(
        private connection: TransactionalConnection,
        private configService: ConfigService,
        private listQueryBuilder: ListQueryBuilder,
        private passwordCipher: PasswordCipher,
        private userService: UserService,
        private roleService: RoleService,
        private channelService: ChannelService,
        private channelRoleService: ChannelRoleService,
        private customFieldRelationService: CustomFieldRelationService,
        private eventBus: EventBus,
        private requestContextService: RequestContextService,
    ) {}

    /** @internal */
    async initAdministrators() {
        await this.ensureSuperAdminExists();
    }

    /**
     * @description
     * Get a paginated list of Administrators.
     */
    findAll(
        ctx: RequestContext,
        options?: ListQueryOptions<Administrator>,
        relations?: RelationPaths<Administrator>,
    ): Promise<PaginatedList<Administrator>> {
        return this.listQueryBuilder
            .build(Administrator, options, {
                relations: relations ?? ['user', 'user.roles'],
                where: { deletedAt: IsNull() },
                ctx,
            })
            .getManyAndCount()
            .then(([items, totalItems]) => ({
                items,
                totalItems,
            }));
    }

    /**
     * @description
     * Get an Administrator by id.
     */
    findOne(
        ctx: RequestContext,
        administratorId: ID,
        relations?: RelationPaths<Administrator>,
    ): Promise<Administrator | undefined> {
        return this.connection
            .getRepository(ctx, Administrator)
            .findOne({
                relations: relations ?? ['user', 'user.roles'],
                where: {
                    id: administratorId,
                    deletedAt: IsNull(),
                },
            })
            .then(result => result ?? undefined);
    }

    /**
     * @description
     * Get an Administrator based on the User id.
     */
    findOneByUserId(
        ctx: RequestContext,
        userId: ID,
        relations?: RelationPaths<Administrator>,
    ): Promise<Administrator | undefined> {
        return this.connection
            .getRepository(ctx, Administrator)
            .findOne({
                relations,
                where: {
                    user: { id: userId },
                    deletedAt: IsNull(),
                },
            })
            .then(result => result ?? undefined);
    }

    /**
     * @description
     * Create a new Administrator.
     */
    async create(ctx: RequestContext, input: CreateChannelAdministratorInput): Promise<Administrator> {
        await this.assertActiveUserCanGrantRoles(ctx, input.channelRoles);

        const administrator = new Administrator(input);
        administrator.emailAddress = normalizeEmailAddress(input.emailAddress);
        administrator.user = await this.userService.createAdminUser(ctx, input.emailAddress, input.password);
        let createdAdministrator = await this.connection
            .getRepository(ctx, Administrator)
            .save(administrator);

        for (const { channelId, roleId } of input.channelRoles) {
            // TODO should this run concurrently via Promise.all?
            await this.channelRoleService.create(ctx, { userId: administrator.id, channelId, roleId });
        }

        // TODO getting error that the input has no customfields -- how did this work previously?
        // Previously the input also didnt specify (?)
        //
        // await this.customFieldRelationService.updateRelations(
        //     ctx,
        //     Administrator,
        //     input,
        //     createdAdministrator,
        // );

        createdAdministrator = await assertFound(this.findOne(ctx, createdAdministrator.id));
        await this.eventBus.publish(new AdministratorEvent(ctx, createdAdministrator, 'created', input));
        return createdAdministrator;
    }

    /**
     * @description
     * Update an existing Administrator.
     */
    async update(ctx: RequestContext, input: UpdateChannelAdministratorInput): Promise<Administrator> {
        const administrator = await this.findOne(ctx, input.id, ['user']);
        if (!administrator) {
            throw new EntityNotFoundError('Administrator', input.id);
        }

        const channelRolesToAdd: ChannelRoleInput[] = [];
        const channelRolesToRemove: ID[] = [];
        if (input.channelRoles) {
            await this.assertActiveUserCanGrantRoles(ctx, input.channelRoles);

            // Must also ensure a sole superadmin cant lock themselves out
            const superAdminRoleId = (await this.roleService.getSuperAdminRole(ctx)).id;
            if (await this.isSoleSuperadmin(ctx, administrator.user.id, superAdminRoleId)) {
                // If the admin truly is the last one, assert that the role does not get removed
                if (!input.channelRoles.find(cr => idsAreEqual(cr.roleId, superAdminRoleId))) {
                    throw new InternalServerError('error.superadmin-must-have-superadmin-role');
                }
            }

            // Gathering to-be-added ones to fire events later
            // Would it be smarter to just insert it and let the unique constraint deal with it?
            for (const cr of input.channelRoles) {
                const exists = await this.connection.getRepository(ctx, ChannelRole).existsBy({
                    userId: administrator.user.id,
                    channelId: cr.channelId,
                    roleId: cr.roleId,
                });
                if (!exists) channelRolesToAdd.push(cr);
            }

            // Gathering to-be-removed ones to fire events later
            for (const channelRole of await this.connection.getRepository(ctx, ChannelRole).findBy({
                userId: administrator.user.id,
                channelId: In(input.channelRoles.map(cr => cr.channelId)),
                roleId: Not(In(input.channelRoles.map(cr => cr.roleId))),
            })) {
                channelRolesToRemove.push(channelRole.id);
            }

            for (const { channelId, roleId } of channelRolesToAdd) {
                await this.channelRoleService.create(ctx, {
                    userId: administrator.user.id,
                    channelId,
                    roleId,
                });
            }

            for (const id of channelRolesToRemove) {
                const response = await this.channelRoleService.delete(ctx, id);
                if (response.result === DeletionResult.NOT_DELETED) {
                    throw new InternalServerError('// TODO is throwing here really what we want?');
                }
            }
        }

        patchEntity(administrator, input);
        await this.connection.getRepository(ctx, Administrator).save(administrator, { reload: false });

        if (input.emailAddress) {
            administrator.user.identifier = input.emailAddress;
            await this.connection.getRepository(ctx, User).save(administrator.user);
        }
        if (input.password) {
            const user = await this.userService.getUserById(ctx, administrator.user.id);
            if (user) {
                const nativeAuthMethod = user.getNativeAuthenticationMethod();
                nativeAuthMethod.passwordHash = await this.passwordCipher.hash(input.password);
                await this.connection.getRepository(ctx, NativeAuthenticationMethod).save(nativeAuthMethod);
            }
        }

        const updatedAdministrator = await assertFound(this.findOne(ctx, administrator.id));

        // TODO getting error that the input has no customfields -- how did this work previously?
        // Previously the input also didnt specify (?)
        //
        // await this.customFieldRelationService.updateRelations(
        //     ctx,
        //     Administrator,
        //     input,
        //     updatedAdministrator,
        // );

        if (channelRolesToAdd.length > 0) {
            await this.eventBus.publish(
                new RoleChangeEvent(
                    ctx,
                    updatedAdministrator,
                    channelRolesToAdd.map(cr => cr.roleId),
                    'assigned',
                ),
            );
        }

        if (channelRolesToRemove.length > 0) {
            await this.eventBus.publish(
                new RoleChangeEvent(ctx, updatedAdministrator, channelRolesToRemove, 'removed'),
            );
        }

        await this.eventBus.publish(new AdministratorEvent(ctx, updatedAdministrator, 'updated', input));
        return updatedAdministrator;
    }

    /**
     * @description
     * Asserts that the active user is allowed to grant the specified Roles when creating or
     * updating an Administrator.
     *
     * @throws {UserInputError} If the active user does not have sufficient permissions
     */
    private async assertActiveUserCanGrantRoles(ctx: RequestContext, channelRoles: ChannelRoleInput[]) {
        if (!ctx.activeUserId)
            throw new UserInputError('error.active-user-does-not-have-sufficient-permissions');

        if (channelRoles.length === 0) return;

        // Retrieving the permissions to cross-check against the active user, because
        // said user may only grant permissions which they already have.
        const roles = await this.connection.getRepository(ctx, Role).find({
            select: { permissions: true },
            where: { id: In(channelRoles.map(cr => cr.roleId)) },
        });

        for (const channelRole of channelRoles) {
            // Someone could have provided a non-existing role-id, so we deny, in order to not leak existing role-ids
            const role = roles.find(r => idsAreEqual(r.id, channelRole.roleId));
            if (!role) throw new UserInputError('error.active-user-does-not-have-sufficient-permissions');

            if (
                (await this.roleService.userHasAllPermissionsOnChannel(
                    ctx,
                    channelRole.channelId,
                    role.permissions,
                )) === false
            ) {
                throw new UserInputError('error.active-user-does-not-have-sufficient-permissions');
            }
        }
    }

    /**
     * @description
     * Assigns roles to the Administrator's User entity on channels.
     */
    async assignRolesOnChannels(
        ctx: RequestContext,
        administratorId: ID,
        channelRoles: ChannelRoleInput[],
    ): Promise<Administrator> {
        const administrator = await this.findOne(ctx, administratorId, ['user']);
        if (!administrator) throw new EntityNotFoundError('Administrator', administratorId);

        // TODO concurrently instead of sequentially?
        // TODO unique constraints could be ignored
        for (const { channelId, roleId } of channelRoles) {
            await this.channelRoleService.create(ctx, { userId: administrator.user.id, channelId, roleId });
        }

        return administrator;
    }

    /**
     * @description
     * Soft deletes an Administrator (sets the `deletedAt` field).
     */
    async softDelete(ctx: RequestContext, id: ID) {
        const administrator = await this.connection.getEntityOrThrow(ctx, Administrator, id, {
            relations: ['user'],
        });
        const isSoleSuperadmin = await this.isSoleSuperadmin(ctx, id);
        if (isSoleSuperadmin) {
            throw new InternalServerError('error.cannot-delete-sole-superadmin');
        }
        await this.connection.getRepository(ctx, Administrator).update({ id }, { deletedAt: new Date() });
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        await this.userService.softDelete(ctx, administrator.user.id);
        await this.eventBus.publish(new AdministratorEvent(ctx, administrator, 'deleted', id));
        return {
            result: DeletionResult.DELETED,
        };
    }

    /**
     * @description
     * Resolves to `true` if the User ID belongs to the only User with SuperAdmin permissions.
     *
     * @argument superAdminRoleId The role ID with which to compare. If omitted retrieves ID itself.
     * Passing the ID manually can be useful to avoid fetching the ID multiple times.
     */
    private async isSoleSuperadmin(ctx: RequestContext, userId: ID, superAdminRoleId?: ID) {
        const roleId = superAdminRoleId ?? (await this.roleService.getSuperAdminRole(ctx)).id;
        const superUserIds = (
            await this.connection.getRepository(ctx, ChannelRole).find({
                select: ['userId'],
                where: { roleId },
            })
        ).map(cr => cr.userId);

        if (superUserIds.length === 1) {
            return idsAreEqual(superUserIds[0], userId);
        }

        return false;
    }

    /**
     * @description
     * There must always exist a SuperAdmin, otherwise full administration via API will
     * no longer be possible.
     *
     * @internal
     */
    private async ensureSuperAdminExists() {
        const { superadminCredentials } = this.configService.authOptions;

        const superAdminUser = await this.connection.rawConnection.getRepository(User).findOne({
            where: {
                identifier: superadminCredentials.identifier,
            },
        });

        if (!superAdminUser) {
            const ctx = await this.requestContextService.create({ apiType: 'admin' });
            const administrator = new Administrator({
                emailAddress: superadminCredentials.identifier,
                firstName: 'Super',
                lastName: 'Admin',
            });
            administrator.user = await this.userService.createAdminUser(
                ctx,
                superadminCredentials.identifier,
                superadminCredentials.password,
            );
            const { id } = await this.connection.getRepository(ctx, Administrator).save(administrator);
            const createdAdministrator = await assertFound(this.findOne(ctx, id, ['user']));

            const superAdminRole = await this.roleService.getSuperAdminRole();
            const defaultChannel = await this.channelService.getDefaultChannel();

            await this.channelRoleService.create(ctx, {
                userId: createdAdministrator.user.id,
                channelId: defaultChannel.id,
                roleId: superAdminRole.id,
            });
        } else {
            const superAdministrator = await this.connection.rawConnection
                .getRepository(Administrator)
                .findOne({
                    where: {
                        user: {
                            id: superAdminUser.id,
                        },
                    },
                });
            if (!superAdministrator) {
                const administrator = new Administrator({
                    emailAddress: superadminCredentials.identifier,
                    firstName: 'Super',
                    lastName: 'Admin',
                });
                const createdAdministrator = await this.connection.rawConnection
                    .getRepository(Administrator)
                    .save(administrator);
                createdAdministrator.user = superAdminUser;
                await this.connection.rawConnection.getRepository(Administrator).save(createdAdministrator);
            } else if (superAdministrator.deletedAt != null) {
                superAdministrator.deletedAt = null;
                await this.connection.rawConnection.getRepository(Administrator).save(superAdministrator);
            }

            if (superAdminUser.deletedAt != null) {
                superAdminUser.deletedAt = null;
                await this.connection.rawConnection.getRepository(User).save(superAdminUser);
            }
        }
    }
}
