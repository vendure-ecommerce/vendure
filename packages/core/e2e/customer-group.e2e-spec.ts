import { pick } from '@vendure/common/lib/pick';
import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

import {
    AddCustomersToGroup,
    CreateCustomerGroup,
    DeleteCustomerGroup,
    GetCustomerGroup,
    GetCustomerGroups,
    GetCustomerHistory,
    GetCustomerList,
    GetCustomerWithGroups,
    HistoryEntryType,
    RemoveCustomersFromGroup,
    UpdateCustomerGroup,
} from './graphql/generated-e2e-admin-types';
import { DeletionResult } from './graphql/generated-e2e-shop-types';
import {
    CREATE_CUSTOMER_GROUP,
    CUSTOMER_GROUP_FRAGMENT,
    GET_CUSTOMER_HISTORY,
    GET_CUSTOMER_LIST,
    REMOVE_CUSTOMERS_FROM_GROUP,
} from './graphql/shared-definitions';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';
import { sortById } from './utils/test-order-utils';

describe('CustomerGroup resolver', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(testConfig);

    let customers: GetCustomerList.Items[];

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
            customerCount: 5,
        });
        await adminClient.asSuperAdmin();
        const result = await adminClient.query<GetCustomerList.Query>(GET_CUSTOMER_LIST);
        customers = result.customers.items;
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('create', async () => {
        const { createCustomerGroup } = await adminClient.query<
            CreateCustomerGroup.Mutation,
            CreateCustomerGroup.Variables
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
        const { customer } = await adminClient.query<GetCustomerHistory.Query, GetCustomerHistory.Variables>(
            GET_CUSTOMER_HISTORY,
            {
                id: customers[0].id,
                options: {
                    skip: 3,
                },
            },
        );

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
            GetCustomerGroups.Query,
            GetCustomerGroups.Variables
        >(GET_CUSTOMER_GROUPS, {
            options: {},
        });

        expect(customerGroups.totalItems).toBe(1);
        expect(customerGroups.items[0].name).toBe('group 1');
    });

    it('customerGroup with customer list options', async () => {
        const { customerGroup } = await adminClient.query<GetCustomerGroup.Query, GetCustomerGroup.Variables>(
            GET_CUSTOMER_GROUP,
            {
                id: 'T_1',
                options: {
                    take: 1,
                },
            },
        );

        expect(customerGroup?.id).toBe('T_1');
        expect(customerGroup?.name).toBe('group 1');
        expect(customerGroup?.customers.items.length).toBe(1);
        expect(customerGroup?.customers.totalItems).toBe(2);
    });

    it('update', async () => {
        const { updateCustomerGroup } = await adminClient.query<
            UpdateCustomerGroup.Mutation,
            UpdateCustomerGroup.Variables
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
            AddCustomersToGroup.Mutation,
            AddCustomersToGroup.Variables
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
            AddCustomersToGroup.Mutation,
            AddCustomersToGroup.Variables
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
        const { customer } = await adminClient.query<GetCustomerHistory.Query, GetCustomerHistory.Variables>(
            GET_CUSTOMER_HISTORY,
            {
                id: customers[0].id,
                options: {
                    filter: {
                        type: { eq: HistoryEntryType.CUSTOMER_ADDED_TO_GROUP },
                    },
                },
            },
        );

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
        const { customer } = await adminClient.query<GetCustomerHistory.Query, GetCustomerHistory.Variables>(
            GET_CUSTOMER_HISTORY,
            {
                id: customers[2].id,
                options: {
                    skip: 3,
                },
            },
        );

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
            GetCustomerWithGroups.Query,
            GetCustomerWithGroups.Variables
        >(GET_CUSTOMER_WITH_GROUPS, {
            id: customers[0].id,
        });

        expect(customer?.groups).toEqual([{ id: 'T_1', name: 'group 1 updated' }]);
    });

    it(
        'removeCustomersFromGroup with invalid customerId',
        assertThrowsWithMessage(async () => {
            await adminClient.query<RemoveCustomersFromGroup.Mutation, RemoveCustomersFromGroup.Variables>(
                REMOVE_CUSTOMERS_FROM_GROUP,
                {
                    groupId: 'T_1',
                    customerIds: [customers[4].id],
                },
            );
        }, `Customer does not belong to this CustomerGroup`),
    );

    it('removeCustomersFromGroup with valid customerIds', async () => {
        const { removeCustomersFromGroup } = await adminClient.query<
            RemoveCustomersFromGroup.Mutation,
            RemoveCustomersFromGroup.Variables
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
        const { customer } = await adminClient.query<GetCustomerHistory.Query, GetCustomerHistory.Variables>(
            GET_CUSTOMER_HISTORY,
            {
                id: customers[1].id,
                options: {
                    skip: 4,
                },
            },
        );

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
            DeleteCustomerGroup.Mutation,
            DeleteCustomerGroup.Variables
        >(DELETE_CUSTOMER_GROUP, {
            id: 'T_1',
        });

        expect(deleteCustomerGroup.message).toBeNull();
        expect(deleteCustomerGroup.result).toBe(DeletionResult.DELETED);

        const { customerGroups } = await adminClient.query<GetCustomerGroups.Query>(GET_CUSTOMER_GROUPS);
        expect(customerGroups.totalItems).toBe(0);
    });
});

export const UPDATE_CUSTOMER_GROUP = gql`
    mutation UpdateCustomerGroup($input: UpdateCustomerGroupInput!) {
        updateCustomerGroup(input: $input) {
            ...CustomerGroup
        }
    }
    ${CUSTOMER_GROUP_FRAGMENT}
`;

export const DELETE_CUSTOMER_GROUP = gql`
    mutation DeleteCustomerGroup($id: ID!) {
        deleteCustomerGroup(id: $id) {
            result
            message
        }
    }
`;

export const GET_CUSTOMER_GROUPS = gql`
    query GetCustomerGroups($options: CustomerGroupListOptions) {
        customerGroups(options: $options) {
            items {
                id
                name
            }
            totalItems
        }
    }
`;

export const GET_CUSTOMER_GROUP = gql`
    query GetCustomerGroup($id: ID!, $options: CustomerListOptions) {
        customerGroup(id: $id) {
            id
            name
            customers(options: $options) {
                items {
                    id
                }
                totalItems
            }
        }
    }
`;

export const ADD_CUSTOMERS_TO_GROUP = gql`
    mutation AddCustomersToGroup($groupId: ID!, $customerIds: [ID!]!) {
        addCustomersToGroup(customerGroupId: $groupId, customerIds: $customerIds) {
            ...CustomerGroup
        }
    }
    ${CUSTOMER_GROUP_FRAGMENT}
`;

export const GET_CUSTOMER_WITH_GROUPS = gql`
    query GetCustomerWithGroups($id: ID!) {
        customer(id: $id) {
            id
            groups {
                id
                name
            }
        }
    }
`;
