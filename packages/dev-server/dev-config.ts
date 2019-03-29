import { ADMIN_API_PATH, API_PORT, SHOP_API_PATH } from '@vendure/common/lib/shared-constants';
import {
    AdminUiPlugin,
    DefaultSearchPlugin,
    examplePaymentHandler,
    VendureConfig,
} from '@vendure/core';
import { DefaultAssetServerPlugin } from '@vendure/default-asset-server-plugin';
import { DefaultEmailPlugin } from '@vendure/default-email-plugin';
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
        new DefaultAssetServerPlugin({
            route: 'assets',
            assetUploadDir: path.join(__dirname, 'assets'),
            port: 5002,
        }),
        new DefaultSearchPlugin(),
        new DefaultEmailPlugin({
            devMode: true,
            templatePath: path.join(__dirname, '../default-email-plugin/templates'),
            outputPath: path.join(__dirname, 'test-emails'),
        }),
       /* new AdminUiPlugin({
            port: 5001,
        }),*/
    ],
};
