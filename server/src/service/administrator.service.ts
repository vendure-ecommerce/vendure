import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { ID, PaginatedList } from 'shared/shared-types';
import { Connection } from 'typeorm';

import { SUPER_ADMIN_USER_IDENTIFIER, SUPER_ADMIN_USER_PASSWORD } from '../common/constants';
import { ListQueryOptions } from '../common/types/common-types';
import { CreateAdministratorDto } from '../entity/administrator/administrator.dto';
import { Administrator } from '../entity/administrator/administrator.entity';
import { User } from '../entity/user/user.entity';
import { I18nError } from '../i18n/i18n-error';

import { buildListQuery } from './helpers/build-list-query';
import { PasswordService } from './password.service';
import { RoleService } from './role.service';

@Injectable()
export class AdministratorService {
    constructor(
        @InjectConnection() private connection: Connection,
        private passwordService: PasswordService,
        private roleService: RoleService,
    ) {}

    async initAdministrators() {
        await this.ensureSuperAdminExists();
    }

    findAll(options: ListQueryOptions<Administrator>): Promise<PaginatedList<Administrator>> {
        return buildListQuery(this.connection, Administrator, options, ['user', 'user.roles'])
            .getManyAndCount()
            .then(([items, totalItems]) => ({
                items,
                totalItems,
            }));
    }

    findOne(administratorId: ID): Promise<Administrator | undefined> {
        return this.connection.manager.findOne(Administrator, administratorId, {
            relations: ['user', 'user.roles'],
        });
    }

    async create(createAdministratorDto: CreateAdministratorDto): Promise<Administrator> {
        const administrator = new Administrator(createAdministratorDto);

        const user = new User();
        user.passwordHash = await this.passwordService.hash(createAdministratorDto.password);
        user.identifier = createAdministratorDto.emailAddress;
        user.roles = [];

        const createdUser = await this.connection.manager.save(user);
        administrator.user = createdUser;

        return this.connection.manager.save(administrator);
    }

    /**
     * Assigns a Role to the Administrator's User entity.
     */
    async assignRole(administratorId: ID, roleId: ID): Promise<Administrator> {
        const administrator = await this.findOne(administratorId);
        if (!administrator) {
            throw new I18nError(`error.entity-with-id-not-found`, {
                id: administratorId,
                entityName: 'Administrator',
            });
        }
        const role = await this.roleService.findOne(roleId);
        if (!role) {
            throw new I18nError(`error.entity-with-id-not-found`, { id: roleId, entityName: 'Role' });
        }
        administrator.user.roles.push(role);
        await this.connection.manager.save(administrator.user);
        return administrator;
    }

    /**
     * There must always exist a SuperAdmin, otherwise full administration via API will
     * no longer be possible.
     */
    private async ensureSuperAdminExists() {
        const superAdminUser = await this.connection.getRepository(User).findOne({
            where: {
                identifier: SUPER_ADMIN_USER_IDENTIFIER,
            },
        });

        if (!superAdminUser) {
            const administrator = await this.create({
                emailAddress: SUPER_ADMIN_USER_IDENTIFIER,
                password: SUPER_ADMIN_USER_PASSWORD,
                firstName: 'Super',
                lastName: 'Admin',
            });
            await this.assignRole(administrator.id, (await this.roleService.getSuperAdminRole()).id);
        }
    }
}
