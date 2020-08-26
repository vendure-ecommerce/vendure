import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import {
    CreateAdministratorInput,
    DeletionResult,
    UpdateAdministratorInput,
} from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { Connection } from 'typeorm';

import { EntityNotFoundError } from '../../common/error/errors';
import { ListQueryOptions } from '../../common/types/common-types';
import { ConfigService } from '../../config';
import { Administrator } from '../../entity/administrator/administrator.entity';
import { User } from '../../entity/user/user.entity';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { PasswordCiper } from '../helpers/password-cipher/password-ciper';
import { getEntityOrThrow } from '../helpers/utils/get-entity-or-throw';
import { patchEntity } from '../helpers/utils/patch-entity';

import { RoleService } from './role.service';
import { UserService } from './user.service';

@Injectable()
export class AdministratorService {
    constructor(
        @InjectConnection() private connection: Connection,
        private configService: ConfigService,
        private listQueryBuilder: ListQueryBuilder,
        private passwordCipher: PasswordCiper,
        private userService: UserService,
        private roleService: RoleService,
    ) {}

    async initAdministrators() {
        await this.ensureSuperAdminExists();
    }

    findAll(options?: ListQueryOptions<Administrator>): Promise<PaginatedList<Administrator>> {
        return this.listQueryBuilder
            .build(Administrator, options, { relations: ['user', 'user.roles'], where: { deletedAt: null } })
            .getManyAndCount()
            .then(([items, totalItems]) => ({
                items,
                totalItems,
            }));
    }

    findOne(administratorId: ID): Promise<Administrator | undefined> {
        return this.connection.manager.findOne(Administrator, administratorId, {
            relations: ['user', 'user.roles'],
            where: {
                deletedAt: null,
            },
        });
    }

    findOneByUserId(userId: ID): Promise<Administrator | undefined> {
        return this.connection.getRepository(Administrator).findOne({
            where: {
                user: { id: userId },
                deletedAt: null,
            },
        });
    }

    async create(input: CreateAdministratorInput): Promise<Administrator> {
        const administrator = new Administrator(input);
        administrator.user = await this.userService.createAdminUser(input.emailAddress, input.password);
        let createdAdministrator = await this.connection.manager.save(administrator);
        for (const roleId of input.roleIds) {
            createdAdministrator = await this.assignRole(createdAdministrator.id, roleId);
        }
        return createdAdministrator;
    }

    async update(input: UpdateAdministratorInput): Promise<Administrator> {
        const administrator = await this.findOne(input.id);
        if (!administrator) {
            throw new EntityNotFoundError('Administrator', input.id);
        }
        let updatedAdministrator = patchEntity(administrator, input);
        await this.connection.manager.save(administrator, { reload: false });

        if (input.password) {
            const user = await this.userService.getUserById(administrator.user.id);
            if (user) {
                const nativeAuthMethod = user.getNativeAuthenticationMethod();
                nativeAuthMethod.passwordHash = await this.passwordCipher.hash(input.password);
                await this.connection.manager.save(nativeAuthMethod);
            }
        }
        if (input.roleIds) {
            administrator.user.roles = [];
            await this.connection.manager.save(administrator.user, { reload: false });
            for (const roleId of input.roleIds) {
                updatedAdministrator = await this.assignRole(administrator.id, roleId);
            }
        }
        return updatedAdministrator;
    }

    /**
     * Assigns a Role to the Administrator's User entity.
     */
    async assignRole(administratorId: ID, roleId: ID): Promise<Administrator> {
        const administrator = await this.findOne(administratorId);
        if (!administrator) {
            throw new EntityNotFoundError('Administrator', administratorId);
        }
        const role = await this.roleService.findOne(roleId);
        if (!role) {
            throw new EntityNotFoundError('Role', roleId);
        }
        administrator.user.roles.push(role);
        await this.connection.manager.save(administrator.user, { reload: false });
        return administrator;
    }

    async softDelete(id: ID) {
        const administrator = await getEntityOrThrow(this.connection, Administrator, id, {
            relations: ['user'],
        });
        await this.connection.getRepository(Administrator).update({ id }, { deletedAt: new Date() });
        // tslint:disable-next-line:no-non-null-assertion
        await this.userService.softDelete(administrator.user!.id);
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
            const administrator = await this.create({
                emailAddress: superadminCredentials.identifier,
                password: superadminCredentials.password,
                firstName: 'Super',
                lastName: 'Admin',
                roleIds: [superAdminRole.id],
            });
        }
    }
}
