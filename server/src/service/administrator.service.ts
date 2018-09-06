import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';

import { CreateAdministratorDto } from '../entity/administrator/administrator.dto';
import { Administrator } from '../entity/administrator/administrator.entity';
import { User } from '../entity/user/user.entity';

import { PasswordService } from './password.service';
import { RoleService } from './role.service';

@Injectable()
export class AdministratorService {
    constructor(
        @InjectConnection() private connection: Connection,
        private passwordService: PasswordService,
        private roleService: RoleService,
    ) {}

    findAll(): Promise<Administrator[]> {
        return this.connection.manager.find(Administrator);
    }

    findOne(administratorId: string): Promise<Administrator | undefined> {
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
