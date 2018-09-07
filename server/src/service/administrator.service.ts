import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { ID, PaginatedList } from 'shared/shared-types';
import { Connection } from 'typeorm';

import { ListQueryOptions } from '../common/types/common-types';
import { CreateAdministratorDto } from '../entity/administrator/administrator.dto';
import { Administrator } from '../entity/administrator/administrator.entity';
import { User } from '../entity/user/user.entity';

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

    findAll(options: ListQueryOptions<Administrator>): Promise<PaginatedList<Administrator>> {
        return buildListQuery(this.connection, Administrator, options, ['user', 'user.roles'])
            .getManyAndCount()
            .then(([items, totalItems]) => ({
                items,
                totalItems,
            }));
    }

    findOne(administratorId: ID): Promise<Administrator | undefined> {
        return this.connection.manager.findOne(Administrator, administratorId);
    }

    async create(createAdministratorDto: CreateAdministratorDto): Promise<Administrator> {
        const administrator = new Administrator(createAdministratorDto);

        const user = new User();
        user.passwordHash = await this.passwordService.hash(createAdministratorDto.password);
        user.identifier = createAdministratorDto.emailAddress;
        // TODO: for now all Admins are added to the SuperAdmin role.
        // It should be possible to add them to other roles.
        user.roles = [await this.roleService.getSuperAdminRole()];

        const createdUser = await this.connection.manager.save(user);
        administrator.user = createdUser;

        return this.connection.manager.save(administrator);
    }
}
