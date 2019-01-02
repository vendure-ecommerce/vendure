import * as path from 'path';

import { API_PATH, API_PORT } from '../shared/shared-constants';

import { fakePalPaymentHandler } from './src/config/payment-method/fakepal-payment-method-config';
import { gripePaymentHandler } from './src/config/payment-method/gripe-payment-method-config';
import { OrderProcessOptions, VendureConfig } from './src/config/vendure-config';
import { defaultEmailTypes } from './src/email/default-email-types';
import { HandlebarsMjmlGenerator } from './src/email/handlebars-mjml-generator';

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
    plugins: [],
};
