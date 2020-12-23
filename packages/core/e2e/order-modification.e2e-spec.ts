/* tslint:disable:no-non-null-assertion */
import { omit } from '@vendure/common/lib/omit';
import { pick } from '@vendure/common/lib/pick';
import {
    defaultShippingCalculator,
    defaultShippingEligibilityChecker,
    mergeConfig,
    ShippingCalculator,
} from '@vendure/core';
import { createErrorResultGuard, createTestEnvironment, ErrorResultGuard } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';
import { manualFulfillmentHandler } from '../src/config/fulfillment/manual-fulfillment-handler';

import { testSuccessfulPaymentMethod } from './fixtures/test-payment-methods';
import {
    AddManualPayment,
    AdminTransition,
    CreateShippingMethod,
    ErrorCode,
    GetOrder,
    GetOrderHistory,
    GetOrderWithModifications,
    GlobalFlag,
    HistoryEntryType,
    LanguageCode,
    ModifyOrder,
    OrderFragment,
    OrderWithLinesFragment,
    OrderWithModificationsFragment,
    UpdateProductVariants,
} from './graphql/generated-e2e-admin-types';
import {
    AddItemToOrderMutationVariables,
    SetShippingAddress,
    SetShippingMethod,
    TestOrderWithPaymentsFragment,
    TransitionToState,
    UpdatedOrderFragment,
} from './graphql/generated-e2e-shop-types';
import {
    ADMIN_TRANSITION_TO_STATE,
    CREATE_SHIPPING_METHOD,
    GET_ORDER,
    GET_ORDER_HISTORY,
    UPDATE_PRODUCT_VARIANTS,
} from './graphql/shared-definitions';
import { SET_SHIPPING_ADDRESS, SET_SHIPPING_METHOD, TRANSITION_TO_STATE } from './graphql/shop-definitions';
import { addPaymentToOrder, proceedToArrangingPayment } from './utils/test-order-utils';

const SHIPPING_GB = 500;
const SHIPPING_US = 1000;
const SHIPPING_OTHER = 750;
const testCalculator = new ShippingCalculator({
    code: 'test-calculator',
    description: [{ languageCode: LanguageCode.en, value: 'Has metadata' }],
    args: {},
    calculate: (ctx, order, args) => {
        let price;
        switch (order.shippingAddress.countryCode) {
            case 'GB':
                price = SHIPPING_GB;
                break;
            case 'US':
                price = SHIPPING_US;
                break;
            default:
                price = SHIPPING_OTHER;
        }
        return {
            price,
            priceIncludesTax: true,
            taxRate: 20,
        };
    },
});

