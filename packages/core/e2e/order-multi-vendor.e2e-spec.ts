/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { mergeConfig, OrderService } from '@vendure/core';
import { createErrorResultGuard, createTestEnvironment, ErrorResultGuard } from '@vendure/testing';
import { multivendorPaymentMethodHandler } from 'dev-server/example-plugins/multivendor-plugin/config/mv-payment-handler';
import { CONNECTED_PAYMENT_METHOD_CODE } from 'dev-server/example-plugins/multivendor-plugin/constants';
import { MultivendorPlugin } from 'dev-server/example-plugins/multivendor-plugin/multivendor.plugin';
import gql from 'graphql-tag';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

import {
    AssignProductsToChannelDocument,
    GetOrderWithSellerOrdersDocument,
} from './graphql/generated-e2e-admin-types';
import * as CodegenShop from './graphql/generated-e2e-shop-types';
import { SetShippingMethodDocument } from './graphql/generated-e2e-shop-types';
import {
    ADD_ITEM_TO_ORDER,
    ADD_PAYMENT,
    GET_ELIGIBLE_SHIPPING_METHODS,
    SET_SHIPPING_ADDRESS,
    TRANSITION_TO_STATE,
} from './graphql/shop-definitions';

declare module '@vendure/core/dist/entity/custom-entity-fields' {
    interface CustomShippingMethodFields {
        minPrice: number;
        maxPrice: number;
    }
}

