/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { omit } from '@vendure/common/lib/omit';
import { pick } from '@vendure/common/lib/pick';
import { summate } from '@vendure/common/lib/shared-utils';
import {
    defaultShippingCalculator,
    defaultShippingEligibilityChecker,
    freeShipping,
    mergeConfig,
    minimumOrderAmount,
    Order,
    OrderItemPriceCalculationStrategy,
    orderPercentageDiscount,
    PriceCalculationResult,
    productsPercentageDiscount,
    ProductVariant,
    RequestContext,
    ShippingCalculator,
} from '@vendure/core';
import { createErrorResultGuard, createTestEnvironment, ErrorResultGuard } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';
import { manualFulfillmentHandler } from '../src/config/fulfillment/manual-fulfillment-handler';
import { orderFixedDiscount } from '../src/config/promotion/actions/order-fixed-discount-action';

import {
    failsToSettlePaymentMethod,
    testFailingPaymentMethod,
    testSuccessfulPaymentMethod,
} from './fixtures/test-payment-methods';
import * as Codegen from './graphql/generated-e2e-admin-types';
import {
    ErrorCode,
    GlobalFlag,
    HistoryEntryType,
    LanguageCode,
    OrderFragment,
    OrderWithLinesFragment,
    OrderWithModificationsFragment,
} from './graphql/generated-e2e-admin-types';
import * as CodegenShop from './graphql/generated-e2e-shop-types';
import {
    AddItemToOrderMutationVariables,
    TestOrderWithPaymentsFragment,
    UpdatedOrderFragment,
} from './graphql/generated-e2e-shop-types';
import {
    ADMIN_TRANSITION_TO_STATE,
    CREATE_FULFILLMENT,
    CREATE_PROMOTION,
    CREATE_SHIPPING_METHOD,
    DELETE_PROMOTION,
    GET_ORDER,
    GET_ORDER_HISTORY,
    GET_PRODUCT_VARIANT_LIST,
    GET_STOCK_MOVEMENT,
    UPDATE_CHANNEL,
    UPDATE_PRODUCT_VARIANTS,
} from './graphql/shared-definitions';
import {
    APPLY_COUPON_CODE,
    SET_SHIPPING_ADDRESS,
    SET_SHIPPING_METHOD,
    TRANSITION_TO_STATE,
} from './graphql/shop-definitions';
import { addPaymentToOrder, proceedToArrangingPayment, sortById } from './utils/test-order-utils';

export class TestOrderItemPriceCalculationStrategy implements OrderItemPriceCalculationStrategy {
    calculateUnitPrice(
        ctx: RequestContext,
        productVariant: ProductVariant,
        orderLineCustomFields: { [key: string]: any },
        order: Order,
    ): PriceCalculationResult | Promise<PriceCalculationResult> {
        if (orderLineCustomFields.color === 'hotpink') {
            return {
                price: 1337,
                priceIncludesTax: true,
            };
        }
        return {
            price: productVariant.listPrice,
            priceIncludesTax: productVariant.listPriceIncludesTax,
        };
    }
}