describe('Order modification', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(
        mergeConfig(testConfig, {
            paymentOptions: {
                paymentMethodHandlers: [testSuccessfulPaymentMethod],
            },
            shippingOptions: {
                shippingCalculators: [defaultShippingCalculator, testCalculator],
            },
            customFields: {
                Order: [{ name: 'points', type: 'int', defaultValue: 0 }],
                OrderLine: [{ name: 'color', type: 'string', nullable: true }],
            },
        }),
    );

    let orderId: string;
    let testShippingMethodId: string;
    const orderGuard: ErrorResultGuard<
        UpdatedOrderFragment | OrderWithModificationsFragment | OrderFragment
    > = createErrorResultGuard(input => !!input.id);

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
            customerCount: 2,
        });
        await adminClient.asSuperAdmin();

        await adminClient.query<UpdateProductVariants.Mutation, UpdateProductVariants.Variables>(
            UPDATE_PRODUCT_VARIANTS,
            {
                input: [
                    {
                        id: 'T_1',
                        trackInventory: GlobalFlag.TRUE,
                    },
                    {
                        id: 'T_2',
                        trackInventory: GlobalFlag.TRUE,
                    },
                    {
                        id: 'T_3',
                        trackInventory: GlobalFlag.TRUE,
                    },
                ],
            },
        );

        const { createShippingMethod } = await adminClient.query<
            CreateShippingMethod.Mutation,
            CreateShippingMethod.Variables
        >(CREATE_SHIPPING_METHOD, {
            input: {
                code: 'new-method',
                fulfillmentHandler: manualFulfillmentHandler.code,
                checker: {
                    code: defaultShippingEligibilityChecker.code,
                    arguments: [
                        {
                            name: 'orderMinimum',
                            value: '0',
                        },
                    ],
                },
                calculator: {
                    code: testCalculator.code,
                    arguments: [],
                },
                translations: [{ languageCode: LanguageCode.en, name: 'test method', description: '' }],
            },
        });
        testShippingMethodId = createShippingMethod.id;

        // create an order and check out
        await shopClient.asUserWithCredentials('hayden.zieme12@hotmail.com', 'test');
        await shopClient.query(gql(ADD_ITEM_TO_ORDER_WITH_CUSTOM_FIELDS), {
            productVariantId: 'T_1',
            quantity: 1,
            customFields: {
                color: 'green',
            },
        } as any);
        await shopClient.query(gql(ADD_ITEM_TO_ORDER_WITH_CUSTOM_FIELDS), {
            productVariantId: 'T_4',
            quantity: 2,
        });
        await proceedToArrangingPayment(shopClient);
        const result = await addPaymentToOrder(shopClient, testSuccessfulPaymentMethod);
        orderGuard.assertSuccess(result);
        orderId = result.id;
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('modifyOrder returns error result when not in Modifying state', async () => {
        const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
            id: orderId,
        });
        const { modifyOrder } = await adminClient.query<ModifyOrder.Mutation, ModifyOrder.Variables>(
            MODIFY_ORDER,
            {
                input: {
                    dryRun: false,
                    orderId,
                    adjustOrderLines: order!.lines.map(l => ({ orderLineId: l.id, quantity: 3 })),
                },
            },
        );

        orderGuard.assertErrorResult(modifyOrder);
        expect(modifyOrder.errorCode).toBe(ErrorCode.ORDER_MODIFICATION_STATE_ERROR);
    });

    it('transition to Modifying state', async () => {
        const { transitionOrderToState } = await adminClient.query<
            AdminTransition.Mutation,
            AdminTransition.Variables
        >(ADMIN_TRANSITION_TO_STATE, {
            id: orderId,
            state: 'Modifying',
        });
        orderGuard.assertSuccess(transitionOrderToState);

        expect(transitionOrderToState.state).toBe('Modifying');
    });

    describe('error cases', () => {
        it('no changes specified error', async () => {
            const { modifyOrder } = await adminClient.query<ModifyOrder.Mutation, ModifyOrder.Variables>(
                MODIFY_ORDER,
                {
                    input: {
                        dryRun: false,
                        orderId,
                    },
                },
            );

            orderGuard.assertErrorResult(modifyOrder);

            expect(modifyOrder.errorCode).toBe(ErrorCode.NO_CHANGES_SPECIFIED_ERROR);
        });

        it('no refund paymentId specified', async () => {
            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: orderId,
            });
            const { modifyOrder } = await adminClient.query<ModifyOrder.Mutation, ModifyOrder.Variables>(
                MODIFY_ORDER,
                {
                    input: {
                        dryRun: false,
                        orderId,
                        surcharges: [{ price: -500, priceIncludesTax: true, description: 'Discount' }],
                    },
                },
            );
            orderGuard.assertErrorResult(modifyOrder);

            expect(modifyOrder.errorCode).toBe(ErrorCode.REFUND_PAYMENT_ID_MISSING_ERROR);
            await assertOrderIsUnchanged(order!);
        });

        it('addItems negative quantity', async () => {
            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: orderId,
            });
            const { modifyOrder } = await adminClient.query<ModifyOrder.Mutation, ModifyOrder.Variables>(
                MODIFY_ORDER,
                {
                    input: {
                        dryRun: false,
                        orderId,
                        addItems: [{ productVariantId: 'T_3', quantity: -1 }],
                    },
                },
            );
            orderGuard.assertErrorResult(modifyOrder);

            expect(modifyOrder.errorCode).toBe(ErrorCode.NEGATIVE_QUANTITY_ERROR);
            await assertOrderIsUnchanged(order!);
        });

        it('adjustOrderLines negative quantity', async () => {
            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: orderId,
            });
            const { modifyOrder } = await adminClient.query<ModifyOrder.Mutation, ModifyOrder.Variables>(
                MODIFY_ORDER,
                {
                    input: {
                        dryRun: false,
                        orderId,
                        adjustOrderLines: [{ orderLineId: order!.lines[0].id, quantity: -1 }],
                    },
                },
            );
            orderGuard.assertErrorResult(modifyOrder);

            expect(modifyOrder.errorCode).toBe(ErrorCode.NEGATIVE_QUANTITY_ERROR);
            await assertOrderIsUnchanged(order!);
        });

        it('addItems insufficient stock', async () => {
            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: orderId,
            });
            const { modifyOrder } = await adminClient.query<ModifyOrder.Mutation, ModifyOrder.Variables>(
                MODIFY_ORDER,
                {
                    input: {
                        dryRun: false,
                        orderId,
                        addItems: [{ productVariantId: 'T_3', quantity: 500 }],
                    },
                },
            );
            orderGuard.assertErrorResult(modifyOrder);

            expect(modifyOrder.errorCode).toBe(ErrorCode.INSUFFICIENT_STOCK_ERROR);
            await assertOrderIsUnchanged(order!);
        });

        it('adjustOrderLines insufficient stock', async () => {
            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: orderId,
            });
            const { modifyOrder } = await adminClient.query<ModifyOrder.Mutation, ModifyOrder.Variables>(
                MODIFY_ORDER,
                {
                    input: {
                        dryRun: false,
                        orderId,
                        adjustOrderLines: [{ orderLineId: order!.lines[0].id, quantity: 500 }],
                    },
                },
            );
            orderGuard.assertErrorResult(modifyOrder);

            expect(modifyOrder.errorCode).toBe(ErrorCode.INSUFFICIENT_STOCK_ERROR);
            await assertOrderIsUnchanged(order!);
        });

        it('addItems order limit', async () => {
            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: orderId,
            });
            const { modifyOrder } = await adminClient.query<ModifyOrder.Mutation, ModifyOrder.Variables>(
                MODIFY_ORDER,
                {
                    input: {
                        dryRun: false,
                        orderId,
                        addItems: [{ productVariantId: 'T_4', quantity: 9999 }],
                    },
                },
            );
            orderGuard.assertErrorResult(modifyOrder);

            expect(modifyOrder.errorCode).toBe(ErrorCode.ORDER_LIMIT_ERROR);
            await assertOrderIsUnchanged(order!);
        });

        it('adjustOrderLines order limit', async () => {
            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: orderId,
            });
            const { modifyOrder } = await adminClient.query<ModifyOrder.Mutation, ModifyOrder.Variables>(
                MODIFY_ORDER,
                {
                    input: {
                        dryRun: false,
                        orderId,
                        adjustOrderLines: [{ orderLineId: order!.lines[1].id, quantity: 9999 }],
                    },
                },
            );
            orderGuard.assertErrorResult(modifyOrder);

            expect(modifyOrder.errorCode).toBe(ErrorCode.ORDER_LIMIT_ERROR);
            await assertOrderIsUnchanged(order!);
        });
    });

    describe('dry run', () => {
        it('addItems', async () => {
            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: orderId,
            });
            const { modifyOrder } = await adminClient.query<ModifyOrder.Mutation, ModifyOrder.Variables>(
                MODIFY_ORDER,
                {
                    input: {
                        dryRun: true,
                        orderId,
                        addItems: [{ productVariantId: 'T_5', quantity: 1 }],
                    },
                },
            );
            orderGuard.assertSuccess(modifyOrder);

            const expectedTotal = order!.totalWithTax + Math.round(14374 * 1.2); // price of variant T_5
            expect(modifyOrder.totalWithTax).toBe(expectedTotal);
            expect(modifyOrder.lines.length).toBe(order!.lines.length + 1);
            await assertOrderIsUnchanged(order!);
        });

        it('addItems with existing variant id increments existing OrderLine', async () => {
            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: orderId,
            });
            const { modifyOrder } = await adminClient.query<ModifyOrder.Mutation, ModifyOrder.Variables>(
                MODIFY_ORDER,
                {
                    input: {
                        dryRun: true,
                        orderId,
                        addItems: [
                            { productVariantId: 'T_1', quantity: 1, customFields: { color: 'green' } } as any,
                        ],
                    },
                },
            );
            orderGuard.assertSuccess(modifyOrder);

            const lineT1 = modifyOrder.lines.find(l => l.productVariant.id === 'T_1');
            expect(modifyOrder.lines.length).toBe(2);
            expect(lineT1?.quantity).toBe(2);
            await assertOrderIsUnchanged(order!);
        });

        it('addItems with existing variant id but different customFields adds new OrderLine', async () => {
            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: orderId,
            });
            const { modifyOrder } = await adminClient.query<ModifyOrder.Mutation, ModifyOrder.Variables>(
                MODIFY_ORDER,
                {
                    input: {
                        dryRun: true,
                        orderId,
                        addItems: [
                            { productVariantId: 'T_1', quantity: 1, customFields: { color: 'blue' } } as any,
                        ],
                    },
                },
            );
            orderGuard.assertSuccess(modifyOrder);

            const lineT1 = modifyOrder.lines.find(l => l.productVariant.id === 'T_1');
            expect(modifyOrder.lines.length).toBe(3);
            expect(
                modifyOrder.lines.map(l => ({ variantId: l.productVariant.id, quantity: l.quantity })),
            ).toEqual([
                { variantId: 'T_1', quantity: 1 },
                { variantId: 'T_4', quantity: 2 },
                { variantId: 'T_1', quantity: 1 },
            ]);
            await assertOrderIsUnchanged(order!);
        });

        it('adjustOrderLines up', async () => {
            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: orderId,
            });
            const { modifyOrder } = await adminClient.query<ModifyOrder.Mutation, ModifyOrder.Variables>(
                MODIFY_ORDER,
                {
                    input: {
                        dryRun: true,
                        orderId,
                        adjustOrderLines: [{ orderLineId: order!.lines[0].id, quantity: 3 }],
                    },
                },
            );
            orderGuard.assertSuccess(modifyOrder);

            const expectedTotal = order!.totalWithTax + order!.lines[0].unitPriceWithTax * 2;
            expect(modifyOrder.lines[0].items.length).toBe(3);
            expect(modifyOrder.totalWithTax).toBe(expectedTotal);
            await assertOrderIsUnchanged(order!);
        });

        it('adjustOrderLines down', async () => {
            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: orderId,
            });
            const { modifyOrder } = await adminClient.query<ModifyOrder.Mutation, ModifyOrder.Variables>(
                MODIFY_ORDER,
                {
                    input: {
                        dryRun: true,
                        orderId,
                        adjustOrderLines: [{ orderLineId: order!.lines[1].id, quantity: 1 }],
                    },
                },
            );
            orderGuard.assertSuccess(modifyOrder);

            const expectedTotal = order!.totalWithTax - order!.lines[1].unitPriceWithTax;
            expect(modifyOrder.lines[1].items.filter(i => i.cancelled).length).toBe(1);
            expect(modifyOrder.lines[1].items.filter(i => !i.cancelled).length).toBe(1);
            expect(modifyOrder.totalWithTax).toBe(expectedTotal);
            await assertOrderIsUnchanged(order!);
        });

        it('adjustOrderLines to zero', async () => {
            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: orderId,
            });
            const { modifyOrder } = await adminClient.query<ModifyOrder.Mutation, ModifyOrder.Variables>(
                MODIFY_ORDER,
                {
                    input: {
                        dryRun: true,
                        orderId,
                        adjustOrderLines: [{ orderLineId: order!.lines[0].id, quantity: 0 }],
                    },
                },
            );
            orderGuard.assertSuccess(modifyOrder);

            const expectedTotal = order!.totalWithTax - order!.lines[0].linePriceWithTax;
            expect(modifyOrder.totalWithTax).toBe(expectedTotal);
            expect(modifyOrder.lines[0].items.every(i => i.cancelled)).toBe(true);
            await assertOrderIsUnchanged(order!);
        });

        it('surcharge positive', async () => {
            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: orderId,
            });
            const { modifyOrder } = await adminClient.query<ModifyOrder.Mutation, ModifyOrder.Variables>(
                MODIFY_ORDER,
                {
                    input: {
                        dryRun: true,
                        orderId,
                        surcharges: [
                            {
                                description: 'extra fee',
                                sku: '123',
                                price: 300,
                                priceIncludesTax: true,
                                taxRate: 20,
                                taxDescription: 'VAT',
                            },
                        ],
                    },
                },
            );
            orderGuard.assertSuccess(modifyOrder);

            const expectedTotal = order!.totalWithTax + 300;
            expect(modifyOrder.totalWithTax).toBe(expectedTotal);
            expect(modifyOrder.surcharges.map(s => omit(s, ['id']))).toEqual([
                {
                    description: 'extra fee',
                    sku: '123',
                    price: 250,
                    priceWithTax: 300,
                    taxRate: 20,
                },
            ]);
            await assertOrderIsUnchanged(order!);
        });

        it('surcharge negative', async () => {
            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: orderId,
            });
            const { modifyOrder } = await adminClient.query<ModifyOrder.Mutation, ModifyOrder.Variables>(
                MODIFY_ORDER,
                {
                    input: {
                        dryRun: true,
                        orderId,
                        surcharges: [
                            {
                                description: 'special discount',
                                sku: '123',
                                price: -300,
                                priceIncludesTax: true,
                                taxRate: 20,
                                taxDescription: 'VAT',
                            },
                        ],
                    },
                },
            );
            orderGuard.assertSuccess(modifyOrder);

            const expectedTotal = order!.totalWithTax + -300;
            expect(modifyOrder.totalWithTax).toBe(expectedTotal);
            expect(modifyOrder.surcharges.map(s => omit(s, ['id']))).toEqual([
                {
                    description: 'special discount',
                    sku: '123',
                    price: -250,
                    priceWithTax: -300,
                    taxRate: 20,
                },
            ]);
            await assertOrderIsUnchanged(order!);
        });

        it('does not add a history entry', async () => {
            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: orderId,
            });
            const { modifyOrder } = await adminClient.query<ModifyOrder.Mutation, ModifyOrder.Variables>(
                MODIFY_ORDER,
                {
                    input: {
                        dryRun: true,
                        orderId,
                        addItems: [{ productVariantId: 'T_5', quantity: 1 }],
                    },
                },
            );
            orderGuard.assertSuccess(modifyOrder);

            const { order: history } = await adminClient.query<
                GetOrderHistory.Query,
                GetOrderHistory.Variables
            >(GET_ORDER_HISTORY, {
                id: orderId,
                options: { filter: { type: { eq: HistoryEntryType.ORDER_MODIFIED } } },
            });
            orderGuard.assertSuccess(history);

            expect(history.history.totalItems).toBe(0);
        });
    });

    describe('wet run', () => {
        async function assertModifiedOrderIsPersisted(order: OrderWithModificationsFragment) {
            const { order: order2 } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: order.id,
            });
            expect(order2!.totalWithTax).toBe(order!.totalWithTax);
            expect(order2!.lines.length).toBe(order!.lines.length);
            expect(order2!.surcharges.length).toBe(order!.surcharges.length);
            expect(order2!.payments!.length).toBe(order!.payments!.length);
            expect(order2!.payments!.map(p => pick(p, ['id', 'amount', 'method']))).toEqual(
                order!.payments!.map(p => pick(p, ['id', 'amount', 'method'])),
            );
        }

        it('addItems', async () => {
            const order = await createOrderAndTransitionToModifyingState([
                {
                    productVariantId: 'T_1',
                    quantity: 1,
                },
            ]);
            const { modifyOrder } = await adminClient.query<ModifyOrder.Mutation, ModifyOrder.Variables>(
                MODIFY_ORDER,
                {
                    input: {
                        dryRun: false,
                        orderId: order.id,
                        addItems: [{ productVariantId: 'T_5', quantity: 1 }],
                    },
                },
            );
            orderGuard.assertSuccess(modifyOrder);

            const priceDelta = Math.round(14374 * 1.2); // price of variant T_5
            const expectedTotal = order!.totalWithTax + priceDelta;
            expect(modifyOrder.totalWithTax).toBe(expectedTotal);
            expect(modifyOrder.lines.length).toBe(order!.lines.length + 1);
            expect(modifyOrder.modifications.length).toBe(1);
            expect(modifyOrder.modifications[0].priceChange).toBe(priceDelta);
            expect(modifyOrder.modifications[0].orderItems?.length).toBe(1);
            expect(modifyOrder.modifications[0].orderItems?.map(i => i.id)).toEqual([
                modifyOrder.lines[1].items[0].id,
            ]);

            await assertModifiedOrderIsPersisted(modifyOrder);
        });

        it('adjustOrderLines up', async () => {
            const order = await createOrderAndTransitionToModifyingState([
                {
                    productVariantId: 'T_1',
                    quantity: 1,
                },
            ]);
            const { modifyOrder } = await adminClient.query<ModifyOrder.Mutation, ModifyOrder.Variables>(
                MODIFY_ORDER,
                {
                    input: {
                        dryRun: false,
                        orderId: order.id,
                        adjustOrderLines: [{ orderLineId: order!.lines[0].id, quantity: 2 }],
                    },
                },
            );
            orderGuard.assertSuccess(modifyOrder);

            const priceDelta = order!.lines[0].unitPriceWithTax;
            const expectedTotal = order!.totalWithTax + priceDelta;
            expect(modifyOrder.totalWithTax).toBe(expectedTotal);
            expect(modifyOrder.lines[0].quantity).toBe(2);
            expect(modifyOrder.modifications.length).toBe(1);
            expect(modifyOrder.modifications[0].priceChange).toBe(priceDelta);
            expect(modifyOrder.modifications[0].orderItems?.length).toBe(1);
            expect(
                modifyOrder.lines[0].items
                    .map(i => i.id)
                    .includes(modifyOrder.modifications?.[0].orderItems?.[0].id as string),
            ).toBe(true);
            await assertModifiedOrderIsPersisted(modifyOrder);
        });

        it('adjustOrderLines down', async () => {
            const order = await createOrderAndTransitionToModifyingState([
                {
                    productVariantId: 'T_1',
                    quantity: 2,
                },
            ]);
            const { modifyOrder } = await adminClient.query<ModifyOrder.Mutation, ModifyOrder.Variables>(
                MODIFY_ORDER,
                {
                    input: {
                        dryRun: false,
                        orderId: order.id,
                        adjustOrderLines: [{ orderLineId: order!.lines[0].id, quantity: 1 }],
                        refund: { paymentId: order!.payments![0].id },
                    },
                },
            );
            orderGuard.assertSuccess(modifyOrder);

            const priceDelta = -order!.lines[0].unitPriceWithTax;
            const expectedTotal = order!.totalWithTax + priceDelta;
            expect(modifyOrder.totalWithTax).toBe(expectedTotal);
            expect(modifyOrder.lines[0].quantity).toBe(1);
            expect(modifyOrder.payments?.length).toBe(1);
            expect(modifyOrder.payments?.[0].refunds.length).toBe(1);
            expect(modifyOrder.payments?.[0].refunds[0]).toEqual({
                id: 'T_1',
                state: 'Pending',
                total: -priceDelta,
                paymentId: modifyOrder.payments?.[0].id,
            });
            expect(modifyOrder.modifications.length).toBe(1);
            expect(modifyOrder.modifications[0].priceChange).toBe(priceDelta);
            expect(modifyOrder.modifications[0].surcharges).toEqual(modifyOrder.surcharges.map(pick(['id'])));
            expect(modifyOrder.modifications[0].orderItems?.length).toBe(1);
            expect(
                modifyOrder.lines[0].items
                    .map(i => i.id)
                    .includes(modifyOrder.modifications?.[0].orderItems?.[0].id as string),
            ).toBe(true);
            await assertModifiedOrderIsPersisted(modifyOrder);
        });

        it('adjustOrderLines with changed customField value', async () => {
            const order = await createOrderAndTransitionToModifyingState([
                {
                    productVariantId: 'T_1',
                    quantity: 1,
                    customFields: {
                        color: 'green',
                    },
                },
            ]);
            const { modifyOrder } = await adminClient.query<ModifyOrder.Mutation, ModifyOrder.Variables>(
                MODIFY_ORDER,
                {
                    input: {
                        dryRun: false,
                        orderId: order.id,
                        adjustOrderLines: [
                            {
                                orderLineId: order!.lines[0].id,
                                quantity: 1,
                                customFields: { color: 'black' },
                            } as any,
                        ],
                    },
                },
            );
            orderGuard.assertSuccess(modifyOrder);
            expect(modifyOrder.lines.length).toBe(1);

            const { order: orderWithLines } = await adminClient.query(gql(GET_ORDER_WITH_CUSTOM_FIELDS), {
                id: order.id,
            });
            expect(orderWithLines.lines[0]).toEqual({
                id: order!.lines[0].id,
                customFields: { color: 'black' },
            });
        });

        it('adjustOrderLines handles quantity correctly', async () => {
            await adminClient.query<UpdateProductVariants.Mutation, UpdateProductVariants.Variables>(
                UPDATE_PRODUCT_VARIANTS,
                {
                    input: [
                        {
                            id: 'T_6',
                            stockOnHand: 1,
                            trackInventory: GlobalFlag.TRUE,
                        },
                    ],
                },
            );
            const order = await createOrderAndTransitionToModifyingState([
                {
                    productVariantId: 'T_6',
                    quantity: 1,
                },
            ]);
            const { modifyOrder } = await adminClient.query<ModifyOrder.Mutation, ModifyOrder.Variables>(
                MODIFY_ORDER,
                {
                    input: {
                        dryRun: false,
                        orderId: order.id,
                        adjustOrderLines: [
                            {
                                orderLineId: order.lines[0].id,
                                quantity: 1,
                            },
                        ],
                        updateShippingAddress: {
                            fullName: 'Jim',
                        },
                    },
                },
            );
            orderGuard.assertSuccess(modifyOrder);
        });

        it('surcharge positive', async () => {
            const order = await createOrderAndTransitionToModifyingState([
                {
                    productVariantId: 'T_1',
                    quantity: 1,
                },
            ]);
            const { modifyOrder } = await adminClient.query<ModifyOrder.Mutation, ModifyOrder.Variables>(
                MODIFY_ORDER,
                {
                    input: {
                        dryRun: false,
                        orderId: order.id,
                        surcharges: [
                            {
                                description: 'extra fee',
                                sku: '123',
                                price: 300,
                                priceIncludesTax: true,
                                taxRate: 20,
                                taxDescription: 'VAT',
                            },
                        ],
                    },
                },
            );
            orderGuard.assertSuccess(modifyOrder);

            const priceDelta = 300;
            const expectedTotal = order!.totalWithTax + priceDelta;
            expect(modifyOrder.totalWithTax).toBe(expectedTotal);
            expect(modifyOrder.surcharges.map(s => omit(s, ['id']))).toEqual([
                {
                    description: 'extra fee',
                    sku: '123',
                    price: 250,
                    priceWithTax: 300,
                    taxRate: 20,
                },
            ]);
            expect(modifyOrder.modifications.length).toBe(1);
            expect(modifyOrder.modifications[0].priceChange).toBe(priceDelta);
            expect(modifyOrder.modifications[0].surcharges).toEqual(modifyOrder.surcharges.map(pick(['id'])));
            await assertModifiedOrderIsPersisted(modifyOrder);
        });

        it('surcharge negative', async () => {
            const order = await createOrderAndTransitionToModifyingState([
                {
                    productVariantId: 'T_1',
                    quantity: 1,
                },
            ]);
            const { modifyOrder } = await adminClient.query<ModifyOrder.Mutation, ModifyOrder.Variables>(
                MODIFY_ORDER,
                {
                    input: {
                        dryRun: false,
                        orderId: order!.id,
                        surcharges: [
                            {
                                description: 'special discount',
                                sku: '123',
                                price: -300,
                                priceIncludesTax: true,
                                taxRate: 20,
                                taxDescription: 'VAT',
                            },
                        ],
                        refund: {
                            paymentId: order!.payments![0].id,
                        },
                    },
                },
            );
            orderGuard.assertSuccess(modifyOrder);

            const expectedTotal = order!.totalWithTax + -300;
            expect(modifyOrder.totalWithTax).toBe(expectedTotal);
            expect(modifyOrder.surcharges.map(s => omit(s, ['id']))).toEqual([
                {
                    description: 'special discount',
                    sku: '123',
                    price: -250,
                    priceWithTax: -300,
                    taxRate: 20,
                },
            ]);
            expect(modifyOrder.modifications.length).toBe(1);
            expect(modifyOrder.modifications[0].priceChange).toBe(-300);
            await assertModifiedOrderIsPersisted(modifyOrder);
        });

        it('update updateShippingAddress, recalculate shipping', async () => {
            const order = await createOrderAndTransitionToModifyingState([
                {
                    productVariantId: 'T_1',
                    quantity: 1,
                },
            ]);

            const { modifyOrder } = await adminClient.query<ModifyOrder.Mutation, ModifyOrder.Variables>(
                MODIFY_ORDER,
                {
                    input: {
                        dryRun: false,
                        orderId: order!.id,
                        updateShippingAddress: {
                            countryCode: 'US',
                        },
                        options: {
                            recalculateShipping: true,
                        },
                    },
                },
            );
            orderGuard.assertSuccess(modifyOrder);

            const priceDelta = SHIPPING_US - SHIPPING_OTHER;
            const expectedTotal = order!.totalWithTax + priceDelta;
            expect(modifyOrder.totalWithTax).toBe(expectedTotal);
            expect(modifyOrder.shippingAddress?.countryCode).toBe('US');
            expect(modifyOrder.modifications.length).toBe(1);
            expect(modifyOrder.modifications[0].priceChange).toBe(priceDelta);
            await assertModifiedOrderIsPersisted(modifyOrder);
        });

        it('update updateShippingAddress, do not recalculate shipping', async () => {
            const order = await createOrderAndTransitionToModifyingState([
                {
                    productVariantId: 'T_1',
                    quantity: 1,
                },
            ]);

            const { modifyOrder } = await adminClient.query<ModifyOrder.Mutation, ModifyOrder.Variables>(
                MODIFY_ORDER,
                {
                    input: {
                        dryRun: false,
                        orderId: order!.id,
                        updateShippingAddress: {
                            countryCode: 'US',
                        },
                        options: {
                            recalculateShipping: false,
                        },
                    },
                },
            );
            orderGuard.assertSuccess(modifyOrder);

            const priceDelta = 0;
            const expectedTotal = order!.totalWithTax + priceDelta;
            expect(modifyOrder.totalWithTax).toBe(expectedTotal);
            expect(modifyOrder.shippingAddress?.countryCode).toBe('US');
            expect(modifyOrder.modifications.length).toBe(1);
            expect(modifyOrder.modifications[0].priceChange).toBe(priceDelta);
            await assertModifiedOrderIsPersisted(modifyOrder);
        });

        it('update Order customFields', async () => {
            const order = await createOrderAndTransitionToModifyingState([
                {
                    productVariantId: 'T_1',
                    quantity: 1,
                },
            ]);
            const { modifyOrder } = await adminClient.query<ModifyOrder.Mutation, ModifyOrder.Variables>(
                MODIFY_ORDER,
                {
                    input: {
                        dryRun: false,
                        orderId: order.id,
                        customFields: {
                            points: 42,
                        },
                    } as any,
                },
            );
            orderGuard.assertSuccess(modifyOrder);

            const { order: orderWithCustomFields } = await adminClient.query(
                gql(GET_ORDER_WITH_CUSTOM_FIELDS),
                { id: order.id },
            );
            expect(orderWithCustomFields.customFields).toEqual({
                points: 42,
            });
        });

        it('adds a history entry', async () => {
            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: orderId,
            });
            const { modifyOrder } = await adminClient.query<ModifyOrder.Mutation, ModifyOrder.Variables>(
                MODIFY_ORDER,
                {
                    input: {
                        dryRun: false,
                        orderId: order!.id,
                        addItems: [{ productVariantId: 'T_5', quantity: 1 }],
                    },
                },
            );
            orderGuard.assertSuccess(modifyOrder);

            const { order: history } = await adminClient.query<
                GetOrderHistory.Query,
                GetOrderHistory.Variables
            >(GET_ORDER_HISTORY, {
                id: orderId,
                options: { filter: { type: { eq: HistoryEntryType.ORDER_MODIFIED } } },
            });
            orderGuard.assertSuccess(history);

            expect(history.history.totalItems).toBe(1);
            expect(history.history.items[0].data).toEqual({
                modificationId: modifyOrder.modifications[0].id,
            });
        });
    });

    describe('additional payment handling', () => {
        let orderId2: string;

        beforeAll(async () => {
            const order = await createOrderAndTransitionToModifyingState([
                {
                    productVariantId: 'T_1',
                    quantity: 1,
                },
            ]);
            const { modifyOrder } = await adminClient.query<ModifyOrder.Mutation, ModifyOrder.Variables>(
                MODIFY_ORDER,
                {
                    input: {
                        dryRun: false,
                        orderId: order.id,
                        surcharges: [
                            {
                                description: 'extra fee',
                                sku: '123',
                                price: 300,
                                priceIncludesTax: true,
                                taxRate: 20,
                                taxDescription: 'VAT',
                            },
                        ],
                    },
                },
            );
            orderGuard.assertSuccess(modifyOrder);
            orderId2 = modifyOrder.id;
        });

        it('cannot transition back to original state if no payment is set', async () => {
            const { transitionOrderToState } = await adminClient.query<
                AdminTransition.Mutation,
                AdminTransition.Variables
            >(ADMIN_TRANSITION_TO_STATE, {
                id: orderId2,
                state: 'PaymentSettled',
            });
            orderGuard.assertErrorResult(transitionOrderToState);
            expect(transitionOrderToState!.errorCode).toBe(ErrorCode.ORDER_STATE_TRANSITION_ERROR);
            expect(transitionOrderToState!.transitionError).toBe(
                `Can only transition to the "ArrangingAdditionalPayment" state`,
            );
        });

        it('can transition to ArrangingAdditionalPayment state', async () => {
            const { transitionOrderToState } = await adminClient.query<
                AdminTransition.Mutation,
                AdminTransition.Variables
            >(ADMIN_TRANSITION_TO_STATE, {
                id: orderId2,
                state: 'ArrangingAdditionalPayment',
            });
            orderGuard.assertSuccess(transitionOrderToState);
            expect(transitionOrderToState!.state).toBe('ArrangingAdditionalPayment');
        });

        it('cannot transition from ArrangingAdditionalPayment when total not covered by Payments', async () => {
            const { transitionOrderToState } = await adminClient.query<
                AdminTransition.Mutation,
                AdminTransition.Variables
            >(ADMIN_TRANSITION_TO_STATE, {
                id: orderId2,
                state: 'PaymentSettled',
            });
            orderGuard.assertErrorResult(transitionOrderToState);
            expect(transitionOrderToState!.errorCode).toBe(ErrorCode.ORDER_STATE_TRANSITION_ERROR);
            expect(transitionOrderToState!.transitionError).toBe(
                `Cannot transition away from "ArrangingAdditionalPayment" unless Order total is covered by Payments`,
            );
        });

        it('addManualPaymentToOrder', async () => {
            const { addManualPaymentToOrder } = await adminClient.query<
                AddManualPayment.Mutation,
                AddManualPayment.Variables
            >(ADD_MANUAL_PAYMENT, {
                input: {
                    orderId: orderId2,
                    method: 'test',
                    transactionId: 'ABC123',
                    metadata: {
                        foo: 'bar',
                    },
                },
            });
            orderGuard.assertSuccess(addManualPaymentToOrder);

            expect(addManualPaymentToOrder.payments?.length).toBe(2);
            expect(omit(addManualPaymentToOrder.payments![1], ['id'])).toEqual({
                transactionId: 'ABC123',
                state: 'Settled',
                amount: 300,
                method: 'test',
                metadata: {
                    foo: 'bar',
                },
                refunds: [],
            });
            expect(addManualPaymentToOrder.modifications[0].isSettled).toBe(true);
            expect(addManualPaymentToOrder.modifications[0].payment?.id).toBe(
                addManualPaymentToOrder.payments![1].id,
            );
        });

        it('transition back to original state', async () => {
            const { transitionOrderToState } = await adminClient.query<
                AdminTransition.Mutation,
                AdminTransition.Variables
            >(ADMIN_TRANSITION_TO_STATE, {
                id: orderId2,
                state: 'PaymentSettled',
            });
            orderGuard.assertSuccess(transitionOrderToState);

            expect(transitionOrderToState.state).toBe('PaymentSettled');
        });
    });

    describe('refund handling', () => {
        let orderId3: string;

        beforeAll(async () => {
            const order = await createOrderAndTransitionToModifyingState([
                {
                    productVariantId: 'T_1',
                    quantity: 1,
                },
            ]);
            const { modifyOrder } = await adminClient.query<ModifyOrder.Mutation, ModifyOrder.Variables>(
                MODIFY_ORDER,
                {
                    input: {
                        dryRun: false,
                        orderId: order.id,
                        surcharges: [
                            {
                                description: 'discount',
                                sku: '123',
                                price: -300,
                                priceIncludesTax: true,
                                taxRate: 20,
                                taxDescription: 'VAT',
                            },
                        ],
                        refund: {
                            paymentId: order.payments![0].id,
                            reason: 'discount',
                        },
                    },
                },
            );
            orderGuard.assertSuccess(modifyOrder);
            orderId3 = modifyOrder.id;
        });

        it('modification is settled', async () => {
            const { order } = await adminClient.query<
                GetOrderWithModifications.Query,
                GetOrderWithModifications.Variables
            >(GET_ORDER_WITH_MODIFICATIONS, { id: orderId3 });

            expect(order?.modifications.length).toBe(1);
            expect(order?.modifications[0].isSettled).toBe(true);
        });

        it('cannot transition to ArrangingAdditionalPayment state if no payment is needed', async () => {
            const { transitionOrderToState } = await adminClient.query<
                AdminTransition.Mutation,
                AdminTransition.Variables
            >(ADMIN_TRANSITION_TO_STATE, {
                id: orderId3,
                state: 'ArrangingAdditionalPayment',
            });
            orderGuard.assertErrorResult(transitionOrderToState);
            expect(transitionOrderToState!.errorCode).toBe(ErrorCode.ORDER_STATE_TRANSITION_ERROR);
            expect(transitionOrderToState!.transitionError).toBe(
                `Cannot transition Order to the \"ArrangingAdditionalPayment\" state as no additional payments are needed`,
            );
        });

        it('can transition to original state', async () => {
            const { transitionOrderToState } = await adminClient.query<
                AdminTransition.Mutation,
                AdminTransition.Variables
            >(ADMIN_TRANSITION_TO_STATE, {
                id: orderId3,
                state: 'PaymentSettled',
            });
            orderGuard.assertSuccess(transitionOrderToState);
            expect(transitionOrderToState!.state).toBe('PaymentSettled');

            const { order } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
                id: orderId3,
            });
            expect(order?.payments![0].refunds.length).toBe(1);
            expect(order?.payments![0].refunds[0].total).toBe(300);
            expect(order?.payments![0].refunds[0].reason).toBe('discount');
        });
    });

    async function assertOrderIsUnchanged(order: OrderWithLinesFragment) {
        const { order: order2 } = await adminClient.query<GetOrder.Query, GetOrder.Variables>(GET_ORDER, {
            id: order.id,
        });
        expect(order2!.totalWithTax).toBe(order!.totalWithTax);
        expect(order2!.lines.length).toBe(order!.lines.length);
        expect(order2!.surcharges.length).toBe(order!.surcharges.length);
        expect(order2!.totalQuantity).toBe(order!.totalQuantity);
    }

    async function createOrderAndTransitionToModifyingState(
        items: Array<AddItemToOrderMutationVariables & { customFields?: any }>,
    ): Promise<TestOrderWithPaymentsFragment> {
        await shopClient.asUserWithCredentials('hayden.zieme12@hotmail.com', 'test');
        for (const itemInput of items) {
            await shopClient.query(gql(ADD_ITEM_TO_ORDER_WITH_CUSTOM_FIELDS), itemInput);
        }

        await shopClient.query<SetShippingAddress.Mutation, SetShippingAddress.Variables>(
            SET_SHIPPING_ADDRESS,
            {
                input: {
                    fullName: 'name',
                    streetLine1: '12 the street',
                    city: 'foo',
                    postalCode: '123456',
                    countryCode: 'AT',
                },
            },
        );

        await shopClient.query<SetShippingMethod.Mutation, SetShippingMethod.Variables>(SET_SHIPPING_METHOD, {
            id: testShippingMethodId,
        });

        await shopClient.query<TransitionToState.Mutation, TransitionToState.Variables>(TRANSITION_TO_STATE, {
            state: 'ArrangingPayment',
        });

        const order = await addPaymentToOrder(shopClient, testSuccessfulPaymentMethod);
        orderGuard.assertSuccess(order);

        const { transitionOrderToState } = await adminClient.query<
            AdminTransition.Mutation,
            AdminTransition.Variables
        >(ADMIN_TRANSITION_TO_STATE, {
            id: order.id,
            state: 'Modifying',
        });
        return order;
    }
});

