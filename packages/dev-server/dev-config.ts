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
    LanguageCode,
    LogLevel,
    VendureConfig,
} from '@vendure/core';
import { ElasticsearchPlugin } from '@vendure/elasticsearch-plugin';
import { defaultEmailHandlers, EmailPlugin } from '@vendure/email-plugin';
import { BullMQJobQueuePlugin } from '@vendure/job-queue-plugin/package/bullmq';
import 'dotenv/config';
import { compileUiExtensions } from '@vendure/ui-devkit/compiler';
import path from 'path';
import { DataSourceOptions } from 'typeorm';

import { MultivendorPlugin } from './test-plugins/multivendor-plugin/multivendor.plugin';

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
        Product: [
            {
                name: 'searchKeywords',
                label: [{ languageCode: LanguageCode.en, value: 'Search keywords' }],
                type: 'string',
                defaultValue: '',
                public: false,
            },
            {
                name: 'noIndex',
                label: [{ languageCode: LanguageCode.en, value: 'Do not allow crawlers to index' }],
                type: 'boolean',
                defaultValue: false,
                public: true,
                ui: { tab: 'SEO' },
            },
        ],
        ProductVariant: [
            {
                name: 'weight',
                type: 'int',
                defaultValue: 0,
                nullable: false,
                min: 0,
                step: 1,
                public: true,
                label: [{ languageCode: LanguageCode.en, value: 'Weight' }],
                ui: { component: 'number-form-input', suffix: 'g' },
            },
            {
                name: 'gtin',
                type: 'string',
                nullable: true,
                public: true,
                label: [{ languageCode: LanguageCode.en, value: 'GTIN (barcode)' }],
            },
        ],
    },

    /* customFields: {
        ProductVariant: [
            {
                name: 'weight',
                type: 'int',
                defaultValue: 0,
                nullable: false,
                min: 0,
                step: 1,
                public: true,
                label: [{ languageCode: LanguageCode.en, value: 'Weight' }],
                ui: { component: 'number-form-input', suffix: 'g' },
            },
            {
                name: 'rrp',
                type: 'int',
                nullable: true,
                min: 0,
                step: 1,
                public: true,
                label: [{ languageCode: LanguageCode.en, value: 'RRP' }],
                ui: { component: 'currency-form-input' },
            },
            {
                name: 'gtin',
                type: 'string',
                nullable: true,
                public: true,
                label: [{ languageCode: LanguageCode.en, value: 'GTIN (barcode)' }],
            },
            {
                name: 'additionalInformation',
                type: 'text',
                nullable: true,
                public: true,
                label: [{ languageCode: LanguageCode.en, value: 'Additional Information' }],
                ui: { component: 'json-editor-form-input' },
            },
        ],
        Product: [
            {
                name: 'searchKeywords',
                label: [{ languageCode: LanguageCode.en, value: 'Search keywords' }],
                type: 'string',
                defaultValue: '',
                public: false,
            },
            {
                name: 'pageType',
                label: [{ languageCode: LanguageCode.en, value: 'Page type' }],
                type: 'string',
                defaultValue: 'default',
                public: true,
                options: [
                    { value: 'default', label: [{ languageCode: LanguageCode.en, value: 'Default' }] },
                    {
                        value: 'colour-chart',
                        label: [{ languageCode: LanguageCode.en, value: 'Colour chart' }],
                    },
                    {
                        value: 'select-menu',
                        label: [{ languageCode: LanguageCode.en, value: 'Select menu' }],
                    },
                    { value: 'gift-card', label: [{ languageCode: LanguageCode.en, value: 'Gift card' }] },
                ],
                ui: { tab: 'Display' },
            },
            {
                name: 'keyFeatures',
                label: [{ languageCode: LanguageCode.en, value: 'Key features' }],
                type: 'text',
                public: true,
                nullable: true,
                ui: { component: 'rich-text-form-input' },
            },
            {
                name: 'videoUrls',
                label: [{ languageCode: LanguageCode.en, value: 'Video urls' }],
                type: 'string',
                list: true,
                public: true,
                nullable: false,
                defaultValue: [],
            },
            {
                name: 'variantOrdering',
                label: [{ languageCode: LanguageCode.en, value: 'Variant ordering' }],
                type: 'string',
                defaultValue: 'default',
                public: true,
                options: [
                    { value: 'default', label: [{ languageCode: LanguageCode.en, value: 'Default' }] },
                    {
                        value: 'alphabetical',
                        label: [{ languageCode: LanguageCode.en, value: 'Alphabetical' }],
                    },
                    {
                        value: 'brush-size',
                        label: [{ languageCode: LanguageCode.en, value: 'Brush size (000, 00, 0, 1, ...)' }],
                    },
                    {
                        value: 'dimension',
                        label: [
                            { languageCode: LanguageCode.en, value: 'Dimension (5" x 5", 10" x 12",...)' },
                        ],
                    },
                ],
                ui: { tab: 'Display' },
            },
            {
                name: 'seoTitle',
                type: 'localeString',
                public: true,
                label: [{ languageCode: LanguageCode.en, value: 'SEO Title' }],
                nullable: true,
                ui: { tab: 'SEO' },
            },
            {
                name: 'seoDescription',
                type: 'localeString',
                public: true,
                label: [{ languageCode: LanguageCode.en, value: 'SEO Description' }],
                nullable: true,
                ui: { tab: 'SEO', component: 'textarea-form-input' },
            },
            {
                name: 'seoImage',
                type: 'relation',
                entity: Asset,
                public: true,
                label: [{ languageCode: LanguageCode.en, value: 'SEO Image' }],
                nullable: true,
                ui: { tab: 'SEO' },
            },
            {
                name: 'boost',
                type: 'int',
                public: true,
                defaultValue: 0,
                min: 0,
                max: 5,
                label: [{ languageCode: LanguageCode.en, value: 'Boost in list pages' }],
                nullable: true,
            },
            {
                name: 'minimumOrderQuantity',
                type: 'int',
                public: true,
                min: 0,
                label: [{ languageCode: LanguageCode.en, value: 'Minimum order quantity' }],
                description: [
                    {
                        languageCode: LanguageCode.en,
                        value: 'If set, the customer must order at least this number of any variants of this product',
                    },
                ],
                nullable: true,
            },
        ],
        Collection: [
            {
                name: 'excludeFromNavMenu',
                label: [{ languageCode: LanguageCode.en, value: 'Exclude from nav menu' }],
                type: 'boolean',
                defaultValue: false,
                public: true,
            },
            {
                name: 'excludeFromSubCollections',
                label: [{ languageCode: LanguageCode.en, value: 'Exclude from sub collections' }],
                type: 'boolean',
                defaultValue: false,
                public: true,
            },
            {
                name: 'noIndex',
                label: [{ languageCode: LanguageCode.en, value: 'Do not allow crawlers to index' }],
                type: 'boolean',
                defaultValue: false,
                public: true,
                ui: { tab: 'SEO' },
            },
            {
                name: 'searchKeywords',
                label: [{ languageCode: LanguageCode.en, value: 'Search keywords' }],
                type: 'string',
                defaultValue: '',
                public: false,
            },
            {
                name: 'layout',
                type: 'string',
                public: true,
                nullable: false,
                defaultValue: 'fullWidth',
                label: [{ languageCode: LanguageCode.en, value: 'Layout mode' }],
                options: [
                    { value: 'default', label: [{ languageCode: LanguageCode.en, value: 'Default' }] },
                    { value: 'fullWidth', label: [{ languageCode: LanguageCode.en, value: 'Full width' }] },
                ],
            },
            {
                name: 'seoTitle',
                type: 'localeString',
                public: true,
                label: [{ languageCode: LanguageCode.en, value: 'SEO Meta Title' }],
                nullable: true,
                ui: { tab: 'SEO' },
            },
            {
                name: 'seoDescription',
                type: 'localeString',
                public: true,
                label: [{ languageCode: LanguageCode.en, value: 'SEO Meta Description' }],
                nullable: true,
                ui: { tab: 'SEO', component: 'textarea-form-input' },
            },
            {
                name: 'seoImage',
                type: 'relation',
                entity: Asset,
                public: true,
                label: [{ languageCode: LanguageCode.en, value: 'SEO Meta Image' }],
                nullable: true,
                ui: { tab: 'SEO' },
            },
            {
                name: 'extendedDescription',
                type: 'text',
                public: true,
                label: [{ languageCode: LanguageCode.en, value: 'Extended description' }],
                nullable: true,
                ui: { tab: 'SEO', component: 'rich-text-form-input' },
            },
            {
                name: 'isOfferCollection',
                type: 'boolean',
                public: true,
                label: [{ languageCode: LanguageCode.en, value: 'Is offer collecion' }],
                nullable: true,
                defaultValue: false,
                ui: { tab: 'Offers' },
            },
            {
                name: 'offerName',
                type: 'string',
                public: true,
                label: [{ languageCode: LanguageCode.en, value: 'Offer name' }],
                nullable: true,
                ui: { tab: 'Offers' },
            },
            {
                name: 'offerDescription',
                type: 'string',
                public: true,
                label: [{ languageCode: LanguageCode.en, value: 'Offer description' }],
                nullable: true,
                ui: { tab: 'Offers', component: 'rich-text-form-input' },
            },
            {
                name: 'displayRrpDiscount',
                type: 'boolean',
                public: true,
                label: [{ languageCode: LanguageCode.en, value: 'Display RRP discount' }],
                description: [
                    {
                        languageCode: LanguageCode.en,
                        value: 'When enabled, the RRP discount of included products will be displayed in the storefront',
                    },
                ],
                nullable: true,
                ui: { tab: 'Offers' },
            },
        ],
    }, */
    logger: new DefaultLogger({ level: LogLevel.Verbose }),
    importExportOptions: {
        importAssetsDir: path.join(__dirname, 'import-assets'),
    },
    plugins: [
        // MultivendorPlugin,
        AssetServerPlugin.init({
            route: 'assets',
            assetUploadDir: path.join(__dirname, 'assets'),
        }),
        DefaultSearchPlugin.init({ bufferUpdates: false, indexStockStatus: false }),
        BullMQJobQueuePlugin.init({}),
        // DefaultJobQueuePlugin.init({}),
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
            // Un-comment to compile a custom admin ui
            // app: compileUiExtensions({
            //     outputPath: path.join(__dirname, './custom-admin-ui'),
            //     extensions: [
            //         {
            //             id: 'test-ui-extension',
            //             extensionPath: path.join(__dirname, 'test-plugins/with-ui-extension/ui'),
            //             ngModules: [
            //                 {
            //                     type: 'lazy',
            //                     route: 'greetz',
            //                     ngModuleFileName: 'greeter.module.ts',
            //                     ngModuleName: 'GreeterModule',
            //                 },
            //                 {
            //                     type: 'shared',
            //                     ngModuleFileName: 'greeter-shared.module.ts',
            //                     ngModuleName: 'GreeterSharedModule',
            //                 },
            //             ],
            //         },
            //         {
            //             globalStyles: path.join(
            //                 __dirname,
            //                 'test-plugins/with-ui-extension/ui/custom-theme.scss',
            //             ),
            //         },
            //         {
            //             id: 'external-ui-extension',
            //             extensionPath: path.join(__dirname, 'test-plugins/with-external-ui-extension'),
            //             ngModules: [
            //                 {
            //                     type: 'lazy',
            //                     route: 'greet',
            //                     ngModuleFileName: 'external-ui-extension.ts',
            //                     ngModuleName: 'ExternalUiExtensionModule',
            //                 },
            //             ],
            //             staticAssets: [
            //                 {
            //                     path: path.join(__dirname, 'test-plugins/with-external-ui-extension/app'),
            //                     rename: 'external-app',
            //                 },
            //             ],
            //         },
            //     ],
            //     devMode: true,
            // }),
        }),
    ],
};

function getDbConfig(): DataSourceOptions {
    const dbType = process.env.DB || 'mysql';
    switch (dbType) {
        case 'postgres':
            console.log('Using postgres connection');
            return {
                synchronize: false,
                type: 'postgres',
                host: process.env.DB_HOST || 'localhost',
                port: Number(process.env.DB_PORT) || 5432,
                username: process.env.DB_USERNAME || 'postgres',
                password: process.env.DB_PASSWORD || 'postgres',
                database: process.env.DB_NAME || 'vendure',
                schema: process.env.DB_SCHEMA || 'public',
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
                database: 'vendure2-dev',
            };
    }
}
