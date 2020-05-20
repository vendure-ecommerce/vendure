import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import {
    CreateCustomerGroupInput,
    CustomerGroupListOptions,
    CustomerListOptions,
    DeletionResponse,
    DeletionResult,
    MutationAddCustomersToGroupArgs,
    MutationRemoveCustomersFromGroupArgs,
    UpdateCustomerGroupInput,
} from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { Connection } from 'typeorm';

import { UserInputError } from '../../common/error/errors';
import { assertFound, idsAreEqual } from '../../common/utils';
import { CustomerGroup } from '../../entity/customer-group/customer-group.entity';
import { Customer } from '../../entity/customer/customer.entity';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { getEntityOrThrow } from '../helpers/utils/get-entity-or-throw';
import { patchEntity } from '../helpers/utils/patch-entity';

@Injectable()
export class CustomerGroupService {
    constructor(
        @InjectConnection() private connection: Connection,
        private listQueryBuilder: ListQueryBuilder,
    ) {}

    findAll(options?: CustomerGroupListOptions): Promise<PaginatedList<CustomerGroup>> {
        return this.listQueryBuilder
            .build(CustomerGroup, options)
            .getManyAndCount()
            .then(([items, totalItems]) => ({ items, totalItems }));
    }

    findOne(customerGroupId: ID): Promise<CustomerGroup | undefined> {
        return this.connection.getRepository(CustomerGroup).findOne(customerGroupId);
    }

    getGroupCustomers(customerGroupId: ID, options?: CustomerListOptions): Promise<PaginatedList<Customer>> {
        return this.listQueryBuilder
            .build(Customer, options)
            .leftJoin('customer.groups', 'group')
            .andWhere('group.id = :groupId', { groupId: customerGroupId })
            .getManyAndCount()
            .then(([items, totalItems]) => ({ items, totalItems }));
    }

    async create(input: CreateCustomerGroupInput): Promise<CustomerGroup> {
        const customerGroup = new CustomerGroup(input);

        const newCustomerGroup = await this.connection.getRepository(CustomerGroup).save(customerGroup);
        if (input.customerIds) {
            const customers = await this.getCustomersFromIds(input.customerIds);
            customers.forEach((c) => (c.groups = [...(c.groups || []), newCustomerGroup]));
            await this.connection.getRepository(Customer).save(customers);
        }
        return assertFound(this.findOne(newCustomerGroup.id));
    }

    async update(input: UpdateCustomerGroupInput): Promise<CustomerGroup> {
        const customerGroup = await getEntityOrThrow(this.connection, CustomerGroup, input.id);
        const updatedCustomerGroup = patchEntity(customerGroup, input);
        await this.connection.getRepository(CustomerGroup).save(updatedCustomerGroup, { reload: false });
        return assertFound(this.findOne(customerGroup.id));
    }

    async delete(id: ID): Promise<DeletionResponse> {
        const group = await getEntityOrThrow(this.connection, CustomerGroup, id);
        try {
            await this.connection.getRepository(CustomerGroup).remove(group);
            return {
                result: DeletionResult.DELETED,
            };
        } catch (e) {
            return {
                result: DeletionResult.NOT_DELETED,
                message: e.message,
            };
        }
    }

    async addCustomersToGroup(input: MutationAddCustomersToGroupArgs): Promise<CustomerGroup> {
        const customers = await this.getCustomersFromIds(input.customerIds);
        const group = await getEntityOrThrow(this.connection, CustomerGroup, input.customerGroupId);
        for (const customer of customers) {
            if (!customer.groups.map((g) => g.id).includes(input.customerGroupId)) {
                customer.groups.push(group);
            }
        }
        await this.connection.getRepository(Customer).save(customers, { reload: false });
        return assertFound(this.findOne(group.id));
    }

    async removeCustomersFromGroup(input: MutationRemoveCustomersFromGroupArgs): Promise<CustomerGroup> {
        const customers = await this.getCustomersFromIds(input.customerIds);
        const group = await getEntityOrThrow(this.connection, CustomerGroup, input.customerGroupId);
        for (const customer of customers) {
            if (!customer.groups.map((g) => g.id).includes(input.customerGroupId)) {
                throw new UserInputError('error.customer-does-not-belong-to-customer-group');
            }
            customer.groups = customer.groups.filter((g) => !idsAreEqual(g.id, group.id));
        }
        await this.connection.getRepository(Customer).save(customers, { reload: false });
        return assertFound(this.findOne(group.id));
    }

    private getCustomersFromIds(ids: ID[]): Promise<Customer[]> {
        return this.connection
            .getRepository(Customer)
            .findByIds(ids, { where: { deletedAt: null }, relations: ['groups'] });
    }
}
