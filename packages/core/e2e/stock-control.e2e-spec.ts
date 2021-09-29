/* tslint:disable:no-non-null-assertion */
import { manualFulfillmentHandler, mergeConfig, OrderState } from '@vendure/core';
import { createErrorResultGuard, createTestEnvironment, ErrorResultGuard } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import { testSuccessfulPaymentMethod, twoStagePaymentMethod } from './fixtures/test-payment-methods';
import { VARIANT_WITH_STOCK_FRAGMENT } from './graphql/fragments';
import {
    CancelOrder,
    CreateAddressInput,
    CreateFulfillment,
    ErrorCode as AdminErrorCode,
    FulfillmentFragment,
    GetOrder,
    GetStockMovement,
    GlobalFlag,
    SettlePayment,
    StockMovementType,
    UpdateGlobalSettings,
    UpdateProductVariantInput,
    UpdateProductVariants,
    UpdateStock,
    VariantWithStockFragment,
} from './graphql/generated-e2e-admin-types';
import {
    AddItemToOrder,
    AddPaymentToOrder,
    ErrorCode,
    GetProductStockLevel,
    PaymentInput,
    SetShippingAddress,
    TestOrderFragmentFragment,
    TestOrderWithPaymentsFragment,
    TransitionToState,
    UpdatedOrderFragment,
} from './graphql/generated-e2e-shop-types';
import {
    CANCEL_ORDER,
    CREATE_FULFILLMENT,
    GET_ORDER,
    GET_STOCK_MOVEMENT,
    SETTLE_PAYMENT,
    UPDATE_GLOBAL_SETTINGS,
    UPDATE_PRODUCT_VARIANTS,
} from './graphql/shared-definitions';
import {
    ADD_ITEM_TO_ORDER,
    ADD_PAYMENT,
    GET_PRODUCT_WITH_STOCK_LEVEL,
    SET_SHIPPING_ADDRESS,
    TRANSITION_TO_STATE,
} from './graphql/shop-definitions';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';
import { addPaymentToOrder, proceedToArrangingPayment } from './utils/test-order-utils';

