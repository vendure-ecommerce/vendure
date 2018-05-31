import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { User } from '../entities/User';
import { Address } from '../entities/Address';

@Injectable()
export class UserService {
    constructor(@InjectConnection() private connection: Connection) {}

    findAll(): Promise<User[]> {
        return this.connection.manager.find(User);
    }

    findOne(userId: number): Promise<User> {
        return this.connection.manager.findOne(User, userId);
    }

    findAddressesByUserId(userId: number): Promise<Address[]> {
        return this.connection
            .getRepository(Address)
            .createQueryBuilder('address')
            .where('address.userId = :id', { id: userId })
            .getMany();
    }
}
