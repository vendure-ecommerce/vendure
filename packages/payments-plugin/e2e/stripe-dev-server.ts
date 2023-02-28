import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import {
    ChannelService,
    DefaultLogger,
    Logger,
    LogLevel,
    mergeConfig,
    OrderService,
    RequestContext,
} from '@vendure/core';
import { createTestEnvironment, registerInitializer, SqljsInitializer, testConfig } from '@vendure/testing';
import gql from 'graphql-tag';
import localtunnel from 'localtunnel';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { StripePlugin } from '../src/stripe';
import { stripePaymentMethodHandler } from '../src/stripe/stripe.handler';

import { CREATE_PAYMENT_METHOD } from './graphql/admin-queries';
import { CreatePaymentMethod } from './graphql/generated-admin-types';
import { AddItemToOrder } from './graphql/generated-shop-types';
import { ADD_ITEM_TO_ORDER } from './graphql/shop-queries';
import { CREATE_STRIPE_PAYMENT_INTENT, setShipping } from './payment-helpers';

/* tslint:disable:no-floating-promises */
(async () => {
    require('dotenv').config();

    registerInitializer('sqljs', new SqljsInitializer(path.join(__dirname, '__data__')));
    const tunnel = await localtunnel({ port: 3050 });
    const config = mergeConfig(testConfig, {
        plugins: [
            ...testConfig.plugins,
            AdminUiPlugin.init({
                route: 'admin',
                port: 5001,
            }),
            StripePlugin.init({}),
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
    await adminClient.query<CreatePaymentMethod.Mutation,
        CreatePaymentMethod.Variables>(CREATE_PAYMENT_METHOD, {
        input: {
            code: 'stripe-payment-method',
            name: 'Stripe',
            description: 'This is a Stripe test payment method',
            enabled: true,
            handler: {
                code: stripePaymentMethodHandler.code,
                arguments: [
                    // tslint:disable-next-line:no-non-null-assertion
                    { name: 'apiKey', value: process.env.STRIPE_APIKEY! },
                    { name: 'webhookSecret', value: process.env.STRIPE_WEBHOOK_SECRET! },
                ],
            },
        },
    });
    // Prepare order for payment
    await shopClient.asUserWithCredentials('hayden.zieme12@hotmail.com', 'test');
    await shopClient.query<AddItemToOrder.Order, AddItemToOrder.Variables>(ADD_ITEM_TO_ORDER, {
        productVariantId: 'T_5',
        quantity: 10,
    });
    const ctx = new RequestContext({
        apiType: 'admin',
        isAuthorized: true,
        authorizedAsOwnerOnly: false,
        channel: await server.app.get(ChannelService).getDefaultChannel()
    });
   await server.app.get(OrderService).addSurchargeToOrder(ctx, 1, {
        description: 'Negative test surcharge',
        listPrice: -20000,
    });
    await setShipping(shopClient);
    const { createStripePaymentIntent } = await shopClient.query(CREATE_STRIPE_PAYMENT_INTENT);
    Logger.info(`Stripe client secret: ${createMolliePaymentIntent}`, 'Stripe DevServer');
})();

