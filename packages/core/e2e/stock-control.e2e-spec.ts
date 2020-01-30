/* tslint:disable:no-non-null-assertion */
import { mergeConfig, OrderState } from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

import { testSuccessfulPaymentMethod } from './fixtures/test-payment-methods';
import { VARIANT_WITH_STOCK_FRAGMENT } from './graphql/fragments';
import {
    CreateAddressInput,
    GetStockMovement,
    StockMovementType,
    UpdateProductVariantInput,
    UpdateStock,
    VariantWithStockFragment,
} from './graphql/generated-e2e-admin-types';
import {
    AddItemToOrder,
    AddPaymentToOrder,
    PaymentInput,
    SetShippingAddress,
    TransitionToState,
} from './graphql/generated-e2e-shop-types';
import { GET_STOCK_MOVEMENT } from './graphql/shared-definitions';
import {
    ADD_ITEM_TO_ORDER,
    ADD_PAYMENT,
    SET_SHIPPING_ADDRESS,
    TRANSITION_TO_STATE,
} from './graphql/shop-definitions';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';

describe('Stock control', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(
        mergeConfig(testConfig, {
            paymentOptions: {
                paymentMethodHandlers: [testSuccessfulPaymentMethod],
            },
        }),
    );

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-stock-control.csv'),
            customerCount: 2,
        });
        await adminClient.asSuperAdmin();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    describe('stock adjustments', () => {
        let variants: VariantWithStockFragment[];

        it('stockMovements are initially empty', async () => {
            const { product } = await adminClient.query<GetStockMovement.Query, GetStockMovement.Variables>(
                GET_STOCK_MOVEMENT,
                { id: 'T_1' },
            );

            variants = product!.variants;
            for (const variant of variants) {
                expect(variant.stockMovements.items).toEqual([]);
                expect(variant.stockMovements.totalItems).toEqual(0);
            }
        });

        it('updating ProductVariant with same stockOnHand does not create a StockMovement', async () => {
            const { updateProductVariants } = await adminClient.query<
                UpdateStock.Mutation,
                UpdateStock.Variables
            >(UPDATE_STOCK_ON_HAND, {
                input: [
                    {
                        id: variants[0].id,
                        stockOnHand: variants[0].stockOnHand,
                    },
                ] as UpdateProductVariantInput[],
            });

            expect(updateProductVariants[0]!.stockMovements.items).toEqual([]);
            expect(updateProductVariants[0]!.stockMovements.totalItems).toEqual(0);
        });

        it('increasing stockOnHand creates a StockMovement with correct quantity', async () => {
            const { updateProductVariants } = await adminClient.query<
                UpdateStock.Mutation,
                UpdateStock.Variables
            >(UPDATE_STOCK_ON_HAND, {
                input: [
                    {
                        id: variants[0].id,
                        stockOnHand: variants[0].stockOnHand + 5,
                    },
                ] as UpdateProductVariantInput[],
            });

            expect(updateProductVariants[0]!.stockOnHand).toBe(5);
            expect(updateProductVariants[0]!.stockMovements.totalItems).toEqual(1);
            expect(updateProductVariants[0]!.stockMovements.items[0].type).toBe(StockMovementType.ADJUSTMENT);
            expect(updateProductVariants[0]!.stockMovements.items[0].quantity).toBe(5);
        });

        it('decreasing stockOnHand creates a StockMovement with correct quantity', async () => {
            const { updateProductVariants } = await adminClient.query<
                UpdateStock.Mutation,
                UpdateStock.Variables
            >(UPDATE_STOCK_ON_HAND, {
                input: [
                    {
                        id: variants[0].id,
                        stockOnHand: variants[0].stockOnHand + 5 - 2,
                    },
                ] as UpdateProductVariantInput[],
            });

            expect(updateProductVariants[0]!.stockOnHand).toBe(3);
            expect(updateProductVariants[0]!.stockMovements.totalItems).toEqual(2);
            expect(updateProductVariants[0]!.stockMovements.items[1].type).toBe(StockMovementType.ADJUSTMENT);
            expect(updateProductVariants[0]!.stockMovements.items[1].quantity).toBe(-2);
        });

        it(
            'attempting to set a negative stockOnHand throws',
            assertThrowsWithMessage(async () => {
                const result = await adminClient.query<UpdateStock.Mutation, UpdateStock.Variables>(
                    UPDATE_STOCK_ON_HAND,
                    {
                        input: [
                            {
                                id: variants[0].id,
                                stockOnHand: -1,
                            },
                        ] as UpdateProductVariantInput[],
                    },
                );
            }, 'stockOnHand cannot be a negative value'),
        );
    });

    describe('sales', () => {
        beforeAll(async () => {
            const { product } = await adminClient.query<GetStockMovement.Query, GetStockMovement.Variables>(
                GET_STOCK_MOVEMENT,
                { id: 'T_2' },
            );
            const [variant1, variant2] = product!.variants;

            await adminClient.query<UpdateStock.Mutation, UpdateStock.Variables>(UPDATE_STOCK_ON_HAND, {
                input: [
                    {
                        id: variant1.id,
                        stockOnHand: 5,
                        trackInventory: false,
                    },
                    {
                        id: variant2.id,
                        stockOnHand: 5,
                        trackInventory: true,
                    },
                ] as UpdateProductVariantInput[],
            });

            // Add items to order and check out
            await shopClient.asUserWithCredentials('hayden.zieme12@hotmail.com', 'test');
            await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
                productVariantId: variant1.id,
                quantity: 2,
            });
            await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
                productVariantId: variant2.id,
                quantity: 3,
            });
            await shopClient.query<SetShippingAddress.Mutation, SetShippingAddress.Variables>(
                SET_SHIPPING_ADDRESS,
                {
                    input: {
                        streetLine1: '1 Test Street',
                        countryCode: 'GB',
                    } as CreateAddressInput,
                },
            );
            await shopClient.query<TransitionToState.Mutation, TransitionToState.Variables>(
                TRANSITION_TO_STATE,
                { state: 'ArrangingPayment' as OrderState },
            );
        });

        it('creates a Sale when order completed', async () => {
            const { addPaymentToOrder } = await shopClient.query<
                AddPaymentToOrder.Mutation,
                AddPaymentToOrder.Variables
            >(ADD_PAYMENT, {
                input: {
                    method: testSuccessfulPaymentMethod.code,
                    metadata: {},
                } as PaymentInput,
            });
            expect(addPaymentToOrder).not.toBeNull();

            const { product } = await adminClient.query<GetStockMovement.Query, GetStockMovement.Variables>(
                GET_STOCK_MOVEMENT,
                { id: 'T_2' },
            );
            const [variant1, variant2] = product!.variants;

            expect(variant1.stockMovements.totalItems).toBe(2);
            expect(variant1.stockMovements.items[1].type).toBe(StockMovementType.SALE);
            expect(variant1.stockMovements.items[1].quantity).toBe(-2);

            expect(variant2.stockMovements.totalItems).toBe(2);
            expect(variant2.stockMovements.items[1].type).toBe(StockMovementType.SALE);
            expect(variant2.stockMovements.items[1].quantity).toBe(-3);
        });

        it('stockOnHand is updated according to trackInventory setting', async () => {
            const { product } = await adminClient.query<GetStockMovement.Query, GetStockMovement.Variables>(
                GET_STOCK_MOVEMENT,
                { id: 'T_2' },
            );
            const [variant1, variant2] = product!.variants;

            expect(variant1.stockOnHand).toBe(5); // untracked inventory
            expect(variant2.stockOnHand).toBe(2); // tracked inventory
        });
    });
});

const UPDATE_STOCK_ON_HAND = gql`
    mutation UpdateStock($input: [UpdateProductVariantInput!]!) {
        updateProductVariants(input: $input) {
            ...VariantWithStock
        }
    }
    ${VARIANT_WITH_STOCK_FRAGMENT}
`;
