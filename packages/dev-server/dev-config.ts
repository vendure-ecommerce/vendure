import { AdminUiPlugin } from '@vendure/admin-ui-plugin';
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import { ADMIN_API_PATH, API_PORT, SHOP_API_PATH } from '@vendure/common/lib/shared-constants';
import {
    DefaultSearchPlugin,
    examplePaymentHandler,
    VendureConfig,
} from '@vendure/core';
import { defaultEmailHandlers, EmailPlugin } from '@vendure/email-plugin';
import path from 'path';

/**
 * Config settings used during development
 */
export const devConfig: VendureConfig = {
    authOptions: {
        disableAuth: false,
        sessionSecret: 'some-secret',
        requireVerification: true,
    },
    port: API_PORT,
    adminApiPath: ADMIN_API_PATH,
    shopApiPath: SHOP_API_PATH,
    dbConnectionOptions: {
        synchronize: false,
        logging: false,

        type: 'mysql',
        host: '192.168.99.100',
        port: 3306,
        username: 'root',
        password: '',
        database: 'vendure-dev',

        // type: 'sqlite',
        // database:  path.join(__dirname, 'vendure.sqlite'),

        // type: 'postgres',
        // host: '127.0.0.1',
        // port: 5432,
        // username: 'postgres',
        // password: 'Be70',
        // database: 'vendure',
    },
    paymentOptions: {
        paymentMethodHandlers: [examplePaymentHandler],
    },
    customFields: {},
    importExportOptions: {
        importAssetsDir: path.join(__dirname, 'import-assets'),
    },
    plugins: [
        new AssetServerPlugin({
            route: 'assets',
            assetUploadDir: path.join(__dirname, 'assets'),
            port: 5002,
        }),
        new DefaultSearchPlugin(),
        new EmailPlugin({
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
        new AdminUiPlugin({
            port: 5001,
        }),
    ],
};