const SHIPPING_GB = 500;
const SHIPPING_US = 1000;
const SHIPPING_OTHER = 750;
const testCalculator = new ShippingCalculator({
    code: 'test-calculator',
    description: [{ languageCode: LanguageCode.en, value: 'Has metadata' }],
    args: {
        surcharge: {
            type: 'int',
            defaultValue: 0,
        },
    },
    calculate: (ctx, order, args) => {
        let price;
        const surcharge = args.surcharge || 0;
        switch (order.shippingAddress.countryCode) {
            case 'GB':
                price = SHIPPING_GB + surcharge;
                break;
            case 'US':
                price = SHIPPING_US + surcharge;
                break;
            default:
                price = SHIPPING_OTHER + surcharge;
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
        mergeConfig(testConfig(), {
            paymentOptions: {
                paymentMethodHandlers: [
                    testSuccessfulPaymentMethod,
                    failsToSettlePaymentMethod,
                    testFailingPaymentMethod,
                ],
            },
            orderOptions: {
                orderItemPriceCalculationStrategy: new TestOrderItemPriceCalculationStrategy(),
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
    let testExpressShippingMethodId: string;
    const orderGuard: ErrorResultGuard<
        UpdatedOrderFragment | OrderWithModificationsFragment | OrderFragment
    > = createErrorResultGuard(input => !!input.id);

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
                        name: failsToSettlePaymentMethod.code,
                        handler: { code: failsToSettlePaymentMethod.code, arguments: [] },
                    },
                    {
                        name: testFailingPaymentMethod.code,
                        handler: { code: testFailingPaymentMethod.code, arguments: [] },
                    },
                ],
            },
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
            customerCount: 3,
        });
        await adminClient.asSuperAdmin();

        await adminClient.query<
            Codegen.UpdateProductVariantsMutation,
            Codegen.UpdateProductVariantsMutationVariables
        >(UPDATE_PRODUCT_VARIANTS, {
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
        });

        const { createShippingMethod } = await adminClient.query<
            Codegen.CreateShippingMethodMutation,
            Codegen.CreateShippingMethodMutationVariables
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

        const { createShippingMethod: shippingMethod2 } = await adminClient.query<
            Codegen.CreateShippingMethodMutation,
            Codegen.CreateShippingMethodMutationVariables
        >(CREATE_SHIPPING_METHOD, {
            input: {
                code: 'new-method-express',
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
                    arguments: [
                        {
                            name: 'surcharge',
                            value: '500',
                        },
                    ],
                },
                translations: [
                    { languageCode: LanguageCode.en, name: 'test method express', description: '' },
                ],
            },
        });
        testExpressShippingMethodId = shippingMethod2.id;

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
        const { order } = await adminClient.query<Codegen.GetOrderQuery, Codegen.GetOrderQueryVariables>(
            GET_ORDER,
            {
                id: orderId,
            },
        );
        const { modifyOrder } = await adminClient.query<
            Codegen.ModifyOrderMutation,
            Codegen.ModifyOrderMutationVariables
        >(MODIFY_ORDER, {
            input: {
                dryRun: false,
                orderId,
                adjustOrderLines: order!.lines.map(l => ({ orderLineId: l.id, quantity: 3 })),
            },
        });

        orderGuard.assertErrorResult(modifyOrder);
        expect(modifyOrder.errorCode).toBe(ErrorCode.ORDER_MODIFICATION_STATE_ERROR);
    });

    it('transition to Modifying state', async () => {
        const transitionOrderToState = await adminTransitionOrderToState(orderId, 'Modifying');
        orderGuard.assertSuccess(transitionOrderToState);

        expect(transitionOrderToState.state).toBe('Modifying');
    });

    describe('error cases', () => {
        it('no changes specified error', async () => {
            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
                input: {
                    dryRun: false,
                    orderId,
                },
            });

            orderGuard.assertErrorResult(modifyOrder);

            expect(modifyOrder.errorCode).toBe(ErrorCode.NO_CHANGES_SPECIFIED_ERROR);
        });

        it('no refund paymentId specified', async () => {
            const { order } = await adminClient.query<Codegen.GetOrderQuery, Codegen.GetOrderQueryVariables>(
                GET_ORDER,
                {
                    id: orderId,
                },
            );
            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
                input: {
                    dryRun: false,
                    orderId,
                    surcharges: [{ price: -500, priceIncludesTax: true, description: 'Discount' }],
                },
            });
            orderGuard.assertErrorResult(modifyOrder);

            expect(modifyOrder.errorCode).toBe(ErrorCode.REFUND_PAYMENT_ID_MISSING_ERROR);
            await assertOrderIsUnchanged(order!);
        });

        it('addItems negative quantity', async () => {
            const { order } = await adminClient.query<Codegen.GetOrderQuery, Codegen.GetOrderQueryVariables>(
                GET_ORDER,
                {
                    id: orderId,
                },
            );
            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
                input: {
                    dryRun: false,
                    orderId,
                    addItems: [{ productVariantId: 'T_3', quantity: -1 }],
                },
            });
            orderGuard.assertErrorResult(modifyOrder);

            expect(modifyOrder.errorCode).toBe(ErrorCode.NEGATIVE_QUANTITY_ERROR);
            await assertOrderIsUnchanged(order!);
        });

        it('adjustOrderLines negative quantity', async () => {
            const { order } = await adminClient.query<Codegen.GetOrderQuery, Codegen.GetOrderQueryVariables>(
                GET_ORDER,
                {
                    id: orderId,
                },
            );
            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
                input: {
                    dryRun: false,
                    orderId,
                    adjustOrderLines: [{ orderLineId: order!.lines[0].id, quantity: -1 }],
                },
            });
            orderGuard.assertErrorResult(modifyOrder);

            expect(modifyOrder.errorCode).toBe(ErrorCode.NEGATIVE_QUANTITY_ERROR);
            await assertOrderIsUnchanged(order!);
        });

        it('addItems insufficient stock', async () => {
            const { order } = await adminClient.query<Codegen.GetOrderQuery, Codegen.GetOrderQueryVariables>(
                GET_ORDER,
                {
                    id: orderId,
                },
            );
            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
                input: {
                    dryRun: false,
                    orderId,
                    addItems: [{ productVariantId: 'T_3', quantity: 500 }],
                },
            });
            orderGuard.assertErrorResult(modifyOrder);

            expect(modifyOrder.errorCode).toBe(ErrorCode.INSUFFICIENT_STOCK_ERROR);
            await assertOrderIsUnchanged(order!);
        });

        it('adjustOrderLines insufficient stock', async () => {
            const { order } = await adminClient.query<Codegen.GetOrderQuery, Codegen.GetOrderQueryVariables>(
                GET_ORDER,
                {
                    id: orderId,
                },
            );
            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
                input: {
                    dryRun: false,
                    orderId,
                    adjustOrderLines: [{ orderLineId: order!.lines[0].id, quantity: 500 }],
                },
            });
            orderGuard.assertErrorResult(modifyOrder);

            expect(modifyOrder.errorCode).toBe(ErrorCode.INSUFFICIENT_STOCK_ERROR);
            await assertOrderIsUnchanged(order!);
        });

        it('addItems order limit', async () => {
            const { order } = await adminClient.query<Codegen.GetOrderQuery, Codegen.GetOrderQueryVariables>(
                GET_ORDER,
                {
                    id: orderId,
                },
            );
            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
                input: {
                    dryRun: false,
                    orderId,
                    addItems: [{ productVariantId: 'T_4', quantity: 9999 }],
                },
            });
            orderGuard.assertErrorResult(modifyOrder);

            expect(modifyOrder.errorCode).toBe(ErrorCode.ORDER_LIMIT_ERROR);
            await assertOrderIsUnchanged(order!);
        });

        it('adjustOrderLines order limit', async () => {
            const { order } = await adminClient.query<Codegen.GetOrderQuery, Codegen.GetOrderQueryVariables>(
                GET_ORDER,
                {
                    id: orderId,
                },
            );
            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
                input: {
                    dryRun: false,
                    orderId,
                    adjustOrderLines: [{ orderLineId: order!.lines[1].id, quantity: 9999 }],
                },
            });
            orderGuard.assertErrorResult(modifyOrder);

            expect(modifyOrder.errorCode).toBe(ErrorCode.ORDER_LIMIT_ERROR);
            await assertOrderIsUnchanged(order!);
        });
    });

    describe('dry run', () => {
        it('addItems', async () => {
            const { order } = await adminClient.query<Codegen.GetOrderQuery, Codegen.GetOrderQueryVariables>(
                GET_ORDER,
                {
                    id: orderId,
                },
            );
            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
                input: {
                    dryRun: true,
                    orderId,
                    addItems: [{ productVariantId: 'T_5', quantity: 1 }],
                },
            });
            orderGuard.assertSuccess(modifyOrder);

            const expectedTotal = order!.totalWithTax + Math.round(14374 * 1.2); // price of variant T_5
            expect(modifyOrder.totalWithTax).toBe(expectedTotal);
            expect(modifyOrder.lines.length).toBe(order!.lines.length + 1);
            await assertOrderIsUnchanged(order!);
        });

        it('addItems with existing variant id increments existing OrderLine', async () => {
            const { order } = await adminClient.query<Codegen.GetOrderQuery, Codegen.GetOrderQueryVariables>(
                GET_ORDER,
                {
                    id: orderId,
                },
            );
            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
                input: {
                    dryRun: true,
                    orderId,
                    addItems: [
                        { productVariantId: 'T_1', quantity: 1, customFields: { color: 'green' } } as any,
                    ],
                },
            });
            orderGuard.assertSuccess(modifyOrder);

            const lineT1 = modifyOrder.lines.find(l => l.productVariant.id === 'T_1');
            expect(modifyOrder.lines.length).toBe(2);
            expect(lineT1?.quantity).toBe(2);
            await assertOrderIsUnchanged(order!);
        });

        it('addItems with existing variant id but different customFields adds new OrderLine', async () => {
            const { order } = await adminClient.query<Codegen.GetOrderQuery, Codegen.GetOrderQueryVariables>(
                GET_ORDER,
                {
                    id: orderId,
                },
            );
            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
                input: {
                    dryRun: true,
                    orderId,
                    addItems: [
                        { productVariantId: 'T_1', quantity: 1, customFields: { color: 'blue' } } as any,
                    ],
                },
            });
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
            const { order } = await adminClient.query<Codegen.GetOrderQuery, Codegen.GetOrderQueryVariables>(
                GET_ORDER,
                {
                    id: orderId,
                },
            );
            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
                input: {
                    dryRun: true,
                    orderId,
                    adjustOrderLines: [{ orderLineId: order!.lines[0].id, quantity: 3 }],
                },
            });
            orderGuard.assertSuccess(modifyOrder);

            const expectedTotal = order!.totalWithTax + order!.lines[0].unitPriceWithTax * 2;
            expect(modifyOrder.lines[0].quantity).toBe(3);
            expect(modifyOrder.totalWithTax).toBe(expectedTotal);
            await assertOrderIsUnchanged(order!);
        });

        it('adjustOrderLines down', async () => {
            const { order } = await adminClient.query<Codegen.GetOrderQuery, Codegen.GetOrderQueryVariables>(
                GET_ORDER,
                {
                    id: orderId,
                },
            );
            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
                input: {
                    dryRun: true,
                    orderId,
                    adjustOrderLines: [{ orderLineId: order!.lines[1].id, quantity: 1 }],
                },
            });
            orderGuard.assertSuccess(modifyOrder);

            const expectedTotal = order!.totalWithTax - order!.lines[1].unitPriceWithTax;
            expect(modifyOrder.lines[1].quantity).toBe(1);
            expect(modifyOrder.totalWithTax).toBe(expectedTotal);
            await assertOrderIsUnchanged(order!);
        });

        it('adjustOrderLines to zero', async () => {
            const { order } = await adminClient.query<Codegen.GetOrderQuery, Codegen.GetOrderQueryVariables>(
                GET_ORDER,
                {
                    id: orderId,
                },
            );
            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
                input: {
                    dryRun: true,
                    orderId,
                    adjustOrderLines: [{ orderLineId: order!.lines[0].id, quantity: 0 }],
                },
            });
            orderGuard.assertSuccess(modifyOrder);

            const expectedTotal =
                order!.totalWithTax - order!.lines[0].unitPriceWithTax * order!.lines[0].quantity;
            expect(modifyOrder.totalWithTax).toBe(expectedTotal);
            expect(modifyOrder.lines[0].quantity).toBe(0);
            await assertOrderIsUnchanged(order!);
        });

        it('surcharge positive', async () => {
            const { order } = await adminClient.query<Codegen.GetOrderQuery, Codegen.GetOrderQueryVariables>(
                GET_ORDER,
                {
                    id: orderId,
                },
            );
            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
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
            });
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
            const { order } = await adminClient.query<Codegen.GetOrderQuery, Codegen.GetOrderQueryVariables>(
                GET_ORDER,
                {
                    id: orderId,
                },
            );
            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
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
            });
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

        it('the configured OrderItemPriceCalculationStrategy is applied', async () => {
            const { order } = await adminClient.query<Codegen.GetOrderQuery, Codegen.GetOrderQueryVariables>(
                GET_ORDER,
                {
                    id: orderId,
                },
            );
            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
                input: {
                    dryRun: true,
                    orderId,
                    adjustOrderLines: [
                        {
                            orderLineId: order!.lines[1].id,
                            quantity: 1,
                            customFields: { color: 'hotpink' },
                        } as any,
                    ],
                },
            });
            orderGuard.assertSuccess(modifyOrder);

            const expectedTotal = order!.totalWithTax - order!.lines[1].unitPriceWithTax;
            expect(modifyOrder.lines[1].quantity).toBe(1);
            expect(modifyOrder.lines[1].linePriceWithTax).toBe(1337);
            await assertOrderIsUnchanged(order!);
        });

        it('changing shipping method', async () => {
            const { order } = await adminClient.query<Codegen.GetOrderQuery, Codegen.GetOrderQueryVariables>(
                GET_ORDER,
                {
                    id: orderId,
                },
            );
            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
                input: {
                    dryRun: true,
                    orderId,
                    shippingMethodIds: [testExpressShippingMethodId],
                },
            });
            orderGuard.assertSuccess(modifyOrder);

            const expectedTotal = order!.totalWithTax + 500;
            expect(modifyOrder.totalWithTax).toBe(expectedTotal);
            expect(modifyOrder.shippingLines).toEqual([
                {
                    id: 'T_1',
                    discountedPriceWithTax: 1500,
                    shippingMethod: {
                        id: testExpressShippingMethodId,
                        name: 'test method express',
                    },
                },
            ]);
            await assertOrderIsUnchanged(order!);
        });

        it('does not add a history entry', async () => {
            const { order } = await adminClient.query<Codegen.GetOrderQuery, Codegen.GetOrderQueryVariables>(
                GET_ORDER,
                {
                    id: orderId,
                },
            );
            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
                input: {
                    dryRun: true,
                    orderId,
                    addItems: [{ productVariantId: 'T_5', quantity: 1 }],
                },
            });
            orderGuard.assertSuccess(modifyOrder);

            const { order: history } = await adminClient.query<
                Codegen.GetOrderHistoryQuery,
                Codegen.GetOrderHistoryQueryVariables
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
            const { order: order2 } = await adminClient.query<
                Codegen.GetOrderQuery,
                Codegen.GetOrderQueryVariables
            >(GET_ORDER, {
                id: order.id,
            });
            expect(order2!.totalWithTax).toBe(order.totalWithTax);
            expect(order2!.lines.length).toBe(order.lines.length);
            expect(order2!.surcharges.length).toBe(order.surcharges.length);
            expect(order2!.payments!.length).toBe(order.payments!.length);
            expect(order2!.payments!.map(p => pick(p, ['id', 'amount', 'method']))).toEqual(
                order.payments!.map(p => pick(p, ['id', 'amount', 'method'])),
            );
        }

        it('addItems', async () => {
            const order = await createOrderAndTransitionToModifyingState([
                {
                    productVariantId: 'T_1',
                    quantity: 1,
                },
            ]);
            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
                input: {
                    dryRun: false,
                    orderId: order.id,
                    addItems: [{ productVariantId: 'T_5', quantity: 1 }],
                },
            });
            orderGuard.assertSuccess(modifyOrder);

            const priceDelta = Math.round(14374 * 1.2); // price of variant T_5
            const expectedTotal = order.totalWithTax + priceDelta;
            expect(modifyOrder.totalWithTax).toBe(expectedTotal);
            expect(modifyOrder.lines.length).toBe(order.lines.length + 1);
            expect(modifyOrder.modifications.length).toBe(1);
            expect(modifyOrder.modifications[0].priceChange).toBe(priceDelta);
            expect(modifyOrder.modifications[0].lines.length).toBe(1);
            expect(modifyOrder.modifications[0].lines).toEqual([
                { orderLineId: modifyOrder.lines[1].id, quantity: 1 },
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
            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
                input: {
                    dryRun: false,
                    orderId: order.id,
                    adjustOrderLines: [{ orderLineId: order.lines[0].id, quantity: 2 }],
                },
            });
            orderGuard.assertSuccess(modifyOrder);

            const priceDelta = order.lines[0].unitPriceWithTax;
            const expectedTotal = order.totalWithTax + priceDelta;
            expect(modifyOrder.totalWithTax).toBe(expectedTotal);
            expect(modifyOrder.lines[0].quantity).toBe(2);
            expect(modifyOrder.modifications.length).toBe(1);
            expect(modifyOrder.modifications[0].priceChange).toBe(priceDelta);
            expect(modifyOrder.modifications[0].lines.length).toBe(1);
            expect(modifyOrder.lines[0].id).toEqual(modifyOrder.modifications[0].lines[0].orderLineId);
            await assertModifiedOrderIsPersisted(modifyOrder);
        });

        it('adjustOrderLines down', async () => {
            const order = await createOrderAndTransitionToModifyingState([
                {
                    productVariantId: 'T_1',
                    quantity: 2,
                },
            ]);
            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
                input: {
                    dryRun: false,
                    orderId: order.id,
                    adjustOrderLines: [{ orderLineId: order.lines[0].id, quantity: 1 }],
                    refund: { paymentId: order.payments![0].id },
                },
            });
            orderGuard.assertSuccess(modifyOrder);

            const priceDelta = -order.lines[0].unitPriceWithTax;
            const expectedTotal = order.totalWithTax + priceDelta;
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
            expect(modifyOrder.modifications[0].lines.length).toBe(1);
            expect(modifyOrder.lines[0].id).toEqual(modifyOrder.modifications[0].lines[0].orderLineId);
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
            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
                input: {
                    dryRun: false,
                    orderId: order.id,
                    adjustOrderLines: [
                        {
                            orderLineId: order.lines[0].id,
                            quantity: 1,
                            customFields: { color: 'black' },
                        } as any,
                    ],
                },
            });
            orderGuard.assertSuccess(modifyOrder);
            expect(modifyOrder.lines.length).toBe(1);

            const { order: orderWithLines } = await adminClient.query(gql(GET_ORDER_WITH_CUSTOM_FIELDS), {
                id: order.id,
            });
            expect(orderWithLines.lines[0]).toEqual({
                id: order.lines[0].id,
                customFields: { color: 'black' },
            });
        });

        it('adjustOrderLines handles quantity correctly', async () => {
            await adminClient.query<
                Codegen.UpdateProductVariantsMutation,
                Codegen.UpdateProductVariantsMutationVariables
            >(UPDATE_PRODUCT_VARIANTS, {
                input: [
                    {
                        id: 'T_6',
                        stockOnHand: 1,
                        trackInventory: GlobalFlag.TRUE,
                    },
                ],
            });
            const order = await createOrderAndTransitionToModifyingState([
                {
                    productVariantId: 'T_6',
                    quantity: 1,
                },
            ]);
            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
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
            });
            orderGuard.assertSuccess(modifyOrder);
        });

        it('surcharge positive', async () => {
            const order = await createOrderAndTransitionToModifyingState([
                {
                    productVariantId: 'T_1',
                    quantity: 1,
                },
            ]);
            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
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
            });
            orderGuard.assertSuccess(modifyOrder);

            const priceDelta = 300;
            const expectedTotal = order.totalWithTax + priceDelta;
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
            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
                input: {
                    dryRun: false,
                    orderId: order.id,
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
                        paymentId: order.payments![0].id,
                    },
                },
            });
            orderGuard.assertSuccess(modifyOrder);

            const expectedTotal = order.totalWithTax + -300;
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

            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
                input: {
                    dryRun: false,
                    orderId: order.id,
                    updateShippingAddress: {
                        countryCode: 'US',
                    },
                    options: {
                        recalculateShipping: true,
                    },
                },
            });
            orderGuard.assertSuccess(modifyOrder);

            const priceDelta = SHIPPING_US - SHIPPING_OTHER;
            const expectedTotal = order.totalWithTax + priceDelta;
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

            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
                input: {
                    dryRun: false,
                    orderId: order.id,
                    updateShippingAddress: {
                        countryCode: 'US',
                    },
                    options: {
                        recalculateShipping: false,
                    },
                },
            });
            orderGuard.assertSuccess(modifyOrder);

            const priceDelta = 0;
            const expectedTotal = order.totalWithTax + priceDelta;
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
            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
                input: {
                    dryRun: false,
                    orderId: order.id,
                    customFields: {
                        points: 42,
                    },
                } as any,
            });
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
            const { order } = await adminClient.query<Codegen.GetOrderQuery, Codegen.GetOrderQueryVariables>(
                GET_ORDER,
                {
                    id: orderId,
                },
            );
            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
                input: {
                    dryRun: false,
                    orderId: order!.id,
                    addItems: [{ productVariantId: 'T_5', quantity: 1 }],
                },
            });
            orderGuard.assertSuccess(modifyOrder);

            const { order: history } = await adminClient.query<
                Codegen.GetOrderHistoryQuery,
                Codegen.GetOrderHistoryQueryVariables
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
            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
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
            });
            orderGuard.assertSuccess(modifyOrder);
            orderId2 = modifyOrder.id;
        });

        it('cannot transition back to original state if no payment is set', async () => {
            const transitionOrderToState = await adminTransitionOrderToState(orderId2, 'PaymentSettled');
            orderGuard.assertErrorResult(transitionOrderToState);
            expect(transitionOrderToState!.errorCode).toBe(ErrorCode.ORDER_STATE_TRANSITION_ERROR);
            expect(transitionOrderToState!.transitionError).toBe(
                'Can only transition to the "ArrangingAdditionalPayment" state',
            );
        });

        it('can transition to ArrangingAdditionalPayment state', async () => {
            const transitionOrderToState = await adminTransitionOrderToState(
                orderId2,
                'ArrangingAdditionalPayment',
            );
            orderGuard.assertSuccess(transitionOrderToState);
            expect(transitionOrderToState.state).toBe('ArrangingAdditionalPayment');
        });

        it('cannot transition from ArrangingAdditionalPayment when total not covered by Payments', async () => {
            const transitionOrderToState = await adminTransitionOrderToState(orderId2, 'PaymentSettled');
            orderGuard.assertErrorResult(transitionOrderToState);
            expect(transitionOrderToState!.errorCode).toBe(ErrorCode.ORDER_STATE_TRANSITION_ERROR);
            expect(transitionOrderToState!.transitionError).toBe(
                'Cannot transition away from "ArrangingAdditionalPayment" unless Order total is covered by Payments',
            );
        });

        it('addManualPaymentToOrder', async () => {
            const { addManualPaymentToOrder } = await adminClient.query<
                Codegen.AddManualPaymentMutation,
                Codegen.AddManualPaymentMutationVariables
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
            const transitionOrderToState = await adminTransitionOrderToState(orderId2, 'PaymentSettled');
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
            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
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
            });
            orderGuard.assertSuccess(modifyOrder);
            orderId3 = modifyOrder.id;
        });

        it('modification is settled', async () => {
            const { order } = await adminClient.query<
                Codegen.GetOrderWithModificationsQuery,
                Codegen.GetOrderWithModificationsQueryVariables
            >(GET_ORDER_WITH_MODIFICATIONS, { id: orderId3 });

            expect(order?.modifications.length).toBe(1);
            expect(order?.modifications[0].isSettled).toBe(true);
        });

        it('cannot transition to ArrangingAdditionalPayment state if no payment is needed', async () => {
            const transitionOrderToState = await adminTransitionOrderToState(
                orderId3,
                'ArrangingAdditionalPayment',
            );
            orderGuard.assertErrorResult(transitionOrderToState);
            expect(transitionOrderToState!.errorCode).toBe(ErrorCode.ORDER_STATE_TRANSITION_ERROR);
            expect(transitionOrderToState!.transitionError).toBe(
                'Cannot transition Order to the "ArrangingAdditionalPayment" state as no additional payments are needed',
            );
        });

        it('can transition to original state', async () => {
            const transitionOrderToState = await adminTransitionOrderToState(orderId3, 'PaymentSettled');
            orderGuard.assertSuccess(transitionOrderToState);
            expect(transitionOrderToState.state).toBe('PaymentSettled');

            const { order } = await adminClient.query<Codegen.GetOrderQuery, Codegen.GetOrderQueryVariables>(
                GET_ORDER,
                {
                    id: orderId3,
                },
            );
            expect(order?.payments![0].refunds.length).toBe(1);
            expect(order?.payments![0].refunds[0].total).toBe(300);
            expect(order?.payments![0].refunds[0].reason).toBe('discount');
        });
    });

    // https://github.com/vendure-ecommerce/vendure/issues/1753
    describe('refunds for multiple payments', () => {
        let orderId2: string;
        let orderLineId: string;
        let additionalPaymentId: string;

        beforeAll(async () => {
            await adminClient.query<
                Codegen.CreatePromotionMutation,
                Codegen.CreatePromotionMutationVariables
            >(CREATE_PROMOTION, {
                input: {
                    couponCode: '5OFF',
                    enabled: true,
                    conditions: [],
                    actions: [
                        {
                            code: orderFixedDiscount.code,
                            arguments: [{ name: 'discount', value: '500' }],
                        },
                    ],
                    translations: [{ languageCode: LanguageCode.en, name: '$5 off' }],
                },
            });
            await shopClient.asUserWithCredentials('trevor_donnelly96@hotmail.com', 'test');
            await shopClient.query(gql(ADD_ITEM_TO_ORDER_WITH_CUSTOM_FIELDS), {
                productVariantId: 'T_5',
                quantity: 1,
            } as any);
            await proceedToArrangingPayment(shopClient);
            const order = await addPaymentToOrder(shopClient, testSuccessfulPaymentMethod);
            orderGuard.assertSuccess(order);
            orderLineId = order.lines[0].id;
            orderId2 = order.id;

            const transitionOrderToState = await adminTransitionOrderToState(orderId2, 'Modifying');
            orderGuard.assertSuccess(transitionOrderToState);
            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
                input: {
                    dryRun: false,
                    orderId: orderId2,
                    adjustOrderLines: [{ orderLineId, quantity: 2 }],
                },
            });
            orderGuard.assertSuccess(modifyOrder);

            await adminTransitionOrderToState(orderId2, 'ArrangingAdditionalPayment');

            const { addManualPaymentToOrder } = await adminClient.query<
                Codegen.AddManualPaymentMutation,
                Codegen.AddManualPaymentMutationVariables
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
            additionalPaymentId = addManualPaymentToOrder.payments![1].id!;

            const transitionOrderToState2 = await adminTransitionOrderToState(orderId2, 'PaymentSettled');
            orderGuard.assertSuccess(transitionOrderToState2);

            expect(transitionOrderToState2.state).toBe('PaymentSettled');
        });

        it('apply couponCode to create first refund', async () => {
            const transitionOrderToState = await adminTransitionOrderToState(orderId2, 'Modifying');
            orderGuard.assertSuccess(transitionOrderToState);
            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
                input: {
                    dryRun: false,
                    orderId: orderId2,
                    couponCodes: ['5OFF'],
                    refund: {
                        paymentId: additionalPaymentId,
                        reason: 'test',
                    },
                },
            });
            orderGuard.assertSuccess(modifyOrder);

            expect(modifyOrder.payments?.length).toBe(2);
            expect(modifyOrder?.payments?.find(p => p.id === additionalPaymentId)?.refunds).toEqual([
                {
                    id: 'T_4',
                    paymentId: additionalPaymentId,
                    state: 'Pending',
                    total: 600,
                },
            ]);
            expect(modifyOrder.totalWithTax).toBe(getOrderPaymentsTotalWithRefunds(modifyOrder));
        });

        it('reduce quantity to create second refund', async () => {
            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
                input: {
                    dryRun: false,
                    orderId: orderId2,
                    adjustOrderLines: [{ orderLineId, quantity: 1 }],
                    refund: {
                        paymentId: additionalPaymentId,
                        reason: 'test 2',
                    },
                },
            });
            orderGuard.assertSuccess(modifyOrder);

            expect(
                modifyOrder?.payments?.find(p => p.id === additionalPaymentId)?.refunds.sort(sortById),
            ).toEqual([
                {
                    id: 'T_4',
                    paymentId: additionalPaymentId,
                    state: 'Pending',
                    total: 600,
                },
                {
                    id: 'T_5',
                    paymentId: additionalPaymentId,
                    state: 'Pending',
                    total: 16649,
                },
            ]);
            // Note: During the big refactor of the OrderItem entity, the "total" value in the following
            // assertion was changed from `300` to `600`. This is due to a change in the way we calculate
            // refunds on pro-rated discounts. Previously, the pro-ration was not recalculated prior to
            // the refund being calculated, so the individual OrderItem had only 1/2 the full order discount
            // applied to it (300). Now, the pro-ration is applied to the single remaining item and therefore the
            // entire discount of 600 gets moved over to the remaining item.
            expect(modifyOrder?.payments?.find(p => p.id !== additionalPaymentId)?.refunds).toEqual([
                {
                    id: 'T_6',
                    paymentId: 'T_15',
                    state: 'Pending',
                    total: 600,
                },
            ]);
            expect(modifyOrder.totalWithTax).toBe(getOrderPaymentsTotalWithRefunds(modifyOrder));
        });
    });

    // https://github.com/vendure-ecommerce/vendure/issues/688 - 4th point
    it('correct additional payment when discounts applied', async () => {
        await adminClient.query<Codegen.CreatePromotionMutation, Codegen.CreatePromotionMutationVariables>(
            CREATE_PROMOTION,
            {
                input: {
                    couponCode: '5OFF',
                    enabled: true,
                    conditions: [],
                    actions: [
                        {
                            code: orderFixedDiscount.code,
                            arguments: [{ name: 'discount', value: '500' }],
                        },
                    ],
                    translations: [{ languageCode: LanguageCode.en, name: '$5 off' }],
                },
            },
        );

        await shopClient.asUserWithCredentials('trevor_donnelly96@hotmail.com', 'test');
        await shopClient.query(gql(ADD_ITEM_TO_ORDER_WITH_CUSTOM_FIELDS), {
            productVariantId: 'T_1',
            quantity: 1,
        } as any);
        await shopClient.query<
            CodegenShop.ApplyCouponCodeMutation,
            CodegenShop.ApplyCouponCodeMutationVariables
        >(APPLY_COUPON_CODE, {
            couponCode: '5OFF',
        });
        await proceedToArrangingPayment(shopClient);
        const order = await addPaymentToOrder(shopClient, testSuccessfulPaymentMethod);
        orderGuard.assertSuccess(order);

        const originalTotalWithTax = order.totalWithTax;
        const surcharge = 300;

        const transitionOrderToState = await adminTransitionOrderToState(order.id, 'Modifying');
        orderGuard.assertSuccess(transitionOrderToState);

        expect(transitionOrderToState.state).toBe('Modifying');

        const { modifyOrder } = await adminClient.query<
            Codegen.ModifyOrderMutation,
            Codegen.ModifyOrderMutationVariables
        >(MODIFY_ORDER, {
            input: {
                dryRun: false,
                orderId: order.id,
                surcharges: [
                    {
                        description: 'extra fee',
                        sku: '123',
                        price: surcharge,
                        priceIncludesTax: true,
                        taxRate: 20,
                        taxDescription: 'VAT',
                    },
                ],
            },
        });
        orderGuard.assertSuccess(modifyOrder);

        expect(modifyOrder.totalWithTax).toBe(originalTotalWithTax + surcharge);
    });

    // https://github.com/vendure-ecommerce/vendure/issues/872
    describe('correct price calculations when prices include tax', () => {
        async function modifyOrderLineQuantity(order: TestOrderWithPaymentsFragment) {
            const transitionOrderToState = await adminTransitionOrderToState(order.id, 'Modifying');
            orderGuard.assertSuccess(transitionOrderToState);

            expect(transitionOrderToState.state).toBe('Modifying');

            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
                input: {
                    dryRun: true,
                    orderId: order.id,
                    adjustOrderLines: [{ orderLineId: order.lines[0].id, quantity: 2 }],
                },
            });
            orderGuard.assertSuccess(modifyOrder);
            return modifyOrder;
        }

        beforeAll(async () => {
            await adminClient.query<Codegen.UpdateChannelMutation, Codegen.UpdateChannelMutationVariables>(
                UPDATE_CHANNEL,
                {
                    input: {
                        id: 'T_1',
                        pricesIncludeTax: true,
                    },
                },
            );
        });

        it('without promotion', async () => {
            await shopClient.asUserWithCredentials('hayden.zieme12@hotmail.com', 'test');
            await shopClient.query(gql(ADD_ITEM_TO_ORDER_WITH_CUSTOM_FIELDS), {
                productVariantId: 'T_1',
                quantity: 1,
            } as any);
            await proceedToArrangingPayment(shopClient);
            const order = await addPaymentToOrder(shopClient, testSuccessfulPaymentMethod);
            orderGuard.assertSuccess(order);

            const modifyOrder = await modifyOrderLineQuantity(order);
            expect(modifyOrder.lines[0].linePriceWithTax).toBe(order.lines[0].linePriceWithTax * 2);
        });

        it('with promotion', async () => {
            await adminClient.query<
                Codegen.CreatePromotionMutation,
                Codegen.CreatePromotionMutationVariables
            >(CREATE_PROMOTION, {
                input: {
                    couponCode: 'HALF',
                    enabled: true,
                    conditions: [],
                    actions: [
                        {
                            code: productsPercentageDiscount.code,
                            arguments: [
                                { name: 'discount', value: '50' },
                                { name: 'productVariantIds', value: JSON.stringify(['T_1']) },
                            ],
                        },
                    ],
                    translations: [{ languageCode: LanguageCode.en, name: 'half price' }],
                },
            });
            await shopClient.asUserWithCredentials('trevor_donnelly96@hotmail.com', 'test');
            await shopClient.query(gql(ADD_ITEM_TO_ORDER_WITH_CUSTOM_FIELDS), {
                productVariantId: 'T_1',
                quantity: 1,
            } as any);
            await shopClient.query<
                CodegenShop.ApplyCouponCodeMutation,
                CodegenShop.ApplyCouponCodeMutationVariables
            >(APPLY_COUPON_CODE, {
                couponCode: 'HALF',
            });
            await proceedToArrangingPayment(shopClient);
            const order = await addPaymentToOrder(shopClient, testSuccessfulPaymentMethod);
            orderGuard.assertSuccess(order);

            const modifyOrder = await modifyOrderLineQuantity(order);

            expect(modifyOrder.lines[0].discountedLinePriceWithTax).toBe(
                modifyOrder.lines[0].linePriceWithTax / 2,
            );
            expect(modifyOrder.lines[0].linePriceWithTax).toBe(order.lines[0].linePriceWithTax * 2);
        });
    });

    describe('refund handling when promotions are active on order', () => {
        // https://github.com/vendure-ecommerce/vendure/issues/890
        it('refunds correct amount when order-level promotion applied', async () => {
            await adminClient.query<
                Codegen.CreatePromotionMutation,
                Codegen.CreatePromotionMutationVariables
            >(CREATE_PROMOTION, {
                input: {
                    couponCode: '5OFF2',
                    enabled: true,
                    conditions: [],
                    actions: [
                        {
                            code: orderFixedDiscount.code,
                            arguments: [{ name: 'discount', value: '500' }],
                        },
                    ],
                    translations: [{ languageCode: LanguageCode.en, name: '$5 off' }],
                },
            });

            await shopClient.asUserWithCredentials('trevor_donnelly96@hotmail.com', 'test');
            await shopClient.query(gql(ADD_ITEM_TO_ORDER_WITH_CUSTOM_FIELDS), {
                productVariantId: 'T_1',
                quantity: 2,
            } as any);
            await shopClient.query<
                CodegenShop.ApplyCouponCodeMutation,
                CodegenShop.ApplyCouponCodeMutationVariables
            >(APPLY_COUPON_CODE, {
                couponCode: '5OFF2',
            });
            await proceedToArrangingPayment(shopClient);
            const order = await addPaymentToOrder(shopClient, testSuccessfulPaymentMethod);
            orderGuard.assertSuccess(order);

            const originalTotalWithTax = order.totalWithTax;
            const transitionOrderToState = await adminTransitionOrderToState(order.id, 'Modifying');
            orderGuard.assertSuccess(transitionOrderToState);

            expect(transitionOrderToState.state).toBe('Modifying');

            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
                input: {
                    dryRun: false,
                    orderId: order.id,
                    adjustOrderLines: [{ orderLineId: order.lines[0].id, quantity: 1 }],
                    refund: {
                        paymentId: order.payments![0].id,
                        reason: 'requested',
                    },
                },
            });
            orderGuard.assertSuccess(modifyOrder);

            expect(modifyOrder.totalWithTax).toBe(
                originalTotalWithTax - order.lines[0].proratedUnitPriceWithTax,
            );
            expect(modifyOrder.payments![0].refunds[0].total).toBe(order.lines[0].proratedUnitPriceWithTax);
            expect(modifyOrder.totalWithTax).toBe(getOrderPaymentsTotalWithRefunds(modifyOrder));
        });

        // https://github.com/vendure-ecommerce/vendure/issues/1865
        describe('issue 1865', () => {
            const promoDiscount = 5000;
            let promoId: string;
            let orderId2: string;
            beforeAll(async () => {
                const { createPromotion } = await adminClient.query<
                    Codegen.CreatePromotionMutation,
                    Codegen.CreatePromotionMutationVariables
                >(CREATE_PROMOTION, {
                    input: {
                        enabled: true,
                        conditions: [
                            {
                                code: minimumOrderAmount.code,
                                arguments: [
                                    { name: 'amount', value: '10000' },
                                    { name: 'taxInclusive', value: 'true' },
                                ],
                            },
                        ],
                        actions: [
                            {
                                code: orderFixedDiscount.code,
                                arguments: [{ name: 'discount', value: JSON.stringify(promoDiscount) }],
                            },
                        ],
                        translations: [{ languageCode: LanguageCode.en, name: '50 off orders over 100' }],
                    },
                });
                promoId = (createPromotion as any).id;
            });

            afterAll(async () => {
                await adminClient.query<
                    Codegen.DeletePromotionMutation,
                    Codegen.DeletePromotionMutationVariables
                >(DELETE_PROMOTION, {
                    id: promoId,
                });
            });

            it('refund handling when order-level promotion becomes invalid on modification', async () => {
                const { productVariants } = await adminClient.query<
                    Codegen.GetProductVariantListQuery,
                    Codegen.GetProductVariantListQueryVariables
                >(GET_PRODUCT_VARIANT_LIST, {
                    options: {
                        filter: {
                            name: { contains: 'football' },
                        },
                    },
                });
                const football = productVariants.items[0];

                await shopClient.query(gql(ADD_ITEM_TO_ORDER_WITH_CUSTOM_FIELDS), {
                    productVariantId: football.id,
                    quantity: 2,
                } as any);
                await proceedToArrangingPayment(shopClient);
                const order = await addPaymentToOrder(shopClient, testSuccessfulPaymentMethod);
                orderGuard.assertSuccess(order);
                orderId2 = order.id;

                expect(order.discounts.length).toBe(1);
                expect(order.discounts[0].amountWithTax).toBe(-promoDiscount);
                const shippingPrice = order.shippingWithTax;
                const expectedTotal = football.priceWithTax * 2 + shippingPrice - promoDiscount;
                expect(order.totalWithTax).toBe(expectedTotal);

                const originalTotalWithTax = order.totalWithTax;

                const transitionOrderToState = await adminTransitionOrderToState(order.id, 'Modifying');
                orderGuard.assertSuccess(transitionOrderToState);

                expect(transitionOrderToState.state).toBe('Modifying');

                const { modifyOrder } = await adminClient.query<
                    Codegen.ModifyOrderMutation,
                    Codegen.ModifyOrderMutationVariables
                >(MODIFY_ORDER, {
                    input: {
                        dryRun: false,
                        orderId: order.id,
                        adjustOrderLines: [{ orderLineId: order.lines[0].id, quantity: 1 }],
                        refund: {
                            paymentId: order.payments![0].id,
                            reason: 'requested',
                        },
                    },
                });
                orderGuard.assertSuccess(modifyOrder);

                const expectedNewTotal = order.lines[0].unitPriceWithTax + shippingPrice;
                expect(modifyOrder.totalWithTax).toBe(expectedNewTotal);
                expect(modifyOrder.payments![0].refunds[0].total).toBe(expectedTotal - expectedNewTotal);
                expect(modifyOrder.totalWithTax).toBe(getOrderPaymentsTotalWithRefunds(modifyOrder));
            });

            it('transition back to original state', async () => {
                const transitionOrderToState2 = await adminTransitionOrderToState(orderId2, 'PaymentSettled');
                orderGuard.assertSuccess(transitionOrderToState2);
                expect(transitionOrderToState2.state).toBe('PaymentSettled');
            });

            it('order no longer has promotions', async () => {
                const { order } = await adminClient.query<
                    Codegen.GetOrderWithModificationsQuery,
                    Codegen.GetOrderWithModificationsQueryVariables
                >(GET_ORDER_WITH_MODIFICATIONS, { id: orderId2 });

                expect(order?.promotions).toEqual([]);
            });

            it('order no longer has discounts', async () => {
                const { order } = await adminClient.query<
                    Codegen.GetOrderWithModificationsQuery,
                    Codegen.GetOrderWithModificationsQueryVariables
                >(GET_ORDER_WITH_MODIFICATIONS, { id: orderId2 });

                expect(order?.discounts).toEqual([]);
            });
        });
    });

    // https://github.com/vendure-ecommerce/vendure/issues/1197
    describe('refund on shipping when change made to shippingAddress', () => {
        let order: OrderWithModificationsFragment;
        beforeAll(async () => {
            const createdOrder = await createOrderAndTransitionToModifyingState([
                {
                    productVariantId: 'T_1',
                    quantity: 1,
                },
            ]);
            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
                input: {
                    dryRun: false,
                    orderId: createdOrder.id,
                    updateShippingAddress: {
                        countryCode: 'GB',
                    },
                    refund: {
                        paymentId: createdOrder.payments![0].id,
                        reason: 'discount',
                    },
                },
            });
            orderGuard.assertSuccess(modifyOrder);
            order = modifyOrder;
        });

        it('creates a Refund with the correct amount', async () => {
            expect(order.payments?.[0].refunds[0].total).toBe(SHIPPING_OTHER - SHIPPING_GB);
        });

        it('allows transition to PaymentSettled', async () => {
            const transitionOrderToState = await adminTransitionOrderToState(order.id, 'PaymentSettled');

            orderGuard.assertSuccess(transitionOrderToState);

            expect(transitionOrderToState.state).toBe('PaymentSettled');
        });
    });

    // https://github.com/vendure-ecommerce/vendure/issues/1210
    describe('updating stock levels', () => {
        async function getVariant(id: 'T_1' | 'T_2' | 'T_3') {
            const { product } = await adminClient.query<
                Codegen.GetStockMovementQuery,
                Codegen.GetStockMovementQueryVariables
            >(GET_STOCK_MOVEMENT, {
                id: 'T_1',
            });
            return product!.variants.find(v => v.id === id)!;
        }

        let orderId4: string;
        let orderId5: string;

        it('updates stock when increasing quantity before fulfillment', async () => {
            const variant1 = await getVariant('T_2');
            expect(variant1.stockOnHand).toBe(100);
            expect(variant1.stockAllocated).toBe(0);

            const order = await createOrderAndTransitionToModifyingState([
                {
                    productVariantId: 'T_2',
                    quantity: 1,
                },
            ]);
            orderId4 = order.id;

            const variant2 = await getVariant('T_2');
            expect(variant2.stockOnHand).toBe(100);
            expect(variant2.stockAllocated).toBe(1);

            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
                input: {
                    dryRun: false,
                    orderId: order.id,
                    adjustOrderLines: [{ orderLineId: order.lines[0].id, quantity: 2 }],
                },
            });
            orderGuard.assertSuccess(modifyOrder);

            const variant3 = await getVariant('T_2');
            expect(variant3.stockOnHand).toBe(100);
            expect(variant3.stockAllocated).toBe(2);
        });

        it('updates stock when increasing quantity after fulfillment', async () => {
            const result = await adminTransitionOrderToState(orderId4, 'ArrangingAdditionalPayment');
            orderGuard.assertSuccess(result);
            expect(result.state).toBe('ArrangingAdditionalPayment');
            const { order } = await adminClient.query<Codegen.GetOrderQuery, Codegen.GetOrderQueryVariables>(
                GET_ORDER,
                {
                    id: orderId4,
                },
            );
            const { addManualPaymentToOrder } = await adminClient.query<
                Codegen.AddManualPaymentMutation,
                Codegen.AddManualPaymentMutationVariables
            >(ADD_MANUAL_PAYMENT, {
                input: {
                    orderId: orderId4,
                    method: 'test',
                    transactionId: 'ABC123',
                    metadata: {
                        foo: 'bar',
                    },
                },
            });
            orderGuard.assertSuccess(addManualPaymentToOrder);
            await adminTransitionOrderToState(orderId4, 'PaymentSettled');
            await adminClient.query<
                Codegen.CreateFulfillmentMutation,
                Codegen.CreateFulfillmentMutationVariables
            >(CREATE_FULFILLMENT, {
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
            });

            const variant1 = await getVariant('T_2');
            expect(variant1.stockOnHand).toBe(98);
            expect(variant1.stockAllocated).toBe(0);

            await adminTransitionOrderToState(orderId4, 'Modifying');
            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
                input: {
                    dryRun: false,
                    orderId: order!.id,
                    adjustOrderLines: [{ orderLineId: order!.lines[0].id, quantity: 3 }],
                },
            });
            orderGuard.assertSuccess(modifyOrder);

            const variant2 = await getVariant('T_2');
            expect(variant2.stockOnHand).toBe(98);
            expect(variant2.stockAllocated).toBe(1);

            const { order: order2 } = await adminClient.query<
                Codegen.GetOrderQuery,
                Codegen.GetOrderQueryVariables
            >(GET_ORDER, {
                id: orderId4,
            });
        });

        it('updates stock when adding item before fulfillment', async () => {
            const variant1 = await getVariant('T_3');
            expect(variant1.stockOnHand).toBe(100);
            expect(variant1.stockAllocated).toBe(0);

            const order = await createOrderAndTransitionToModifyingState([
                {
                    productVariantId: 'T_2',
                    quantity: 1,
                },
            ]);
            orderId5 = order.id;

            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
                input: {
                    dryRun: false,
                    orderId: order.id,
                    addItems: [{ productVariantId: 'T_3', quantity: 1 }],
                },
            });
            orderGuard.assertSuccess(modifyOrder);

            const variant2 = await getVariant('T_3');
            expect(variant2.stockOnHand).toBe(100);
            expect(variant2.stockAllocated).toBe(1);

            const result = await adminTransitionOrderToState(orderId5, 'ArrangingAdditionalPayment');
            orderGuard.assertSuccess(result);
            expect(result.state).toBe('ArrangingAdditionalPayment');
            const { addManualPaymentToOrder } = await adminClient.query<
                Codegen.AddManualPaymentMutation,
                Codegen.AddManualPaymentMutationVariables
            >(ADD_MANUAL_PAYMENT, {
                input: {
                    orderId: orderId5,
                    method: 'test',
                    transactionId: 'manual-extra-payment',
                    metadata: {
                        foo: 'bar',
                    },
                },
            });
            orderGuard.assertSuccess(addManualPaymentToOrder);
            const result2 = await adminTransitionOrderToState(orderId5, 'PaymentSettled');
            orderGuard.assertSuccess(result2);
            const result3 = await adminTransitionOrderToState(orderId5, 'Modifying');
            orderGuard.assertSuccess(result3);
        });

        it('updates stock when removing item before fulfillment', async () => {
            const variant1 = await getVariant('T_3');
            expect(variant1.stockOnHand).toBe(100);
            expect(variant1.stockAllocated).toBe(1);

            const { order } = await adminClient.query<Codegen.GetOrderQuery, Codegen.GetOrderQueryVariables>(
                GET_ORDER,
                {
                    id: orderId5,
                },
            );

            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
                input: {
                    dryRun: false,
                    orderId: orderId5,
                    adjustOrderLines: [
                        {
                            orderLineId: order!.lines.find(l => l.productVariant.id === 'T_3')!.id,
                            quantity: 0,
                        },
                    ],
                    refund: {
                        paymentId: order!.payments![0].id,
                    },
                },
            });
            orderGuard.assertSuccess(modifyOrder);

            const variant2 = await getVariant('T_3');
            expect(variant2.stockOnHand).toBe(100);
            expect(variant2.stockAllocated).toBe(0);
        });

        it('updates stock when removing item after fulfillment', async () => {
            const variant1 = await getVariant('T_3');
            expect(variant1.stockOnHand).toBe(100);
            expect(variant1.stockAllocated).toBe(0);

            const order = await createOrderAndCheckout([
                {
                    productVariantId: 'T_3',
                    quantity: 1,
                },
            ]);
            const { addFulfillmentToOrder } = await adminClient.query<
                Codegen.CreateFulfillmentMutation,
                Codegen.CreateFulfillmentMutationVariables
            >(CREATE_FULFILLMENT, {
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
            });
            orderGuard.assertSuccess(addFulfillmentToOrder);

            const variant2 = await getVariant('T_3');
            expect(variant2.stockOnHand).toBe(99);
            expect(variant2.stockAllocated).toBe(0);

            await adminTransitionOrderToState(order.id, 'Modifying');
            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
                input: {
                    dryRun: false,
                    orderId: order.id,
                    adjustOrderLines: [
                        {
                            orderLineId: order.lines.find(l => l.productVariant.id === 'T_3')!.id,
                            quantity: 0,
                        },
                    ],
                    refund: {
                        paymentId: order.payments![0].id,
                    },
                },
            });

            const variant3 = await getVariant('T_3');
            expect(variant3.stockOnHand).toBe(100);
            expect(variant3.stockAllocated).toBe(0);
        });
    });

    describe('couponCode handling', () => {
        const CODE_50PC_OFF = '50PC';
        const CODE_FREE_SHIPPING = 'FREESHIP';
        let order: TestOrderWithPaymentsFragment;
        beforeAll(async () => {
            await adminClient.query<
                Codegen.CreatePromotionMutation,
                Codegen.CreatePromotionMutationVariables
            >(CREATE_PROMOTION, {
                input: {
                    couponCode: CODE_50PC_OFF,
                    enabled: true,
                    conditions: [],
                    actions: [
                        {
                            code: orderPercentageDiscount.code,
                            arguments: [{ name: 'discount', value: '50' }],
                        },
                    ],
                    translations: [{ languageCode: LanguageCode.en, name: '50% off' }],
                },
            });
            await adminClient.query<
                Codegen.CreatePromotionMutation,
                Codegen.CreatePromotionMutationVariables
            >(CREATE_PROMOTION, {
                input: {
                    couponCode: CODE_FREE_SHIPPING,
                    enabled: true,
                    conditions: [],
                    actions: [{ code: freeShipping.code, arguments: [] }],
                    translations: [{ languageCode: LanguageCode.en, name: 'Free shipping' }],
                },
            });

            // create an order and check out
            await shopClient.asUserWithCredentials('trevor_donnelly96@hotmail.com', 'test');
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
            order = result;
            const result2 = await adminTransitionOrderToState(order.id, 'Modifying');
            orderGuard.assertSuccess(result2);
            expect(result2.state).toBe('Modifying');
        });

        it('invalid coupon code returns ErrorResult', async () => {
            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
                input: {
                    dryRun: false,
                    orderId: order.id,
                    couponCodes: ['BAD_CODE'],
                },
            });
            orderGuard.assertErrorResult(modifyOrder);
            expect(modifyOrder.message).toBe('Coupon code "BAD_CODE" is not valid');
        });

        it('valid coupon code applies Promotion', async () => {
            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
                input: {
                    dryRun: false,
                    orderId: order.id,
                    refund: {
                        paymentId: order.payments![0].id,
                    },
                    couponCodes: [CODE_50PC_OFF],
                },
            });
            orderGuard.assertSuccess(modifyOrder);
            expect(modifyOrder.subTotalWithTax).toBe(order.subTotalWithTax * 0.5);
        });

        it('adds order.discounts', async () => {
            const { order: orderWithModifications } = await adminClient.query<
                Codegen.GetOrderWithModificationsQuery,
                Codegen.GetOrderWithModificationsQueryVariables
            >(GET_ORDER_WITH_MODIFICATIONS, { id: order.id });
            expect(orderWithModifications?.discounts.length).toBe(1);
            expect(orderWithModifications?.discounts[0].description).toBe('50% off');
        });

        it('adds order.promotions', async () => {
            const { order: orderWithModifications } = await adminClient.query<
                Codegen.GetOrderWithModificationsQuery,
                Codegen.GetOrderWithModificationsQueryVariables
            >(GET_ORDER_WITH_MODIFICATIONS, { id: order.id });
            expect(orderWithModifications?.promotions.length).toBe(1);
            expect(orderWithModifications?.promotions[0].name).toBe('50% off');
        });

        it('creates correct refund amount', async () => {
            const { order: orderWithModifications } = await adminClient.query<
                Codegen.GetOrderWithModificationsQuery,
                Codegen.GetOrderWithModificationsQueryVariables
            >(GET_ORDER_WITH_MODIFICATIONS, { id: order.id });
            expect(orderWithModifications?.payments![0].refunds.length).toBe(1);
            expect(orderWithModifications!.totalWithTax).toBe(
                getOrderPaymentsTotalWithRefunds(orderWithModifications!),
            );
            expect(orderWithModifications?.payments![0].refunds[0].total).toBe(
                order.totalWithTax - orderWithModifications!.totalWithTax,
            );
        });

        it('creates history entry for applying couponCode', async () => {
            const { order: history } = await adminClient.query<
                Codegen.GetOrderHistoryQuery,
                Codegen.GetOrderHistoryQueryVariables
            >(GET_ORDER_HISTORY, {
                id: order.id,
                options: { filter: { type: { eq: HistoryEntryType.ORDER_COUPON_APPLIED } } },
            });
            orderGuard.assertSuccess(history);

            expect(history.history.items.length).toBe(1);
            expect(pick(history.history.items[0]!, ['type', 'data'])).toEqual({
                type: HistoryEntryType.ORDER_COUPON_APPLIED,
                data: { couponCode: CODE_50PC_OFF, promotionId: 'T_6' },
            });
        });

        it('removes coupon code', async () => {
            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
                input: {
                    dryRun: false,
                    orderId: order.id,
                    couponCodes: [],
                },
            });
            orderGuard.assertSuccess(modifyOrder);
            expect(modifyOrder.subTotalWithTax).toBe(order.subTotalWithTax);
        });

        it('removes order.discounts', async () => {
            const { order: orderWithModifications } = await adminClient.query<
                Codegen.GetOrderWithModificationsQuery,
                Codegen.GetOrderWithModificationsQueryVariables
            >(GET_ORDER_WITH_MODIFICATIONS, { id: order.id });
            expect(orderWithModifications?.discounts.length).toBe(0);
        });

        it('removes order.promotions', async () => {
            const { order: orderWithModifications } = await adminClient.query<
                Codegen.GetOrderWithModificationsQuery,
                Codegen.GetOrderWithModificationsQueryVariables
            >(GET_ORDER_WITH_MODIFICATIONS, { id: order.id });
            expect(orderWithModifications?.promotions.length).toBe(0);
        });

        it('creates history entry for removing couponCode', async () => {
            const { order: history } = await adminClient.query<
                Codegen.GetOrderHistoryQuery,
                Codegen.GetOrderHistoryQueryVariables
            >(GET_ORDER_HISTORY, {
                id: order.id,
                options: { filter: { type: { eq: HistoryEntryType.ORDER_COUPON_REMOVED } } },
            });
            orderGuard.assertSuccess(history);

            expect(history.history.items.length).toBe(1);
            expect(pick(history.history.items[0]!, ['type', 'data'])).toEqual({
                type: HistoryEntryType.ORDER_COUPON_REMOVED,
                data: { couponCode: CODE_50PC_OFF },
            });
        });

        it('correct refund for free shipping couponCode', async () => {
            await shopClient.query(gql(ADD_ITEM_TO_ORDER_WITH_CUSTOM_FIELDS), {
                productVariantId: 'T_1',
                quantity: 1,
            } as any);
            await proceedToArrangingPayment(shopClient);
            const result = await addPaymentToOrder(shopClient, testSuccessfulPaymentMethod);
            orderGuard.assertSuccess(result);
            const order2 = result;
            const shippingWithTax = order2.shippingWithTax;
            const result2 = await adminTransitionOrderToState(order2.id, 'Modifying');
            orderGuard.assertSuccess(result2);
            expect(result2.state).toBe('Modifying');

            const { modifyOrder } = await adminClient.query<
                Codegen.ModifyOrderMutation,
                Codegen.ModifyOrderMutationVariables
            >(MODIFY_ORDER, {
                input: {
                    dryRun: false,
                    orderId: order2.id,
                    refund: {
                        paymentId: order2.payments![0].id,
                    },
                    couponCodes: [CODE_FREE_SHIPPING],
                },
            });
            orderGuard.assertSuccess(modifyOrder);
            expect(modifyOrder.shippingWithTax).toBe(0);
            expect(modifyOrder.totalWithTax).toBe(getOrderPaymentsTotalWithRefunds(modifyOrder));
            expect(modifyOrder.payments![0].refunds[0].total).toBe(shippingWithTax);
        });
    });

    async function adminTransitionOrderToState(id: string, state: string) {
        const result = await adminClient.query<
            Codegen.AdminTransitionMutation,
            Codegen.AdminTransitionMutationVariables
        >(ADMIN_TRANSITION_TO_STATE, {
            id,
            state,
        });
        return result.transitionOrderToState;
    }

    async function assertOrderIsUnchanged(order: OrderWithLinesFragment) {
        const { order: order2 } = await adminClient.query<
            Codegen.GetOrderQuery,
            Codegen.GetOrderQueryVariables
        >(GET_ORDER, {
            id: order.id,
        });
        expect(order2!.totalWithTax).toBe(order.totalWithTax);
        expect(order2!.lines.length).toBe(order.lines.length);
        expect(order2!.surcharges.length).toBe(order.surcharges.length);
        expect(order2!.totalQuantity).toBe(order.totalQuantity);
    }

    async function createOrderAndCheckout(
        items: Array<AddItemToOrderMutationVariables & { customFields?: any }>,
    ) {
        await shopClient.asUserWithCredentials('hayden.zieme12@hotmail.com', 'test');
        for (const itemInput of items) {
            await shopClient.query(gql(ADD_ITEM_TO_ORDER_WITH_CUSTOM_FIELDS), itemInput);
        }

        await shopClient.query<
            CodegenShop.SetShippingAddressMutation,
            CodegenShop.SetShippingAddressMutationVariables
        >(SET_SHIPPING_ADDRESS, {
            input: {
                fullName: 'name',
                streetLine1: '12 the street',
                city: 'foo',
                postalCode: '123456',
                countryCode: 'AT',
            },
        });

        await shopClient.query<
            CodegenShop.SetShippingMethodMutation,
            CodegenShop.SetShippingMethodMutationVariables
        >(SET_SHIPPING_METHOD, {
            id: testShippingMethodId,
        });

        await shopClient.query<
            CodegenShop.TransitionToStateMutation,
            CodegenShop.TransitionToStateMutationVariables
        >(TRANSITION_TO_STATE, {
            state: 'ArrangingPayment',
        });

        const order = await addPaymentToOrder(shopClient, testSuccessfulPaymentMethod);
        orderGuard.assertSuccess(order);
        return order;
    }

    async function createOrderAndTransitionToModifyingState(
        items: Array<AddItemToOrderMutationVariables & { customFields?: any }>,
    ): Promise<TestOrderWithPaymentsFragment> {
        const order = await createOrderAndCheckout(items);
        await adminTransitionOrderToState(order.id, 'Modifying');
        return order;
    }

    function getOrderPaymentsTotalWithRefunds(_order: OrderWithModificationsFragment) {
        return _order.payments?.reduce((sum, p) => sum + p.amount - summate(p?.refunds, 'total'), 0) ?? 0;
    }
});

export const ORDER_WITH_MODIFICATION_FRAGMENT = gql`
    fragment OrderWithModifications on Order {
        id
        state
        subTotal
        subTotalWithTax
        shipping
        shippingWithTax
        total
        totalWithTax
        lines {
            id
            quantity
            orderPlacedQuantity
            linePrice
            linePriceWithTax
            unitPriceWithTax
            discountedLinePriceWithTax
            proratedLinePriceWithTax
            proratedUnitPriceWithTax
            discounts {
                description
                amountWithTax
            }
            productVariant {
                id
                name
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
            lines {
                orderLineId
                quantity
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
        promotions {
            id
            name
            couponCode
        }
        discounts {
            description
            adjustmentSource
            amount
            amountWithTax
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
        shippingLines {
            id
            discountedPriceWithTax
            shippingMethod {
                id
                name
            }
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
