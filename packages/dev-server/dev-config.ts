/* tslint:disable:no-console */
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import { ADMIN_API_PATH, API_PORT, SHOP_API_PATH } from '@vendure/common/lib/shared-constants';
import {
    DefaultJobQueuePlugin,
    DefaultLogger,
    DefaultSearchPlugin,
    dummyPaymentHandler,
    LanguageCode,
    LogLevel,
    VendureConfig,
} from '@vendure/core';
import { ElasticsearchPlugin } from '@vendure/elasticsearch-plugin';
import { defaultEmailHandlers, EmailPlugin } from '@vendure/email-plugin';
import { BullMQJobQueuePlugin } from '@vendure/job-queue-plugin/package/bullmq';
import path from 'path';
import { ConnectionOptions } from 'typeorm';

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
        Facet: [
            {
                name: 'color1',
                type: 'string',
                ui: { component: 'colorpicker-form-input' },
                label: [{ languageCode: LanguageCode.en, value: 'Color 1' }],
            },
            {
                name: 'color2',
                type: 'string',
                ui: { component: 'colorpicker-form-input' },
                label: [{ languageCode: LanguageCode.en, value: 'Color 2' }],
            },
        ],
        FacetValue: [
            {
                name: 'color1',
                type: 'string',
                ui: { component: 'colorpicker-form-input' },
                label: [{ languageCode: LanguageCode.en, value: 'Color 1' }],
            },
            {
                name: 'color2',
                type: 'string',
                ui: { component: 'colorpicker-form-input' },
                label: [{ languageCode: LanguageCode.en, value: 'Color 2' }],
            },
        ],
        User: [
            { name: 'referral', type: 'string' },
            { name: 'barcode', type: 'string' },
        ],
    },
    logger: new DefaultLogger({ level: LogLevel.Verbose }),
    importExportOptions: {
        importAssetsDir: path.join(__dirname, 'import-assets'),
    },
    plugins: [
        AssetServerPlugin.init({
            route: 'assets',
            assetUploadDir: path.join(__dirname, 'assets'),
        }),
        DefaultSearchPlugin.init({ bufferUpdates: true, indexStockStatus: false }),
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
            templatePath: path.join(__dirname, '../email-plugin/templates'),
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
        default:
            console.log('Using mysql connection');
            return {
                synchronize: true,
                type: 'mysql',
                host: 'localhost',
                port: 3307,
                username: 'root',
                password: 'root',
                database: 'vendure-dev',
            };
    }
}
