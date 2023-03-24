import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import {
    ChannelService,
    DefaultLogger,
    LanguageCode,
    Logger,
    LogLevel,
    mergeConfig,
    OrderService,
    RequestContext,
} from '@vendure/core';
import { createTestEnvironment, registerInitializer, SqljsInitializer, testConfig } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { StripePlugin } from '../src/stripe';
import { stripePaymentMethodHandler } from '../src/stripe/stripe.handler';

/* eslint-disable */
import { CREATE_PAYMENT_METHOD } from './graphql/admin-queries';
import {
    CreatePaymentMethodMutation,
    CreatePaymentMethodMutationVariables,
} from './graphql/generated-admin-types';
import { AddItemToOrderMutation, AddItemToOrderMutationVariables } from './graphql/generated-shop-types';
import { ADD_ITEM_TO_ORDER } from './graphql/shop-queries';
import { CREATE_STRIPE_PAYMENT_INTENT, setShipping } from './payment-helpers';
import { StripeCheckoutTestPlugin } from './stripe-checkout-test.plugin';

export let clientSecret: string;

/**
 * The actual starting of the dev server
 */
(async () => {
    require('dotenv').config();

    registerInitializer('sqljs', new SqljsInitializer(path.join(__dirname, '__data__')));
    const config = mergeConfig(testConfig, {
        plugins: [
            ...testConfig.plugins,
            AdminUiPlugin.init({
                route: 'admin',
                port: 5001,
            }),
            StripePlugin.init({}),
            StripeCheckoutTestPlugin,
        ],
        logger: new DefaultLogger({ level: LogLevel.Debug }),
    });
    const { server, shopClient, adminClient } = createTestEnvironment(config as any);
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
                code: 'stripe-payment-method',
                enabled: true,
                translations: [
                    {
                        name: 'Stripe',
                        description: 'This is a Stripe test payment method',
                        languageCode: LanguageCode.en,
                    },
                ],
                handler: {
                    code: stripePaymentMethodHandler.code,
                    arguments: [
                        { name: 'apiKey', value: process.env.STRIPE_APIKEY! },
                        { name: 'webhookSecret', value: process.env.STRIPE_WEBHOOK_SECRET! },
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
    const { createStripePaymentIntent } = await shopClient.query(CREATE_STRIPE_PAYMENT_INTENT);
    clientSecret = createStripePaymentIntent;
    Logger.info('http://localhost:3050/checkout', 'Stripe DevServer');
})();
