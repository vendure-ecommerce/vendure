import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { UserEntity } from '../../entity/user/user.entity';
import { AddressEntity } from '../../entity/address/address.entity';
import { User } from '../../entity/user/user.interface';
import { Address } from '../../entity/address/address.interface';

@Injectable()
export class UserService {
    constructor(@InjectConnection() private connection: Connection) {}

    findAll(): Promise<User[]> {
        return this.connection.manager.find(UserEntity);
    }

    findOne(userId: number): Promise<User> {
        return this.connection.manager.findOne(UserEntity, userId);
    }

    findAddressesByUserId(userId: number): Promise<Address[]> {
        return this.connection
            .getRepository(AddressEntity)
            .createQueryBuilder('address')
            .where('address.userId = :id', { id: userId })
            .getMany();
    }
}
