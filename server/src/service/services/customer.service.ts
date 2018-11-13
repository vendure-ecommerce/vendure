import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import {
    CreateAddressInput,
    CreateCustomerInput,
    UpdateAddressInput,
    UpdateCustomerInput,
} from 'shared/generated-types';
import { ID, PaginatedList } from 'shared/shared-types';
import { Connection } from 'typeorm';

import { ListQueryOptions } from '../../common/types/common-types';
import { assertFound, normalizeEmailAddress } from '../../common/utils';
import { Address } from '../../entity/address/address.entity';
import { Customer } from '../../entity/customer/customer.entity';
import { I18nError } from '../../i18n/i18n-error';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { getEntityOrThrow } from '../helpers/utils/get-entity-or-throw';
import { patchEntity } from '../helpers/utils/patch-entity';

import { UserService } from './user.service';

@Injectable()
export class CustomerService {
    constructor(
        @InjectConnection() private connection: Connection,
        private userService: UserService,
        private listQueryBuilder: ListQueryBuilder,
    ) {}

    findAll(options: ListQueryOptions<Customer> | undefined): Promise<PaginatedList<Customer>> {
        return this.listQueryBuilder
            .build(Customer, options)
            .getManyAndCount()
            .then(([items, totalItems]) => ({ items, totalItems }));
    }

    findOne(id: ID): Promise<Customer | undefined> {
        return this.connection.getRepository(Customer).findOne(id);
    }

    findOneByUserId(userId: ID): Promise<Customer | undefined> {
        return this.connection.getRepository(Customer).findOne({
            where: {
                user: { id: userId },
            },
        });
    }

    findAddressesByCustomerId(customerId: ID): Promise<Address[]> {
        return this.connection
            .getRepository(Address)
            .createQueryBuilder('address')
            .where('address.customerId = :id', { id: customerId })
            .getMany();
    }

    async create(input: CreateCustomerInput, password?: string): Promise<Customer> {
        input.emailAddress = normalizeEmailAddress(input.emailAddress);
        const customer = new Customer(input);

        const existing = await this.connection.getRepository(Customer).findOne({
            where: {
                emailAddress: input.emailAddress,
            },
        });

        if (existing) {
            throw new I18nError(`error.email-address-must-be-unique`);
        }

        if (password) {
            customer.user = await this.userService.createCustomerUser(input.emailAddress, password);
        }
        return this.connection.getRepository(Customer).save(customer);
    }

    async update(input: UpdateCustomerInput): Promise<Customer> {
        const customer = await getEntityOrThrow(this.connection, Customer, input.id);
        const updatedCustomer = patchEntity(customer, input);
        await this.connection.getRepository(Customer).save(customer);
        return assertFound(this.findOne(customer.id));
    }

    /**
     * For guest checkouts, we assume that a matching email address is the same customer.
     */
    async createOrUpdate(input: CreateCustomerInput): Promise<Customer> {
        input.emailAddress = normalizeEmailAddress(input.emailAddress);
        let customer: Customer;
        const existing = await this.connection.getRepository(Customer).findOne({
            where: {
                emailAddress: input.emailAddress,
            },
        });
        if (existing) {
            customer = patchEntity(existing, input);
        } else {
            customer = new Customer(input);
        }
        return this.connection.getRepository(Customer).save(customer);
    }

    async createAddress(customerId: string, input: CreateAddressInput): Promise<Address> {
        const customer = await this.connection.manager.findOne(Customer, customerId, {
            relations: ['addresses'],
        });

        if (!customer) {
            throw new I18nError('error.entity-with-id-not-found', { entityName: 'Customer', id: customerId });
        }

        const address = new Address(input);
        const createdAddress = await this.connection.manager.getRepository(Address).save(address);
        customer.addresses.push(createdAddress);
        await this.connection.manager.save(customer);
        return createdAddress;
    }

    async updateAddress(input: UpdateAddressInput): Promise<Address> {
        const address = await getEntityOrThrow(this.connection, Address, input.id);
        const updatedAddress = patchEntity(address, input);
        await this.connection.getRepository(Address).save(updatedAddress);
        return updatedAddress;
    }
}
