/* tslint:disable:no-non-null-assertion */
import { omit } from '@vendure/common/lib/omit';
import { pick } from '@vendure/common/lib/pick';
import {
    containsProducts,
    customerGroup,
    defaultShippingCalculator,
    defaultShippingEligibilityChecker,
    discountOnItemWithFacets,
    hasFacetValues,
    manualFulfillmentHandler,
    minimumOrderAmount,
    orderPercentageDiscount,
    productsPercentageDiscount,
} from '@vendure/core';
import {
    createErrorResultGuard,
    createTestEnvironment,
    E2E_DEFAULT_CHANNEL_TOKEN,
    ErrorResultGuard,
} from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';
import { freeShipping } from '../src/config/promotion/actions/free-shipping-action';
import { orderFixedDiscount } from '../src/config/promotion/actions/order-fixed-discount-action';

import { testSuccessfulPaymentMethod } from './fixtures/test-payment-methods';
import {
    AssignProductsToChannel,
    ChannelFragment,
    CreateChannel,
    CreateCustomerGroup,
    CreatePromotion,
    CreatePromotionInput,
    CreateShippingMethod,
    CurrencyCode,
    GetFacetList,
    GetProductsWithVariantPrices,
    HistoryEntryType,
    LanguageCode,
    PromotionFragment,
    RemoveCustomersFromGroup,
} from './graphql/generated-e2e-admin-types';
import {
    AddItemToOrder,
    AdjustItemQuantity,
    AdjustmentType,
    ApplyCouponCode,
    ErrorCode,
    GetActiveOrder,
    GetOrderPromotionsByCode,
    RemoveCouponCode,
    SetCustomerForOrder,
    SetShippingMethod,
    TestOrderFragmentFragment,
    TestOrderWithPaymentsFragment,
    UpdatedOrderFragment,
} from './graphql/generated-e2e-shop-types';
import {
    ASSIGN_PRODUCT_TO_CHANNEL,
    CREATE_CHANNEL,
    CREATE_CUSTOMER_GROUP,
    CREATE_PROMOTION,
    CREATE_SHIPPING_METHOD,
    GET_FACET_LIST,
    GET_PRODUCTS_WITH_VARIANT_PRICES,
    REMOVE_CUSTOMERS_FROM_GROUP,
} from './graphql/shared-definitions';
import {
    ADD_ITEM_TO_ORDER,
    ADJUST_ITEM_QUANTITY,
    APPLY_COUPON_CODE,
    GET_ACTIVE_ORDER,
    GET_ORDER_PROMOTIONS_BY_CODE,
    REMOVE_COUPON_CODE,
    SET_CUSTOMER,
    SET_SHIPPING_METHOD,
} from './graphql/shop-definitions';
import { addPaymentToOrder, proceedToArrangingPayment } from './utils/test-order-utils';

