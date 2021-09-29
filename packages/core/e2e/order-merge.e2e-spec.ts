/* tslint:disable:no-non-null-assertion */
import {
    mergeConfig,
    MergedOrderLine,
    MergeOrdersStrategy,
    Order,
    OrderMergeStrategy,
    RequestContext,
    UseExistingStrategy,
    UseGuestIfExistingEmptyStrategy,
    UseGuestStrategy,
} from '@vendure/core';
import { createErrorResultGuard, createTestEnvironment, ErrorResultGuard } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import { AttemptLogin, GetCustomerList } from './graphql/generated-e2e-admin-types';
import {
    AddItemToOrder,
    TestOrderFragmentFragment,
    UpdatedOrderFragment,
} from './graphql/generated-e2e-shop-types';
import { ATTEMPT_LOGIN, GET_CUSTOMER_LIST } from './graphql/shared-definitions';
import { TEST_ORDER_FRAGMENT } from './graphql/shop-definitions';
import { sortById } from './utils/test-order-utils';

/**
 * Allows us to change the active OrderMergeStrategy per-test and delegates to the current
 * activeStrategy.
 */
class DelegateMergeStrategy implements OrderMergeStrategy {
    static activeStrategy: OrderMergeStrategy = new MergeOrdersStrategy();
    merge(ctx: RequestContext, guestOrder: Order, existingOrder: Order): MergedOrderLine[] {
        return DelegateMergeStrategy.activeStrategy.merge(ctx, guestOrder, existingOrder);
    }
}

type AddItemToOrderWithCustomFields = AddItemToOrder.Variables & {
    customFields?: { inscription?: string };
};

