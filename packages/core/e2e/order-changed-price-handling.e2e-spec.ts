/* tslint:disable:no-non-null-assertion */
import {
    ChangedPriceHandlingStrategy,
    mergeConfig,
    OrderItem,
    PriceCalculationResult,
    RequestContext,
} from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import { UpdateProductVariants } from './graphql/generated-e2e-admin-types';
import { AddItemToOrder, AdjustItemQuantity, GetActiveOrder } from './graphql/generated-e2e-shop-types';
import { UPDATE_PRODUCT_VARIANTS } from './graphql/shared-definitions';
import { ADD_ITEM_TO_ORDER, ADJUST_ITEM_QUANTITY, GET_ACTIVE_ORDER } from './graphql/shop-definitions';

class TestChangedPriceStrategy implements ChangedPriceHandlingStrategy {
    static spy = jest.fn();
    static useLatestPrice = true;

    handlePriceChange(
        ctx: RequestContext,
        current: PriceCalculationResult,
        existingItems: OrderItem[],
    ): PriceCalculationResult {
        TestChangedPriceStrategy.spy(current);
        if (TestChangedPriceStrategy.useLatestPrice) {
            return current;
        } else {
            return {
                price: existingItems[0].listPrice,
                priceIncludesTax: existingItems[0].listPriceIncludesTax,
            };
        }
    }
}

describe('ChangedPriceHandlingStrategy', () => {
    const { server, shopClient, adminClient } = createTestEnvironment(
        mergeConfig(testConfig, {
            orderOptions: {
                changedPriceHandlingStrategy: new TestChangedPriceStrategy(),
            },
        }),
    );

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('unitPriceChangeSinceAdded starts as 0', async () => {
        TestChangedPriceStrategy.spy.mockClear();

        await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
            productVariantId: 'T_12',
            quantity: 1,
        });

        const { activeOrder } = await shopClient.query<GetActiveOrder.Query>(GET_ACTIVE_ORDER);

        expect(activeOrder?.lines[0].unitPriceChangeSinceAdded).toBe(0);
        expect(activeOrder?.lines[0].unitPrice).toBe(5374);
        expect(TestChangedPriceStrategy.spy).not.toHaveBeenCalled();
    });

    describe('use latest price', () => {
        let firstOrderLineId: string;

        beforeAll(() => {
            TestChangedPriceStrategy.useLatestPrice = true;
        });

        it('calls handlePriceChange on addItemToOrder', async () => {
            TestChangedPriceStrategy.spy.mockClear();

            await adminClient.query<UpdateProductVariants.Mutation, UpdateProductVariants.Variables>(
                UPDATE_PRODUCT_VARIANTS,
                {
                    input: [
                        {
                            id: 'T_12',
                            price: 6000,
                        },
                    ],
                },
            );

            await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_12',
                quantity: 1,
            });

            const { activeOrder } = await shopClient.query<GetActiveOrder.Query>(GET_ACTIVE_ORDER);
            expect(activeOrder?.lines[0].unitPriceChangeSinceAdded).toBe(626);
            expect(activeOrder?.lines[0].unitPrice).toBe(6000);
            expect(activeOrder?.lines[0].items.every(i => i.unitPrice === 6000)).toBe(true);
            expect(TestChangedPriceStrategy.spy).toHaveBeenCalledTimes(1);

            firstOrderLineId = activeOrder!.lines[0].id;
        });

        it('calls handlePriceChange on adjustOrderLine', async () => {
            TestChangedPriceStrategy.spy.mockClear();

            await adminClient.query<UpdateProductVariants.Mutation, UpdateProductVariants.Variables>(
                UPDATE_PRODUCT_VARIANTS,
                {
                    input: [
                        {
                            id: 'T_12',
                            price: 3000,
                        },
                    ],
                },
            );

            await shopClient.query<AdjustItemQuantity.Mutation, AdjustItemQuantity.Variables>(
                ADJUST_ITEM_QUANTITY,
                {
                    orderLineId: firstOrderLineId,
                    quantity: 3,
                },
            );

            const { activeOrder } = await shopClient.query<GetActiveOrder.Query>(GET_ACTIVE_ORDER);
            expect(activeOrder?.lines[0].unitPriceChangeSinceAdded).toBe(-2374);
            expect(activeOrder?.lines[0].unitPrice).toBe(3000);
            expect(activeOrder?.lines[0].items.every(i => i.unitPrice === 3000)).toBe(true);
            expect(TestChangedPriceStrategy.spy).toHaveBeenCalledTimes(1);
        });
    });

    describe('use original price', () => {
        let secondOrderLineId: string;
        const ORIGINAL_PRICE = 7896;

        beforeAll(() => {
            TestChangedPriceStrategy.useLatestPrice = false;
        });

        it('calls handlePriceChange on addItemToOrder', async () => {
            TestChangedPriceStrategy.spy.mockClear();

            await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_13',
                quantity: 1,
            });

            await adminClient.query<UpdateProductVariants.Mutation, UpdateProductVariants.Variables>(
                UPDATE_PRODUCT_VARIANTS,
                {
                    input: [
                        {
                            id: 'T_13',
                            price: 8000,
                        },
                    ],
                },
            );

            await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
                productVariantId: 'T_13',
                quantity: 1,
            });

            const { activeOrder } = await shopClient.query<GetActiveOrder.Query>(GET_ACTIVE_ORDER);
            expect(activeOrder?.lines[1].unitPriceChangeSinceAdded).toBe(0);
            expect(activeOrder?.lines[1].unitPrice).toBe(ORIGINAL_PRICE);
            expect(activeOrder?.lines[1].items.every(i => i.unitPrice === ORIGINAL_PRICE)).toBe(true);
            expect(TestChangedPriceStrategy.spy).toHaveBeenCalledTimes(1);

            secondOrderLineId = activeOrder!.lines[1].id;
        });

        it('calls handlePriceChange on adjustOrderLine', async () => {
            TestChangedPriceStrategy.spy.mockClear();

            await adminClient.query<UpdateProductVariants.Mutation, UpdateProductVariants.Variables>(
                UPDATE_PRODUCT_VARIANTS,
                {
                    input: [
                        {
                            id: 'T_13',
                            price: 3000,
                        },
                    ],
                },
            );

            await shopClient.query<AdjustItemQuantity.Mutation, AdjustItemQuantity.Variables>(
                ADJUST_ITEM_QUANTITY,
                {
                    orderLineId: secondOrderLineId,
                    quantity: 3,
                },
            );

            const { activeOrder } = await shopClient.query<GetActiveOrder.Query>(GET_ACTIVE_ORDER);
            expect(activeOrder?.lines[1].unitPriceChangeSinceAdded).toBe(0);
            expect(activeOrder?.lines[1].unitPrice).toBe(ORIGINAL_PRICE);
            expect(activeOrder?.lines[1].items.every(i => i.unitPrice === ORIGINAL_PRICE)).toBe(true);
            expect(TestChangedPriceStrategy.spy).toHaveBeenCalledTimes(1);
        });
    });
});
