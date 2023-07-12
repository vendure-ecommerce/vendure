/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { LanguageCode } from '@vendure/common/lib/generated-types';
import {
    DefaultLogger,
    DefaultOrderPlacedStrategy,
    mergeConfig,
    Order,
    orderPercentageDiscount,
    OrderState,
    RequestContext,
} from '@vendure/core';
import { createErrorResultGuard, createTestEnvironment, ErrorResultGuard } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import { singleStageRefundablePaymentMethod } from './fixtures/test-payment-methods';
import { ORDER_WITH_LINES_FRAGMENT } from './graphql/fragments';
import * as Codegen from './graphql/generated-e2e-admin-types';
import {
    AddManualPaymentDocument,
    AdminTransitionDocument,
    CanceledOrderFragment,
    GetOrderDocument,
    GetOrderPlacedAtDocument,
    OrderWithLinesFragment,
} from './graphql/generated-e2e-admin-types';
import {
    GetActiveCustomerOrdersQuery,
    TestOrderFragmentFragment,
    TransitionToStateDocument,
    UpdatedOrderFragment,
} from './graphql/generated-e2e-shop-types';
import { CREATE_PROMOTION, GET_CUSTOMER_LIST } from './graphql/shared-definitions';
import { GET_ACTIVE_CUSTOMER_ORDERS } from './graphql/shop-definitions';

class TestOrderPlacedStrategy extends DefaultOrderPlacedStrategy {
    static spy = vi.fn();
    shouldSetAsPlaced(
        ctx: RequestContext,
        fromState: OrderState,
        toState: OrderState,
        order: Order,
    ): boolean {
        TestOrderPlacedStrategy.spy(order);
        return super.shouldSetAsPlaced(ctx, fromState, toState, order);
    }
}

