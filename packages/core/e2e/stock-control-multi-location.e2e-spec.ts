/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { manualFulfillmentHandler, mergeConfig } from '@vendure/core';
import { createErrorResultGuard, createTestEnvironment, ErrorResultGuard } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import { testSuccessfulPaymentMethod, twoStagePaymentMethod } from './fixtures/test-payment-methods';
import {
    TestMultiLocationStockPlugin,
    TestStockDisplayStrategy,
    TestStockLocationStrategy,
} from './fixtures/test-plugins/multi-location-stock-plugin';
import * as Codegen from './graphql/generated-e2e-admin-types';
import { CreateAddressInput, FulfillmentFragment } from './graphql/generated-e2e-admin-types';
import { PaymentInput } from './graphql/generated-e2e-shop-types';
import * as CodegenShop from './graphql/generated-e2e-shop-types';
import {
    CANCEL_ORDER,
    CREATE_FULFILLMENT,
    GET_ORDER,
    GET_STOCK_MOVEMENT,
    UPDATE_GLOBAL_SETTINGS,
    UPDATE_PRODUCT_VARIANTS,
} from './graphql/shared-definitions';
import {
    ADD_ITEM_TO_ORDER,
    ADD_PAYMENT,
    GET_ELIGIBLE_SHIPPING_METHODS,
    GET_PRODUCT_WITH_STOCK_LEVEL,
    SET_SHIPPING_ADDRESS,
    SET_SHIPPING_METHOD,
    TRANSITION_TO_STATE,
} from './graphql/shop-definitions';

