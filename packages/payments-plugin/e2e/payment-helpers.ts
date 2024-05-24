import { ID } from '@vendure/common/lib/shared-types';
import {
    ChannelService,
    ErrorResult,
    OrderService,
    PaymentService,
    RequestContext,
    assertFound,
} from '@vendure/core';
import { SimpleGraphQLClient, TestServer } from '@vendure/testing';
import gql from 'graphql-tag';

import { CREATE_COUPON, REFUND_ORDER } from './graphql/admin-queries';
import {
    RefundFragment,
    RefundOrderMutation,
    RefundOrderMutationVariables,
} from './graphql/generated-admin-types';
import {
    GetShippingMethodsQuery,
    SetShippingMethodMutation,
    SetShippingMethodMutationVariables,
    TestOrderFragmentFragment,
    TransitionToStateMutation,
    TransitionToStateMutationVariables,
} from './graphql/generated-shop-types';
import {
    GET_ELIGIBLE_SHIPPING_METHODS,
    SET_SHIPPING_ADDRESS,
    SET_SHIPPING_METHOD,
    TRANSITION_TO_STATE,
} from './graphql/shop-queries';

export async function setShipping(shopClient: SimpleGraphQLClient): Promise<void> {
    const { setOrderShippingAddress: order } = await shopClient.query(SET_SHIPPING_ADDRESS, {
        input: {
            fullName: 'name',
            streetLine1: '12 the street',
            city: 'Leeuwarden',
            postalCode: '123456',
            countryCode: 'AT',
        },
    });
    const { eligibleShippingMethods } = await shopClient.query<GetShippingMethodsQuery>(
        GET_ELIGIBLE_SHIPPING_METHODS,
    );
    if (!eligibleShippingMethods?.length) {
        throw Error(
            `No eligible shipping methods found for order '${String(order.code)}' with a total of '${String(order.totalWithTax)}'`,
        );
    }
    await shopClient.query<SetShippingMethodMutation, SetShippingMethodMutationVariables>(
        SET_SHIPPING_METHOD,
        {
            id: eligibleShippingMethods[1].id,
        },
    );
}

export async function proceedToArrangingPayment(shopClient: SimpleGraphQLClient): Promise<ID> {
    await setShipping(shopClient);
    const { transitionOrderToState } = await shopClient.query<
        TransitionToStateMutation,
        TransitionToStateMutationVariables
    >(TRANSITION_TO_STATE, { state: 'ArrangingPayment' });
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (transitionOrderToState as TestOrderFragmentFragment)!.id;
}

export async function refundOrderLine(
    adminClient: SimpleGraphQLClient,
    orderLineId: string,
    quantity: number,
    paymentId: string,
    adjustment: number,
): Promise<RefundFragment> {
    const { refundOrder } = await adminClient.query<RefundOrderMutation, RefundOrderMutationVariables>(
        REFUND_ORDER,
        {
            input: {
                lines: [{ orderLineId, quantity }],
                shipping: 0,
                adjustment,
                paymentId,
            },
        },
    );
    return refundOrder as RefundFragment;
}
/**
 * Add a partial payment to an order. This happens, for example, when using Gift cards
 */
export async function addManualPayment(server: TestServer, orderId: ID, amount: number): Promise<void> {
    const ctx = new RequestContext({
        apiType: 'admin',
        isAuthorized: true,
        authorizedAsOwnerOnly: false,
        channel: await server.app.get(ChannelService).getDefaultChannel(),
    });
    const order = await assertFound(server.app.get(OrderService).findOne(ctx, orderId));
    // tslint:disable-next-line:no-non-null-assertion
    await server.app.get(PaymentService).createManualPayment(ctx, order, amount, {
        method: 'Gift card',
        orderId: order.id,
        metadata: {
            bogus: 'test',
        },
    });
}

/**
 * Create a coupon with the given code and discount amount.
 */
export async function createFixedDiscountCoupon(
    adminClient: SimpleGraphQLClient,
    amount: number,
    couponCode: string,
): Promise<void> {
    const { createPromotion } = await adminClient.query(CREATE_COUPON, {
        input: {
            conditions: [],
            actions: [
                {
                    code: 'order_fixed_discount',
                    arguments: [
                        {
                            name: 'discount',
                            value: String(amount),
                        },
                    ],
                },
            ],
            couponCode,
            startsAt: null,
            endsAt: null,
            perCustomerUsageLimit: null,
            usageLimit: null,
            enabled: true,
            translations: [
                {
                    languageCode: 'en',
                    name: `Coupon ${couponCode}`,
                    description: '',
                    customFields: {},
                },
            ],
            customFields: {},
        },
    });
    if (createPromotion.__typename === 'ErrorResult') {
        throw new Error(`Error creating coupon: ${(createPromotion as ErrorResult).errorCode}`);
    }
}
/**
 * Create a coupon that discounts the shipping costs
 */
export async function createFreeShippingCoupon(
    adminClient: SimpleGraphQLClient,
    couponCode: string,
): Promise<void> {
    const { createPromotion } = await adminClient.query(CREATE_COUPON, {
        input: {
            conditions: [],
            actions: [
                {
                    code: 'free_shipping',
                    arguments: [],
                },
            ],
            couponCode,
            startsAt: null,
            endsAt: null,
            perCustomerUsageLimit: null,
            usageLimit: null,
            enabled: true,
            translations: [
                {
                    languageCode: 'en',
                    name: `Coupon ${couponCode}`,
                    description: '',
                    customFields: {},
                },
            ],
            customFields: {},
        },
    });
    if (createPromotion.__typename === 'ErrorResult') {
        throw new Error(`Error creating coupon: ${(createPromotion as ErrorResult).errorCode}`);
    }
}

export const CREATE_MOLLIE_PAYMENT_INTENT = gql`
    mutation createMolliePaymentIntent($input: MolliePaymentIntentInput!) {
        createMolliePaymentIntent(input: $input) {
            ... on MolliePaymentIntent {
                url
            }
            ... on MolliePaymentIntentError {
                errorCode
                message
            }
        }
    }
`;

export const CREATE_STRIPE_PAYMENT_INTENT = gql`
    mutation createStripePaymentIntent {
        createStripePaymentIntent
    }
`;

export const GET_MOLLIE_PAYMENT_METHODS = gql`
    query molliePaymentMethods($input: MolliePaymentMethodsInput!) {
        molliePaymentMethods(input: $input) {
            id
            code
            description
            minimumAmount {
                value
                currency
            }
            maximumAmount {
                value
                currency
            }
            image {
                size1x
                size2x
                svg
            }
        }
    }
`;
