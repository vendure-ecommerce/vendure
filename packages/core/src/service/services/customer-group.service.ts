import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import {
    CreateCustomerGroupInput,
    CustomerGroupListOptions,
    CustomerListOptions,
    DeletionResponse,
    DeletionResult,
    HistoryEntryType,
    MutationAddCustomersToGroupArgs,
    MutationRemoveCustomersFromGroupArgs,
    UpdateCustomerGroupInput,
} from '@vendure/common/lib/generated-types';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { Connection } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { UserInputError } from '../../common/error/errors';
import { assertFound, idsAreEqual } from '../../common/utils';
import { CustomerGroup } from '../../entity/customer-group/customer-group.entity';
import { Customer } from '../../entity/customer/customer.entity';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { getEntityOrThrow } from '../helpers/utils/get-entity-or-throw';
import { patchEntity } from '../helpers/utils/patch-entity';

import { HistoryService } from './history.service';

@Injectable()
export class CustomerGroupService {
    constructor(
        @InjectConnection() private connection: Connection,
        private listQueryBuilder: ListQueryBuilder,
        private historyService: HistoryService,
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

    async create(ctx: RequestContext, input: CreateCustomerGroupInput): Promise<CustomerGroup> {
        const customerGroup = new CustomerGroup(input);

        const newCustomerGroup = await this.connection.getRepository(CustomerGroup).save(customerGroup);
        if (input.customerIds) {
            const customers = await this.getCustomersFromIds(input.customerIds);
            for (const customer of customers) {
                customer.groups = [...(customer.groups || []), newCustomerGroup];
                await this.historyService.createHistoryEntryForCustomer({
                    ctx,
                    customerId: customer.id,
                    type: HistoryEntryType.CUSTOMER_ADDED_TO_GROUP,
                    data: {
                        groupName: customerGroup.name,
                    },
                });
            }
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

    async addCustomersToGroup(
        ctx: RequestContext,
        input: MutationAddCustomersToGroupArgs,
    ): Promise<CustomerGroup> {
        const customers = await this.getCustomersFromIds(input.customerIds);
        const group = await getEntityOrThrow(this.connection, CustomerGroup, input.customerGroupId);
        for (const customer of customers) {
            if (!customer.groups.map((g) => g.id).includes(input.customerGroupId)) {
                customer.groups.push(group);
                await this.historyService.createHistoryEntryForCustomer({
                    ctx,
                    customerId: customer.id,
                    type: HistoryEntryType.CUSTOMER_ADDED_TO_GROUP,
                    data: {
                        groupName: group.name,
                    },
                });
            }
        }

        await this.connection.getRepository(Customer).save(customers, { reload: false });
        return assertFound(this.findOne(group.id));
    }

    async removeCustomersFromGroup(
        ctx: RequestContext,
        input: MutationRemoveCustomersFromGroupArgs,
    ): Promise<CustomerGroup> {
        const customers = await this.getCustomersFromIds(input.customerIds);
        const group = await getEntityOrThrow(this.connection, CustomerGroup, input.customerGroupId);
        for (const customer of customers) {
            if (!customer.groups.map((g) => g.id).includes(input.customerGroupId)) {
                throw new UserInputError('error.customer-does-not-belong-to-customer-group');
            }
            customer.groups = customer.groups.filter((g) => !idsAreEqual(g.id, group.id));
            await this.historyService.createHistoryEntryForCustomer({
                ctx,
                customerId: customer.id,
                type: HistoryEntryType.CUSTOMER_REMOVED_FROM_GROUP,
                data: {
                    groupName: group.name,
                },
            });
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
