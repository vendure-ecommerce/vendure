import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { ID, PaginatedList } from 'shared/shared-types';
import { Connection } from 'typeorm';

import { PasswordService } from '../auth/password.service';
import { Role } from '../auth/role';
import { buildListQuery } from '../common/build-list-query';
import { ListQueryOptions } from '../common/common-types';
import { CreateAddressDto } from '../entity/address/address.dto';
import { Address } from '../entity/address/address.entity';
import { CreateCustomerDto } from '../entity/customer/customer.dto';
import { Customer } from '../entity/customer/customer.entity';
import { User } from '../entity/user/user.entity';
import { I18nError } from '../i18n/i18n-error';

@Injectable()
export class CustomerService {
    constructor(
        @InjectConnection() private connection: Connection,
        private passwordService: PasswordService,
    ) {}

    findAll(options: ListQueryOptions<Customer>): Promise<PaginatedList<Customer>> {
        return buildListQuery(this.connection, Customer, options)
            .getManyAndCount()
            .then(([items, totalItems]) => ({ items, totalItems }));
    }

    findOne(userId: string): Promise<Customer | undefined> {
        return this.connection.manager.findOne(Customer, userId);
    }

    findAddressesByCustomerId(customerId: ID): Promise<Address[]> {
        return this.connection
            .getRepository(Address)
            .createQueryBuilder('address')
            .where('address.customerId = :id', { id: customerId })
            .getMany();
    }

    async create(createCustomerDto: CreateCustomerDto, password?: string): Promise<Customer> {
        const customer = new Customer(createCustomerDto);

        if (password) {
            const user = new User();
            user.passwordHash = await this.passwordService.hash(password);
            user.identifier = createCustomerDto.emailAddress;
            user.roles = [Role.Customer];
            const createdUser = await this.connection.getRepository(User).save(user);
            customer.user = createdUser;
        }

        return this.connection.getRepository(Customer).save(customer);
    }

    async createAddress(customerId: string, createAddressDto: CreateAddressDto): Promise<Address> {
        const customer = await this.connection.manager.findOne(Customer, customerId, {
            relations: ['addresses'],
        });

        if (!customer) {
            throw new I18nError('error.entity-with-id-not-found', { entityName: 'Customer', id: customerId });
        }

        const address = new Address(createAddressDto);

        const createdAddress = await this.connection.manager.getRepository(Address).save(address);

        customer.addresses.push(createdAddress);
        await this.connection.manager.save(customer);

        return createdAddress;
    }
}
