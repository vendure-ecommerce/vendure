/* tslint:disable:no-non-null-assertion */
import { omit } from '@vendure/common/lib/omit';
import { pick } from '@vendure/common/lib/pick';
import {
    containsProducts,
    customerGroup,
    discountOnItemWithFacets,
    hasFacetValues,
    minimumOrderAmount,
    orderPercentageDiscount,
    productsPercentageDiscount,
} from '@vendure/core';
import { createErrorResultGuard, createTestEnvironment, ErrorResultGuard } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import { testSuccessfulPaymentMethod } from './fixtures/test-payment-methods';
import {
    CreateCustomerGroup,
    CreatePromotion,
    CreatePromotionInput,
    GetFacetList,
    GetPromoProducts,
    HistoryEntryType,
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
    TestOrderFragment,
    TestOrderFragmentFragment,
    TestOrderWithPaymentsFragment,
    UpdatedOrderFragment,
} from './graphql/generated-e2e-shop-types';
import {
    CREATE_CUSTOMER_GROUP,
    CREATE_PROMOTION,
    GET_FACET_LIST,
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
} from './graphql/shop-definitions';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';
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
    const orderResultGuard: ErrorResultGuard<OrderSuccessResult> = createErrorResultGuard<OrderSuccessResult>(
        input => !!input.lines,
    );

    let products: GetPromoProducts.Items[];

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
            const item60 = getVariantBySlug('item-60');
            await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
                productVariantId: item60.id,
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
            expect(applyCouponCode!.adjustments.length).toBe(1);
            expect(applyCouponCode!.adjustments[0].description).toBe('Free with test coupon');
            expect(applyCouponCode!.total).toBe(0);
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

            expect(removeCouponCode!.adjustments.length).toBe(0);
            expect(removeCouponCode!.total).toBe(6000);
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
            const item60 = getVariantBySlug('item-60');
            const { addItemToOrder } = await shopClient.query<
                AddItemToOrder.Mutation,
                AddItemToOrder.Variables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: item60.id,
                quantity: 1,
            });
            orderResultGuard.assertSuccess(addItemToOrder);
            expect(addItemToOrder!.total).toBe(6000);
            expect(addItemToOrder!.adjustments.length).toBe(0);

            const { adjustOrderLine } = await shopClient.query<
                AdjustItemQuantity.Mutation,
                AdjustItemQuantity.Variables
            >(ADJUST_ITEM_QUANTITY, {
                orderLineId: addItemToOrder!.lines[0].id,
                quantity: 2,
            });
            orderResultGuard.assertSuccess(adjustOrderLine);
            expect(adjustOrderLine!.total).toBe(0);
            expect(adjustOrderLine!.adjustments[0].description).toBe('Free if order total greater than 100');
            expect(adjustOrderLine!.adjustments[0].amount).toBe(-12000);

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

            const itemSale1 = getVariantBySlug('item-sale-1');
            const itemSale12 = getVariantBySlug('item-sale-12');
            const { addItemToOrder: res1 } = await shopClient.query<
                AddItemToOrder.Mutation,
                AddItemToOrder.Variables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: itemSale1.id,
                quantity: 1,
            });
            orderResultGuard.assertSuccess(res1);
            expect(res1!.total).toBe(120);
            expect(res1!.adjustments.length).toBe(0);

            const { addItemToOrder: res2 } = await shopClient.query<
                AddItemToOrder.Mutation,
                AddItemToOrder.Variables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: itemSale12.id,
                quantity: 1,
            });
            orderResultGuard.assertSuccess(res2);
            expect(res2!.total).toBe(0);
            expect(res2!.adjustments.length).toBe(1);
            expect(res2!.total).toBe(0);
            expect(res2!.adjustments[0].description).toBe(
                'Free if order contains 2 items with Sale facet value',
            );
            expect(res2!.adjustments[0].amount).toBe(-1320);

            await deletePromotion(promotion.id);
        });

        it('containsProducts', async () => {
            const item60 = getVariantBySlug('item-60');
            const item12 = getVariantBySlug('item-12');
            const promotion = await createPromotion({
                enabled: true,
                name: 'Free if buying 3 or more offer products',
                conditions: [
                    {
                        code: containsProducts.code,
                        arguments: [
                            { name: 'minimum', value: '3' },
                            { name: 'productVariantIds', value: JSON.stringify([item60.id, item12.id]) },
                        ],
                    },
                ],
                actions: [freeOrderAction],
            });
            await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
                productVariantId: item60.id,
                quantity: 1,
            });
            const { addItemToOrder } = await shopClient.query<
                AddItemToOrder.Mutation,
                AddItemToOrder.Variables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: item12.id,
                quantity: 1,
            });
            orderResultGuard.assertSuccess(addItemToOrder);
            expect(addItemToOrder!.total).toBe(7200);
            expect(addItemToOrder!.adjustments.length).toBe(0);

            const { adjustOrderLine } = await shopClient.query<
                AdjustItemQuantity.Mutation,
                AdjustItemQuantity.Variables
            >(ADJUST_ITEM_QUANTITY, {
                orderLineId: addItemToOrder!.lines[0].id,
                quantity: 2,
            });
            orderResultGuard.assertSuccess(adjustOrderLine);
            expect(adjustOrderLine!.total).toBe(0);
            expect(adjustOrderLine!.adjustments[0].description).toBe(
                'Free if buying 3 or more offer products',
            );
            expect(adjustOrderLine!.adjustments[0].amount).toBe(-13200);

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
                productVariantId: getVariantBySlug('item-60').id,
                quantity: 1,
            });
            orderResultGuard.assertSuccess(addItemToOrder);
            expect(addItemToOrder!.total).toBe(0);
            expect(addItemToOrder!.adjustments.length).toBe(1);
            expect(addItemToOrder!.adjustments[0].description).toBe('Free for group members');
            expect(addItemToOrder!.adjustments[0].amount).toBe(-6000);

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
            expect(adjustOrderLine!.total).toBe(12000);
            expect(adjustOrderLine!.adjustments.length).toBe(0);

            await deletePromotion(promotion.id);
        });
    });

    describe('default PromotionActions', () => {
        beforeEach(async () => {
            await shopClient.asAnonymousUser();
        });

        it('orderPercentageDiscount', async () => {
            const couponCode = '50%_off_order';
            const promotion = await createPromotion({
                enabled: true,
                name: '50% discount on order',
                couponCode,
                conditions: [],
                actions: [
                    {
                        code: orderPercentageDiscount.code,
                        arguments: [{ name: 'discount', value: '50' }],
                    },
                ],
            });
            const item60 = getVariantBySlug('item-60');
            const { addItemToOrder } = await shopClient.query<
                AddItemToOrder.Mutation,
                AddItemToOrder.Variables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: item60.id,
                quantity: 1,
            });
            orderResultGuard.assertSuccess(addItemToOrder);
            expect(addItemToOrder!.total).toBe(6000);
            expect(addItemToOrder!.adjustments.length).toBe(0);

            const { applyCouponCode } = await shopClient.query<
                ApplyCouponCode.Mutation,
                ApplyCouponCode.Variables
            >(APPLY_COUPON_CODE, {
                couponCode,
            });
            orderResultGuard.assertSuccess(applyCouponCode);
            expect(applyCouponCode!.adjustments.length).toBe(1);
            expect(applyCouponCode!.adjustments[0].description).toBe('50% discount on order');
            expect(applyCouponCode!.total).toBe(3000);

            await deletePromotion(promotion.id);
        });

        it('discountOnItemWithFacets', async () => {
            const { facets } = await adminClient.query<GetFacetList.Query>(GET_FACET_LIST);
            const saleFacetValue = facets.items[0].values[0];
            const couponCode = '50%_off_sale_items';
            const promotion = await createPromotion({
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
            await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
                productVariantId: getVariantBySlug('item-12').id,
                quantity: 1,
            });
            await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
                productVariantId: getVariantBySlug('item-sale-12').id,
                quantity: 1,
            });
            const { addItemToOrder } = await shopClient.query<
                AddItemToOrder.Mutation,
                AddItemToOrder.Variables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: getVariantBySlug('item-sale-1').id,
                quantity: 2,
            });

            function getItemSale1Line(lines: TestOrderFragment.Lines[]): TestOrderFragment.Lines {
                return lines.find(l => l.productVariant.id === getVariantBySlug('item-sale-1').id)!;
            }
            orderResultGuard.assertSuccess(addItemToOrder);
            expect(addItemToOrder!.adjustments.length).toBe(0);
            expect(getItemSale1Line(addItemToOrder!.lines).adjustments.length).toBe(2); // 2x tax
            expect(addItemToOrder!.total).toBe(2640);

            const { applyCouponCode } = await shopClient.query<
                ApplyCouponCode.Mutation,
                ApplyCouponCode.Variables
            >(APPLY_COUPON_CODE, {
                couponCode,
            });
            orderResultGuard.assertSuccess(applyCouponCode);

            expect(applyCouponCode!.total).toBe(1920);
            expect(getItemSale1Line(applyCouponCode!.lines).adjustments.length).toBe(4); // 2x tax, 2x promotion

            const { removeCouponCode } = await shopClient.query<
                RemoveCouponCode.Mutation,
                RemoveCouponCode.Variables
            >(REMOVE_COUPON_CODE, {
                couponCode,
            });

            expect(getItemSale1Line(removeCouponCode!.lines).adjustments.length).toBe(2); // 2x tax
            expect(removeCouponCode!.total).toBe(2640);

            const { activeOrder } = await shopClient.query<GetActiveOrder.Query>(GET_ACTIVE_ORDER);
            expect(getItemSale1Line(activeOrder!.lines).adjustments.length).toBe(2); // 2x tax
            expect(activeOrder!.total).toBe(2640);

            await deletePromotion(promotion.id);
        });

        it('productsPercentageDiscount', async () => {
            const item60 = getVariantBySlug('item-60');
            const couponCode = '50%_off_product';
            const promotion = await createPromotion({
                enabled: true,
                name: '50% off product',
                couponCode,
                conditions: [],
                actions: [
                    {
                        code: productsPercentageDiscount.code,
                        arguments: [
                            { name: 'discount', value: '50' },
                            { name: 'productVariantIds', value: `["${item60.id}"]` },
                        ],
                    },
                ],
            });
            const { addItemToOrder } = await shopClient.query<
                AddItemToOrder.Mutation,
                AddItemToOrder.Variables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: item60.id,
                quantity: 1,
            });
            orderResultGuard.assertSuccess(addItemToOrder);
            expect(addItemToOrder!.adjustments.length).toBe(0);
            expect(addItemToOrder!.lines[0].adjustments.length).toBe(1); // 1x tax
            expect(addItemToOrder!.total).toBe(6000);

            const { applyCouponCode } = await shopClient.query<
                ApplyCouponCode.Mutation,
                ApplyCouponCode.Variables
            >(APPLY_COUPON_CODE, {
                couponCode,
            });
            orderResultGuard.assertSuccess(applyCouponCode);

            expect(applyCouponCode!.total).toBe(3000);
            expect(applyCouponCode!.lines[0].adjustments.length).toBe(2); // 1x tax, 1x promotion

            const { removeCouponCode } = await shopClient.query<
                RemoveCouponCode.Mutation,
                RemoveCouponCode.Variables
            >(REMOVE_COUPON_CODE, {
                couponCode,
            });

            expect(removeCouponCode!.lines[0].adjustments.length).toBe(1); // 1x tax
            expect(removeCouponCode!.total).toBe(6000);

            await deletePromotion(promotion.id);
        });

        it('multiple promotions simultaneously', async () => {
            const { facets } = await adminClient.query<GetFacetList.Query>(GET_FACET_LIST);
            const saleFacetValue = facets.items[0].values[0];
            const promotion1 = await createPromotion({
                enabled: true,
                name: 'item promo',
                couponCode: 'CODE1',
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
            const promotion2 = await createPromotion({
                enabled: true,
                name: 'order promo',
                couponCode: 'CODE2',
                conditions: [],
                actions: [
                    {
                        code: orderPercentageDiscount.code,
                        arguments: [{ name: 'discount', value: '50' }],
                    },
                ],
            });

            await shopClient.query<AddItemToOrder.Mutation, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
                productVariantId: getVariantBySlug('item-sale-12').id,
                quantity: 1,
            });

            // Apply the OrderItem-level promo
            const { applyCouponCode: apply1 } = await shopClient.query<
                ApplyCouponCode.Mutation,
                ApplyCouponCode.Variables
            >(APPLY_COUPON_CODE, {
                couponCode: 'CODE1',
            });
            orderResultGuard.assertSuccess(apply1);

            expect(apply1?.lines[0].adjustments.length).toBe(2);
            expect(
                apply1?.lines[0].adjustments.find(a => a.type === AdjustmentType.PROMOTION)?.description,
            ).toBe('item promo');
            expect(apply1?.adjustments.length).toBe(0);

            // Apply the Order-level promo
            const { applyCouponCode: apply2 } = await shopClient.query<
                ApplyCouponCode.Mutation,
                ApplyCouponCode.Variables
            >(APPLY_COUPON_CODE, {
                couponCode: 'CODE2',
            });
            orderResultGuard.assertSuccess(apply2);

            expect(apply2?.lines[0].adjustments.length).toBe(2);
            expect(
                apply2?.lines[0].adjustments.find(a => a.type === AdjustmentType.PROMOTION)?.description,
            ).toBe('item promo');
            expect(apply2?.adjustments.length).toBe(1);
            expect(apply2?.adjustments[0].description).toBe('order promo');
        });
    });

    describe('per-customer usage limit', () => {
        const TEST_COUPON_CODE = 'TESTCOUPON';
        const orderGuard: ErrorResultGuard<TestOrderWithPaymentsFragment> = createErrorResultGuard<
            TestOrderWithPaymentsFragment
        >(input => !!input.lines);
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
            const item60 = getVariantBySlug('item-60');
            const { addItemToOrder } = await shopClient.query<
                AddItemToOrder.Mutation,
                AddItemToOrder.Variables
            >(ADD_ITEM_TO_ORDER, {
                productVariantId: item60.id,
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

                expect(applyCouponCode!.total).toBe(0);
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

                expect(applyCouponCode!.total).toBe(0);
                expect(applyCouponCode!.couponCodes).toEqual([TEST_COUPON_CODE]);

                await addGuestCustomerToOrder();

                const { activeOrder } = await shopClient.query<GetActiveOrder.Query>(GET_ACTIVE_ORDER);
                expect(activeOrder!.couponCodes).toEqual([]);
                expect(activeOrder!.total).toBe(6000);
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

                expect(applyCouponCode!.total).toBe(0);
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
                expect(applyCouponCode!.total).toBe(0);

                await logInAsRegisteredCustomer();

                const { activeOrder } = await shopClient.query<GetActiveOrder.Query>(GET_ACTIVE_ORDER);
                expect(activeOrder!.total).toBe(6000);
                expect(activeOrder!.couponCodes).toEqual([]);
            });
        });
    });

    async function getProducts() {
        const result = await adminClient.query<GetPromoProducts.Query>(GET_PROMO_PRODUCTS, {
            options: {
                take: 10,
                skip: 0,
            },
        });
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
        slug: 'item-1' | 'item-12' | 'item-60' | 'item-sale-1' | 'item-sale-12',
    ): GetPromoProducts.Variants {
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

export const GET_PROMO_PRODUCTS = gql`
    query GetPromoProducts {
        products {
            items {
                id
                slug
                variants {
                    id
                    price
                    priceWithTax
                    sku
                    facetValues {
                        id
                        code
                    }
                }
            }
        }
    }
`;
