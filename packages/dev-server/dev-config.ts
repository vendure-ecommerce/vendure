/* tslint:disable:no-console */
import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import { ADMIN_API_PATH, API_PORT, SHOP_API_PATH } from '@vendure/common/lib/shared-constants';
import {
    DefaultJobQueuePlugin,
    DefaultLogger,
    DefaultSearchPlugin,
    examplePaymentHandler,
    LogLevel,
    VendureConfig,
} from '@vendure/core';
import { defaultEmailHandlers, EmailPlugin } from '@vendure/email-plugin';
import dotenv from 'dotenv';
import path from 'path';
import { ConnectionOptions } from 'typeorm';

const configPath = path.join(__dirname, '.env');
console.log(`Loading .env file from ${configPath}`);
dotenv.config({ path: configPath });

/**
 * Config settings used during development
 */
export const devConfig: VendureConfig = {
    apiOptions: {
        port: +(process.env.PORT ?? API_PORT),
        adminApiPath: process.env.ADMIN_API_PATH || ADMIN_API_PATH,
        adminApiPlayground: {
            settings: {
                'request.credentials': 'include',
            } as any,
        },
        adminApiDebug: true,
        shopApiPath: process.env.SHOP_API_PATH ?? SHOP_API_PATH,
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
    customFields: {},
    logger: new DefaultLogger({ level: LogLevel.Info }),
    importExportOptions: {
        importAssetsDir: path.join(__dirname, 'import-assets'),
    },
    plugins: [
        AssetServerPlugin.init({
            route: 'assets',
            assetUploadDir: path.join(__dirname, 'assets'),
            port: 5002,
        }),
        DefaultSearchPlugin,
        DefaultJobQueuePlugin,
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
                host: process.env.DB_HOST || '127.0.0.1',
                port: +(process.env.DB_PORT ?? 5432),
                username: process.env.DB_USER ?? 'root',
                password: process.env.DB_PASS ?? '',
                database: process.env.DB_NAME ?? 'vendure-dev',
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
                synchronize: false,
                type: 'mysql',
                host: process.env.DB_HOST ?? '127.0.0.1',
                port: +(process.env.DB_PORT ?? 3306),
                username: process.env.DB_USER ?? 'root',
                password: process.env.DB_PASS ?? '',
                database: process.env.DB_NAME ?? 'vendure-dev',
            };
    }
}
