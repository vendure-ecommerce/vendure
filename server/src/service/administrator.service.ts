import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { PasswordService } from '../auth/password.service';
import { Role } from '../auth/role';
import { CreateAdministratorDto } from '../entity/administrator/administrator.dto';
import { Administrator } from '../entity/administrator/administrator.entity';
import { User } from '../entity/user/user.entity';

@Injectable()
export class AdministratorService {
    constructor(@InjectConnection() private connection: Connection, private passwordService: PasswordService) {}

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
        user.roles = [Role.Superadmin];
        const createdUser = await this.connection.getRepository(User).save(user);
        administrator.user = createdUser;

        return this.connection.getRepository(Administrator).save(administrator);
    }
}
