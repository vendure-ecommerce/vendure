/* tslint:disable:no-console */
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import { ADMIN_API_PATH, API_PORT, SHOP_API_PATH } from '@vendure/common/lib/shared-constants';
import { Order, OrderService, OrderState, TransactionalConnection } from '@vendure/core';
import {
    CustomOrderProcess,
    DefaultJobQueuePlugin,
    DefaultLogger,
    DefaultSearchPlugin,
    examplePaymentHandler,
    FulfillmentHandler,
    LanguageCode,
    Logger,
    LogLevel,
    manualFulfillmentHandler,
    PermissionDefinition,
    Surcharge,
    VendureConfig,
} from '@vendure/core';
import { ElasticsearchPlugin } from '@vendure/elasticsearch-plugin';
import { defaultEmailHandlers, EmailPlugin } from '@vendure/email-plugin';
import path from 'path';
import { ConnectionOptions } from 'typeorm';

let connection: TransactionalConnection;
let orderService: OrderService;
const customerValidationProcess: CustomOrderProcess<OrderState> = {
    // The init method allows us to inject services
    // and other providers
    init(injector) {
        connection = injector.get(TransactionalConnection);
        orderService = injector.get(OrderService);
    },

    // The logic for enforcing our validation goes here
    async onTransitionStart(fromState, toState, data) {
        if (fromState === 'AddingItems' && toState === 'ArrangingPayment') {
            const { ctx, order } = data;
            await orderService.addSurchargeToOrder(ctx, order.id, {
                description: '3% payment surcharge',
                sku: 'PAYMENT_SURCHARGE',
                listPrice: Math.round(order.subTotal * 0.03),
                listPriceIncludesTax: ctx.channel.pricesIncludeTax,
            });
        }
    },
};

/**
 * Config settings used during development
 */
export const devConfig: VendureConfig = {
    apiOptions: {
        port: API_PORT,
        adminApiPath: ADMIN_API_PATH,
        adminApiPlayground: {
            settings: {
                'request.credentials': 'include',
            } as any,
        },
        adminApiDebug: true,
        shopApiPath: SHOP_API_PATH,
        shopApiPlayground: {
            settings: {
                'request.credentials': 'include',
            } as any,
        },
        shopApiDebug: true,
    },
    authOptions: {
        disableAuth: false,
        tokenMethod: 'cookie',
        sessionSecret: 'some-secret',
        requireVerification: true,
        customPermissions: [],
    },
    orderOptions: {
        process: [customerValidationProcess],
    },
    dbConnectionOptions: {
        synchronize: false,
        logging: false,
        migrations: [path.join(__dirname, 'migrations/*.ts')],
        ...getDbConfig(),
    },
    paymentOptions: {
        paymentMethodHandlers: [examplePaymentHandler],
    },
    customFields: {
        OrderLine: [
            { name: 'test', type: 'string', nullable: true },
            { name: 'test2', type: 'string', nullable: true },
        ],
    },
    logger: new DefaultLogger({ level: LogLevel.Info }),
    importExportOptions: {
        importAssetsDir: path.join(__dirname, 'import-assets'),
    },
    shippingOptions: {
        fulfillmentHandlers: [manualFulfillmentHandler],
    },
    plugins: [
        AssetServerPlugin.init({
            route: 'assets',
            assetUploadDir: path.join(__dirname, 'assets'),
            port: 5002,
        }),
        DefaultSearchPlugin,
        DefaultJobQueuePlugin,
        // ElasticsearchPlugin.init({
        //     host: 'http://localhost',
        //     port: 9200,
        // }),
        EmailPlugin.init({
            devMode: true,
            handlers: defaultEmailHandlers,
            templatePath: path.join(__dirname, '../email-plugin/templates'),
            outputPath: path.join(__dirname, 'test-emails'),
            mailboxPort: 5003,
            globalTemplateVars: {
                verifyEmailAddressUrl: 'http://localhost:4201/verify',
                passwordResetUrl: 'http://localhost:4201/reset-password',
                changeEmailAddressUrl: 'http://localhost:4201/change-email-address',
            },
        }),
        AdminUiPlugin.init({
            port: 5001,
        }),
    ],
};

function getDbConfig(): ConnectionOptions {
    const dbType = process.env.DB || 'mysql';
    switch (dbType) {
        case 'postgres':
            console.log('Using postgres connection');
            return {
                synchronize: true,
                type: 'postgres',
                host: '127.0.0.1',
                port: 5432,
                username: 'admin',
                password: 'secret',
                database: 'vendure-dev',
            };
        case 'sqlite':
            console.log('Using sqlite connection');
            return {
                synchronize: false,
                type: 'better-sqlite3',
                database: path.join(__dirname, 'vendure.sqlite'),
            };
        case 'sqljs':
            console.log('Using sql.js connection');
            return {
                type: 'sqljs',
                autoSave: true,
                database: new Uint8Array([]),
                location: path.join(__dirname, 'vendure.sqlite'),
            };
        case 'mysql':
        default:
            console.log('Using mysql connection');
            return {
                synchronize: true,
                type: 'mariadb',
                host: '127.0.0.1',
                port: 3306,
                username: 'root',
                password: '',
                database: 'vendure-dev',
            };
    }
}
