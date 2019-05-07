import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import {
    MutationAddCustomersToGroupArgs,
    CreateCustomerGroupInput,
    MutationRemoveCustomersFromGroupArgs,
    UpdateCustomerGroupInput,
} from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { unique } from '@vendure/common/lib/unique';
import { Connection } from 'typeorm';

import { assertFound } from '../../common/utils';
import { CustomerGroup } from '../../entity/customer-group/customer-group.entity';
import { Customer } from '../../entity/customer/customer.entity';
import { getEntityOrThrow } from '../helpers/utils/get-entity-or-throw';
import { patchEntity } from '../helpers/utils/patch-entity';

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
        const customerGroup = await getEntityOrThrow(this.connection, CustomerGroup, input.id);
        const updatedCustomerGroup = patchEntity(customerGroup, input);
        await this.connection.getRepository(CustomerGroup).save(updatedCustomerGroup);
        return assertFound(this.findOne(customerGroup.id));
    }

    async addCustomersToGroup(input: MutationAddCustomersToGroupArgs): Promise<CustomerGroup> {
        const countries = await this.getCustomersFromIds(input.customerIds);
        const customerGroup = await getEntityOrThrow(this.connection, CustomerGroup, input.customerGroupId);
        const customers = unique(customerGroup.customers.concat(countries), 'id');
        customerGroup.customers = customers;
        await this.connection.getRepository(CustomerGroup).save(customerGroup);
        return customerGroup;
    }

    async removeCustomersFromGroup(input: MutationRemoveCustomersFromGroupArgs): Promise<CustomerGroup> {
        const customerGroup = await getEntityOrThrow(this.connection, CustomerGroup, input.customerGroupId);
        customerGroup.customers = customerGroup.customers.filter(
            customer => !input.customerIds.includes(customer.id as string),
        );
        await this.connection.getRepository(CustomerGroup).save(customerGroup);
        return customerGroup;
    }

    private getCustomersFromIds(ids: ID[]): Promise<Customer[]> {
        return this.connection.getRepository(Customer).findByIds(ids, { where: { deletedAt: null } });
    }
}
