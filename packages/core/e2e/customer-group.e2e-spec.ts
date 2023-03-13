import { pick } from '@vendure/common/lib/pick';
import { createTestEnvironment } from '@vendure/testing';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import * as Codegen from './graphql/generated-e2e-admin-types';
import { HistoryEntryType } from './graphql/generated-e2e-admin-types';
import { DeletionResult } from './graphql/generated-e2e-shop-types';
import {
    ADD_CUSTOMERS_TO_GROUP,
    CREATE_CUSTOMER_GROUP,
    DELETE_CUSTOMER,
    DELETE_CUSTOMER_GROUP,
    GET_CUSTOMER_GROUP,
    GET_CUSTOMER_GROUPS,
    GET_CUSTOMER_HISTORY,
    GET_CUSTOMER_LIST,
    GET_CUSTOMER_WITH_GROUPS,
    REMOVE_CUSTOMERS_FROM_GROUP,
    UPDATE_CUSTOMER_GROUP,
} from './graphql/shared-definitions';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';
import { sortById } from './utils/test-order-utils';

describe('CustomerGroup resolver', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(testConfig());

    let customers: Codegen.GetCustomerListQuery['customers']['items'];

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
            customerCount: 5,
        });
        await adminClient.asSuperAdmin();
        const result = await adminClient.query<Codegen.GetCustomerListQuery>(GET_CUSTOMER_LIST);
        customers = result.customers.items;
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('create', async () => {
        const { createCustomerGroup } = await adminClient.query<
            Codegen.CreateCustomerGroupMutation,
            Codegen.CreateCustomerGroupMutationVariables
        >(CREATE_CUSTOMER_GROUP, {
            input: {
                name: 'group 1',
                customerIds: [customers[0].id, customers[1].id],
            },
        });

        expect(createCustomerGroup.name).toBe('group 1');
        expect(createCustomerGroup.customers.items.sort(sortById)).toEqual([
            { id: customers[0].id },
            { id: customers[1].id },
        ]);
    });

    it('history entry for CUSTOMER_ADDED_TO_GROUP after group created', async () => {
        const { customer } = await adminClient.query<
            Codegen.GetCustomerHistoryQuery,
            Codegen.GetCustomerHistoryQueryVariables
        >(GET_CUSTOMER_HISTORY, {
            id: customers[0].id,
            options: {
                skip: 3,
            },
        });

        expect(customer?.history.items.map(pick(['type', 'data']))).toEqual([
            {
                type: HistoryEntryType.CUSTOMER_ADDED_TO_GROUP,
                data: {
                    groupName: 'group 1',
                },
            },
        ]);
    });

    it('customerGroups', async () => {
        const { customerGroups } = await adminClient.query<
            Codegen.GetCustomerGroupsQuery,
            Codegen.GetCustomerGroupsQueryVariables
        >(GET_CUSTOMER_GROUPS, {
            options: {},
        });

        expect(customerGroups.totalItems).toBe(1);
        expect(customerGroups.items[0].name).toBe('group 1');
    });

    it('customerGroup with customer list options', async () => {
        const { customerGroup } = await adminClient.query<
            Codegen.GetCustomerGroupQuery,
            Codegen.GetCustomerGroupQueryVariables
        >(GET_CUSTOMER_GROUP, {
            id: 'T_1',
            options: {
                take: 1,
            },
        });

        expect(customerGroup?.id).toBe('T_1');
        expect(customerGroup?.name).toBe('group 1');
        expect(customerGroup?.customers.items.length).toBe(1);
        expect(customerGroup?.customers.totalItems).toBe(2);
    });

    it('update', async () => {
        const { updateCustomerGroup } = await adminClient.query<
            Codegen.UpdateCustomerGroupMutation,
            Codegen.UpdateCustomerGroupMutationVariables
        >(UPDATE_CUSTOMER_GROUP, {
            input: {
                id: 'T_1',
                name: 'group 1 updated',
            },
        });

        expect(updateCustomerGroup.name).toBe('group 1 updated');
    });

    it('addCustomersToGroup with existing customer', async () => {
        const { addCustomersToGroup } = await adminClient.query<
            Codegen.AddCustomersToGroupMutation,
            Codegen.AddCustomersToGroupMutationVariables
        >(ADD_CUSTOMERS_TO_GROUP, {
            groupId: 'T_1',
            customerIds: [customers[0].id],
        });
        expect(addCustomersToGroup.customers.items.sort(sortById)).toEqual([
            { id: customers[0].id },
            { id: customers[1].id },
        ]);
    });

    it('addCustomersToGroup with new customers', async () => {
        const { addCustomersToGroup } = await adminClient.query<
            Codegen.AddCustomersToGroupMutation,
            Codegen.AddCustomersToGroupMutationVariables
        >(ADD_CUSTOMERS_TO_GROUP, {
            groupId: 'T_1',
            customerIds: [customers[2].id, customers[3].id],
        });

        expect(addCustomersToGroup.customers.items.sort(sortById)).toEqual([
            { id: customers[0].id },
            { id: customers[1].id },
            { id: customers[2].id },
            { id: customers[3].id },
        ]);
    });

    it('history entry for CUSTOMER_ADDED_TO_GROUP not duplicated', async () => {
        const { customer } = await adminClient.query<
            Codegen.GetCustomerHistoryQuery,
            Codegen.GetCustomerHistoryQueryVariables
        >(GET_CUSTOMER_HISTORY, {
            id: customers[0].id,
            options: {
                filter: {
                    type: { eq: HistoryEntryType.CUSTOMER_ADDED_TO_GROUP },
                },
            },
        });

        expect(customer?.history.items.map(pick(['type', 'data']))).toEqual([
            {
                type: HistoryEntryType.CUSTOMER_ADDED_TO_GROUP,
                data: {
                    groupName: 'group 1',
                },
            },
        ]);
    });

    it('history entry for CUSTOMER_ADDED_TO_GROUP after customer added', async () => {
        const { customer } = await adminClient.query<
            Codegen.GetCustomerHistoryQuery,
            Codegen.GetCustomerHistoryQueryVariables
        >(GET_CUSTOMER_HISTORY, {
            id: customers[2].id,
            options: {
                skip: 3,
            },
        });

        expect(customer?.history.items.map(pick(['type', 'data']))).toEqual([
            {
                type: HistoryEntryType.CUSTOMER_ADDED_TO_GROUP,
                data: {
                    groupName: 'group 1 updated',
                },
            },
        ]);
    });

    it('customer.groups field resolver', async () => {
        const { customer } = await adminClient.query<
            Codegen.GetCustomerWithGroupsQuery,
            Codegen.GetCustomerWithGroupsQueryVariables
        >(GET_CUSTOMER_WITH_GROUPS, {
            id: customers[0].id,
        });

        expect(customer?.groups).toEqual([{ id: 'T_1', name: 'group 1 updated' }]);
    });

    it(
        'removeCustomersFromGroup with invalid customerId',
        assertThrowsWithMessage(async () => {
            await adminClient.query<
                Codegen.RemoveCustomersFromGroupMutation,
                Codegen.RemoveCustomersFromGroupMutationVariables
            >(REMOVE_CUSTOMERS_FROM_GROUP, {
                groupId: 'T_1',
                customerIds: [customers[4].id],
            });
        }, 'Customer does not belong to this CustomerGroup'),
    );

    it('removeCustomersFromGroup with valid customerIds', async () => {
        const { removeCustomersFromGroup } = await adminClient.query<
            Codegen.RemoveCustomersFromGroupMutation,
            Codegen.RemoveCustomersFromGroupMutationVariables
        >(REMOVE_CUSTOMERS_FROM_GROUP, {
            groupId: 'T_1',
            customerIds: [customers[1].id, customers[3].id],
        });

        expect(removeCustomersFromGroup.customers.items.sort(sortById)).toEqual([
            { id: customers[0].id },
            { id: customers[2].id },
        ]);
    });

    it('history entry for CUSTOMER_REMOVED_FROM_GROUP', async () => {
        const { customer } = await adminClient.query<
            Codegen.GetCustomerHistoryQuery,
            Codegen.GetCustomerHistoryQueryVariables
        >(GET_CUSTOMER_HISTORY, {
            id: customers[1].id,
            options: {
                skip: 4,
            },
        });

        expect(customer?.history.items.map(pick(['type', 'data']))).toEqual([
            {
                type: HistoryEntryType.CUSTOMER_REMOVED_FROM_GROUP,
                data: {
                    groupName: 'group 1 updated',
                },
            },
        ]);
    });

    it('deleteCustomerGroup', async () => {
        const { deleteCustomerGroup } = await adminClient.query<
            Codegen.DeleteCustomerGroupMutation,
            Codegen.DeleteCustomerGroupMutationVariables
        >(DELETE_CUSTOMER_GROUP, {
            id: 'T_1',
        });

        expect(deleteCustomerGroup.message).toBeNull();
        expect(deleteCustomerGroup.result).toBe(DeletionResult.DELETED);

        const { customerGroups } = await adminClient.query<Codegen.GetCustomerGroupsQuery>(
            GET_CUSTOMER_GROUPS,
        );
        expect(customerGroups.totalItems).toBe(0);
    });

    // https://github.com/vendure-ecommerce/vendure/issues/1785
    it('removes customer from group when customer is deleted', async () => {
        const customer5Id = customers[4].id;
        const { createCustomerGroup } = await adminClient.query<
            Codegen.CreateCustomerGroupMutation,
            Codegen.CreateCustomerGroupMutationVariables
        >(CREATE_CUSTOMER_GROUP, {
            input: {
                name: 'group-1785',
                customerIds: [customer5Id],
            },
        });

        expect(createCustomerGroup.customers.items).toEqual([{ id: customer5Id }]);

        await adminClient.query<Codegen.DeleteCustomerMutation, Codegen.DeleteCustomerMutationVariables>(
            DELETE_CUSTOMER,
            {
                id: customer5Id,
            },
        );

        const { customerGroup } = await adminClient.query<
            Codegen.GetCustomerGroupQuery,
            Codegen.GetCustomerGroupQueryVariables
        >(GET_CUSTOMER_GROUP, {
            id: createCustomerGroup.id,
        });

        expect(customerGroup?.customers.items).toEqual([]);
    });
});
