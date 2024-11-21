import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import {
    ChannelService,
    configureDefaultOrderProcess,
    DefaultLogger,
    LanguageCode,
    Logger,
    LogLevel,
    mergeConfig,
    Order,
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

export let exposedClientToken: string;
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

    // We are exposing the shopClient for the braintree-checkout-test.plugin
    exposedShopClient = shopClient;

    await server.init({
        initialData,
        productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
        customerCount: 1,
    });

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

    // Set EUR or other currency for test flow, should be matching with a value in BraintreePlugin option's merchantAccountIds
    await adminClient.asSuperAdmin();
    await adminClient.query(gql`
        mutation {
            updateChannel(input: { id: "T_1", currencyCode: EUR }) {
                __typename
            }
        }
    `);

    const { addItemToOrder } = await shopClient.query<
        AddItemToOrderMutation,
        AddItemToOrderMutationVariables
    >(ADD_ITEM_TO_ORDER, {
        productVariantId: 'T_1',
        quantity: 1,
    });

    Logger.info(`Order's currency code is ${(addItemToOrder as any)?.currencyCode}`, 'braintree-dev-server');

    await setShipping(shopClient);
    await proceedToArrangingPayment(shopClient);

    const { generateBraintreeClientToken } = await shopClient.query(GENERATE_BRAINTREE_CLIENT_TOKEN);
    exposedClientToken = generateBraintreeClientToken;
    Logger.info('http://localhost:3050/checkout', 'braintree-dev-server');
    Logger.info(
        'The drop-in checkout currency must match with clientToken currency.',
        'braintree-dev-server',
    );
})();