export const ORDER_WITH_MODIFICATION_FRAGMENT = gql`
    fragment OrderWithModifications on Order {
        id
        state
        total
        totalWithTax
        lines {
            id
            quantity
            linePrice
            linePriceWithTax
            productVariant {
                id
                name
            }
            items {
                id
                createdAt
                updatedAt
                cancelled
                unitPrice
            }
        }
        surcharges {
            id
            description
            sku
            price
            priceWithTax
            taxRate
        }
        payments {
            id
            transactionId
            state
            amount
            method
            metadata
            refunds {
                id
                state
                total
                paymentId
            }
        }
        modifications {
            id
            note
            priceChange
            isSettled
            orderItems {
                id
            }
            surcharges {
                id
            }
            payment {
                id
                state
                amount
                method
            }
            refund {
                id
                state
                total
                paymentId
            }
        }
        shippingAddress {
            streetLine1
            city
            postalCode
            province
            countryCode
            country
        }
        billingAddress {
            streetLine1
            city
            postalCode
            province
            countryCode
            country
        }
    }
`;

export const GET_ORDER_WITH_MODIFICATIONS = gql`
    query GetOrderWithModifications($id: ID!) {
        order(id: $id) {
            ...OrderWithModifications
        }
    }
    ${ORDER_WITH_MODIFICATION_FRAGMENT}
`;

export const MODIFY_ORDER = gql`
    mutation ModifyOrder($input: ModifyOrderInput!) {
        modifyOrder(input: $input) {
            ...OrderWithModifications
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
    ${ORDER_WITH_MODIFICATION_FRAGMENT}
`;

export const ADD_MANUAL_PAYMENT = gql`
    mutation AddManualPayment($input: ManualPaymentInput!) {
        addManualPaymentToOrder(input: $input) {
            ...OrderWithModifications
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
    ${ORDER_WITH_MODIFICATION_FRAGMENT}
`;

// Note, we don't use the gql tag around these due to the customFields which
// would cause a codegen error.
const ADD_ITEM_TO_ORDER_WITH_CUSTOM_FIELDS = `
    mutation AddItemToOrder($productVariantId: ID!, $quantity: Int!, $customFields: OrderLineCustomFieldsInput) {
        addItemToOrder(productVariantId: $productVariantId, quantity: $quantity, customFields: $customFields) {
            ...on Order { id }
        }
    }
`;
const GET_ORDER_WITH_CUSTOM_FIELDS = `
    query GetOrderCustomFields($id: ID!) {
        order(id: $id) {
            customFields { points }
            lines { id, customFields { color } }
        }
    }
`;
