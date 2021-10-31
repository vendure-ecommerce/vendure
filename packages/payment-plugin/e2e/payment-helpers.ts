import { SimpleGraphQLClient } from '@vendure/testing';
import { ID } from '@vendure/common/lib/shared-types';
import {
    GET_ELIGIBLE_SHIPPING_METHODS,
    SET_SHIPPING_ADDRESS,
    SET_SHIPPING_METHOD,
    TRANSITION_TO_STATE,
} from './graphql/shop-queries';
import {
    GetShippingMethods,
    SetShippingMethod,
    TestOrderFragmentFragment,
    TransitionToState,
} from './graphql/generated-shop-types';

export async function proceedToArrangingPayment(shopClient: SimpleGraphQLClient): Promise<ID> {
    await shopClient.query(SET_SHIPPING_ADDRESS, {
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

    return (transitionOrderToState as TestOrderFragmentFragment)!.id;
}
