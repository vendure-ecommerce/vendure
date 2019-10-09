/* tslint:disable:no-non-null-assertion */
import { ID } from '../../../common/lib/shared-types';
import { PaymentMethodHandler } from '../../src/config/payment-method/payment-method-handler';
import { LanguageCode } from '../graphql/generated-e2e-admin-types';
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
import { TestShopClient } from '../test-client';

export async function proceedToArrangingPayment(shopClient: TestShopClient): Promise<ID> {
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
    shopClient: TestShopClient,
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

export const testSuccessfulPaymentMethod = new PaymentMethodHandler({
    code: 'test-payment-method',
    description: [{ languageCode: LanguageCode.en, value: 'Test Payment Method' }],
    args: {},
    createPayment: (order, args, metadata) => {
        return {
            amount: order.total,
            state: 'Settled',
            transactionId: '12345',
            metadata,
        };
    },
    settlePayment: order => ({
        success: true,
    }),
});