describe('Stock control', () => {
    let defaultStockLocationId: string;
    let secondStockLocationId: string;
    const { server, adminClient, shopClient } = createTestEnvironment(
        mergeConfig(testConfig(), {
            paymentOptions: {
                paymentMethodHandlers: [testSuccessfulPaymentMethod],
            },
            plugins: [TestMultiLocationStockPlugin],
        }),
    );

    const orderGuard: ErrorResultGuard<
        CodegenShop.TestOrderFragmentFragment | CodegenShop.UpdatedOrderFragment
    > = createErrorResultGuard(input => !!input.lines);

    const fulfillmentGuard: ErrorResultGuard<FulfillmentFragment> = createErrorResultGuard(
        input => !!input.state,
    );

    async function getProductWithStockMovement(productId: string) {
        const { product } = await adminClient.query<
            Codegen.GetStockMovementQuery,
            Codegen.GetStockMovementQueryVariables
        >(GET_STOCK_MOVEMENT, { id: productId });
        return product;
    }

    async function setFirstEligibleShippingMethod() {
        const { eligibleShippingMethods } = await shopClient.query<CodegenShop.GetShippingMethodsQuery>(
            GET_ELIGIBLE_SHIPPING_METHODS,
        );
        await shopClient.query<
            CodegenShop.SetShippingMethodMutation,
            CodegenShop.SetShippingMethodMutationVariables
        >(SET_SHIPPING_METHOD, {
            id: eligibleShippingMethods[0].id,
        });
    }

    beforeAll(async () => {
        await server.init({
            initialData: {
                ...initialData,
                paymentMethods: [
                    {
                        name: testSuccessfulPaymentMethod.code,
                        handler: { code: testSuccessfulPaymentMethod.code, arguments: [] },
                    },
                    {
                        name: twoStagePaymentMethod.code,
                        handler: { code: twoStagePaymentMethod.code, arguments: [] },
                    },
                ],
            },
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-stock-control-multi.csv'),
            customerCount: 3,
        });
        await adminClient.asSuperAdmin();

        await adminClient.query<
            Codegen.UpdateGlobalSettingsMutation,
            Codegen.UpdateGlobalSettingsMutationVariables
        >(UPDATE_GLOBAL_SETTINGS, {
            input: {
                trackInventory: false,
            },
        });
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('default StockLocation exists', async () => {
        const { stockLocations } = await adminClient.query<Codegen.GetStockLocationsQuery>(
            GET_STOCK_LOCATIONS,
        );
        expect(stockLocations.items.length).toBe(1);
        expect(stockLocations.items[0].name).toBe('Default Stock Location');
        defaultStockLocationId = stockLocations.items[0].id;
    });

    it('variant stock is all at default StockLocation', async () => {
        const { productVariants } = await adminClient.query<
            Codegen.GetVariantStockLevelsQuery,
            Codegen.GetVariantStockLevelsQueryVariables
        >(GET_VARIANT_STOCK_LEVELS, {});

        expect(productVariants.items.every(variant => variant.stockLevels.length === 1)).toBe(true);
        expect(
            productVariants.items.every(
                variant => variant.stockLevels[0].stockLocationId === defaultStockLocationId,
            ),
        ).toBe(true);
    });

    it('create StockLocation', async () => {
        const { createStockLocation } = await adminClient.query<
            Codegen.CreateStockLocationMutation,
            Codegen.CreateStockLocationMutationVariables
        >(CREATE_STOCK_LOCATION, {
            input: {
                name: 'StockLocation1',
                description: 'StockLocation1',
            },
        });

        expect(createStockLocation).toEqual({
            id: 'T_2',
            name: 'StockLocation1',
            description: 'StockLocation1',
        });
        secondStockLocationId = createStockLocation.id;
    });

    it('update StockLocation', async () => {
        const { updateStockLocation } = await adminClient.query<
            Codegen.UpdateStockLocationMutation,
            Codegen.UpdateStockLocationMutationVariables
        >(UPDATE_STOCK_LOCATION, {
            input: {
                id: 'T_2',
                name: 'Warehouse 2',
                description: 'The secondary warehouse',
            },
        });

        expect(updateStockLocation).toEqual({
            id: 'T_2',
            name: 'Warehouse 2',
            description: 'The secondary warehouse',
        });
    });

    it('update ProductVariants with stock levels in second location', async () => {
        const { productVariants } = await adminClient.query<
            Codegen.GetVariantStockLevelsQuery,
            Codegen.GetVariantStockLevelsQueryVariables
        >(GET_VARIANT_STOCK_LEVELS, {});

        const { updateProductVariants } = await adminClient.query<
            Codegen.UpdateProductVariantsMutation,
            Codegen.UpdateProductVariantsMutationVariables
        >(UPDATE_PRODUCT_VARIANTS, {
            input: productVariants.items.map(variant => ({
                id: variant.id,
                stockLevels: [{ stockLocationId: secondStockLocationId, stockOnHand: 120 }],
            })),
        });

        const {
            productVariants: { items },
        } = await adminClient.query<
            Codegen.GetVariantStockLevelsQuery,
            Codegen.GetVariantStockLevelsQueryVariables
        >(GET_VARIANT_STOCK_LEVELS, {});
        expect(items.every(variant => variant.stockLevels.length === 2)).toBe(true);
        expect(
            items.every(variant => {
                return (
                    variant.stockLevels[0].stockLocationId === defaultStockLocationId &&
                    variant.stockLevels[1].stockLocationId === secondStockLocationId
                );
            }),
        ).toBe(true);
    });

    it('StockLocationStrategy.getAvailableStock() is used to calculate saleable stock level', async () => {
        const result1 = await shopClient.query<
            CodegenShop.GetProductStockLevelQuery,
            CodegenShop.GetProductStockLevelQueryVariables
        >(GET_PRODUCT_WITH_STOCK_LEVEL, {
            id: 'T_1',
        });

        expect(result1.product?.variants[0].stockLevel).toBe('220');

        const result2 = await shopClient.query<
            CodegenShop.GetProductStockLevelQuery,
            CodegenShop.GetProductStockLevelQueryVariables
        >(
            GET_PRODUCT_WITH_STOCK_LEVEL,
            {
                id: 'T_1',
            },
            { fromLocation: 1 },
        );

        expect(result2.product?.variants[0].stockLevel).toBe('100');

        const result3 = await shopClient.query<
            CodegenShop.GetProductStockLevelQuery,
            CodegenShop.GetProductStockLevelQueryVariables
        >(
            GET_PRODUCT_WITH_STOCK_LEVEL,
            {
                id: 'T_1',
            },
            { fromLocation: 2 },
        );

        expect(result3.product?.variants[0].stockLevel).toBe('120');
    });

    describe('stock movements', () => {
        const ADD_ITEM_TO_ORDER_WITH_CUSTOM_FIELDS = `
            mutation AddItemToOrderWithCustomFields(
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
                        lines { id }
                    }
                    ... on ErrorResult {
                        errorCode
                        message
                    }
                }
            }
        `;
        let orderId: string;

        it('creates Allocations according to StockLocationStrategy', async () => {
            await shopClient.asUserWithCredentials('trevor_donnelly96@hotmail.com', 'test');

            await shopClient.query(gql(ADD_ITEM_TO_ORDER_WITH_CUSTOM_FIELDS), {
                productVariantId: 'T_1',
                quantity: 2,
                customFields: {
                    stockLocationId: '1',
                },
            });
            const { addItemToOrder } = await shopClient.query(gql(ADD_ITEM_TO_ORDER_WITH_CUSTOM_FIELDS), {
                productVariantId: 'T_2',
                quantity: 2,
                customFields: {
                    stockLocationId: '2',
                },
            });

            orderId = addItemToOrder.id;
            expect(addItemToOrder.lines.length).toBe(2);

            // Do all steps to check out
            await shopClient.query<
                CodegenShop.SetShippingAddressMutation,
                CodegenShop.SetShippingAddressMutationVariables
            >(SET_SHIPPING_ADDRESS, {
                input: {
                    streetLine1: '1 Test Street',
                    countryCode: 'GB',
                } as CreateAddressInput,
            });
            const { eligibleShippingMethods } = await shopClient.query<CodegenShop.GetShippingMethodsQuery>(
                GET_ELIGIBLE_SHIPPING_METHODS,
            );
            await shopClient.query<
                CodegenShop.SetShippingMethodMutation,
                CodegenShop.SetShippingMethodMutationVariables
            >(SET_SHIPPING_METHOD, {
                id: eligibleShippingMethods[0].id,
            });
            await shopClient.query<
                CodegenShop.TransitionToStateMutation,
                CodegenShop.TransitionToStateMutationVariables
            >(TRANSITION_TO_STATE, {
                state: 'ArrangingPayment',
            });
            const { addPaymentToOrder: order } = await shopClient.query<
                CodegenShop.AddPaymentToOrderMutation,
                CodegenShop.AddPaymentToOrderMutationVariables
            >(ADD_PAYMENT, {
                input: {
                    method: testSuccessfulPaymentMethod.code,
                    metadata: {},
                } as PaymentInput,
            });
            orderGuard.assertSuccess(order);

            const { productVariants } = await adminClient.query<
                Codegen.GetVariantStockLevelsQuery,
                Codegen.GetVariantStockLevelsQueryVariables
            >(GET_VARIANT_STOCK_LEVELS, {
                options: {
                    filter: {
                        id: { in: ['T_1', 'T_2'] },
                    },
                },
            });

            // First variant gets stock allocated from location 1
            expect(productVariants.items.find(v => v.id === 'T_1')?.stockLevels).toEqual([
                {
                    stockLocationId: 'T_1',
                    stockOnHand: 100,
                    stockAllocated: 2,
                },
                {
                    stockLocationId: 'T_2',
                    stockOnHand: 120,
                    stockAllocated: 0,
                },
            ]);

            // Second variant gets stock allocated from location 2
            expect(productVariants.items.find(v => v.id === 'T_2')?.stockLevels).toEqual([
                {
                    stockLocationId: 'T_1',
                    stockOnHand: 100,
                    stockAllocated: 0,
                },
                {
                    stockLocationId: 'T_2',
                    stockOnHand: 120,
                    stockAllocated: 2,
                },
            ]);
        });

        it('creates Releases according to StockLocationStrategy', async () => {
            const { order } = await adminClient.query<Codegen.GetOrderQuery, Codegen.GetOrderQueryVariables>(
                GET_ORDER,
                { id: orderId },
            );

            const { cancelOrder } = await adminClient.query<
                Codegen.CancelOrderMutation,
                Codegen.CancelOrderMutationVariables
            >(CANCEL_ORDER, {
                input: {
                    orderId,
                    lines: order?.lines
                        .filter(l => l.productVariant.id === 'T_2')
                        .map(l => ({
                            orderLineId: l.id,
                            quantity: 1,
                        })),
                },
            });

            const { productVariants } = await adminClient.query<
                Codegen.GetVariantStockLevelsQuery,
                Codegen.GetVariantStockLevelsQueryVariables
            >(GET_VARIANT_STOCK_LEVELS, {
                options: {
                    filter: {
                        id: { eq: 'T_2' },
                    },
                },
            });

            // Second variant gets stock allocated from location 2
            expect(productVariants.items.find(v => v.id === 'T_2')?.stockLevels).toEqual([
                {
                    stockLocationId: 'T_1',
                    stockOnHand: 100,
                    stockAllocated: 0,
                },
                {
                    stockLocationId: 'T_2',
                    stockOnHand: 120,
                    stockAllocated: 1,
                },
            ]);
        });

        it('creates Sales according to StockLocationStrategy', async () => {
            const { order } = await adminClient.query<Codegen.GetOrderQuery, Codegen.GetOrderQueryVariables>(
                GET_ORDER,
                { id: orderId },
            );
            await adminClient.query<
                Codegen.CreateFulfillmentMutation,
                Codegen.CreateFulfillmentMutationVariables
            >(CREATE_FULFILLMENT, {
                input: {
                    handler: {
                        code: manualFulfillmentHandler.code,
                        arguments: [{ name: 'method', value: 'Test1' }],
                    },
                    lines: order!.lines.map(l => ({
                        orderLineId: l.id,
                        quantity: l.quantity,
                    })),
                },
            });

            const { productVariants } = await adminClient.query<
                Codegen.GetVariantStockLevelsQuery,
                Codegen.GetVariantStockLevelsQueryVariables
            >(GET_VARIANT_STOCK_LEVELS, {
                options: {
                    filter: {
                        id: { in: ['T_1', 'T_2'] },
                    },
                },
            });

            // Second variant gets stock allocated from location 2
            expect(productVariants.items.find(v => v.id === 'T_1')?.stockLevels).toEqual([
                {
                    stockLocationId: 'T_1',
                    stockOnHand: 98,
                    stockAllocated: 0,
                },
                {
                    stockLocationId: 'T_2',
                    stockOnHand: 120,
                    stockAllocated: 0,
                },
            ]);

            // Second variant gets stock allocated from location 2
            expect(productVariants.items.find(v => v.id === 'T_2')?.stockLevels).toEqual([
                {
                    stockLocationId: 'T_1',
                    stockOnHand: 100,
                    stockAllocated: 0,
                },
                {
                    stockLocationId: 'T_2',
                    stockOnHand: 119,
                    stockAllocated: 0,
                },
            ]);
        });

        it('creates Cancellations according to StockLocationStrategy', async () => {
            const { order } = await adminClient.query<Codegen.GetOrderQuery, Codegen.GetOrderQueryVariables>(
                GET_ORDER,
                { id: orderId },
            );
            await adminClient.query<Codegen.CancelOrderMutation, Codegen.CancelOrderMutationVariables>(
                CANCEL_ORDER,
                {
                    input: {
                        orderId,
                        cancelShipping: true,
                        reason: 'No longer needed',
                    },
                },
            );

            const { productVariants } = await adminClient.query<
                Codegen.GetVariantStockLevelsQuery,
                Codegen.GetVariantStockLevelsQueryVariables
            >(GET_VARIANT_STOCK_LEVELS, {
                options: {
                    filter: {
                        id: { in: ['T_1', 'T_2'] },
                    },
                },
            });

            // Second variant gets stock allocated from location 2
            expect(productVariants.items.find(v => v.id === 'T_1')?.stockLevels).toEqual([
                {
                    stockLocationId: 'T_1',
                    stockOnHand: 100,
                    stockAllocated: 0,
                },
                {
                    stockLocationId: 'T_2',
                    stockOnHand: 120,
                    stockAllocated: 0,
                },
            ]);

            // Second variant gets stock allocated from location 2
            expect(productVariants.items.find(v => v.id === 'T_2')?.stockLevels).toEqual([
                {
                    stockLocationId: 'T_1',
                    stockOnHand: 100,
                    stockAllocated: 0,
                },
                {
                    stockLocationId: 'T_2',
                    stockOnHand: 120,
                    stockAllocated: 0,
                },
            ]);
        });
    });
});

const STOCK_LOCATION_FRAGMENT = gql`
    fragment StockLocation on StockLocation {
        id
        name
        description
    }
`;

const GET_STOCK_LOCATION = gql`
    query GetStockLocation($id: ID!) {
        stockLocation(id: $id) {
            ...StockLocation
        }
    }
    ${STOCK_LOCATION_FRAGMENT}
`;

const GET_STOCK_LOCATIONS = gql`
    query GetStockLocations($options: StockLocationListOptions) {
        stockLocations(options: $options) {
            items {
                ...StockLocation
            }
            totalItems
        }
    }
    ${STOCK_LOCATION_FRAGMENT}
`;

const CREATE_STOCK_LOCATION = gql`
    mutation CreateStockLocation($input: CreateStockLocationInput!) {
        createStockLocation(input: $input) {
            ...StockLocation
        }
    }
    ${STOCK_LOCATION_FRAGMENT}
`;

const UPDATE_STOCK_LOCATION = gql`
    mutation UpdateStockLocation($input: UpdateStockLocationInput!) {
        updateStockLocation(input: $input) {
            ...StockLocation
        }
    }
    ${STOCK_LOCATION_FRAGMENT}
`;

const GET_VARIANT_STOCK_LEVELS = gql`
    query GetVariantStockLevels($options: ProductVariantListOptions) {
        productVariants(options: $options) {
            items {
                id
                name
                stockOnHand
                stockAllocated
                stockLevels {
                    stockLocationId
                    stockOnHand
                    stockAllocated
                }
            }
        }
    }
`;
