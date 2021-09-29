import { Injectable } from '@nestjs/common';
import {
    CreateAdministratorInput,
    DeletionResult,
    UpdateAdministratorInput,
} from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api/common/request-context';
import { EntityNotFoundError } from '../../common/error/errors';
import { ListQueryOptions } from '../../common/types/common-types';
import { ConfigService } from '../../config';
import { Administrator } from '../../entity/administrator/administrator.entity';
import { NativeAuthenticationMethod } from '../../entity/authentication-method/native-authentication-method.entity';
import { User } from '../../entity/user/user.entity';
import { CustomFieldRelationService } from '../helpers/custom-field-relation/custom-field-relation.service';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { PasswordCipher } from '../helpers/password-cipher/password-cipher';
import { patchEntity } from '../helpers/utils/patch-entity';
import { TransactionalConnection } from '../transaction/transactional-connection';

import { RoleService } from './role.service';
import { UserService } from './user.service';

@Injectable()
export class AdministratorService {
    constructor(
        private connection: TransactionalConnection,
        private configService: ConfigService,
        private listQueryBuilder: ListQueryBuilder,
        private passwordCipher: PasswordCipher,
        private userService: UserService,
        private roleService: RoleService,
        private customFieldRelationService: CustomFieldRelationService,
    ) {}

    async initAdministrators() {
        await this.ensureSuperAdminExists();
    }

    findAll(
        ctx: RequestContext,
        options?: ListQueryOptions<Administrator>,
    ): Promise<PaginatedList<Administrator>> {
        return this.listQueryBuilder
            .build(Administrator, options, {
                relations: ['user', 'user.roles'],
                where: { deletedAt: null },
                ctx,
            })
            .getManyAndCount()
            .then(([items, totalItems]) => ({
                items,
                totalItems,
            }));
    }

    findOne(ctx: RequestContext, administratorId: ID): Promise<Administrator | undefined> {
        return this.connection.getRepository(ctx, Administrator).findOne(administratorId, {
            relations: ['user', 'user.roles'],
            where: {
                deletedAt: null,
            },
        });
    }

    findOneByUserId(ctx: RequestContext, userId: ID): Promise<Administrator | undefined> {
        return this.connection.getRepository(ctx, Administrator).findOne({
            where: {
                user: { id: userId },
                deletedAt: null,
            },
        });
    }

    async create(ctx: RequestContext, input: CreateAdministratorInput): Promise<Administrator> {
        const administrator = new Administrator(input);
        administrator.user = await this.userService.createAdminUser(ctx, input.emailAddress, input.password);
        let createdAdministrator = await this.connection
            .getRepository(ctx, Administrator)
            .save(administrator);
        for (const roleId of input.roleIds) {
            createdAdministrator = await this.assignRole(ctx, createdAdministrator.id, roleId);
        }
        await this.customFieldRelationService.updateRelations(
            ctx,
            Administrator,
            input,
            createdAdministrator,
        );
        return createdAdministrator;
    }

    async update(ctx: RequestContext, input: UpdateAdministratorInput): Promise<Administrator> {
        const administrator = await this.findOne(ctx, input.id);
        if (!administrator) {
            throw new EntityNotFoundError('Administrator', input.id);
        }
        let updatedAdministrator = patchEntity(administrator, input);
        await this.connection.getRepository(ctx, Administrator).save(administrator, { reload: false });

        if (input.emailAddress) {
            updatedAdministrator.user.identifier = input.emailAddress;
            await this.connection.getRepository(ctx, User).save(updatedAdministrator.user);
        }
        if (input.password) {
            const user = await this.userService.getUserById(ctx, administrator.user.id);
            if (user) {
                const nativeAuthMethod = user.getNativeAuthenticationMethod();
                nativeAuthMethod.passwordHash = await this.passwordCipher.hash(input.password);
                await this.connection.getRepository(ctx, NativeAuthenticationMethod).save(nativeAuthMethod);
            }
        }
        if (input.roleIds) {
            administrator.user.roles = [];
            await this.connection.getRepository(ctx, User).save(administrator.user, { reload: false });
            for (const roleId of input.roleIds) {
                updatedAdministrator = await this.assignRole(ctx, administrator.id, roleId);
            }
        }
        await this.customFieldRelationService.updateRelations(
            ctx,
            Administrator,
            input,
            updatedAdministrator,
        );
        return updatedAdministrator;
    }

    /**
     * Assigns a Role to the Administrator's User entity.
     */
    async assignRole(ctx: RequestContext, administratorId: ID, roleId: ID): Promise<Administrator> {
        const administrator = await this.findOne(ctx, administratorId);
        if (!administrator) {
            throw new EntityNotFoundError('Administrator', administratorId);
        }
        const role = await this.roleService.findOne(ctx, roleId);
        if (!role) {
            throw new EntityNotFoundError('Role', roleId);
        }
        administrator.user.roles.push(role);
        await this.connection.getRepository(ctx, User).save(administrator.user, { reload: false });
        return administrator;
    }

    async softDelete(ctx: RequestContext, id: ID) {
        const administrator = await this.connection.getEntityOrThrow(ctx, Administrator, id, {
            relations: ['user'],
        });
        await this.connection.getRepository(ctx, Administrator).update({ id }, { deletedAt: new Date() });
        // tslint:disable-next-line:no-non-null-assertion
        await this.userService.softDelete(ctx, administrator.user!.id);
        return {
            result: DeletionResult.DELETED,
        };
    }

    /**
     * There must always exist a SuperAdmin, otherwise full administration via API will
     * no longer be possible.
     */
    private async ensureSuperAdminExists() {
        const { superadminCredentials } = this.configService.authOptions;

        const superAdminUser = await this.connection.getRepository(User).findOne({
            where: {
                identifier: superadminCredentials.identifier,
            },
        });

        if (!superAdminUser) {
            const superAdminRole = await this.roleService.getSuperAdminRole();
            const administrator = await this.create(RequestContext.empty(), {
                emailAddress: superadminCredentials.identifier,
                password: superadminCredentials.password,
                firstName: 'Super',
                lastName: 'Admin',
                roleIds: [superAdminRole.id],
            });
        }
    }
}