describe('Order merging', () => {
    type OrderSuccessResult = UpdatedOrderFragment | TestOrderFragmentFragment;
    const orderResultGuard: ErrorResultGuard<OrderSuccessResult> = createErrorResultGuard(
        input => !!input.lines,
    );

    let customers: GetCustomerList.Items[];

    const { server, shopClient, adminClient } = createTestEnvironment(
        mergeConfig(testConfig, {
            orderOptions: {
                mergeStrategy: new DelegateMergeStrategy(),
            },
            customFields: {
                OrderLine: [{ name: 'inscription', type: 'string' }],
            },
        }),
    );
    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
            customerCount: 10,
        });
        await adminClient.asSuperAdmin();
        const result = await adminClient.query<GetCustomerList.Query>(GET_CUSTOMER_LIST);
        customers = result.customers.items;
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    async function testMerge(options: {
        strategy: OrderMergeStrategy;
        customerEmailAddress: string;
        existingOrderLines: AddItemToOrderWithCustomFields[];
        guestOrderLines: AddItemToOrderWithCustomFields[];
    }): Promise<{ lines: any[] }> {
        const { strategy, customerEmailAddress, existingOrderLines, guestOrderLines } = options;
        DelegateMergeStrategy.activeStrategy = strategy;

        await shopClient.asUserWithCredentials(customerEmailAddress, 'test');
        for (const line of existingOrderLines) {
            await shopClient.query<AddItemToOrder.Mutation, AddItemToOrderWithCustomFields>(
                ADD_ITEM_TO_ORDER_WITH_CUSTOM_FIELDS,
                line,
            );
        }

        await shopClient.asAnonymousUser();
        for (const line of guestOrderLines) {
            await shopClient.query<AddItemToOrder.Mutation, AddItemToOrderWithCustomFields>(
                ADD_ITEM_TO_ORDER_WITH_CUSTOM_FIELDS,
                line,
            );
        }

        await shopClient.query<AttemptLogin.Mutation, AttemptLogin.Variables>(ATTEMPT_LOGIN, {
            username: customerEmailAddress,
            password: 'test',
        });
        const { activeOrder } = await shopClient.query(GET_ACTIVE_ORDER_WITH_CUSTOM_FIELDS);
        return activeOrder;
    }

    it('MergeOrdersStrategy adds new line', async () => {
        const result = await testMerge({
            strategy: new MergeOrdersStrategy(),
            customerEmailAddress: customers[0].emailAddress,
            existingOrderLines: [{ productVariantId: 'T_1', quantity: 1 }],
            guestOrderLines: [{ productVariantId: 'T_2', quantity: 1 }],
        });

        expect(
            result.lines.map(line => ({ productVariantId: line.productVariant.id, quantity: line.quantity })),
        ).toEqual([
            { productVariantId: 'T_1', quantity: 1 },
            { productVariantId: 'T_2', quantity: 1 },
        ]);
    });

    it('MergeOrdersStrategy uses guest quantity', async () => {
        const result = await testMerge({
            strategy: new MergeOrdersStrategy(),
            customerEmailAddress: customers[1].emailAddress,
            existingOrderLines: [{ productVariantId: 'T_1', quantity: 1 }],
            guestOrderLines: [{ productVariantId: 'T_1', quantity: 3 }],
        });

        expect(
            result.lines.map(line => ({ productVariantId: line.productVariant.id, quantity: line.quantity })),
        ).toEqual([{ productVariantId: 'T_1', quantity: 3 }]);
    });

    it('MergeOrdersStrategy accounts for customFields', async () => {
        const result = await testMerge({
            strategy: new MergeOrdersStrategy(),
            customerEmailAddress: customers[2].emailAddress,
            existingOrderLines: [
                { productVariantId: 'T_1', quantity: 1, customFields: { inscription: 'foo' } },
            ],
            guestOrderLines: [{ productVariantId: 'T_1', quantity: 3, customFields: { inscription: 'bar' } }],
        });

        expect(
            result.lines.sort(sortById).map(line => ({
                productVariantId: line.productVariant.id,
                quantity: line.quantity,
                customFields: line.customFields,
            })),
        ).toEqual([
            { productVariantId: 'T_1', quantity: 1, customFields: { inscription: 'foo' } },
            { productVariantId: 'T_1', quantity: 3, customFields: { inscription: 'bar' } },
        ]);
    });

    it('UseGuestStrategy', async () => {
        const result = await testMerge({
            strategy: new UseGuestStrategy(),
            customerEmailAddress: customers[3].emailAddress,
            existingOrderLines: [
                { productVariantId: 'T_1', quantity: 1 },
                { productVariantId: 'T_3', quantity: 1 },
            ],
            guestOrderLines: [{ productVariantId: 'T_5', quantity: 3 }],
        });

        expect(
            result.lines.sort(sortById).map(line => ({
                productVariantId: line.productVariant.id,
                quantity: line.quantity,
            })),
        ).toEqual([{ productVariantId: 'T_5', quantity: 3 }]);
    });

    it('UseGuestIfExistingEmptyStrategy with empty existing', async () => {
        const result = await testMerge({
            strategy: new UseGuestIfExistingEmptyStrategy(),
            customerEmailAddress: customers[4].emailAddress,
            existingOrderLines: [],
            guestOrderLines: [{ productVariantId: 'T_2', quantity: 3 }],
        });

        expect(
            result.lines.sort(sortById).map(line => ({
                productVariantId: line.productVariant.id,
                quantity: line.quantity,
            })),
        ).toEqual([{ productVariantId: 'T_2', quantity: 3 }]);
    });

    it('UseGuestIfExistingEmptyStrategy with non-empty existing', async () => {
        const result = await testMerge({
            strategy: new UseGuestIfExistingEmptyStrategy(),
            customerEmailAddress: customers[5].emailAddress,
            existingOrderLines: [{ productVariantId: 'T_5', quantity: 5 }],
            guestOrderLines: [{ productVariantId: 'T_2', quantity: 3 }],
        });

        expect(
            result.lines.sort(sortById).map(line => ({
                productVariantId: line.productVariant.id,
                quantity: line.quantity,
            })),
        ).toEqual([{ productVariantId: 'T_5', quantity: 5 }]);
    });

    it('UseExistingStrategy', async () => {
        const result = await testMerge({
            strategy: new UseExistingStrategy(),
            customerEmailAddress: customers[6].emailAddress,
            existingOrderLines: [{ productVariantId: 'T_8', quantity: 1 }],
            guestOrderLines: [{ productVariantId: 'T_2', quantity: 3 }],
        });

        expect(
            result.lines.sort(sortById).map(line => ({
                productVariantId: line.productVariant.id,
                quantity: line.quantity,
            })),
        ).toEqual([{ productVariantId: 'T_8', quantity: 1 }]);
    });
});

export const ADD_ITEM_TO_ORDER_WITH_CUSTOM_FIELDS = gql`
    mutation AddItemToOrder(
        $productVariantId: ID!
        $quantity: Int!
        $customFields: OrderLineCustomFieldsInput
    ) {
        addItemToOrder(
            productVariantId: $productVariantId
            quantity: $quantity
            customFields: $customFields
        ) {
            ... on Order {
                id
            }
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
`;

export const GET_ACTIVE_ORDER_WITH_CUSTOM_FIELDS = gql`
    query GetActiveOrder {
        activeOrder {
            ...TestOrderFragment
            ... on Order {
                lines {
                    customFields {
                        inscription
                    }
                }
            }
        }
    }
    ${TEST_ORDER_FRAGMENT}
`;
