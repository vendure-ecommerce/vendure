/* eslint-disable @typescript-eslint/no-non-null-assertion */
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
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

import { currentUserFragment } from './graphql/fragments-admin';
import { FragmentOf, graphql, ResultOf, VariablesOf } from './graphql/graphql-shop';
import { attemptLoginDocument, getCustomerListDocument } from './graphql/shared-definitions';
import {
    addItemToOrderCustomFieldsDocument,
    addItemToOrderDocument,
    getNextStatesDocument,
} from './graphql/shop-definitions';
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

type AddItemToOrderWithCustomFields = VariablesOf<typeof addItemToOrderDocument> & {
    customFields?: { inscription?: string };
};

const getActiveOrderWithCustomFieldsDocument = graphql(`
    query GetActiveOrderWithCustomFields {
        activeOrder {
            id
            code
            state
            active
            subTotal
            subTotalWithTax
            shipping
            shippingWithTax
            total
            totalWithTax
            currencyCode
            couponCodes
            discounts {
                adjustmentSource
                amount
                amountWithTax
                description
                type
            }
            lines {
                id
                quantity
                linePrice
                linePriceWithTax
                unitPrice
                unitPriceWithTax
                unitPriceChangeSinceAdded
                unitPriceWithTaxChangeSinceAdded
                discountedUnitPriceWithTax
                proratedUnitPriceWithTax
                productVariant {
                    id
                }
                discounts {
                    adjustmentSource
                    amount
                    amountWithTax
                    description
                    type
                }
                customFields {
                    inscription
                }
            }
            shippingLines {
                priceWithTax
                shippingMethod {
                    id
                    code
                    description
                }
            }
        }
    }
`);

describe('Order merging', () => {
    type LoginSuccessResult = FragmentOf<typeof currentUserFragment>;
    const loginResultGuard: ErrorResultGuard<LoginSuccessResult> = createErrorResultGuard(
        input => !!input && 'id' in input && !('errorCode' in input),
    );

    let customers: ResultOf<typeof getCustomerListDocument>['customers']['items'];

    const { server, shopClient, adminClient } = createTestEnvironment(
        mergeConfig(testConfig(), {
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
        const result = await adminClient.query(getCustomerListDocument);
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
            await shopClient.query(
                addItemToOrderCustomFieldsDocument,
                line as VariablesOf<typeof addItemToOrderCustomFieldsDocument>,
            );
        }

        await shopClient.asAnonymousUser();
        for (const line of guestOrderLines) {
            await shopClient.query(
                addItemToOrderCustomFieldsDocument,
                line as VariablesOf<typeof addItemToOrderCustomFieldsDocument>,
            );
        }

        await shopClient.query(attemptLoginDocument, {
            username: customerEmailAddress,
            password: 'test',
        });
        const { activeOrder } = await shopClient.query(getActiveOrderWithCustomFieldsDocument);

        if (!activeOrder) {
            throw new Error('Active order not found');
        }

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

    it('UseGuestStrategy with conflicting lines', async () => {
        const result = await testMerge({
            strategy: new UseGuestStrategy(),
            customerEmailAddress: customers[8].emailAddress,
            existingOrderLines: [
                { productVariantId: 'T_7', quantity: 1 },
                { productVariantId: 'T_8', quantity: 1 },
            ],
            guestOrderLines: [{ productVariantId: 'T_8', quantity: 3 }],
        });

        expect(
            (result?.lines || []).sort(sortById).map(line => ({
                productVariantId: line.productVariant.id,
                quantity: line.quantity,
            })),
        ).toEqual([{ productVariantId: 'T_8', quantity: 3 }]);
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

    // https://github.com/vendure-ecommerce/vendure/issues/1454
    it('does not throw FK error when merging with a cart with an existing session', async () => {
        await shopClient.asUserWithCredentials(customers[7].emailAddress, 'test');
        // Create an Order linked with the current session
        await shopClient.query(getNextStatesDocument);

        // unset last auth token to simulate a guest user in a different browser
        shopClient.setAuthToken('');
        await shopClient.query(addItemToOrderDocument, { productVariantId: '1', quantity: 2 });

        const { login } = await shopClient.query(attemptLoginDocument, {
            username: customers[7].emailAddress,
            password: 'test',
        });

        loginResultGuard.assertSuccess(login);
        expect(login.id).toBe(customers[7].user?.id);
    });
});
