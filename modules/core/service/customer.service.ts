import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { Address } from '../entity/address/address.entity';
import { Customer } from '../entity/customer/customer.entity';

@Injectable()
export class CustomerService {
    constructor(@InjectConnection() private connection: Connection) {}

    findAll(): Promise<Customer[]> {
        return this.connection.manager.find(Customer);
    }

    findOne(userId: number): Promise<Customer | undefined> {
        return this.connection.manager.findOne(Customer, userId);
    }

    findAddressesByCustomerId(customerId: number): Promise<Address[]> {
        return this.connection
            .getRepository(Address)
            .createQueryBuilder('address')
            .where('address.customerId = :id', { id: customerId })
            .getMany();
    }
}