describe('Draft Orders resolver', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(
        mergeConfig(testConfig(), {
            logger: new DefaultLogger(),
            paymentOptions: {
                paymentMethodHandlers: [singleStageRefundablePaymentMethod],
            },
            orderOptions: {
                orderPlacedStrategy: new TestOrderPlacedStrategy(),
            },
            dbConnectionOptions: {
                logging: true,
            },
        }),
    );
    let customers: Codegen.GetCustomerListQuery['customers']['items'];
    let draftOrder: OrderWithLinesFragment;
    const freeOrderCouponCode = 'FREE';

    const orderGuard: ErrorResultGuard<
        TestOrderFragmentFragment | CanceledOrderFragment | UpdatedOrderFragment
    > = createErrorResultGuard(input => !!input.lines || !!input.state);

    beforeAll(async () => {
        await server.init({
            initialData: {
                ...initialData,
                paymentMethods: [
                    {
                        name: singleStageRefundablePaymentMethod.code,
                        handler: { code: singleStageRefundablePaymentMethod.code, arguments: [] },
                    },
                ],
            },
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
            customerCount: 3,
        });
        await adminClient.asSuperAdmin();

        // Create a couple of orders to be queried
        const result = await adminClient.query<
            Codegen.GetCustomerListQuery,
            Codegen.GetCustomerListQueryVariables
        >(GET_CUSTOMER_LIST, {
            options: {
                take: 3,
            },
        });
        customers = result.customers.items;

        // Create a coupon code promotion
        const { createPromotion } = await adminClient.query<
            Codegen.CreatePromotionMutation,
            Codegen.CreatePromotionMutationVariables
        >(CREATE_PROMOTION, {
            input: {
                enabled: true,
                conditions: [],
                couponCode: freeOrderCouponCode,
                actions: [
                    {
                        code: orderPercentageDiscount.code,
                        arguments: [{ name: 'discount', value: '100' }],
                    },
                ],
                translations: [{ languageCode: LanguageCode.en, name: 'Free Order' }],
            },
        });
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('create draft order', async () => {
        const { createDraftOrder } = await adminClient.query<Codegen.CreateDraftOrderMutation>(
            CREATE_DRAFT_ORDER,
        );

        expect(createDraftOrder.state).toBe('Draft');
        expect(createDraftOrder.active).toBe(false);
        draftOrder = createDraftOrder;
    });

    it('addItemToDraftOrder', async () => {
        const { addItemToDraftOrder } = await adminClient.query<
            Codegen.AddItemToDraftOrderMutation,
            Codegen.AddItemToDraftOrderMutationVariables
        >(ADD_ITEM_TO_DRAFT_ORDER, {
            orderId: draftOrder.id,
            input: {
                productVariantId: 'T_5',
                quantity: 2,
            },
        });

        orderGuard.assertSuccess(addItemToDraftOrder);

        expect(addItemToDraftOrder.lines.length).toBe(1);
        draftOrder = addItemToDraftOrder;
    });

    it('adjustDraftOrderLine up', async () => {
        const { adjustDraftOrderLine } = await adminClient.query<
            Codegen.AdjustDraftOrderLineMutation,
            Codegen.AdjustDraftOrderLineMutationVariables
        >(ADJUST_DRAFT_ORDER_LINE, {
            orderId: draftOrder.id,
            input: {
                orderLineId: draftOrder.lines[0]!.id,
                quantity: 5,
            },
        });

        orderGuard.assertSuccess(adjustDraftOrderLine);
        expect(adjustDraftOrderLine.lines[0].quantity).toBe(5);
    });

    it('adjustDraftOrderLine down', async () => {
        const { adjustDraftOrderLine } = await adminClient.query<
            Codegen.AdjustDraftOrderLineMutation,
            Codegen.AdjustDraftOrderLineMutationVariables
        >(ADJUST_DRAFT_ORDER_LINE, {
            orderId: draftOrder.id,
            input: {
                orderLineId: draftOrder.lines[0]!.id,
                quantity: 2,
            },
        });

        orderGuard.assertSuccess(adjustDraftOrderLine);
        expect(adjustDraftOrderLine.lines[0].quantity).toBe(2);
    });

    it('removeDraftOrderLine', async () => {
        const { removeDraftOrderLine } = await adminClient.query<
            Codegen.RemoveDraftOrderLineMutation,
            Codegen.RemoveDraftOrderLineMutationVariables
        >(REMOVE_DRAFT_ORDER_LINE, {
            orderId: draftOrder.id,
            orderLineId: draftOrder.lines[0]!.id,
        });

        orderGuard.assertSuccess(removeDraftOrderLine);
        expect(removeDraftOrderLine.lines.length).toBe(0);
    });

    it('setCustomerForDraftOrder', async () => {
        const { setCustomerForDraftOrder } = await adminClient.query<
            Codegen.SetCustomerForDraftOrderMutation,
            Codegen.SetCustomerForDraftOrderMutationVariables
        >(SET_CUSTOMER_FOR_DRAFT_ORDER, {
            orderId: draftOrder.id,
            customerId: customers[0].id,
        });

        orderGuard.assertSuccess(setCustomerForDraftOrder);
        expect(setCustomerForDraftOrder.customer?.id).toBe(customers[0].id);
    });

    it('custom does not see draft orders in history', async () => {
        await shopClient.asUserWithCredentials(customers[0].emailAddress, 'test');

        const { activeCustomer } = await shopClient.query<GetActiveCustomerOrdersQuery>(
            GET_ACTIVE_CUSTOMER_ORDERS,
        );

        expect(activeCustomer?.orders.totalItems).toBe(0);
        expect(activeCustomer?.orders.items.length).toBe(0);
    });

    it('setDraftOrderShippingAddress', async () => {
        const { setDraftOrderShippingAddress } = await adminClient.query<
            Codegen.SetDraftOrderShippingAddressMutation,
            Codegen.SetDraftOrderShippingAddressMutationVariables
        >(SET_SHIPPING_ADDRESS_FOR_DRAFT_ORDER, {
            orderId: draftOrder.id,
            input: {
                streetLine1: 'Shipping Street',
                city: 'Wigan',
                province: 'Greater Manchester',
                postalCode: 'WN1 2DD',
                countryCode: 'GB',
            },
        });

        expect(setDraftOrderShippingAddress.shippingAddress).toEqual({
            company: null,
            fullName: null,
            phoneNumber: null,
            streetLine2: null,
            province: 'Greater Manchester',
            city: 'Wigan',
            country: 'United Kingdom',
            postalCode: 'WN1 2DD',
            streetLine1: 'Shipping Street',
        });
    });

    it('setDraftOrderBillingAddress', async () => {
        const { setDraftOrderBillingAddress } = await adminClient.query<
            Codegen.SetDraftOrderBillingAddressMutation,
            Codegen.SetDraftOrderBillingAddressMutationVariables
        >(SET_BILLING_ADDRESS_FOR_DRAFT_ORDER, {
            orderId: draftOrder.id,
            input: {
                streetLine1: 'Billing Street',
                city: 'Skelmerdale',
                province: 'Lancashire',
                postalCode: 'WN8 3QW',
                countryCode: 'GB',
            },
        });

        expect(setDraftOrderBillingAddress.billingAddress).toEqual({
            company: null,
            fullName: null,
            phoneNumber: null,
            streetLine2: null,
            province: 'Lancashire',
            city: 'Skelmerdale',
            country: 'United Kingdom',
            postalCode: 'WN8 3QW',
            streetLine1: 'Billing Street',
        });
    });

    it('applyCouponCodeToDraftOrder', async () => {
        const { addItemToDraftOrder } = await adminClient.query<
            Codegen.AddItemToDraftOrderMutation,
            Codegen.AddItemToDraftOrderMutationVariables
        >(ADD_ITEM_TO_DRAFT_ORDER, {
            orderId: draftOrder.id,
            input: {
                productVariantId: 'T_1',
                quantity: 1,
            },
        });

        orderGuard.assertSuccess(addItemToDraftOrder);
        expect(addItemToDraftOrder.totalWithTax).toBe(155880);

        const { applyCouponCodeToDraftOrder } = await adminClient.query<
            Codegen.ApplyCouponCodeToDraftOrderMutation,
            Codegen.ApplyCouponCodeToDraftOrderMutationVariables
        >(APPLY_COUPON_CODE_TO_DRAFT_ORDER, {
            orderId: draftOrder.id,
            couponCode: freeOrderCouponCode,
        });

        orderGuard.assertSuccess(applyCouponCodeToDraftOrder);

        expect(applyCouponCodeToDraftOrder.couponCodes).toEqual([freeOrderCouponCode]);
        expect(applyCouponCodeToDraftOrder.totalWithTax).toBe(0);
    });

    it('removeCouponCodeFromDraftOrder', async () => {
        const { removeCouponCodeFromDraftOrder } = await adminClient.query<
            Codegen.RemoveCouponCodeFromDraftOrderMutation,
            Codegen.RemoveCouponCodeFromDraftOrderMutationVariables
        >(REMOVE_COUPON_CODE_FROM_DRAFT_ORDER, {
            orderId: draftOrder.id,
            couponCode: freeOrderCouponCode,
        });

        expect(removeCouponCodeFromDraftOrder!.couponCodes).toEqual([]);
        expect(removeCouponCodeFromDraftOrder!.totalWithTax).toBe(155880);
    });

    it('eligibleShippingMethodsForDraftOrder', async () => {
        const { eligibleShippingMethodsForDraftOrder } = await adminClient.query<
            Codegen.DraftOrderEligibleShippingMethodsQuery,
            Codegen.DraftOrderEligibleShippingMethodsQueryVariables
        >(DRAFT_ORDER_ELIGIBLE_SHIPPING_METHODS, {
            orderId: draftOrder.id,
        });

        expect(eligibleShippingMethodsForDraftOrder).toEqual([
            {
                code: 'standard-shipping',
                description: '',
                id: 'T_1',
                metadata: null,
                name: 'Standard Shipping',
                price: 500,
                priceWithTax: 500,
            },
            {
                code: 'express-shipping',
                description: '',
                id: 'T_2',
                metadata: null,
                name: 'Express Shipping',
                price: 1000,
                priceWithTax: 1000,
            },
        ]);
    });

    it('setDraftOrderShippingMethod', async () => {
        const { setDraftOrderShippingMethod } = await adminClient.query<
            Codegen.SetDraftOrderShippingMethodMutation,
            Codegen.SetDraftOrderShippingMethodMutationVariables
        >(SET_DRAFT_ORDER_SHIPPING_METHOD, {
            orderId: draftOrder.id,
            shippingMethodId: 'T_2',
        });

        orderGuard.assertSuccess(setDraftOrderShippingMethod);

        expect(setDraftOrderShippingMethod.shippingWithTax).toBe(1000);
        expect(setDraftOrderShippingMethod.shippingLines.length).toBe(1);
        expect(setDraftOrderShippingMethod.shippingLines[0].shippingMethod.id).toBe('T_2');
    });

    // https://github.com/vendure-ecommerce/vendure/issues/2105
    it('sets order as placed when payment is settled', async () => {
        TestOrderPlacedStrategy.spy.mockClear();
        expect(TestOrderPlacedStrategy.spy.mock.calls.length).toBe(0);

        const { transitionOrderToState } = await adminClient.query(AdminTransitionDocument, {
            id: draftOrder.id,
            state: 'ArrangingPayment',
        });

        orderGuard.assertSuccess(transitionOrderToState);
        expect(transitionOrderToState.state).toBe('ArrangingPayment');

        const { addManualPaymentToOrder } = await adminClient.query(AddManualPaymentDocument, {
            input: {
                orderId: draftOrder.id,
                metadata: {},
                method: singleStageRefundablePaymentMethod.code,
                transactionId: '12345',
            },
        });

        orderGuard.assertSuccess(addManualPaymentToOrder);
        expect(addManualPaymentToOrder.state).toBe('PaymentSettled');

        const { order } = await adminClient.query(GetOrderPlacedAtDocument, {
            id: draftOrder.id,
        });
        expect(order?.orderPlacedAt).not.toBeNull();
        expect(TestOrderPlacedStrategy.spy.mock.calls.length).toBe(1);
        expect(TestOrderPlacedStrategy.spy.mock.calls[0][0].code).toBe(draftOrder.code);
    });
});

export const CREATE_DRAFT_ORDER = gql`
    mutation CreateDraftOrder {
        createDraftOrder {
            ...OrderWithLines
        }
    }
    ${ORDER_WITH_LINES_FRAGMENT}
`;

export const ADD_ITEM_TO_DRAFT_ORDER = gql`
    mutation AddItemToDraftOrder($orderId: ID!, $input: AddItemToDraftOrderInput!) {
        addItemToDraftOrder(orderId: $orderId, input: $input) {
            ...OrderWithLines
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
    ${ORDER_WITH_LINES_FRAGMENT}
`;

export const ADJUST_DRAFT_ORDER_LINE = gql`
    mutation AdjustDraftOrderLine($orderId: ID!, $input: AdjustDraftOrderLineInput!) {
        adjustDraftOrderLine(orderId: $orderId, input: $input) {
            ...OrderWithLines
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
    ${ORDER_WITH_LINES_FRAGMENT}
`;

export const REMOVE_DRAFT_ORDER_LINE = gql`
    mutation RemoveDraftOrderLine($orderId: ID!, $orderLineId: ID!) {
        removeDraftOrderLine(orderId: $orderId, orderLineId: $orderLineId) {
            ...OrderWithLines
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
    ${ORDER_WITH_LINES_FRAGMENT}
`;

export const SET_CUSTOMER_FOR_DRAFT_ORDER = gql`
    mutation SetCustomerForDraftOrder($orderId: ID!, $customerId: ID, $input: CreateCustomerInput) {
        setCustomerForDraftOrder(orderId: $orderId, customerId: $customerId, input: $input) {
            ...OrderWithLines
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
    ${ORDER_WITH_LINES_FRAGMENT}
`;

export const SET_SHIPPING_ADDRESS_FOR_DRAFT_ORDER = gql`
    mutation SetDraftOrderShippingAddress($orderId: ID!, $input: CreateAddressInput!) {
        setDraftOrderShippingAddress(orderId: $orderId, input: $input) {
            ...OrderWithLines
        }
    }
    ${ORDER_WITH_LINES_FRAGMENT}
`;

export const SET_BILLING_ADDRESS_FOR_DRAFT_ORDER = gql`
    mutation SetDraftOrderBillingAddress($orderId: ID!, $input: CreateAddressInput!) {
        setDraftOrderBillingAddress(orderId: $orderId, input: $input) {
            ...OrderWithLines
            billingAddress {
                ...ShippingAddress
            }
        }
    }
    ${ORDER_WITH_LINES_FRAGMENT}
`;

export const APPLY_COUPON_CODE_TO_DRAFT_ORDER = gql`
    mutation ApplyCouponCodeToDraftOrder($orderId: ID!, $couponCode: String!) {
        applyCouponCodeToDraftOrder(orderId: $orderId, couponCode: $couponCode) {
            ...OrderWithLines
            ... on Order {
                couponCodes
            }
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
    ${ORDER_WITH_LINES_FRAGMENT}
`;

export const REMOVE_COUPON_CODE_FROM_DRAFT_ORDER = gql`
    mutation RemoveCouponCodeFromDraftOrder($orderId: ID!, $couponCode: String!) {
        removeCouponCodeFromDraftOrder(orderId: $orderId, couponCode: $couponCode) {
            ...OrderWithLines
            ... on Order {
                couponCodes
            }
        }
    }
    ${ORDER_WITH_LINES_FRAGMENT}
`;

export const DRAFT_ORDER_ELIGIBLE_SHIPPING_METHODS = gql`
    query DraftOrderEligibleShippingMethods($orderId: ID!) {
        eligibleShippingMethodsForDraftOrder(orderId: $orderId) {
            id
            name
            code
            description
            price
            priceWithTax
            metadata
        }
    }
`;

export const SET_DRAFT_ORDER_SHIPPING_METHOD = gql`
    mutation SetDraftOrderShippingMethod($orderId: ID!, $shippingMethodId: ID!) {
        setDraftOrderShippingMethod(orderId: $orderId, shippingMethodId: $shippingMethodId) {
            ...OrderWithLines
            ... on ErrorResult {
                errorCode
                message
            }
        }
    }
    ${ORDER_WITH_LINES_FRAGMENT}
`;

export const GET_ORDER_PLACED_AT = gql`
    query GetOrderPlacedAt($id: ID!) {
        order(id: $id) {
            id
            createdAt
            updatedAt
            state
            orderPlacedAt
        }
    }
`;
