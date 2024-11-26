import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import {
    ChannelService,
    configureDefaultOrderProcess,
    DefaultLogger,
    LanguageCode,
    Logger,
    LogLevel,
    mergeConfig,
    OrderService,
    RequestContext,
} from '@vendure/core';
import {
    createTestEnvironment,
    registerInitializer,
    SimpleGraphQLClient,
    SqljsInitializer,
    testConfig,
} from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { BraintreePlugin } from '../src/braintree';
import { braintreePaymentMethodHandler } from '../src/braintree/braintree.handler';

/* eslint-disable */
import { CREATE_PAYMENT_METHOD } from './graphql/admin-queries';
import {
    CreatePaymentMethodMutation,
    CreatePaymentMethodMutationVariables,
} from './graphql/generated-admin-types';
import {
    AddItemToOrderMutation,
    AddItemToOrderMutationVariables,
    AddPaymentToOrderMutation,
    AddPaymentToOrderMutationVariables,
} from './graphql/generated-shop-types';
import { ADD_ITEM_TO_ORDER, ADD_PAYMENT } from './graphql/shop-queries';
import { GENERATE_BRAINTREE_CLIENT_TOKEN, proceedToArrangingPayment, setShipping } from './payment-helpers';
import braintree, { Environment, Test } from 'braintree';
import { BraintreeTestPlugin } from './fixtures/braintree-checkout-test.plugin';

export let clientToken: string;
export let exposedShopClient: SimpleGraphQLClient;

/**
 * The actual starting of the dev server
 */
(async () => {
    require('dotenv').config();

    registerInitializer('sqljs', new SqljsInitializer(path.join(__dirname, '__data__')));
    const config = mergeConfig(testConfig, {
        authOptions: {
            tokenMethod: ['bearer', 'cookie'],
            cookieOptions: {
                secret: 'cookie-secret',
            },
        },
        plugins: [
            ...testConfig.plugins,
            AdminUiPlugin.init({
                route: 'admin',
                port: 5001,
            }),
            BraintreePlugin.init({
                storeCustomersInBraintree: false,
                environment: Environment.Sandbox,
                merchantAccountIds: {
                    USD: process.env.BRAINTREE_MERCHANT_ACCOUNT_ID_USD,
                    EUR: process.env.BRAINTREE_MERCHANT_ACCOUNT_ID_EUR,
                },
            }),
            BraintreeTestPlugin,
        ],
        logger: new DefaultLogger({ level: LogLevel.Debug }),
    });
    const { server, shopClient, adminClient } = createTestEnvironment(config as any);
    exposedShopClient = shopClient;
    await server.init({
        initialData,
        productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
        customerCount: 1,
    });
    // Create method
    await adminClient.asSuperAdmin();
    await adminClient.query<CreatePaymentMethodMutation, CreatePaymentMethodMutationVariables>(
        CREATE_PAYMENT_METHOD,
        {
            input: {
                code: 'braintree-payment-method',
                enabled: true,
                translations: [
                    {
                        name: 'Braintree',
                        description: 'This is a Braintree test payment method',
                        languageCode: LanguageCode.en,
                    },
                ],
                handler: {
                    code: braintreePaymentMethodHandler.code,
                    arguments: [
                        { name: 'privateKey', value: process.env.BRAINTREE_PRIVATE_KEY! },
                        { name: 'publicKey', value: process.env.BRAINTREE_PUBLIC_KEY! },
                        { name: 'merchantId', value: process.env.BRAINTREE_MERCHANT_ID! },
                    ],
                },
            },
        },
    );
    // Prepare order for payment
    await shopClient.asUserWithCredentials('hayden.zieme12@hotmail.com', 'test');
    await shopClient.query<AddItemToOrderMutation, AddItemToOrderMutationVariables>(ADD_ITEM_TO_ORDER, {
        productVariantId: 'T_1',
        quantity: 1,
    });
    const ctx = new RequestContext({
        apiType: 'admin',
        isAuthorized: true,
        authorizedAsOwnerOnly: false,
        channel: await server.app.get(ChannelService).getDefaultChannel(),
    });
    await server.app.get(OrderService).addSurchargeToOrder(ctx, 1, {
        description: 'Negative test surcharge',
        listPrice: -20000,
    });
    await setShipping(shopClient);
    const { generateBraintreeClientToken } = await shopClient.query(GENERATE_BRAINTREE_CLIENT_TOKEN);
    clientToken = generateBraintreeClientToken;
    Logger.info('http://localhost:3050/checkout', 'Braintree DevServer');
})();
