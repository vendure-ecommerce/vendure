import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import {
    ChannelService,
    DefaultLogger,
    DefaultSearchPlugin,
    Logger,
    LogLevel,
    mergeConfig,
    OrderService,
    PaymentService,
    RequestContext,
} from '@vendure/core';
import { createTestEnvironment, registerInitializer, SqljsInitializer, testConfig } from '@vendure/testing';
import gql from 'graphql-tag';
import localtunnel from 'localtunnel';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { MolliePlugin } from '../package/mollie';
import { molliePaymentHandler } from '../package/mollie/mollie.handler';

import { CREATE_PAYMENT_METHOD } from './graphql/admin-queries';
import { CreatePaymentMethod } from './graphql/generated-admin-types';
import { AddItemToOrder } from './graphql/generated-shop-types';
import { ADD_ITEM_TO_ORDER } from './graphql/shop-queries';
import { CREATE_MOLLIE_PAYMENT_INTENT, setShipping } from './payment-helpers';

/**
 * This should only be used to locally test the Mollie payment plugin
 */
/* tslint:disable:no-floating-promises */
(async () => {
    require('dotenv').config();

    registerInitializer('sqljs', new SqljsInitializer(path.join(__dirname, '__data__')));
    const tunnel = await localtunnel({ port: 3050 });
    const config = mergeConfig(testConfig, {
        plugins: [
            ...testConfig.plugins,
            DefaultSearchPlugin,
            AdminUiPlugin.init({
                route: 'admin',
                port: 5001,
            }),
            MolliePlugin.init({ vendureHost: tunnel.url }),
        ],
        logger: new DefaultLogger({ level: LogLevel.Debug }),
        apiOptions: {
            adminApiPlayground: true,
            shopApiPlayground: true,
        }
    });
    const { server, shopClient, adminClient } = createTestEnvironment(config as any);
    await server.init({
        initialData,
        productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
        customerCount: 1,
    });
    // Set EUR as currency for Mollie
    await adminClient.asSuperAdmin();
    await adminClient.query(gql`
        mutation {
            updateChannel(input: {id: "T_1", currencyCode: EUR}) {
                __typename
            }
        }
    `);
    // Create method
    await adminClient.query<CreatePaymentMethod.Mutation,
        CreatePaymentMethod.Variables>(CREATE_PAYMENT_METHOD, {
        input: {
            code: 'mollie',
            name: 'Mollie payment test',
            description: 'This is a Mollie test payment method',
            enabled: true,
            handler: {
                code: molliePaymentHandler.code,
                arguments: [
                    { name: 'redirectUrl', value: `${tunnel.url}/admin/orders?filter=open&page=1` },
                    // tslint:disable-next-line:no-non-null-assertion
                    { name: 'apiKey', value: process.env.MOLLIE_APIKEY! },
                    { name: 'autoCapture', value: 'false' },
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
    // Add pre payment to order
    const order = await server.app.get(OrderService).findOne(ctx, 1);
    // tslint:disable-next-line:no-non-null-assertion
    await server.app.get(PaymentService).createManualPayment(ctx, order!, 10000 ,{
        method: 'Manual',
        // tslint:disable-next-line:no-non-null-assertion
        orderId: order!.id,
        metadata: {
            bogus: 'test'
        }
    });
    const { createMolliePaymentIntent } = await shopClient.query(CREATE_MOLLIE_PAYMENT_INTENT, {
        input: {
            paymentMethodCode: 'mollie',
//            molliePaymentMethodCode: 'klarnapaylater'
        },
    });
    if (createMolliePaymentIntent.errorCode) {
        throw createMolliePaymentIntent;
    }
    Logger.info(`Mollie payment link: ${createMolliePaymentIntent.url}`, 'Mollie DevServer');
})();

