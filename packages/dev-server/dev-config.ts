/* eslint-disable no-console */
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import { ADMIN_API_PATH, API_PORT, SHOP_API_PATH } from '@vendure/common/lib/shared-constants';
import {
    Asset,
    DefaultJobQueuePlugin,
    DefaultLogger,
    DefaultSearchPlugin,
    dummyPaymentHandler,
    FacetValue,
    LanguageCode,
    LogLevel,
    VendureConfig,
} from '@vendure/core';
import { ElasticsearchPlugin } from '@vendure/elasticsearch-plugin';
import { defaultEmailHandlers, EmailPlugin, FileBasedTemplateLoader } from '@vendure/email-plugin';
import { BullMQJobQueuePlugin } from '@vendure/job-queue-plugin/package/bullmq';
import 'dotenv/config';
import { compileUiExtensions } from '@vendure/ui-devkit/compiler';
import path from 'path';
import { DataSourceOptions } from 'typeorm';

import { MultivendorPlugin } from './example-plugins/multivendor-plugin/multivendor.plugin';

import { BraintreePlugin } from '../payments-plugin/package/braintree'
import { Environment } from 'braintree';


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
            },
        },
        adminApiDebug: true,
        shopApiPath: SHOP_API_PATH,
        shopApiPlayground: {
            settings: {
                'request.credentials': 'include',
            },
        },
        shopApiDebug: true,
    },
    authOptions: {
        disableAuth: false,
        tokenMethod: ['bearer', 'cookie'] as const,
        requireVerification: true,
        customPermissions: [],
        cookieOptions: {
            secret: 'abc',
        },
    },
    dbConnectionOptions: {
        synchronize: false,
        logging: false,
        migrations: [path.join(__dirname, 'migrations/*.ts')],
        ...getDbConfig(),
    },
    paymentOptions: {
        paymentMethodHandlers: [dummyPaymentHandler],
    },

    customFields: {
        Product: [
            {
                name: 'test',
                type: 'relation',
                entity: Asset,
            },
        ],
        FacetValue: [
            {
                name: 'childFacetValue',
                type: 'relation',
                entity: FacetValue,
            },
        ],
    },
    logger: new DefaultLogger({ level: LogLevel.Info }),
    importExportOptions: {
        importAssetsDir: path.join(__dirname, 'import-assets'),
    },
    plugins: [
        // MultivendorPlugin.init({
        //     platformFeePercent: 10,
        //     platformFeeSKU: 'FEE',
        // }),
        AssetServerPlugin.init({
            route: 'assets',
            assetUploadDir: path.join(__dirname, 'assets'),
        }),
        DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: false }),
        // Enable if you need to debug the job queue
        // BullMQJobQueuePlugin.init({}),
        DefaultJobQueuePlugin.init({}),
        // JobQueueTestPlugin.init({ queueCount: 10 }),
        // ElasticsearchPlugin.init({
        //     host: 'http://localhost',
        //     port: 9200,
        //     bufferUpdates: true,
        // }),
        EmailPlugin.init({
            devMode: true,
            route: 'mailbox',
            handlers: defaultEmailHandlers,
            templateLoader: new FileBasedTemplateLoader(path.join(__dirname, '../email-plugin/templates')),
            outputPath: path.join(__dirname, 'test-emails'),
            globalTemplateVars: {
                verifyEmailAddressUrl: 'http://localhost:4201/verify',
                passwordResetUrl: 'http://localhost:4201/reset-password',
                changeEmailAddressUrl: 'http://localhost:4201/change-email-address',
            },
        }),

        AdminUiPlugin.init({
            route: 'admin',
            port: 5001,
            // Un-comment to compile a custom admin ui
            // app: compileUiExtensions({
            //     outputPath: path.join(__dirname, './custom-admin-ui'),
            //     extensions: [
            //         {
            //             id: 'ui-extensions-library',
            //             extensionPath: path.join(__dirname, 'example-plugins/ui-extensions-library/ui'),
            //             routes: [{ route: 'ui-library', filePath: 'routes.ts' }],
            //             providers: ['providers.ts'],
            //         },
            //         {
            //             globalStyles: path.join(
            //                 __dirname,
            //                 'test-plugins/with-ui-extension/ui/custom-theme.scss',
            //             ),
            //         },
            //     ],
            //     devMode: true,
            // }),
        }),

        BraintreePlugin.init({
            environment: Environment.Sandbox,
            storeCustomersInBraintree: false,
            merchantAccountIds: {
                USD: process.env.BRAINTREE_MERCHANT_ACCOUNT_ID_USD!,
                EUR: process.env.BRAINTREE_MERCHANT_ACCOUNT_ID_EUR!
            }
        }),

        // StripePlugin.init({
        //     apiKeys: {
        //         secretKey: 'sk_test_51Hq842F4778778778778778778778778778778778778778778778778778778778778778778778778778',
        //         publishableKey: 'pk_test_51Hq842F4778778778778778778778778778778778778778778777877877877877877877877877878778',
        //     },
        //     webhookSigningSecret: 'whsec_1234567890',
        //     currencyCode: 'USD',
        //     paymentIntentStatus: ['requires_payment_method', 'requires_action'],
        //     storeCustomersInStripe: false,
        // }),
        // PayPalPlugin.init({
        //     clientId: 'AQ4q842F477877877877877877877877877877877877877877877787778778778778778778778778778',
        //     clientSecret: 'EH4q842F477877877877877877877877877877877877877877877787778778778778778778778778778',
        //     webhookId: '1234567890',
        //     currencyCode: 'USD',
        //     storeCustomersInPayPal: false,
        // }),
        // KlarnaPlugin.init({
        //     apiKeys: {
        //         secretKey: 'secret-key',
        //         publishableKey: 'publishable-key',
        //     },
        //     currencyCode: 'USD',
        //     storeCustomersInKlarna: false,
        // }),
        // StripePaymentIntentsPlugin.init({
        //     apiKeys: {
        //         secretKey: 'sk_test_51Hq842F477877877877877877877877877877877877877877877787778778778778778778778778778',
        //})
    ],
};

function getDbConfig(): DataSourceOptions {
    const dbType = process.env.DB || 'mysql';
    switch (dbType) {
        case 'postgres':
            console.log('Using postgres connection');
            return {
                synchronize: true,
                type: 'postgres',
                host: process.env.DB_HOST || 'localhost',
                port: Number(process.env.DB_PORT) || 5432,
                username: process.env.DB_USERNAME || 'vendure',
                password: process.env.DB_PASSWORD || 'password',
                database: process.env.DB_NAME || 'vendure-dev',
                schema: process.env.DB_SCHEMA || 'public',
            };
        case 'sqlite':
            console.log('Using sqlite connection');
            return {
                synchronize: true,
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
        case 'mariadb':
        default:
            console.log('Using mysql connection');
            return {
                synchronize: true,
                type: 'mariadb',
                host: '127.0.0.1',
                port: 3306,
                username: 'vendure',
                password: 'password',
                database: 'vendure-dev',
            };
    }
}
