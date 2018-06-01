import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { Connection } from 'typeorm';
import { AddressEntity } from '../../entity/address/address.entity';
import { Address } from '../../entity/address/address.interface';
import { CustomerEntity } from "../../entity/customer/customer.entity";
import { Customer } from "../../entity/customer/customer.interface";

@Injectable()
export class CustomerService {
    constructor(@InjectConnection() private connection: Connection) {}

    findAll(): Promise<Customer[]> {
        return this.connection.manager.find(CustomerEntity);
    }

    findOne(userId: number): Promise<Customer> {
        return this.connection.manager.findOne(CustomerEntity, userId);
    }

    findAddressesByCustomerId(customerId: number): Promise<Address[]> {
        return this.connection
            .getRepository(AddressEntity)
            .createQueryBuilder('address')
            .where('address.customerId = :id', { id: customerId })
            .getMany();
    }
}