describe('Promotions applied to Orders', () => {
    const { server, adminClient, shopClient } = createTestEnvironment({
        ...testConfig,
        paymentOptions: {
            paymentMethodHandlers: [testSuccessfulPaymentMethod],
        },
    });

    const freeOrderAction = {
        code: orderPercentageDiscount.code,
        arguments: [{ name: 'discount', value: '100' }],
    };
    const minOrderAmountCondition = (min: number) => ({
        code: minimumOrderAmount.code,
        arguments: [
            { name: 'amount', value: min.toString() },
            { name: 'taxInclusive', value: 'true' },
        ],
    });

    type OrderSuccessResult = UpdatedOrderFragment | TestOrderFragmentFragment;
    const orderResultGuard: ErrorResultGuard<OrderSuccessResult> = createErrorResultGuard(
        input => !!input.lines,
    );

    let products: GetProductsWithVariantPrices.Items[];

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-promotions.csv'),
            customerCount: 2,
        });
        await adminClient.asSuperAdmin();

        await getProducts();
        await createGlobalPromotions();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    describe('coupon codes', () => {
        const TEST_COUPON_CODE = 'TESTCOUPON';
        const EXPIRED_COUPON_CODE = 'EXPIRED';
        let promoFreeWithCoupon: PromotionFragment;
        let promoFreeWithExpiredCoupon: PromotionFragment;

        beforeAll(async () => {
            promoFreeWithCoupon = await createPromotion({
                enabled: true,
                name: 'Free with test coupon',
                couponCode: TEST_COUPON_CODE,
                conditions: [],
                actions: [freeOrderAction],
            });
            promoFreeWithExpiredCoupon = await createPromotion({
                enabled: true,
                name: 'Expired coupon',
                endsAt: new Date(2010, 0, 0),
                couponCode: EXPIRED_COUPON_CODE,
                conditions: [],
                actions: [freeOrderAction],
            });

            await shopClient.asAnonymousUser();
            await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
                productVariantId: getVariantBySlug('item-5000').id,
                quantity: 1,
            });
        });

        afterAll(async () => {
            await deletePromotion(promoFreeWithCoupon.id);
            await deletePromotion(promoFreeWithExpiredCoupon.id);
        });

        it('applyCouponCode returns error result when code is nonexistant', async () => {
            const { applyCouponCode } = await shopClient.query<
                ApplyCouponCode.Mutation,
                ApplyCouponCode.Variables
            >(APPLY_COUPON_CODE, {
                couponCode: 'bad code',
            });
            orderResultGuard.assertErrorResult(applyCouponCode);
            expect(applyCouponCode.message).toBe('Coupon code "bad code" is not valid');
            expect(applyCouponCode.errorCode).toBe(ErrorCode.COUPON_CODE_INVALID_ERROR);
        });

        it('applyCouponCode returns error when code is expired', async () => {
            const { applyCouponCode } = await shopClient.query<
                ApplyCouponCode.Mutation,
                ApplyCouponCode.Variables
            >(APPLY_COUPON_CODE, {
                couponCode: EXPIRED_COUPON_CODE,
            });
            orderResultGuard.assertErrorResult(applyCouponCode);
            expect(applyCouponCode.message).toBe(`Coupon code "${EXPIRED_COUPON_CODE}" has expired`);
            expect(applyCouponCode.errorCode).toBe(ErrorCode.COUPON_CODE_EXPIRED_ERROR);
        });

        it('applies a valid coupon code', async () => {
            const { applyCouponCode } = await shopClient.query<
                ApplyCouponCode.Mutation,
                ApplyCouponCode.Variables
            >(APPLY_COUPON_CODE, {
                couponCode: TEST_COUPON_CODE,
            });
            orderResultGuard.assertSuccess(applyCouponCode);
            expect(applyCouponCode!.couponCodes).toEqual([TEST_COUPON_CODE]);
            expect(applyCouponCode!.discounts.length).toBe(1);
            expect(applyCouponCode!.discounts[0].description).toBe('Free with test coupon');
            expect(applyCouponCode!.totalWithTax).toBe(0);
        });

        it('order history records application', async () => {
            const { activeOrder } = await shopClient.query<GetActiveOrder.Query>(GET_ACTIVE_ORDER);

            expect(activeOrder!.history.items.map(i => omit(i, ['id']))).toEqual([
                {
                    type: HistoryEntryType.ORDER_STATE_TRANSITION,
                    data: {
                        from: 'Created',
                        to: 'AddingItems',
                    },
                },
                {
                    type: HistoryEntryType.ORDER_COUPON_APPLIED,
                    data: {
                        couponCode: TEST_COUPON_CODE,
                        promotionId: 'T_3',
                    },
                },
            ]);
        });

        it('de-duplicates existing codes', async () => {
            const { applyCouponCode } = await shopClient.query<
                ApplyCouponCode.Mutation,
                ApplyCouponCode.Variables
            >(APPLY_COUPON_CODE, {
                couponCode: TEST_COUPON_CODE,
            });
            orderResultGuard.assertSuccess(applyCouponCode);
            expect(applyCouponCode!.couponCodes).toEqual([TEST_COUPON_CODE]);
        });

        it('removes a coupon code', async () => {
            const { removeCouponCode } = await shopClient.query<
                RemoveCouponCode.Mutation,
                RemoveCouponCode.Variables
            >(REMOVE_COUPON_CODE, {
                couponCode: TEST_COUPON_CODE,
            });

            expect(removeCouponCode!.discounts.length).toBe(0);
            expect(removeCouponCode!.totalWithTax).toBe(6000);
        });

        // https://github.com/vendure-ecommerce/vendure/issues/649
        it('discounts array cleared after coupon code removed', async () => {
            const { activeOrder } = await shopClient.query<GetActiveOrder.Query>(GET_ACTIVE_ORDER);

            expect(activeOrder?.discounts).toEqual([]);
        });

        it('order history records removal', async () => {
            const { activeOrder } = await shopClient.query<GetActiveOrder.Query>(GET_ACTIVE_ORDER);

            expect(activeOrder!.history.items.map(i => omit(i, ['id']))).toEqual([
                {
                    type: HistoryEntryType.ORDER_STATE_TRANSITION,
                    data: {
                        from: 'Created',
                        to: 'AddingItems',
                    },
                },
                {
                    type: HistoryEntryType.ORDER_COUPON_APPLIED,
                    data: {
                        couponCode: TEST_COUPON_CODE,
                        promotionId: 'T_3',
                    },
                },
                {
                    type: HistoryEntryType.ORDER_COUPON_REMOVED,
                    data: {
                        couponCode: TEST_COUPON_CODE,
                    },
                },
            ]);
        });

        it('does not record removal of coupon code that was not added', async () => {
            const { removeCouponCode } = await shopClient.query<
                RemoveCouponCode.Mutation,
                RemoveCouponCode.Variables
            >(REMOVE_COUPON_CODE, {
                couponCode: 'NOT_THERE',
            });

            expect(removeCouponCode!.history.items.map(i => omit(i, ['id']))).toEqual([
                {
                    type: HistoryEntryType.ORDER_STATE_TRANSITION,
                    data: {
                        from: 'Created',
                        to: 'AddingItems',
                    },
                },
                {
                    type: HistoryEntryType.ORDER_COUPON_APPLIED,
                    data: {
                        couponCode: TEST_COUPON_CODE,
                        promotionId: 'T_3',
                    },
                },
                {
                    type: HistoryEntryType.ORDER_COUPON_REMOVED,
                    data: {
                        couponCode: TEST_COUPON_CODE,
                    },
                },
            ]);
        });
    });

    describe('default PromotionConditions', () => {
        beforeEach(async () => {
            await shopClient.asAnonymousUser();
        });

        it('minimumOrderAmount', async () => {
            const promotion = await createPromotion({
                enabled: true,
                name: 'Free if order total greater than 100',
                conditions: [minOrderAmountCondition(10000)],
                actions: [freeOrderAction],
            });
            const { addItemToOrder } = await shopClient.query<
                AddItemToOrder.Mutation,
                AddItemToOrder.Variables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: getVariantBySlug('item-5000').id,
                quantity: 1,
            });
            orderResultGuard.assertSuccess(addItemToOrder);
            expect(addItemToOrder!.totalWithTax).toBe(6000);
            expect(addItemToOrder!.discounts.length).toBe(0);

            const { adjustOrderLine } = await shopClient.query<
                AdjustItemQuantity.Mutation,
                AdjustItemQuantity.Variables
            >(ADJUST_ITEM_QUANTITY, {
                orderLineId: addItemToOrder!.lines[0].id,
                quantity: 2,
            });
            orderResultGuard.assertSuccess(adjustOrderLine);
            expect(adjustOrderLine!.totalWithTax).toBe(0);
            expect(adjustOrderLine!.discounts[0].description).toBe('Free if order total greater than 100');
            expect(adjustOrderLine!.discounts[0].amount).toBe(-12000);

            await deletePromotion(promotion.id);
        });

        it('atLeastNWithFacets', async () => {
            const { facets } = await adminClient.query<GetFacetList.Query>(GET_FACET_LIST);
            const saleFacetValue = facets.items[0].values[0];
            const promotion = await createPromotion({
                enabled: true,
                name: 'Free if order contains 2 items with Sale facet value',
                conditions: [
                    {
                        code: hasFacetValues.code,
                        arguments: [
                            { name: 'minimum', value: '2' },
                            { name: 'facets', value: `["${saleFacetValue.id}"]` },
                        ],
                    },
                ],
                actions: [freeOrderAction],
            });

            const { addItemToOrder: res1 } = await shopClient.query<
                AddItemToOrder.Mutation,
                AddItemToOrder.Variables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: getVariantBySlug('item-sale-100').id,
                quantity: 1,
            });
            orderResultGuard.assertSuccess(res1);
            expect(res1!.totalWithTax).toBe(120);
            expect(res1!.discounts.length).toBe(0);

            const { addItemToOrder: res2 } = await shopClient.query<
                AddItemToOrder.Mutation,
                AddItemToOrder.Variables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: getVariantBySlug('item-sale-1000').id,
                quantity: 1,
            });
            orderResultGuard.assertSuccess(res2);
            expect(res2!.totalWithTax).toBe(0);
            expect(res2!.discounts.length).toBe(1);
            expect(res2!.totalWithTax).toBe(0);
            expect(res2!.discounts[0].description).toBe(
                'Free if order contains 2 items with Sale facet value',
            );
            expect(res2!.discounts[0].amount).toBe(-1320);

            await deletePromotion(promotion.id);
        });

        it('containsProducts', async () => {
            const promotion = await createPromotion({
                enabled: true,
                name: 'Free if buying 3 or more offer products',
                conditions: [
                    {
                        code: containsProducts.code,
                        arguments: [
                            { name: 'minimum', value: '3' },
                            {
                                name: 'productVariantIds',
                                value: JSON.stringify([
                                    getVariantBySlug('item-5000').id,
                                    getVariantBySlug('item-1000').id,
                                ]),
                            },
                        ],
                    },
                ],
                actions: [freeOrderAction],
            });
            await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
                productVariantId: getVariantBySlug('item-5000').id,
                quantity: 1,
            });
            const { addItemToOrder } = await shopClient.query<
                AddItemToOrder.Mutation,
                AddItemToOrder.Variables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: getVariantBySlug('item-1000').id,
                quantity: 1,
            });
            orderResultGuard.assertSuccess(addItemToOrder);
            expect(addItemToOrder!.totalWithTax).toBe(7200);
            expect(addItemToOrder!.discounts.length).toBe(0);

            const { adjustOrderLine } = await shopClient.query<
                AdjustItemQuantity.Mutation,
                AdjustItemQuantity.Variables
            >(ADJUST_ITEM_QUANTITY, {
                orderLineId: addItemToOrder!.lines[0].id,
                quantity: 2,
            });
            orderResultGuard.assertSuccess(adjustOrderLine);
            expect(adjustOrderLine!.total).toBe(0);
            expect(adjustOrderLine!.discounts[0].description).toBe('Free if buying 3 or more offer products');
            expect(adjustOrderLine!.discounts[0].amount).toBe(-13200);

            await deletePromotion(promotion.id);
        });

        it('customerGroup', async () => {
            const { createCustomerGroup } = await adminClient.query<
                CreateCustomerGroup.Mutation,
                CreateCustomerGroup.Variables
            >(CREATE_CUSTOMER_GROUP, {
                input: { name: 'Test Group', customerIds: ['T_1'] },
            });

            await shopClient.asUserWithCredentials('hayden.zieme12@hotmail.com', 'test');

            const promotion = await createPromotion({
                enabled: true,
                name: 'Free for group members',
                conditions: [
                    {
                        code: customerGroup.code,
                        arguments: [{ name: 'customerGroupId', value: createCustomerGroup.id }],
                    },
                ],
                actions: [freeOrderAction],
            });

            const { addItemToOrder } = await shopClient.query<
                AddItemToOrder.Mutation,
                AddItemToOrder.Variables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: getVariantBySlug('item-5000').id,
                quantity: 1,
            });
            orderResultGuard.assertSuccess(addItemToOrder);
            expect(addItemToOrder!.totalWithTax).toBe(0);
            expect(addItemToOrder!.discounts.length).toBe(1);
            expect(addItemToOrder!.discounts[0].description).toBe('Free for group members');
            expect(addItemToOrder!.discounts[0].amount).toBe(-6000);

            await adminClient.query<RemoveCustomersFromGroup.Mutation, RemoveCustomersFromGroup.Variables>(
                REMOVE_CUSTOMERS_FROM_GROUP,
                {
                    groupId: createCustomerGroup.id,
                    customerIds: ['T_1'],
                },
            );

            const { adjustOrderLine } = await shopClient.query<
                AdjustItemQuantity.Mutation,
                AdjustItemQuantity.Variables
            >(ADJUST_ITEM_QUANTITY, {
                orderLineId: addItemToOrder!.lines[0].id,
                quantity: 2,
            });
            orderResultGuard.assertSuccess(adjustOrderLine);
            expect(adjustOrderLine!.totalWithTax).toBe(12000);
            expect(adjustOrderLine!.discounts.length).toBe(0);

            await deletePromotion(promotion.id);
        });
    });

    describe('default PromotionActions', () => {
        const TAX_INCLUDED_CHANNEL_TOKEN = 'tax_included_channel';

        beforeAll(async () => {
            // Create a channel where the prices include tax, so we can ensure
            // that PromotionActions are working as expected when taxes are included
            const { createChannel } = await adminClient.query<
                CreateChannel.Mutation,
                CreateChannel.Variables
            >(CREATE_CHANNEL, {
                input: {
                    code: 'tax-included-channel',
                    currencyCode: CurrencyCode.GBP,
                    pricesIncludeTax: true,
                    defaultTaxZoneId: 'T_1',
                    defaultShippingZoneId: 'T_1',
                    defaultLanguageCode: LanguageCode.en,
                    token: TAX_INCLUDED_CHANNEL_TOKEN,
                },
            });
            const taxIncludedChannel = createChannel as ChannelFragment;
            await adminClient.query<AssignProductsToChannel.Mutation, AssignProductsToChannel.Variables>(
                ASSIGN_PRODUCT_TO_CHANNEL,
                {
                    input: {
                        channelId: taxIncludedChannel.id,
                        priceFactor: 1,
                        productIds: products.map(p => p.id),
                    },
                },
            );
        });

        beforeEach(async () => {
            await shopClient.asAnonymousUser();
        });

        describe('orderPercentageDiscount', () => {
            const couponCode = '50%_off_order';
            let promotion: PromotionFragment;

            beforeAll(async () => {
                promotion = await createPromotion({
                    enabled: true,
                    name: '20% discount on order',
                    couponCode,
                    conditions: [],
                    actions: [
                        {
                            code: orderPercentageDiscount.code,
                            arguments: [{ name: 'discount', value: '20' }],
                        },
                    ],
                });
            });

            afterAll(async () => {
                await deletePromotion(promotion.id);
            });

            it('prices exclude tax', async () => {
                shopClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
                const { addItemToOrder } = await shopClient.query<
                    AddItemToOrder.Mutation,
                    AddItemToOrder.Variables
                >(ADD_ITEM_TO_ORDER, {
                    productVariantId: getVariantBySlug('item-5000').id,
                    quantity: 1,
                });
                orderResultGuard.assertSuccess(addItemToOrder);
                expect(addItemToOrder!.totalWithTax).toBe(6000);
                expect(addItemToOrder!.discounts.length).toBe(0);

                const { applyCouponCode } = await shopClient.query<
                    ApplyCouponCode.Mutation,
                    ApplyCouponCode.Variables
                >(APPLY_COUPON_CODE, {
                    couponCode,
                });
                orderResultGuard.assertSuccess(applyCouponCode);
                expect(applyCouponCode!.discounts.length).toBe(1);
                expect(applyCouponCode!.discounts[0].description).toBe('20% discount on order');
                expect(applyCouponCode!.totalWithTax).toBe(4800);
            });

            it('prices include tax', async () => {
                shopClient.setChannelToken(TAX_INCLUDED_CHANNEL_TOKEN);
                const { addItemToOrder } = await shopClient.query<
                    AddItemToOrder.Mutation,
                    AddItemToOrder.Variables
                >(ADD_ITEM_TO_ORDER, {
                    productVariantId: getVariantBySlug('item-5000').id,
                    quantity: 1,
                });
                orderResultGuard.assertSuccess(addItemToOrder);
                expect(addItemToOrder!.totalWithTax).toBe(5000);
                expect(addItemToOrder!.discounts.length).toBe(0);

                const { applyCouponCode } = await shopClient.query<
                    ApplyCouponCode.Mutation,
                    ApplyCouponCode.Variables
                >(APPLY_COUPON_CODE, {
                    couponCode,
                });
                orderResultGuard.assertSuccess(applyCouponCode);
                expect(applyCouponCode!.discounts.length).toBe(1);
                expect(applyCouponCode!.discounts[0].description).toBe('20% discount on order');
                expect(applyCouponCode!.totalWithTax).toBe(4000);
            });
        });

        describe('orderFixedDiscount', () => {
            const couponCode = '10_off_order';
            let promotion: PromotionFragment;

            beforeAll(async () => {
                promotion = await createPromotion({
                    enabled: true,
                    name: '$10 discount on order',
                    couponCode,
                    conditions: [],
                    actions: [
                        {
                            code: orderFixedDiscount.code,
                            arguments: [{ name: 'discount', value: '1000' }],
                        },
                    ],
                });
            });

            afterAll(async () => {
                await deletePromotion(promotion.id);
                shopClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            });

            it('prices exclude tax', async () => {
                shopClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
                const { addItemToOrder } = await shopClient.query<
                    AddItemToOrder.Mutation,
                    AddItemToOrder.Variables
                >(ADD_ITEM_TO_ORDER, {
                    productVariantId: getVariantBySlug('item-5000').id,
                    quantity: 1,
                });
                orderResultGuard.assertSuccess(addItemToOrder);
                expect(addItemToOrder!.total).toBe(5000);
                expect(addItemToOrder!.totalWithTax).toBe(6000);
                expect(addItemToOrder!.discounts.length).toBe(0);

                const { applyCouponCode } = await shopClient.query<
                    ApplyCouponCode.Mutation,
                    ApplyCouponCode.Variables
                >(APPLY_COUPON_CODE, {
                    couponCode,
                });
                orderResultGuard.assertSuccess(applyCouponCode);
                expect(applyCouponCode!.discounts.length).toBe(1);
                expect(applyCouponCode!.discounts[0].description).toBe('$10 discount on order');
                expect(applyCouponCode!.total).toBe(4000);
                expect(applyCouponCode!.totalWithTax).toBe(4800);
            });

            it('prices include tax', async () => {
                shopClient.setChannelToken(TAX_INCLUDED_CHANNEL_TOKEN);
                const { addItemToOrder } = await shopClient.query<
                    AddItemToOrder.Mutation,
                    AddItemToOrder.Variables
                >(ADD_ITEM_TO_ORDER, {
                    productVariantId: getVariantBySlug('item-5000').id,
                    quantity: 1,
                });
                orderResultGuard.assertSuccess(addItemToOrder);
                expect(addItemToOrder!.totalWithTax).toBe(5000);
                expect(addItemToOrder!.discounts.length).toBe(0);

                const { applyCouponCode } = await shopClient.query<
                    ApplyCouponCode.Mutation,
                    ApplyCouponCode.Variables
                >(APPLY_COUPON_CODE, {
                    couponCode,
                });
                orderResultGuard.assertSuccess(applyCouponCode);
                expect(applyCouponCode!.discounts.length).toBe(1);
                expect(applyCouponCode!.discounts[0].description).toBe('$10 discount on order');
                expect(applyCouponCode!.totalWithTax).toBe(4000);
            });
        });

        describe('discountOnItemWithFacets', () => {
            const couponCode = '50%_off_sale_items';
            let promotion: PromotionFragment;
            function getItemSale1Line<
                T extends Array<
                    UpdatedOrderFragment['lines'][number] | TestOrderFragmentFragment['lines'][number]
                >
            >(lines: T): T[number] {
                return lines.find(l => l.productVariant.id === getVariantBySlug('item-sale-100').id)!;
            }

            beforeAll(async () => {
                const { facets } = await adminClient.query<GetFacetList.Query>(GET_FACET_LIST);
                const saleFacetValue = facets.items[0].values[0];
                promotion = await createPromotion({
                    enabled: true,
                    name: '50% off sale items',
                    couponCode,
                    conditions: [],
                    actions: [
                        {
                            code: discountOnItemWithFacets.code,
                            arguments: [
                                { name: 'discount', value: '50' },
                                { name: 'facets', value: `["${saleFacetValue.id}"]` },
                            ],
                        },
                    ],
                });
            });

            afterAll(async () => {
                await deletePromotion(promotion.id);
                shopClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            });

            it('prices exclude tax', async () => {
                await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
                    productVariantId: getVariantBySlug('item-1000').id,
                    quantity: 1,
                });
                await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
                    productVariantId: getVariantBySlug('item-sale-1000').id,
                    quantity: 1,
                });
                const { addItemToOrder } = await shopClient.query<
                    AddItemToOrder.Mutation,
                    AddItemToOrder.Variables
                >(ADD_ITEM_TO_ORDER, {
                    productVariantId: getVariantBySlug('item-sale-100').id,
                    quantity: 2,
                });

                orderResultGuard.assertSuccess(addItemToOrder);
                expect(addItemToOrder!.discounts.length).toBe(0);
                expect(getItemSale1Line(addItemToOrder!.lines).discounts.length).toBe(0);
                expect(addItemToOrder!.total).toBe(2200);
                expect(addItemToOrder!.totalWithTax).toBe(2640);

                const { applyCouponCode } = await shopClient.query<
                    ApplyCouponCode.Mutation,
                    ApplyCouponCode.Variables
                >(APPLY_COUPON_CODE, {
                    couponCode,
                });
                orderResultGuard.assertSuccess(applyCouponCode);

                expect(applyCouponCode!.total).toBe(1600);
                expect(applyCouponCode!.totalWithTax).toBe(1920);
                expect(getItemSale1Line(applyCouponCode!.lines).discounts.length).toBe(1); // 1x promotion

                const { removeCouponCode } = await shopClient.query<
                    RemoveCouponCode.Mutation,
                    RemoveCouponCode.Variables
                >(REMOVE_COUPON_CODE, {
                    couponCode,
                });

                expect(getItemSale1Line(removeCouponCode!.lines).discounts.length).toBe(0);
                expect(removeCouponCode!.total).toBe(2200);
                expect(removeCouponCode!.totalWithTax).toBe(2640);

                const { activeOrder } = await shopClient.query<GetActiveOrder.Query>(GET_ACTIVE_ORDER);
                expect(getItemSale1Line(activeOrder!.lines).discounts.length).toBe(0);
                expect(activeOrder!.total).toBe(2200);
                expect(activeOrder!.totalWithTax).toBe(2640);
            });

            it('prices include tax', async () => {
                shopClient.setChannelToken(TAX_INCLUDED_CHANNEL_TOKEN);
                await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
                    productVariantId: getVariantBySlug('item-1000').id,
                    quantity: 1,
                });
                await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
                    productVariantId: getVariantBySlug('item-sale-1000').id,
                    quantity: 1,
                });
                const { addItemToOrder } = await shopClient.query<
                    AddItemToOrder.Mutation,
                    AddItemToOrder.Variables
                >(ADD_ITEM_TO_ORDER, {
                    productVariantId: getVariantBySlug('item-sale-100').id,
                    quantity: 2,
                });

                orderResultGuard.assertSuccess(addItemToOrder);
                expect(addItemToOrder!.discounts.length).toBe(0);
                expect(getItemSale1Line(addItemToOrder!.lines).discounts.length).toBe(0);
                expect(addItemToOrder!.total).toBe(1832);
                expect(addItemToOrder!.totalWithTax).toBe(2200);

                const { applyCouponCode } = await shopClient.query<
                    ApplyCouponCode.Mutation,
                    ApplyCouponCode.Variables
                >(APPLY_COUPON_CODE, {
                    couponCode,
                });
                orderResultGuard.assertSuccess(applyCouponCode);

                expect(applyCouponCode!.total).toBe(1334);
                expect(applyCouponCode!.totalWithTax).toBe(1600);
                expect(getItemSale1Line(applyCouponCode!.lines).discounts.length).toBe(1); // 1x promotion

                const { removeCouponCode } = await shopClient.query<
                    RemoveCouponCode.Mutation,
                    RemoveCouponCode.Variables
                >(REMOVE_COUPON_CODE, {
                    couponCode,
                });

                expect(getItemSale1Line(removeCouponCode!.lines).discounts.length).toBe(0);
                expect(removeCouponCode!.total).toBe(1832);
                expect(removeCouponCode!.totalWithTax).toBe(2200);

                const { activeOrder } = await shopClient.query<GetActiveOrder.Query>(GET_ACTIVE_ORDER);
                expect(getItemSale1Line(activeOrder!.lines).discounts.length).toBe(0);
                expect(activeOrder!.total).toBe(1832);
                expect(activeOrder!.totalWithTax).toBe(2200);
            });
        });

        describe('productsPercentageDiscount', () => {
            const couponCode = '50%_off_product';
            let promotion: PromotionFragment;

            beforeAll(async () => {
                promotion = await createPromotion({
                    enabled: true,
                    name: '50% off product',
                    couponCode,
                    conditions: [],
                    actions: [
                        {
                            code: productsPercentageDiscount.code,
                            arguments: [
                                { name: 'discount', value: '50' },
                                {
                                    name: 'productVariantIds',
                                    value: `["${getVariantBySlug('item-5000').id}"]`,
                                },
                            ],
                        },
                    ],
                });
            });

            afterAll(async () => {
                await deletePromotion(promotion.id);
                shopClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            });

            it('prices exclude tax', async () => {
                const { addItemToOrder } = await shopClient.query<
                    AddItemToOrder.Mutation,
                    AddItemToOrder.Variables
                >(ADD_ITEM_TO_ORDER, {
                    productVariantId: getVariantBySlug('item-5000').id,
                    quantity: 1,
                });
                orderResultGuard.assertSuccess(addItemToOrder);
                expect(addItemToOrder!.discounts.length).toBe(0);
                expect(addItemToOrder!.lines[0].discounts.length).toBe(0);
                expect(addItemToOrder!.total).toBe(5000);
                expect(addItemToOrder!.totalWithTax).toBe(6000);

                const { applyCouponCode } = await shopClient.query<
                    ApplyCouponCode.Mutation,
                    ApplyCouponCode.Variables
                >(APPLY_COUPON_CODE, {
                    couponCode,
                });
                orderResultGuard.assertSuccess(applyCouponCode);

                expect(applyCouponCode!.total).toBe(2500);
                expect(applyCouponCode!.totalWithTax).toBe(3000);
                expect(applyCouponCode!.lines[0].discounts.length).toBe(1); // 1x promotion
            });

            it('prices include tax', async () => {
                shopClient.setChannelToken(TAX_INCLUDED_CHANNEL_TOKEN);
                const { addItemToOrder } = await shopClient.query<
                    AddItemToOrder.Mutation,
                    AddItemToOrder.Variables
                >(ADD_ITEM_TO_ORDER, {
                    productVariantId: getVariantBySlug('item-5000').id,
                    quantity: 1,
                });
                orderResultGuard.assertSuccess(addItemToOrder);
                expect(addItemToOrder!.discounts.length).toBe(0);
                expect(addItemToOrder!.lines[0].discounts.length).toBe(0);
                expect(addItemToOrder!.total).toBe(4167);
                expect(addItemToOrder!.totalWithTax).toBe(5000);

                const { applyCouponCode } = await shopClient.query<
                    ApplyCouponCode.Mutation,
                    ApplyCouponCode.Variables
                >(APPLY_COUPON_CODE, {
                    couponCode,
                });
                orderResultGuard.assertSuccess(applyCouponCode);

                expect(applyCouponCode!.total).toBe(2083);
                expect(applyCouponCode!.totalWithTax).toBe(2500);
                expect(applyCouponCode!.lines[0].discounts.length).toBe(1); // 1x promotion
            });
        });

        describe('freeShipping', () => {
            const couponCode = 'FREE_SHIPPING';
            let promotion: PromotionFragment;

            // The test shipping method needs to be created in each Channel, since ShippingMethods
            // are ChannelAware
            async function createTestShippingMethod(channelToken: string) {
                adminClient.setChannelToken(channelToken);
                const result = await adminClient.query<
                    CreateShippingMethod.Mutation,
                    CreateShippingMethod.Variables
                >(CREATE_SHIPPING_METHOD, {
                    input: {
                        code: 'test-method',
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
                            code: defaultShippingCalculator.code,
                            arguments: [
                                { name: 'rate', value: '345' },
                                { name: 'includesTax', value: 'auto' },
                                { name: 'taxRate', value: '20' },
                            ],
                        },
                        translations: [
                            { languageCode: LanguageCode.en, name: 'test method', description: '' },
                        ],
                    },
                });
                adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
                return result.createShippingMethod;
            }

            beforeAll(async () => {
                promotion = await createPromotion({
                    enabled: true,
                    name: 'Free shipping',
                    couponCode,
                    conditions: [],
                    actions: [
                        {
                            code: freeShipping.code,
                            arguments: [],
                        },
                    ],
                });
            });

            afterAll(async () => {
                await deletePromotion(promotion.id);
                shopClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            });

            it('prices exclude tax', async () => {
                const { addItemToOrder } = await shopClient.query<
                    AddItemToOrder.Mutation,
                    AddItemToOrder.Variables
                >(ADD_ITEM_TO_ORDER, {
                    productVariantId: getVariantBySlug('item-5000').id,
                    quantity: 1,
                });
                const method = await createTestShippingMethod(E2E_DEFAULT_CHANNEL_TOKEN);
                const { setOrderShippingMethod } = await shopClient.query<
                    SetShippingMethod.Mutation,
                    SetShippingMethod.Variables
                >(SET_SHIPPING_METHOD, {
                    id: method.id,
                });
                orderResultGuard.assertSuccess(setOrderShippingMethod);
                expect(setOrderShippingMethod.discounts).toEqual([]);
                expect(setOrderShippingMethod.shipping).toBe(345);
                expect(setOrderShippingMethod.shippingWithTax).toBe(414);
                expect(setOrderShippingMethod.total).toBe(5345);
                expect(setOrderShippingMethod.totalWithTax).toBe(6414);

                const { applyCouponCode } = await shopClient.query<
                    ApplyCouponCode.Mutation,
                    ApplyCouponCode.Variables
                >(APPLY_COUPON_CODE, {
                    couponCode,
                });
                orderResultGuard.assertSuccess(applyCouponCode);

                expect(applyCouponCode.discounts.length).toBe(1);
                expect(applyCouponCode.discounts[0].description).toBe('Free shipping');
                expect(applyCouponCode.shipping).toBe(0);
                expect(applyCouponCode.shippingWithTax).toBe(0);
                expect(applyCouponCode.total).toBe(5000);
                expect(applyCouponCode.totalWithTax).toBe(6000);
            });

            it('prices include tax', async () => {
                shopClient.setChannelToken(TAX_INCLUDED_CHANNEL_TOKEN);
                const { addItemToOrder } = await shopClient.query<
                    AddItemToOrder.Mutation,
                    AddItemToOrder.Variables
                >(ADD_ITEM_TO_ORDER, {
                    productVariantId: getVariantBySlug('item-5000').id,
                    quantity: 1,
                });
                const method = await createTestShippingMethod(TAX_INCLUDED_CHANNEL_TOKEN);
                const { setOrderShippingMethod } = await shopClient.query<
                    SetShippingMethod.Mutation,
                    SetShippingMethod.Variables
                >(SET_SHIPPING_METHOD, {
                    id: method.id,
                });
                orderResultGuard.assertSuccess(setOrderShippingMethod);
                expect(setOrderShippingMethod.discounts).toEqual([]);
                expect(setOrderShippingMethod.shipping).toBe(287);
                expect(setOrderShippingMethod.shippingWithTax).toBe(345);
                expect(setOrderShippingMethod.total).toBe(4454);
                expect(setOrderShippingMethod.totalWithTax).toBe(5345);

                const { applyCouponCode } = await shopClient.query<
                    ApplyCouponCode.Mutation,
                    ApplyCouponCode.Variables
                >(APPLY_COUPON_CODE, {
                    couponCode,
                });
                orderResultGuard.assertSuccess(applyCouponCode);

                expect(applyCouponCode.discounts.length).toBe(1);
                expect(applyCouponCode.discounts[0].description).toBe('Free shipping');
                expect(applyCouponCode.shipping).toBe(0);
                expect(applyCouponCode.shippingWithTax).toBe(0);
                expect(applyCouponCode.total).toBe(4167);
                expect(applyCouponCode.totalWithTax).toBe(5000);
            });
        });

        describe('multiple promotions simultaneously', () => {
            const saleItem50pcOffCoupon = 'CODE1';
            const order15pcOffCoupon = 'CODE2';
            let promotion1: PromotionFragment;
            let promotion2: PromotionFragment;

            beforeAll(async () => {
                const { facets } = await adminClient.query<GetFacetList.Query>(GET_FACET_LIST);
                const saleFacetValue = facets.items[0].values[0];
                promotion1 = await createPromotion({
                    enabled: true,
                    name: 'item promo',
                    couponCode: saleItem50pcOffCoupon,
                    conditions: [],
                    actions: [
                        {
                            code: discountOnItemWithFacets.code,
                            arguments: [
                                { name: 'discount', value: '50' },
                                { name: 'facets', value: `["${saleFacetValue.id}"]` },
                            ],
                        },
                    ],
                });
                promotion2 = await createPromotion({
                    enabled: true,
                    name: 'order promo',
                    couponCode: order15pcOffCoupon,
                    conditions: [],
                    actions: [
                        {
                            code: orderPercentageDiscount.code,
                            arguments: [{ name: 'discount', value: '15' }],
                        },
                    ],
                });
            });

            afterAll(async () => {
                await deletePromotion(promotion1.id);
                await deletePromotion(promotion2.id);
                shopClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            });

            it('prices exclude tax', async () => {
                await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
                    productVariantId: getVariantBySlug('item-sale-1000').id,
                    quantity: 2,
                });
                await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
                    productVariantId: getVariantBySlug('item-5000').id,
                    quantity: 1,
                });

                // Apply the OrderItem-level promo
                const { applyCouponCode: apply1 } = await shopClient.query<
                    ApplyCouponCode.Mutation,
                    ApplyCouponCode.Variables
                >(APPLY_COUPON_CODE, {
                    couponCode: saleItem50pcOffCoupon,
                });
                orderResultGuard.assertSuccess(apply1);
                const saleItemLine = apply1.lines.find(
                    l => l.productVariant.id === getVariantBySlug('item-sale-1000').id,
                )!;
                expect(saleItemLine.discounts.length).toBe(1); // 1x promotion
                expect(
                    saleItemLine.discounts.find(a => a.type === AdjustmentType.PROMOTION)?.description,
                ).toBe('item promo');
                expect(apply1.discounts.length).toBe(1);
                expect(apply1.total).toBe(6000);
                expect(apply1.totalWithTax).toBe(7200);

                // Apply the Order-level promo
                const { applyCouponCode: apply2 } = await shopClient.query<
                    ApplyCouponCode.Mutation,
                    ApplyCouponCode.Variables
                >(APPLY_COUPON_CODE, {
                    couponCode: order15pcOffCoupon,
                });
                orderResultGuard.assertSuccess(apply2);

                expect(apply2.discounts.map(d => d.description).sort()).toEqual([
                    'item promo',
                    'order promo',
                ]);
                expect(apply2.total).toBe(5100);
                expect(apply2.totalWithTax).toBe(6120);
            });

            it('prices include tax', async () => {
                shopClient.setChannelToken(TAX_INCLUDED_CHANNEL_TOKEN);
                await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
                    productVariantId: getVariantBySlug('item-sale-1000').id,
                    quantity: 2,
                });
                await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
                    productVariantId: getVariantBySlug('item-5000').id,
                    quantity: 1,
                });

                // Apply the OrderItem-level promo
                const { applyCouponCode: apply1 } = await shopClient.query<
                    ApplyCouponCode.Mutation,
                    ApplyCouponCode.Variables
                >(APPLY_COUPON_CODE, {
                    couponCode: saleItem50pcOffCoupon,
                });
                orderResultGuard.assertSuccess(apply1);
                const saleItemLine = apply1.lines.find(
                    l => l.productVariant.id === getVariantBySlug('item-sale-1000').id,
                )!;
                expect(saleItemLine.discounts.length).toBe(1); // 1x promotion
                expect(
                    saleItemLine.discounts.find(a => a.type === AdjustmentType.PROMOTION)?.description,
                ).toBe('item promo');
                expect(apply1.discounts.length).toBe(1);
                expect(apply1.total).toBe(5001);
                expect(apply1.totalWithTax).toBe(6000);

                // Apply the Order-level promo
                const { applyCouponCode: apply2 } = await shopClient.query<
                    ApplyCouponCode.Mutation,
                    ApplyCouponCode.Variables
                >(APPLY_COUPON_CODE, {
                    couponCode: order15pcOffCoupon,
                });
                orderResultGuard.assertSuccess(apply2);

                expect(apply2.discounts.map(d => d.description).sort()).toEqual([
                    'item promo',
                    'order promo',
                ]);
                expect(apply2.total).toBe(4250);
                expect(apply2.totalWithTax).toBe(5100);
            });
        });
    });

    describe('per-customer usage limit', () => {
        const TEST_COUPON_CODE = 'TESTCOUPON';
        const orderGuard: ErrorResultGuard<TestOrderWithPaymentsFragment> = createErrorResultGuard(
            input => !!input.lines,
        );
        let promoWithUsageLimit: PromotionFragment;

        beforeAll(async () => {
            promoWithUsageLimit = await createPromotion({
                enabled: true,
                name: 'Free with test coupon',
                couponCode: TEST_COUPON_CODE,
                perCustomerUsageLimit: 1,
                conditions: [],
                actions: [freeOrderAction],
            });
        });

        afterAll(async () => {
            await deletePromotion(promoWithUsageLimit.id);
        });

        async function createNewActiveOrder() {
            const { addItemToOrder } = await shopClient.query<
                AddItemToOrder.Mutation,
                AddItemToOrder.Variables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: getVariantBySlug('item-5000').id,
                quantity: 1,
            });
            return addItemToOrder;
        }

        describe('guest customer', () => {
            const GUEST_EMAIL_ADDRESS = 'guest@test.com';
            let orderCode: string;

            function addGuestCustomerToOrder() {
                return shopClient.query<SetCustomerForOrder.Mutation, SetCustomerForOrder.Variables>(
                    SET_CUSTOMER,
                    {
                        input: {
                            emailAddress: GUEST_EMAIL_ADDRESS,
                            firstName: 'Guest',
                            lastName: 'Customer',
                        },
                    },
                );
            }

            it('allows initial usage', async () => {
                await shopClient.asAnonymousUser();
                await createNewActiveOrder();
                await addGuestCustomerToOrder();

                const { applyCouponCode } = await shopClient.query<
                    ApplyCouponCode.Mutation,
                    ApplyCouponCode.Variables
                >(APPLY_COUPON_CODE, { couponCode: TEST_COUPON_CODE });
                orderResultGuard.assertSuccess(applyCouponCode);

                expect(applyCouponCode!.totalWithTax).toBe(0);
                expect(applyCouponCode!.couponCodes).toEqual([TEST_COUPON_CODE]);

                await proceedToArrangingPayment(shopClient);
                const order = await addPaymentToOrder(shopClient, testSuccessfulPaymentMethod);
                orderGuard.assertSuccess(order);

                expect(order.state).toBe('PaymentSettled');
                expect(order.active).toBe(false);
                orderCode = order.code;
            });

            it('adds Promotions to Order once payment arranged', async () => {
                const { orderByCode } = await shopClient.query<
                    GetOrderPromotionsByCode.Query,
                    GetOrderPromotionsByCode.Variables
                >(GET_ORDER_PROMOTIONS_BY_CODE, {
                    code: orderCode,
                });
                expect(orderByCode!.promotions.map(pick(['name']))).toEqual([
                    { name: 'Free with test coupon' },
                ]);
            });

            it('returns error result when usage exceeds limit', async () => {
                await shopClient.asAnonymousUser();
                await createNewActiveOrder();
                await addGuestCustomerToOrder();

                const { applyCouponCode } = await shopClient.query<
                    ApplyCouponCode.Mutation,
                    ApplyCouponCode.Variables
                >(APPLY_COUPON_CODE, { couponCode: TEST_COUPON_CODE });
                orderResultGuard.assertErrorResult(applyCouponCode);

                expect(applyCouponCode.message).toEqual(
                    'Coupon code cannot be used more than once per customer',
                );
            });

            it('removes couponCode from order when adding customer after code applied', async () => {
                await shopClient.asAnonymousUser();
                await createNewActiveOrder();

                const { applyCouponCode } = await shopClient.query<
                    ApplyCouponCode.Mutation,
                    ApplyCouponCode.Variables
                >(APPLY_COUPON_CODE, { couponCode: TEST_COUPON_CODE });
                orderResultGuard.assertSuccess(applyCouponCode);

                expect(applyCouponCode!.totalWithTax).toBe(0);
                expect(applyCouponCode!.couponCodes).toEqual([TEST_COUPON_CODE]);

                await addGuestCustomerToOrder();

                const { activeOrder } = await shopClient.query<GetActiveOrder.Query>(GET_ACTIVE_ORDER);
                expect(activeOrder!.couponCodes).toEqual([]);
                expect(activeOrder!.totalWithTax).toBe(6000);
            });
        });

        describe('signed-in customer', () => {
            function logInAsRegisteredCustomer() {
                return shopClient.asUserWithCredentials('hayden.zieme12@hotmail.com', 'test');
            }

            it('allows initial usage', async () => {
                await logInAsRegisteredCustomer();
                await createNewActiveOrder();
                const { applyCouponCode } = await shopClient.query<
                    ApplyCouponCode.Mutation,
                    ApplyCouponCode.Variables
                >(APPLY_COUPON_CODE, { couponCode: TEST_COUPON_CODE });
                orderResultGuard.assertSuccess(applyCouponCode);

                expect(applyCouponCode!.totalWithTax).toBe(0);
                expect(applyCouponCode!.couponCodes).toEqual([TEST_COUPON_CODE]);

                await proceedToArrangingPayment(shopClient);
                const order = await addPaymentToOrder(shopClient, testSuccessfulPaymentMethod);
                orderGuard.assertSuccess(order);

                expect(order.state).toBe('PaymentSettled');
                expect(order.active).toBe(false);
            });

            it('returns error result when usage exceeds limit', async () => {
                await logInAsRegisteredCustomer();
                await createNewActiveOrder();
                const { applyCouponCode } = await shopClient.query<
                    ApplyCouponCode.Mutation,
                    ApplyCouponCode.Variables
                >(APPLY_COUPON_CODE, { couponCode: TEST_COUPON_CODE });
                orderResultGuard.assertErrorResult(applyCouponCode);
                expect(applyCouponCode.message).toEqual(
                    'Coupon code cannot be used more than once per customer',
                );
                expect(applyCouponCode.errorCode).toBe(ErrorCode.COUPON_CODE_LIMIT_ERROR);
            });

            it('removes couponCode from order when logging in after code applied', async () => {
                await shopClient.asAnonymousUser();
                await createNewActiveOrder();
                const { applyCouponCode } = await shopClient.query<
                    ApplyCouponCode.Mutation,
                    ApplyCouponCode.Variables
                >(APPLY_COUPON_CODE, { couponCode: TEST_COUPON_CODE });
                orderResultGuard.assertSuccess(applyCouponCode);

                expect(applyCouponCode!.couponCodes).toEqual([TEST_COUPON_CODE]);
                expect(applyCouponCode!.totalWithTax).toBe(0);

                await logInAsRegisteredCustomer();

                const { activeOrder } = await shopClient.query<GetActiveOrder.Query>(GET_ACTIVE_ORDER);
                expect(activeOrder!.totalWithTax).toBe(6000);
                expect(activeOrder!.couponCodes).toEqual([]);
            });
        });
    });

    async function getProducts() {
        const result = await adminClient.query<GetProductsWithVariantPrices.Query>(
            GET_PRODUCTS_WITH_VARIANT_PRICES,
            {
                options: {
                    take: 10,
                    skip: 0,
                },
            },
        );
        products = result.products.items;
    }
    async function createGlobalPromotions() {
        const { facets } = await adminClient.query<GetFacetList.Query>(GET_FACET_LIST);
        const saleFacetValue = facets.items[0].values[0];
        await createPromotion({
            enabled: true,
            name: 'Promo not yet started',
            startsAt: new Date(2199, 0, 0),
            conditions: [minOrderAmountCondition(100)],
            actions: [freeOrderAction],
        });

        const deletedPromotion = await createPromotion({
            enabled: true,
            name: 'Deleted promotion',
            conditions: [minOrderAmountCondition(100)],
            actions: [freeOrderAction],
        });
        await deletePromotion(deletedPromotion.id);
    }

    async function createPromotion(input: CreatePromotionInput): Promise<PromotionFragment> {
        const result = await adminClient.query<CreatePromotion.Mutation, CreatePromotion.Variables>(
            CREATE_PROMOTION,
            {
                input,
            },
        );
        return result.createPromotion as PromotionFragment;
    }

    function getVariantBySlug(
        slug: 'item-100' | 'item-1000' | 'item-5000' | 'item-sale-100' | 'item-sale-1000',
    ): GetProductsWithVariantPrices.Variants {
        return products.find(p => p.slug === slug)!.variants[0];
    }

    async function deletePromotion(promotionId: string) {
        await adminClient.query(gql`
            mutation DeletePromotionAdHoc1 {
                deletePromotion(id: "${promotionId}") {
                    result
                }
            }
        `);
    }
});
