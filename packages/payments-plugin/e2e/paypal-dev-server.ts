import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import { DefaultLogger, DefaultSearchPlugin, LanguageCode, LogLevel, mergeConfig } from '@vendure/core';
import { createTestEnvironment, registerInitializer, SqljsInitializer, testConfig } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { PayPalPlugin } from '../src/paypal/paypal.plugin';

import { CREATE_PAYMENT_METHOD } from './graphql/admin-queries';
import {
    CreatePaymentMethodMutation,
    CreatePaymentMethodMutationVariables,
} from './graphql/generated-admin-types';
import { ADD_ITEM_TO_ORDER, APPLY_COUPON_CODE, TRANSITION_TO_STATE } from './graphql/shop-queries';
import { setShipping } from './payment-helpers';
import { PayPalSdkPlugin } from './paypal-sdk.plugin';

/**
 * This should only be used to locally test the PayPal payment plugin
 * Make sure you have `PAYPAL_CLIENT_ID=xxxx`, `PAYPAL_CLIENT_SECRET=xxxx`
 * and `PAYPAL_MERCHANT_ID=xxxx` in your .env file
 */
/* eslint-disable @typescript-eslint/no-floating-promises */
async function runPayPalDevServer() {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    require('dotenv').config();

    const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_MERCHANT_ID } = process.env;
    if (!PAYPAL_CLIENT_ID || !PAYPAL_CLIENT_SECRET || !PAYPAL_MERCHANT_ID) {
        throw new Error('Please provide PayPal credentials in the .env file');
    }

    const apiUrl = 'https://api-m.sandbox.paypal.com';

    registerInitializer('sqljs', new SqljsInitializer(path.join(__dirname, '__data__')));
    const config = mergeConfig(testConfig, {
        plugins: [
            ...testConfig.plugins,
            DefaultSearchPlugin,
            AdminUiPlugin.init({
                route: 'admin',
                port: 5001,
            }),
            PayPalPlugin.init({
                apiUrl,
            }),
            PayPalSdkPlugin.init({
                apiUrl,
                clientId: PAYPAL_CLIENT_ID,
            }),
        ],
        logger: new DefaultLogger({ level: LogLevel.Debug }),
        apiOptions: {
            adminApiPlayground: true,
            shopApiPlayground: true,
        },
    });
    const { server, adminClient, shopClient } = createTestEnvironment(config as any);
    await server.init({
        initialData,
        productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
        customerCount: 1,
    });
    // Set EUR as currency for PayPal
    await adminClient.asSuperAdmin();
    await adminClient.query(gql`
        mutation {
            updateChannel(input: { id: "T_1", currencyCode: EUR }) {
                __typename
            }
        }
    `);
    // Create method
    await adminClient.query<CreatePaymentMethodMutation, CreatePaymentMethodMutationVariables>(
        CREATE_PAYMENT_METHOD,
        {
            input: {
                code: 'paypal',
                translations: [
                    {
                        languageCode: LanguageCode.en,
                        name: 'PayPal payment test',
                        description: 'This is a PayPal test payment method',
                    },
                ],
                enabled: true,
                handler: {
                    code: 'paypal',
                    arguments: [
                        { name: 'clientId', value: PAYPAL_CLIENT_ID },
                        { name: 'clientSecret', value: PAYPAL_CLIENT_SECRET },
                        { name: 'merchantId', value: PAYPAL_MERCHANT_ID },
                    ],
                },
            },
        },
    );
    // Prepare a test order where the total is 0
    await shopClient.asUserWithCredentials('hayden.zieme12@hotmail.com', 'test');
    await shopClient.query(ADD_ITEM_TO_ORDER, {
        productVariantId: 'T_1',
        quantity: 1,
    });
    await setShipping(shopClient);
    await shopClient.query(APPLY_COUPON_CODE, { couponCode: 'FREE_SHIPPING' });

    await shopClient.query(TRANSITION_TO_STATE, {
        state: 'ArrangingPayment',
    });

    // eslint-disable-next-line no-console
    console.log('Auth Token: ', shopClient.getAuthToken());
}

(async () => {
    await runPayPalDevServer();
})();
