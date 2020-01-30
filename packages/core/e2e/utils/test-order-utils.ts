/* tslint:disable:no-non-null-assertion */
import { ID } from '@vendure/common/lib/shared-types';
import { PaymentMethodHandler } from '@vendure/core';
import { SimpleGraphQLClient } from '@vendure/testing';

import {
    AddPaymentToOrder,
    GetShippingMethods,
    SetShippingAddress,
    SetShippingMethod,
    TransitionToState,
} from '../graphql/generated-e2e-shop-types';
import {
    ADD_PAYMENT,
    GET_ELIGIBLE_SHIPPING_METHODS,
    SET_SHIPPING_ADDRESS,
    SET_SHIPPING_METHOD,
    TRANSITION_TO_STATE,
} from '../graphql/shop-definitions';

export async function proceedToArrangingPayment(shopClient: SimpleGraphQLClient): Promise<ID> {
    await shopClient.query<SetShippingAddress.Mutation, SetShippingAddress.Variables>(SET_SHIPPING_ADDRESS, {
        input: {
            fullName: 'name',
            streetLine1: '12 the street',
            city: 'foo',
            postalCode: '123456',
            countryCode: 'US',
        },
    });

    const { eligibleShippingMethods } = await shopClient.query<GetShippingMethods.Query>(
        GET_ELIGIBLE_SHIPPING_METHODS,
    );

    await shopClient.query<SetShippingMethod.Mutation, SetShippingMethod.Variables>(SET_SHIPPING_METHOD, {
        id: eligibleShippingMethods[1].id,
    });

    const { transitionOrderToState } = await shopClient.query<
        TransitionToState.Mutation,
        TransitionToState.Variables
    >(TRANSITION_TO_STATE, { state: 'ArrangingPayment' });

    return transitionOrderToState!.id;
}

export async function addPaymentToOrder(
    shopClient: SimpleGraphQLClient,
    handler: PaymentMethodHandler,
): Promise<NonNullable<AddPaymentToOrder.Mutation['addPaymentToOrder']>> {
    const result = await shopClient.query<AddPaymentToOrder.Mutation, AddPaymentToOrder.Variables>(
        ADD_PAYMENT,
        {
            input: {
                method: handler.code,
                metadata: {
                    baz: 'quux',
                },
            },
        },
    );
    const order = result.addPaymentToOrder!;
    return order as any;
}

/**
 * Sorts an array of entities by the id key. Useful for compensating for the fact that different DBs
 * return arrays in different orders.
 */
export function sortById<T extends { id: string | number }>(a: T, b: T): 1 | -1 {
    return a.id < b.id ? -1 : 1;
}
