import { ID } from '@vendure/common/lib/shared-types';
import { SimpleGraphQLClient } from '@vendure/testing';
import gql from 'graphql-tag';

import { REFUND_ORDER } from './graphql/admin-queries';
import { RefundFragment, RefundOrder } from './graphql/generated-admin-types';
import {
    GetShippingMethods,
    SetShippingMethod,
    TestOrderFragmentFragment,
    TransitionToState,
} from './graphql/generated-shop-types';
import {
    GET_ELIGIBLE_SHIPPING_METHODS,
    SET_SHIPPING_ADDRESS,
    SET_SHIPPING_METHOD,
    TRANSITION_TO_STATE,
} from './graphql/shop-queries';

export async function setShipping(shopClient: SimpleGraphQLClient): Promise<void> {
    await shopClient.query(SET_SHIPPING_ADDRESS, {
        input: {
            fullName: 'name',
            streetLine1: '12 the street',
            city: 'Leeuwarden',
            postalCode: '123456',
            countryCode: 'AT',
        },
    });
    const { eligibleShippingMethods } = await shopClient.query<GetShippingMethods.Query>(
        GET_ELIGIBLE_SHIPPING_METHODS,
    );
    await shopClient.query<SetShippingMethod.Mutation, SetShippingMethod.Variables>(SET_SHIPPING_METHOD, {
        id: eligibleShippingMethods[1].id,
    });
}

export async function proceedToArrangingPayment(shopClient: SimpleGraphQLClient): Promise<ID> {
    await setShipping(shopClient);
    const { transitionOrderToState } = await shopClient.query<
        TransitionToState.Mutation,
        TransitionToState.Variables
    >(TRANSITION_TO_STATE, { state: 'ArrangingPayment' });
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    return (transitionOrderToState as TestOrderFragmentFragment)!.id;
}

export async function refundOne(
    adminClient: SimpleGraphQLClient,
    orderLineId: string,
    paymentId: string,
): Promise<RefundFragment> {
    const { refundOrder } = await adminClient.query<RefundOrder.Mutation, RefundOrder.Variables>(
        REFUND_ORDER,
        {
            input: {
                lines: [{ orderLineId, quantity: 1 }],
                shipping: 0,
                adjustment: 0,
                paymentId,
            },
        },
    );
    return refundOrder as RefundFragment;
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
