import * as path from 'path';

import { API_PATH, API_PORT } from '../shared/shared-constants';

import { fakePalPaymentHandler } from './src/config/payment-method/fakepal-payment-method-config';
import { gripePaymentHandler } from './src/config/payment-method/gripe-payment-method-config';
import { OrderProcessOptions, VendureConfig } from './src/config/vendure-config';
import { defaultEmailTypes } from './src/email/default-email-types';
import { HandlebarsMjmlGenerator } from './src/email/handlebars-mjml-generator';
import { DefaultAssetServerPlugin } from './src/plugin';
import { DefaultSearchPlugin } from './src/plugin/default-search-engine/default-search-plugin';

/**
 * Config settings used during development
 */
export const devConfig: VendureConfig = {
    defaultChannelToken: 'default-channel',
    authOptions: {
        disableAuth: false,
        sessionSecret: 'some-secret',
    },
    port: API_PORT,
    apiPath: API_PATH,
    dbConnectionOptions: {
        type: 'mysql',
        synchronize: true,
        logging: true,
        host: '192.168.99.100',
        port: 3306,
        username: 'root',
        password: '',
        database: 'vendure-dev',
    },
    orderProcessOptions: {} as OrderProcessOptions<any>,
    paymentOptions: {
        paymentMethodHandlers: [fakePalPaymentHandler, gripePaymentHandler],
    },
    customFields: {},
    emailOptions: {
        emailTypes: defaultEmailTypes,
        generator: new HandlebarsMjmlGenerator(path.join(__dirname, 'src', 'email', 'templates', 'partials')),
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
            port: 4000,
            hostname: 'http://localhost',
            previewMaxHeight: 1600,
            previewMaxWidth: 1600,
            presets: [
                { name: 'tiny', width: 50, height: 50, mode: 'crop' },
                { name: 'thumb', width: 150, height: 150, mode: 'crop' },
                { name: 'small', width: 300, height: 300, mode: 'resize' },
                { name: 'medium', width: 500, height: 500, mode: 'resize' },
                { name: 'large', width: 800, height: 800, mode: 'resize' },
            ],
        }),
        new DefaultSearchPlugin(),
    ],
};
