import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import {
    AddCustomersToGroupMutationArgs,
    CreateCustomerGroupInput,
    RemoveCustomersFromGroupMutationArgs,
    UpdateCustomerGroupInput,
} from 'shared/generated-types';
import { ID } from 'shared/shared-types';
import { unique } from 'shared/unique';
import { Connection } from 'typeorm';

import { assertFound } from '../../common/utils';
import { CustomerGroup } from '../../entity/customer-group/customer-group.entity';
import { Customer } from '../../entity/customer/customer.entity';
import { I18nError } from '../../i18n/i18n-error';
import { patchEntity } from '../helpers/patch-entity';

@Injectable()
export class CustomerGroupService {
    constructor(@InjectConnection() private connection: Connection) {}

    findAll(): Promise<CustomerGroup[]> {
        return this.connection.getRepository(CustomerGroup).find({});
    }

    findOne(customerGroupId: ID): Promise<CustomerGroup | undefined> {
        return this.connection.getRepository(CustomerGroup).findOne(customerGroupId);
    }

    async create(input: CreateCustomerGroupInput): Promise<CustomerGroup> {
        const customerGroup = new CustomerGroup(input);
        if (input.customerIds) {
            customerGroup.customers = await this.getCustomersFromIds(input.customerIds);
        }
        const newCustomerGroup = await this.connection.getRepository(CustomerGroup).save(customerGroup);
        return assertFound(this.findOne(newCustomerGroup.id));
    }

    async update(input: UpdateCustomerGroupInput): Promise<CustomerGroup> {
        const customerGroup = await this.getCustomerGroupOrThrow(input.id);
        const updatedCustomerGroup = patchEntity(customerGroup, input);
        await this.connection.getRepository(CustomerGroup).save(updatedCustomerGroup);
        return assertFound(this.findOne(customerGroup.id));
    }

    async addCustomersToGroup(input: AddCustomersToGroupMutationArgs): Promise<CustomerGroup> {
        const countries = await this.getCustomersFromIds(input.customerIds);
        const customerGroup = await this.getCustomerGroupOrThrow(input.customerGroupId);
        const customers = unique(customerGroup.customers.concat(countries), 'id');
        customerGroup.customers = customers;
        await this.connection.getRepository(CustomerGroup).save(customerGroup);
        return customerGroup;
    }

    async removeCustomersFromGroup(input: RemoveCustomersFromGroupMutationArgs): Promise<CustomerGroup> {
        const customerGroup = await this.getCustomerGroupOrThrow(input.customerGroupId);
        customerGroup.customers = customerGroup.customers.filter(
            customer => !input.customerIds.includes(customer.id as string),
        );
        await this.connection.getRepository(CustomerGroup).save(customerGroup);
        return customerGroup;
    }

    private async getCustomerGroupOrThrow(id: ID): Promise<CustomerGroup> {
        const customerGroup = await this.findOne(id);
        if (!customerGroup) {
            throw new I18nError(`error.entity-with-id-not-found`, { entityName: 'CustomerGroup', id });
        }
        return customerGroup;
    }

    private getCustomersFromIds(ids: ID[]): Promise<Customer[]> {
        return this.connection.getRepository(Customer).findByIds(ids);
    }
}
