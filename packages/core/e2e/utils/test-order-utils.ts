/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ID } from '@vendure/common/lib/shared-types';
import { PaymentMethodHandler } from '@vendure/core';
import { SimpleGraphQLClient } from '@vendure/testing';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import * as CodegenShop from '../graphql/generated-e2e-shop-types';
import { TestOrderFragmentFragment } from '../graphql/generated-e2e-shop-types';
import {
    ADD_PAYMENT,
    GET_ELIGIBLE_SHIPPING_METHODS,
    SET_SHIPPING_ADDRESS,
    SET_SHIPPING_METHOD,
    TRANSITION_TO_STATE,
} from '../graphql/shop-definitions';

export async function proceedToArrangingPayment(shopClient: SimpleGraphQLClient): Promise<ID> {
    await shopClient.query<
        CodegenShop.SetShippingAddressMutation,
        CodegenShop.SetShippingAddressMutationVariables
    >(SET_SHIPPING_ADDRESS, {
        input: {
            fullName: 'name',
            streetLine1: '12 the street',
            city: 'foo',
            postalCode: '123456',
            countryCode: 'US',
        },
    });

    const { eligibleShippingMethods } = await shopClient.query<CodegenShop.GetShippingMethodsQuery>(
        GET_ELIGIBLE_SHIPPING_METHODS,
    );

    await shopClient.query<
        CodegenShop.SetShippingMethodMutation,
        CodegenShop.SetShippingMethodMutationVariables
    >(SET_SHIPPING_METHOD, {
        id: eligibleShippingMethods[1].id,
    });

    const { transitionOrderToState } = await shopClient.query<
        CodegenShop.TransitionToStateMutation,
        CodegenShop.TransitionToStateMutationVariables
    >(TRANSITION_TO_STATE, { state: 'ArrangingPayment' });

    return (transitionOrderToState as TestOrderFragmentFragment)!.id;
}

export async function addPaymentToOrder(
    shopClient: SimpleGraphQLClient,
    handler: PaymentMethodHandler,
): Promise<NonNullable<CodegenShop.AddPaymentToOrderMutation['addPaymentToOrder']>> {
    const result = await shopClient.query<
        CodegenShop.AddPaymentToOrderMutation,
        CodegenShop.AddPaymentToOrderMutationVariables
    >(ADD_PAYMENT, {
        input: {
            method: handler.code,
            metadata: {
                baz: 'quux',
            },
        },
    });
    const order = result.addPaymentToOrder;
    return order as any;
}

/**
 * Sorts an array of entities by the id key. Useful for compensating for the fact that different DBs
 * return arrays in different orders.
 */
export function sortById<T extends { id: string | number }>(a: T, b: T): 1 | -1 {
    return a.id < b.id ? -1 : 1;
}
