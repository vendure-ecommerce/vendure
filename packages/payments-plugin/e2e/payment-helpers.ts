import { ID } from '@vendure/common/lib/shared-types';
import {
    ChannelService,
    LanguageCode,
    OrderService,
    PaymentMethodEligibilityChecker,
    PaymentService,
    RequestContext,
    assertFound,
} from '@vendure/core';
import { SimpleGraphQLClient, TestServer } from '@vendure/testing';

import { createCouponDocument, refundOrderDocument } from './graphql/admin-definitions';
import { refundFragment } from './graphql/fragments-admin';
import { FragmentOf } from './graphql/graphql-admin';
import {
    getEligibleShippingMethodsDocument,
    setShippingAddressDocument,
    setShippingMethodDocument,
    transitionToStateDocument,
} from './graphql/shop-definitions';

export async function setShipping(shopClient: SimpleGraphQLClient): Promise<void> {
    const { setOrderShippingAddress } = await shopClient.query(setShippingAddressDocument, {
        input: {
            fullName: 'name',
            streetLine1: '12 the street',
            city: 'Leeuwarden',
            postalCode: '123456',
            countryCode: 'AT',
        },
    });
    if (!setOrderShippingAddress || 'errorCode' in setOrderShippingAddress) {
        throw Error('Failed to set shipping address');
    }
    const order = setOrderShippingAddress;
    const { eligibleShippingMethods } = await shopClient.query(getEligibleShippingMethodsDocument);
    if (!eligibleShippingMethods?.length) {
        throw Error(
            `No eligible shipping methods found for order '${String(order.code)}' with a total of '${String(order.totalWithTax)}'`,
        );
    }
    await shopClient.query(setShippingMethodDocument, {
        id: [eligibleShippingMethods[1].id],
    });
}

export async function proceedToArrangingPayment(shopClient: SimpleGraphQLClient): Promise<ID> {
    await setShipping(shopClient);
    const { transitionOrderToState } = await shopClient.query(transitionToStateDocument, {
        state: 'ArrangingPayment',
    });
    if (!transitionOrderToState || 'errorCode' in transitionOrderToState) {
        throw Error('Failed to transition to ArrangingPayment');
    }
    return transitionOrderToState.id;
}

export async function refundOrderLine(
    adminClient: SimpleGraphQLClient,
    orderLineId: string,
    quantity: number,
    paymentId: string,
    adjustment: number,
): Promise<FragmentOf<typeof refundFragment>> {
    const { refundOrder } = await adminClient.query(refundOrderDocument, {
        input: {
            lines: [{ orderLineId, quantity }],
            shipping: 0,
            adjustment,
            paymentId,
        },
    });
    if (!refundOrder || 'errorCode' in refundOrder) {
        throw Error('Failed to refund order');
    }
    return refundOrder;
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
    const { createPromotion } = await adminClient.query(createCouponDocument, {
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
    if (createPromotion.__typename !== 'Promotion') {
        throw new Error(`Error creating coupon: ${createPromotion.errorCode}`);
    }
}
/**
 * Create a coupon that discounts the shipping costs
 */
export async function createFreeShippingCoupon(
    adminClient: SimpleGraphQLClient,
    couponCode: string,
): Promise<void> {
    const { createPromotion } = await adminClient.query(createCouponDocument, {
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
    if (createPromotion.__typename !== 'Promotion') {
        throw new Error(`Error creating coupon: ${createPromotion.errorCode}`);
    }
}

/**
 * Test payment eligibility checker that doesn't allow orders with quantity 9 on an order line,
 * just so that we can easily mock non-eligibility
 */
export const testPaymentEligibilityChecker = new PaymentMethodEligibilityChecker({
    code: 'test-payment-eligibility-checker',
    description: [{ languageCode: LanguageCode.en, value: 'Do not allow 9 items' }],
    args: {},
    check: (ctx, order, args) => {
        const hasLineWithQuantity9 = order.lines.find(line => line.quantity === 9);
        if (hasLineWithQuantity9) {
            return false;
        } else {
            return true;
        }
    },
});