describe('Stock control', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(
        mergeConfig(testConfig, {
            paymentOptions: {
                paymentMethodHandlers: [testSuccessfulPaymentMethod, twoStagePaymentMethod],
            },
            customFields: {
                OrderLine: [{ name: 'customization', type: 'string', nullable: true }],
            },
        }),
    );

    const orderGuard: ErrorResultGuard<
        TestOrderFragmentFragment | UpdatedOrderFragment
    > = createErrorResultGuard(input => !!input.lines);

    const fulfillmentGuard: ErrorResultGuard<FulfillmentFragment> = createErrorResultGuard(
        input => !!input.state,
    );

    async function getProductWithStockMovement(productId: string) {
        const { product } = await adminClient.query<GetStockMovement.Query, GetStockMovement.Variables>(
            GET_STOCK_MOVEMENT,
            { id: productId },
        );
        return product;
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
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-stock-control.csv'),
            customerCount: 3,
        });
        await adminClient.asSuperAdmin();

        await adminClient.query<UpdateGlobalSettings.Mutation, UpdateGlobalSettings.Variables>(
            UPDATE_GLOBAL_SETTINGS,
            {
                input: {
                    trackInventory: false,
                },
            },
        );
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
        let orderId: string;

        beforeAll(async () => {
            const product = await getProductWithStockMovement('T_2');
            const [variant1, variant2, variant3] = product!.variants;

            await adminClient.query<UpdateStock.Mutation, UpdateStock.Variables>(UPDATE_STOCK_ON_HAND, {
                input: [
                    {
                        id: variant1.id,
                        stockOnHand: 5,
                        trackInventory: GlobalFlag.FALSE,
                    },
                    {
                        id: variant2.id,
                        stockOnHand: 5,
                        trackInventory: GlobalFlag.TRUE,
                    },
                    {
                        id: variant3.id,
                        stockOnHand: 5,
                        trackInventory: GlobalFlag.INHERIT,
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
            await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
                productVariantId: variant3.id,
                quantity: 4,
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

        it('creates an Allocation when order completed', async () => {
            const { addPaymentToOrder: order } = await shopClient.query<
                AddPaymentToOrder.Mutation,
                AddPaymentToOrder.Variables
            >(ADD_PAYMENT, {
                input: {
                    method: testSuccessfulPaymentMethod.code,
                    metadata: {},
                } as PaymentInput,
            });
            orderGuard.assertSuccess(order);
            expect(order).not.toBeNull();
            orderId = order.id;

            const product = await getProductWithStockMovement('T_2');
            const [variant1, variant2, variant3] = product!.variants;

            expect(variant1.stockMovements.totalItems).toBe(2);
            expect(variant1.stockMovements.items[1].type).toBe(StockMovementType.ALLOCATION);
            expect(variant1.stockMovements.items[1].quantity).toBe(2);

            expect(variant2.stockMovements.totalItems).toBe(2);
            expect(variant2.stockMovements.items[1].type).toBe(StockMovementType.ALLOCATION);
            expect(variant2.stockMovements.items[1].quantity).toBe(3);

            expect(variant3.stockMovements.totalItems).toBe(2);
            expect(variant3.stockMovements.items[1].type).toBe(StockMovementType.ALLOCATION);
            expect(variant3.stockMovements.items[1].quantity).toBe(4);
        });

        it('stockAllocated is updated according to trackInventory setting', async () => {
            const product = await getProductWithStockMovement('T_2');
            const [variant1, variant2, variant3] = product!.variants;

            // stockOnHand not changed yet
            expect(variant1.stockOnHand).toBe(5);
            expect(variant2.stockOnHand).toBe(5);
            expect(variant3.stockOnHand).toBe(5);

            expect(variant1.stockAllocated).toBe(0); // untracked inventory
            expect(variant2.stockAllocated).toBe(3); // tracked inventory
            expect(variant3.stockAllocated).toBe(0); // inherited untracked inventory
        });

        it('creates a Release on cancelling an allocated OrderItem and updates stockAllocated', async () => {
            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: orderId,
            });

            await adminClient.query<CancelOrder.Mutation, CancelOrder.Variables>(CANCEL_ORDER, {
                input: {
                    orderId: order!.id,
                    lines: [{ orderLineId: order!.lines.find(l => l.quantity === 3)!.id, quantity: 1 }],
                    reason: 'Not needed',
                },
            });

            const product = await getProductWithStockMovement('T_2');
            const [_, variant2, __] = product!.variants;

            expect(variant2.stockMovements.totalItems).toBe(3);
            expect(variant2.stockMovements.items[2].type).toBe(StockMovementType.RELEASE);
            expect(variant2.stockMovements.items[2].quantity).toBe(1);

            expect(variant2.stockAllocated).toBe(2);
        });

        it('creates a Sale on Fulfillment creation', async () => {
            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: orderId,
            });

            await adminClient.query<CreateFulfillment.Mutation, CreateFulfillment.Variables>(
                CREATE_FULFILLMENT,
                {
                    input: {
                        lines: order?.lines.map(l => ({ orderLineId: l.id, quantity: l.quantity })) ?? [],
                        handler: {
                            code: manualFulfillmentHandler.code,
                            arguments: [
                                { name: 'method', value: 'test method' },
                                { name: 'trackingCode', value: 'ABC123' },
                            ],
                        },
                    },
                },
            );

            const product = await getProductWithStockMovement('T_2');
            const [variant1, variant2, variant3] = product!.variants;

            expect(variant1.stockMovements.totalItems).toBe(3);
            expect(variant1.stockMovements.items[2].type).toBe(StockMovementType.SALE);
            expect(variant1.stockMovements.items[2].quantity).toBe(-2);

            // 4 rather than 3 since a Release was created in the previous test
            expect(variant2.stockMovements.totalItems).toBe(4);
            expect(variant2.stockMovements.items[3].type).toBe(StockMovementType.SALE);
            expect(variant2.stockMovements.items[3].quantity).toBe(-2);

            expect(variant3.stockMovements.totalItems).toBe(3);
            expect(variant3.stockMovements.items[2].type).toBe(StockMovementType.SALE);
            expect(variant3.stockMovements.items[2].quantity).toBe(-4);
        });

        it('updates stockOnHand and stockAllocated when Sales are created', async () => {
            const product = await getProductWithStockMovement('T_2');
            const [variant1, variant2, variant3] = product!.variants;

            expect(variant1.stockOnHand).toBe(5); // untracked inventory
            expect(variant2.stockOnHand).toBe(3); // tracked inventory
            expect(variant3.stockOnHand).toBe(5); // inherited untracked inventory

            expect(variant1.stockAllocated).toBe(0); // untracked inventory
            expect(variant2.stockAllocated).toBe(0); // tracked inventory
            expect(variant3.stockAllocated).toBe(0); // inherited untracked inventory
        });

        it('creates Cancellations when cancelling items which are part of a Fulfillment', async () => {
            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: orderId,
            });

            await adminClient.query<CancelOrder.Mutation, CancelOrder.Variables>(CANCEL_ORDER, {
                input: {
                    orderId: order!.id,
                    lines: order!.lines.map(l => ({ orderLineId: l.id, quantity: l.quantity })),
                    reason: 'Faulty',
                },
            });

            const product = await getProductWithStockMovement('T_2');
            const [variant1, variant2, variant3] = product!.variants;

            expect(variant1.stockMovements.totalItems).toBe(5);
            expect(variant1.stockMovements.items[3].type).toBe(StockMovementType.CANCELLATION);
            expect(variant1.stockMovements.items[4].type).toBe(StockMovementType.CANCELLATION);

            expect(variant2.stockMovements.totalItems).toBe(6);
            expect(variant2.stockMovements.items[4].type).toBe(StockMovementType.CANCELLATION);
            expect(variant2.stockMovements.items[5].type).toBe(StockMovementType.CANCELLATION);

            expect(variant3.stockMovements.totalItems).toBe(7);
            expect(variant3.stockMovements.items[3].type).toBe(StockMovementType.CANCELLATION);
            expect(variant3.stockMovements.items[4].type).toBe(StockMovementType.CANCELLATION);
            expect(variant3.stockMovements.items[5].type).toBe(StockMovementType.CANCELLATION);
            expect(variant3.stockMovements.items[6].type).toBe(StockMovementType.CANCELLATION);
        });
    });

    describe('saleable stock level', () => {
        let order: TestOrderWithPaymentsFragment;

        beforeAll(async () => {
            await adminClient.query<UpdateGlobalSettings.Mutation, UpdateGlobalSettings.Variables>(
                UPDATE_GLOBAL_SETTINGS,
                {
                    input: {
                        trackInventory: true,
                        outOfStockThreshold: -5,
                    },
                },
            );

            await adminClient.query<UpdateProductVariants.Mutation, UpdateProductVariants.Variables>(
                UPDATE_PRODUCT_VARIANTS,
                {
                    input: [
                        {
                            id: 'T_1',
                            stockOnHand: 3,
                            outOfStockThreshold: 0,
                            trackInventory: GlobalFlag.TRUE,
                            useGlobalOutOfStockThreshold: false,
                        },
                        {
                            id: 'T_2',
                            stockOnHand: 3,
                            outOfStockThreshold: 0,
                            trackInventory: GlobalFlag.FALSE,
                            useGlobalOutOfStockThreshold: false,
                        },
                        {
                            id: 'T_3',
                            stockOnHand: 3,
                            outOfStockThreshold: 2,
                            trackInventory: GlobalFlag.TRUE,
                            useGlobalOutOfStockThreshold: false,
                        },
                        {
                            id: 'T_4',
                            stockOnHand: 3,
                            outOfStockThreshold: 0,
                            trackInventory: GlobalFlag.TRUE,
                            useGlobalOutOfStockThreshold: true,
                        },
                        {
                            id: 'T_5',
                            stockOnHand: 0,
                            outOfStockThreshold: 0,
                            trackInventory: GlobalFlag.TRUE,
                            useGlobalOutOfStockThreshold: false,
                        },
                    ],
                },
            );

            await shopClient.asUserWithCredentials('trevor_donnelly96@hotmail.com', 'test');
        });

        it('stockLevel uses DefaultStockDisplayStrategy', async () => {
            const { product } = await shopClient.query<
                GetProductStockLevel.Query,
                GetProductStockLevel.Variables
            >(GET_PRODUCT_WITH_STOCK_LEVEL, {
                id: 'T_2',
            });

            expect(product?.variants.map(v => v.stockLevel)).toEqual([
                'OUT_OF_STOCK',
                'IN_STOCK',
                'IN_STOCK',
            ]);
        });

        it('does not add an empty OrderLine if zero saleable stock', async () => {
            const variantId = 'T_5';
            const { addItemToOrder } = await shopClient.query<
                AddItemToOrder.Mutation,
                AddItemToOrder.Variables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: variantId,
                quantity: 1,
            });

            orderGuard.assertErrorResult(addItemToOrder);

            expect(addItemToOrder.errorCode).toBe(ErrorCode.INSUFFICIENT_STOCK_ERROR);
            expect(addItemToOrder.message).toBe(`No items were added to the order due to insufficient stock`);
            expect((addItemToOrder as any).quantityAvailable).toBe(0);
            expect((addItemToOrder as any).order.lines.length).toBe(0);
        });

        it('returns InsufficientStockError when tracking inventory & adding too many at once', async () => {
            const variantId = 'T_1';
            const { addItemToOrder } = await shopClient.query<
                AddItemToOrder.Mutation,
                AddItemToOrder.Variables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: variantId,
                quantity: 5,
            });

            orderGuard.assertErrorResult(addItemToOrder);

            expect(addItemToOrder.errorCode).toBe(ErrorCode.INSUFFICIENT_STOCK_ERROR);
            expect(addItemToOrder.message).toBe(
                `Only 3 items were added to the order due to insufficient stock`,
            );
            expect((addItemToOrder as any).quantityAvailable).toBe(3);
            // Still adds as many as available to the Order
            expect((addItemToOrder as any).order.lines[0].productVariant.id).toBe(variantId);
            expect((addItemToOrder as any).order.lines[0].quantity).toBe(3);

            const product = await getProductWithStockMovement('T_1');
            const variant = product!.variants[0];

            expect(variant.id).toBe(variantId);
            expect(variant.stockAllocated).toBe(0);
            expect(variant.stockOnHand).toBe(3);
        });

        it('does not return error when not tracking inventory', async () => {
            const variantId = 'T_2';
            const { addItemToOrder } = await shopClient.query<
                AddItemToOrder.Mutation,
                AddItemToOrder.Variables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: variantId,
                quantity: 5,
            });

            orderGuard.assertSuccess(addItemToOrder);

            expect(addItemToOrder.lines.length).toBe(2);
            expect(addItemToOrder.lines[1].productVariant.id).toBe(variantId);
            expect(addItemToOrder.lines[1].quantity).toBe(5);

            const product = await getProductWithStockMovement('T_1');
            const variant = product!.variants[1];

            expect(variant.id).toBe(variantId);
            expect(variant.stockAllocated).toBe(0);
            expect(variant.stockOnHand).toBe(3);
        });

        it('returns InsufficientStockError for positive threshold', async () => {
            const variantId = 'T_3';
            const { addItemToOrder } = await shopClient.query<
                AddItemToOrder.Mutation,
                AddItemToOrder.Variables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: variantId,
                quantity: 2,
            });

            orderGuard.assertErrorResult(addItemToOrder);

            expect(addItemToOrder.errorCode).toBe(ErrorCode.INSUFFICIENT_STOCK_ERROR);
            expect(addItemToOrder.message).toBe(
                `Only 1 item was added to the order due to insufficient stock`,
            );
            expect((addItemToOrder as any).quantityAvailable).toBe(1);
            // Still adds as many as available to the Order
            expect((addItemToOrder as any).order.lines.length).toBe(3);
            expect((addItemToOrder as any).order.lines[2].productVariant.id).toBe(variantId);
            expect((addItemToOrder as any).order.lines[2].quantity).toBe(1);

            const product = await getProductWithStockMovement('T_1');
            const variant = product!.variants[2];

            expect(variant.id).toBe(variantId);
            expect(variant.stockAllocated).toBe(0);
            expect(variant.stockOnHand).toBe(3);
        });

        it('negative threshold allows backorder', async () => {
            const variantId = 'T_4';
            const { addItemToOrder } = await shopClient.query<
                AddItemToOrder.Mutation,
                AddItemToOrder.Variables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: variantId,
                quantity: 8,
            });

            orderGuard.assertSuccess(addItemToOrder);

            expect(addItemToOrder.lines.length).toBe(4);
            expect(addItemToOrder.lines[3].productVariant.id).toBe(variantId);
            expect(addItemToOrder.lines[3].quantity).toBe(8);

            const product = await getProductWithStockMovement('T_1');
            const variant = product!.variants[3];

            expect(variant.id).toBe(variantId);
            expect(variant.stockAllocated).toBe(0);
            expect(variant.stockOnHand).toBe(3);
        });

        it('allocates stock', async () => {
            await proceedToArrangingPayment(shopClient);
            const result = await addPaymentToOrder(shopClient, twoStagePaymentMethod);
            orderGuard.assertSuccess(result);
            order = result;

            const product = await getProductWithStockMovement('T_1');
            const [variant1, variant2, variant3, variant4] = product!.variants;

            expect(variant1.stockAllocated).toBe(3);
            expect(variant1.stockOnHand).toBe(3);

            expect(variant2.stockAllocated).toBe(0); // inventory not tracked
            expect(variant2.stockOnHand).toBe(3);

            expect(variant3.stockAllocated).toBe(1);
            expect(variant3.stockOnHand).toBe(3);

            expect(variant4.stockAllocated).toBe(8);
            expect(variant4.stockOnHand).toBe(3);
        });

        it('does not re-allocate stock when transitioning Payment from Authorized -> Settled', async () => {
            await adminClient.query<SettlePayment.Mutation, SettlePayment.Variables>(SETTLE_PAYMENT, {
                id: order.id,
            });

            const product = await getProductWithStockMovement('T_1');
            const [variant1, variant2, variant3, variant4] = product!.variants;

            expect(variant1.stockAllocated).toBe(3);
            expect(variant1.stockOnHand).toBe(3);

            expect(variant2.stockAllocated).toBe(0); // inventory not tracked
            expect(variant2.stockOnHand).toBe(3);

            expect(variant3.stockAllocated).toBe(1);
            expect(variant3.stockOnHand).toBe(3);

            expect(variant4.stockAllocated).toBe(8);
            expect(variant4.stockOnHand).toBe(3);
        });

        it('addFulfillmentToOrder returns ErrorResult when insufficient stock on hand', async () => {
            const { addFulfillmentToOrder } = await adminClient.query<
                CreateFulfillment.Mutation,
                CreateFulfillment.Variables
            >(CREATE_FULFILLMENT, {
                input: {
                    lines: order.lines.map(l => ({ orderLineId: l.id, quantity: l.quantity })),
                    handler: {
                        code: manualFulfillmentHandler.code,
                        arguments: [
                            { name: 'method', value: 'test method' },
                            { name: 'trackingCode', value: 'ABC123' },
                        ],
                    },
                },
            });

            fulfillmentGuard.assertErrorResult(addFulfillmentToOrder);

            expect(addFulfillmentToOrder.errorCode).toBe(AdminErrorCode.INSUFFICIENT_STOCK_ON_HAND_ERROR);
            expect(addFulfillmentToOrder.message).toBe(
                `Cannot create a Fulfillment as 'Laptop 15 inch 16GB' has insufficient stockOnHand (3)`,
            );
        });

        it('addFulfillmentToOrder succeeds when there is sufficient stockOnHand', async () => {
            const { addFulfillmentToOrder } = await adminClient.query<
                CreateFulfillment.Mutation,
                CreateFulfillment.Variables
            >(CREATE_FULFILLMENT, {
                input: {
                    lines: order.lines
                        .filter(l => l.productVariant.id === 'T_1')
                        .map(l => ({ orderLineId: l.id, quantity: l.quantity })),
                    handler: {
                        code: manualFulfillmentHandler.code,
                        arguments: [
                            { name: 'method', value: 'test method' },
                            { name: 'trackingCode', value: 'ABC123' },
                        ],
                    },
                },
            });

            fulfillmentGuard.assertSuccess(addFulfillmentToOrder);

            const product = await getProductWithStockMovement('T_1');
            const variant = product!.variants[0];

            expect(variant.stockOnHand).toBe(0);
            expect(variant.stockAllocated).toBe(0);
        });

        it('addFulfillmentToOrder succeeds when inventory is not being tracked', async () => {
            const { addFulfillmentToOrder } = await adminClient.query<
                CreateFulfillment.Mutation,
                CreateFulfillment.Variables
            >(CREATE_FULFILLMENT, {
                input: {
                    lines: order.lines
                        .filter(l => l.productVariant.id === 'T_2')
                        .map(l => ({ orderLineId: l.id, quantity: l.quantity })),
                    handler: {
                        code: manualFulfillmentHandler.code,
                        arguments: [
                            { name: 'method', value: 'test method' },
                            { name: 'trackingCode', value: 'ABC123' },
                        ],
                    },
                },
            });

            fulfillmentGuard.assertSuccess(addFulfillmentToOrder);

            const product = await getProductWithStockMovement('T_1');
            const variant = product!.variants[1];

            expect(variant.stockOnHand).toBe(3);
            expect(variant.stockAllocated).toBe(0);
        });

        it('addFulfillmentToOrder succeeds when making a partial Fulfillment with quantity equal to stockOnHand', async () => {
            const { addFulfillmentToOrder } = await adminClient.query<
                CreateFulfillment.Mutation,
                CreateFulfillment.Variables
            >(CREATE_FULFILLMENT, {
                input: {
                    lines: order.lines
                        .filter(l => l.productVariant.id === 'T_4')
                        .map(l => ({ orderLineId: l.id, quantity: 3 })), // we know there are only 3 on hand
                    handler: {
                        code: manualFulfillmentHandler.code,
                        arguments: [
                            { name: 'method', value: 'test method' },
                            { name: 'trackingCode', value: 'ABC123' },
                        ],
                    },
                },
            });

            fulfillmentGuard.assertSuccess(addFulfillmentToOrder);

            const product = await getProductWithStockMovement('T_1');
            const variant = product!.variants[3];

            expect(variant.stockOnHand).toBe(0);
            expect(variant.stockAllocated).toBe(5);
        });

        it('fulfillment can be created after adjusting stockOnHand to be sufficient', async () => {
            const { updateProductVariants } = await adminClient.query<
                UpdateProductVariants.Mutation,
                UpdateProductVariants.Variables
            >(UPDATE_PRODUCT_VARIANTS, {
                input: [
                    {
                        id: 'T_4',
                        stockOnHand: 10,
                    },
                ],
            });

            expect(updateProductVariants[0]!.stockOnHand).toBe(10);

            const { addFulfillmentToOrder } = await adminClient.query<
                CreateFulfillment.Mutation,
                CreateFulfillment.Variables
            >(CREATE_FULFILLMENT, {
                input: {
                    lines: order.lines
                        .filter(l => l.productVariant.id === 'T_4')
                        .map(l => ({ orderLineId: l.id, quantity: 5 })),
                    handler: {
                        code: manualFulfillmentHandler.code,
                        arguments: [
                            { name: 'method', value: 'test method' },
                            { name: 'trackingCode', value: 'ABC123' },
                        ],
                    },
                },
            });

            fulfillmentGuard.assertSuccess(addFulfillmentToOrder);

            const product = await getProductWithStockMovement('T_1');
            const variant = product!.variants[3];

            expect(variant.stockOnHand).toBe(5);
            expect(variant.stockAllocated).toBe(0);
        });

        describe('edge cases', () => {
            const variant5Id = 'T_5';
            const variant6Id = 'T_6';

            beforeAll(async () => {
                // First place an order which creates a backorder (excess of allocated units)
                await adminClient.query<UpdateProductVariants.Mutation, UpdateProductVariants.Variables>(
                    UPDATE_PRODUCT_VARIANTS,
                    {
                        input: [
                            {
                                id: variant5Id,
                                stockOnHand: 5,
                                outOfStockThreshold: -20,
                                trackInventory: GlobalFlag.TRUE,
                                useGlobalOutOfStockThreshold: false,
                            },
                            {
                                id: variant6Id,
                                stockOnHand: 3,
                                outOfStockThreshold: 0,
                                trackInventory: GlobalFlag.TRUE,
                                useGlobalOutOfStockThreshold: false,
                            },
                        ],
                    },
                );
                await shopClient.asUserWithCredentials('trevor_donnelly96@hotmail.com', 'test');
                const { addItemToOrder: add1 } = await shopClient.query<
                    AddItemToOrder.Mutation,
                    AddItemToOrder.Variables
                >(ADD_ITEM_TO_ORDER, {
                    productVariantId: variant5Id,
                    quantity: 25,
                });
                orderGuard.assertSuccess(add1);
                await proceedToArrangingPayment(shopClient);
                await addPaymentToOrder(shopClient, testSuccessfulPaymentMethod);
            });

            it('zero saleable stock', async () => {
                await shopClient.asUserWithCredentials('hayden.zieme12@hotmail.com', 'test');
                // The saleable stock level is now 0 (25 allocated, 5 on hand, -20 threshold)
                const { addItemToOrder } = await shopClient.query<
                    AddItemToOrder.Mutation,
                    AddItemToOrder.Variables
                >(ADD_ITEM_TO_ORDER, {
                    productVariantId: variant5Id,
                    quantity: 1,
                });
                orderGuard.assertErrorResult(addItemToOrder);

                expect(addItemToOrder.errorCode).toBe(ErrorCode.INSUFFICIENT_STOCK_ERROR);
                expect(addItemToOrder.message).toBe(
                    `No items were added to the order due to insufficient stock`,
                );
            });

            it('negative saleable stock', async () => {
                await adminClient.query<UpdateProductVariants.Mutation, UpdateProductVariants.Variables>(
                    UPDATE_PRODUCT_VARIANTS,
                    {
                        input: [
                            {
                                id: variant5Id,
                                outOfStockThreshold: -10,
                            },
                        ],
                    },
                );
                // The saleable stock level is now -10 (25 allocated, 5 on hand, -10 threshold)
                await shopClient.asUserWithCredentials('marques.sawayn@hotmail.com', 'test');
                const { addItemToOrder } = await shopClient.query<
                    AddItemToOrder.Mutation,
                    AddItemToOrder.Variables
                >(ADD_ITEM_TO_ORDER, {
                    productVariantId: variant5Id,
                    quantity: 1,
                });
                orderGuard.assertErrorResult(addItemToOrder);

                expect(addItemToOrder.errorCode).toBe(ErrorCode.INSUFFICIENT_STOCK_ERROR);
                expect(addItemToOrder.message).toBe(
                    `No items were added to the order due to insufficient stock`,
                );
            });

            // https://github.com/vendure-ecommerce/vendure/issues/691
            it('returns InsufficientStockError when tracking inventory & adding too many individually', async () => {
                await shopClient.asAnonymousUser();
                const { addItemToOrder: add1 } = await shopClient.query<
                    AddItemToOrder.Mutation,
                    AddItemToOrder.Variables
                >(ADD_ITEM_TO_ORDER, {
                    productVariantId: variant6Id,
                    quantity: 3,
                });

                orderGuard.assertSuccess(add1);

                const { addItemToOrder: add2 } = await shopClient.query<
                    AddItemToOrder.Mutation,
                    AddItemToOrder.Variables
                >(ADD_ITEM_TO_ORDER, {
                    productVariantId: variant6Id,
                    quantity: 1,
                });

                orderGuard.assertErrorResult(add2);

                expect(add2.errorCode).toBe(ErrorCode.INSUFFICIENT_STOCK_ERROR);
                expect(add2.message).toBe(`No items were added to the order due to insufficient stock`);
                expect((add2 as any).quantityAvailable).toBe(0);
                // Still adds as many as available to the Order
                expect((add2 as any).order.lines[0].productVariant.id).toBe(variant6Id);
                expect((add2 as any).order.lines[0].quantity).toBe(3);
            });
        });
    });

    // https://github.com/vendure-ecommerce/vendure/issues/1028
    describe('OrderLines with same variant but different custom fields', () => {
        let orderId: string;

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

        it('correctly allocates stock', async () => {
            await shopClient.asUserWithCredentials('trevor_donnelly96@hotmail.com', 'test');

            const product = await getProductWithStockMovement('T_2');
            const [variant1, variant2, variant3] = product!.variants;

            expect(variant2.stockAllocated).toBe(0);

            await shopClient.query<AddItemToOrder.Mutation, any>(gql(ADD_ITEM_TO_ORDER_WITH_CUSTOM_FIELDS), {
                productVariantId: variant2.id,
                quantity: 1,
                customFields: {
                    customization: 'foo',
                },
            });
            const { addItemToOrder } = await shopClient.query<AddItemToOrder.Mutation, any>(
                gql(ADD_ITEM_TO_ORDER_WITH_CUSTOM_FIELDS),
                {
                    productVariantId: variant2.id,
                    quantity: 1,
                    customFields: {
                        customization: 'bar',
                    },
                },
            );

            orderGuard.assertSuccess(addItemToOrder);
            orderId = addItemToOrder.id;
            // Assert that separate order lines have been created
            expect(addItemToOrder.lines.length).toBe(2);

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
                {
                    state: 'ArrangingPayment',
                },
            );
            const { addPaymentToOrder: order } = await shopClient.query<
                AddPaymentToOrder.Mutation,
                AddPaymentToOrder.Variables
            >(ADD_PAYMENT, {
                input: {
                    method: testSuccessfulPaymentMethod.code,
                    metadata: {},
                } as PaymentInput,
            });
            orderGuard.assertSuccess(order);

            const product2 = await getProductWithStockMovement('T_2');
            const [variant1_2, variant2_2, variant3_2] = product2!.variants;

            expect(variant2_2.stockAllocated).toBe(2);
        });

        it('correctly creates Sales', async () => {
            const product = await getProductWithStockMovement('T_2');
            const [variant1, variant2, variant3] = product!.variants;

            expect(variant2.stockOnHand).toBe(3);

            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: orderId,
            });

            await adminClient.query<CreateFulfillment.Mutation, CreateFulfillment.Variables>(
                CREATE_FULFILLMENT,
                {
                    input: {
                        lines: order?.lines.map(l => ({ orderLineId: l.id, quantity: l.quantity })) ?? [],
                        handler: {
                            code: manualFulfillmentHandler.code,
                            arguments: [
                                { name: 'method', value: 'test method' },
                                { name: 'trackingCode', value: 'ABC123' },
                            ],
                        },
                    },
                },
            );

            const product2 = await getProductWithStockMovement('T_2');
            const [variant1_2, variant2_2, variant3_2] = product2!.variants;

            expect(variant2_2.stockAllocated).toBe(0);
            expect(variant2_2.stockOnHand).toBe(1);
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
