import path from 'path';

import { API_PATH, API_PORT } from '../shared/shared-constants';

import { examplePaymentHandler } from './src/config/payment-method/example-payment-method-config';
import { OrderProcessOptions, VendureConfig } from './src/config/vendure-config';
import { defaultEmailTypes } from './src/email/default-email-types';
import { HandlebarsMjmlGenerator } from './src/email/handlebars-mjml-generator';
import { DefaultAssetServerPlugin } from './src/plugin';
import { AdminUiPlugin } from './src/plugin/admin-ui-plugin/admin-ui-plugin';
import { DefaultSearchPlugin } from './src/plugin/default-search-plugin/default-search-plugin';

/**
 * Config settings used during development
 */
export const devConfig: VendureConfig = {
    authOptions: {
        disableAuth: false,
        sessionSecret: 'some-secret',
        requireVerification: false,
    },
    port: API_PORT,
    apiPath: API_PATH,
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
    orderProcessOptions: {} as OrderProcessOptions<any>,
    paymentOptions: {
        paymentMethodHandlers: [examplePaymentHandler],
    },
    customFields: {},
    emailOptions: {
        emailTemplatePath: path.join(__dirname, 'src/email/templates'),
        emailTypes: defaultEmailTypes,
        generator: new HandlebarsMjmlGenerator(),
        transport: {
            type: 'file',
            raw: false,
            outputPath: path.join(__dirname, 'test-emails'),
        },
    },
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
        new AdminUiPlugin({
            port: 5001,
        }),
    ],
};