describe('Multi-vendor orders', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(
        mergeConfig(testConfig(), {
            plugins: [
                MultivendorPlugin.init({
                    platformFeePercent: 10,
                    platformFeeSKU: 'FEE',
                }),
            ],
        }),
    );

    let bobsPartsChannel: { id: string; token: string; variantIds: string[] };
    let alicesWaresChannel: { id: string; token: string; variantIds: string[] };
    let orderId: string;

    type OrderSuccessResult =
        | CodegenShop.UpdatedOrderFragment
        | CodegenShop.TestOrderFragmentFragment
        | CodegenShop.TestOrderWithPaymentsFragment
        | CodegenShop.ActiveOrderCustomerFragment;
    const orderResultGuard: ErrorResultGuard<OrderSuccessResult> = createErrorResultGuard(
        input => !!input.lines,
    );

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
            customerCount: 3,
        });
        await adminClient.asSuperAdmin();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('setup sellers', async () => {
        const result1 = await shopClient.query(REGISTER_SELLER, {
            input: {
                shopName: "Bob's Parts",
                seller: {
                    firstName: 'Bob',
                    lastName: 'Dobalina',
                    emailAddress: 'bob@bobs-parts.com',
                    password: 'test',
                },
            },
        });
        bobsPartsChannel = result1.registerNewSeller;
        expect(bobsPartsChannel.token).toBe('bobs-parts-token');

        const result2 = await shopClient.query(REGISTER_SELLER, {
            input: {
                shopName: "Alice's Wares",
                seller: {
                    firstName: 'Alice',
                    lastName: 'Smith',
                    emailAddress: 'alice@alices-wares.com',
                    password: 'test',
                },
            },
        });
        alicesWaresChannel = result2.registerNewSeller;
        expect(alicesWaresChannel.token).toBe('alices-wares-token');
    });

    it('assign products to sellers', async () => {
        const { assignProductsToChannel } = await adminClient.query(AssignProductsToChannelDocument, {
            input: {
                channelId: bobsPartsChannel.id,
                productIds: ['T_1'],
                priceFactor: 1,
            },
        });

        expect(assignProductsToChannel[0].channels.map(c => c.code)).toEqual([
            '__default_channel__',
            'bobs-parts',
        ]);
        bobsPartsChannel.variantIds = assignProductsToChannel[0].variants.map(v => v.id);

        expect(bobsPartsChannel.variantIds).toEqual(['T_1', 'T_2', 'T_3', 'T_4']);

        const { assignProductsToChannel: result2 } = await adminClient.query(
            AssignProductsToChannelDocument,
            {
                input: {
                    channelId: alicesWaresChannel.id,
                    productIds: ['T_11'],
                    priceFactor: 1,
                },
            },
        );
        expect(result2[0].channels.map(c => c.code)).toEqual(['__default_channel__', 'alices-wares']);
        alicesWaresChannel.variantIds = result2[0].variants.map(v => v.id);

        expect(alicesWaresChannel.variantIds).toEqual(['T_22']);
    });

    it('adds items and sets shipping methods', async () => {
        await shopClient.asUserWithCredentials('hayden.zieme12@hotmail.com', 'test');
        await shopClient.query<
            CodegenShop.AddItemToOrderMutation,
            CodegenShop.AddItemToOrderMutationVariables
        >(ADD_ITEM_TO_ORDER, {
            productVariantId: bobsPartsChannel.variantIds[0],
            quantity: 1,
        });
        await shopClient.query<
            CodegenShop.AddItemToOrderMutation,
            CodegenShop.AddItemToOrderMutationVariables
        >(ADD_ITEM_TO_ORDER, {
            productVariantId: alicesWaresChannel.variantIds[0],
            quantity: 1,
        });

        await shopClient.query<
            CodegenShop.SetShippingAddressMutation,
            CodegenShop.SetShippingAddressMutationVariables
        >(SET_SHIPPING_ADDRESS, {
            input: {
                streetLine1: '12 the street',
                postalCode: '123456',
                countryCode: 'US',
            },
        });

        const { eligibleShippingMethods } = await shopClient.query<CodegenShop.GetShippingMethodsQuery>(
            GET_ELIGIBLE_SHIPPING_METHODS,
        );

        expect(eligibleShippingMethods.map(m => m.code).sort()).toEqual([
            'alices-wares-shipping',
            'bobs-parts-shipping',
            'express-shipping',
            'express-shipping-taxed',
            'standard-shipping',
        ]);

        const { setOrderShippingMethod } = await shopClient.query(SetShippingMethodDocument, {
            id: [
                eligibleShippingMethods.find(m => m.code === 'bobs-parts-shipping')!.id,
                eligibleShippingMethods.find(m => m.code === 'alices-wares-shipping')!.id,
            ],
        });

        orderResultGuard.assertSuccess(setOrderShippingMethod);
        expect(setOrderShippingMethod.shippingLines.map(l => l.shippingMethod.code).sort()).toEqual([
            'alices-wares-shipping',
            'bobs-parts-shipping',
        ]);
    });

    it('completing checkout splits order', async () => {
        const { transitionOrderToState } = await shopClient.query<
            CodegenShop.TransitionToStateMutation,
            CodegenShop.TransitionToStateMutationVariables
        >(TRANSITION_TO_STATE, { state: 'ArrangingPayment' });

        orderResultGuard.assertSuccess(transitionOrderToState);

        const { addPaymentToOrder } = await shopClient.query<
            CodegenShop.AddPaymentToOrderMutation,
            CodegenShop.AddPaymentToOrderMutationVariables
        >(ADD_PAYMENT, {
            input: {
                method: CONNECTED_PAYMENT_METHOD_CODE,
                metadata: {},
            },
        });
        orderResultGuard.assertSuccess(addPaymentToOrder);

        expect(addPaymentToOrder.state).toBe('PaymentSettled');

        const { order } = await adminClient.query(GetOrderWithSellerOrdersDocument, {
            id: addPaymentToOrder.id,
        });
        orderId = order!.id;

        expect(order?.sellerOrders?.length).toBe(2);
    });

    it('order lines get split', async () => {
        const { order } = await adminClient.query(GetOrderWithSellerOrdersDocument, {
            id: orderId,
        });

        expect(order?.sellerOrders?.[0].lines.map(l => l.productVariant.name)).toEqual([
            'Laptop 13 inch 8GB',
        ]);
        expect(order?.sellerOrders?.[1].lines.map(l => l.productVariant.name)).toEqual(['Road Bike']);
    });

    it('shippingLines get split', async () => {
        const { order } = await adminClient.query(GetOrderWithSellerOrdersDocument, {
            id: orderId,
        });

        expect(order?.sellerOrders?.[0]?.shippingLines.length).toBe(1);
        expect(order?.sellerOrders?.[1]?.shippingLines.length).toBe(1);
        expect(order?.sellerOrders?.[0]?.shippingLines[0].shippingMethod.code).toBe('bobs-parts-shipping');
        expect(order?.sellerOrders?.[1]?.shippingLines[0].shippingMethod.code).toBe('alices-wares-shipping');
    });
});

export const REGISTER_SELLER = gql`
    mutation RegisterSeller($input: RegisterSellerInput!) {
        registerNewSeller(input: $input) {
            id
            code
            token
        }
    }
`;
