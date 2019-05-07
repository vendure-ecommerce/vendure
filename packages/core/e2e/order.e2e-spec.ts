/* tslint:disable:no-non-null-assertion */
import gql from 'graphql-tag';
import path from 'path';

import { TEST_SETUP_TIMEOUT_MS } from './config/test-config';
import { ORDER_FRAGMENT, ORDER_WITH_LINES_FRAGMENT } from './graphql/fragments';
import { GetCustomerList, GetOrder, GetOrderList } from './graphql/generated-e2e-admin-types';
import { GET_CUSTOMER_LIST } from './graphql/shared-definitions';
import { ADD_ITEM_TO_ORDER } from './graphql/shop-definitions';
import { TestAdminClient, TestShopClient } from './test-client';
import { TestServer } from './test-server';

describe('Orders resolver', () => {
    const adminClient = new TestAdminClient();
    const shopClient = new TestShopClient();
    const server = new TestServer();
    let customers: GetCustomerList.Items[];
    const password = 'test';

    beforeAll(async () => {
        const token = await server.init({
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
            customerCount: 2,
        });
        await adminClient.init();

        // Create a couple of orders to be queried
        const result = await adminClient.query<GetCustomerList.Query, GetCustomerList.Variables>(
            GET_CUSTOMER_LIST,
            {
                options: {
                    take: 2,
                },
            },
        );
        customers = result.customers.items;
        await shopClient.asUserWithCredentials(customers[0].emailAddress, password);
        await shopClient.query(ADD_ITEM_TO_ORDER, {
            productVariantId: 'T_1',
            quantity: 1,
        });
        await shopClient.asUserWithCredentials(customers[1].emailAddress, password);
        await shopClient.query(ADD_ITEM_TO_ORDER, {
            productVariantId: 'T_2',
            quantity: 1,
        });
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('orders', async () => {
        const result = await adminClient.query<GetOrderList.Query>(GET_ORDERS_LIST);
        expect(result.orders.items.map(o => o.id)).toEqual(['T_1', 'T_2']);
    });

    it('order', async () => {
        const result = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, { id: 'T_2' });
        expect(result.order!.id).toBe('T_2');
    });
});

export const GET_ORDERS_LIST = gql`
    query GetOrderList($options: OrderListOptions) {
        orders(options: $options) {
            items {
                ...Order
            }
            totalItems
        }
    }
    ${ORDER_FRAGMENT}
`;

export const GET_ORDER = gql`
    query GetOrder($id: ID!) {
        order(id: $id) {
            ...OrderWithLines
        }
    }
    ${ORDER_WITH_LINES_FRAGMENT}
`;
