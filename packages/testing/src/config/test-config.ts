import { Transport } from '@nestjs/microservices';
import { ADMIN_API_PATH, SHOP_API_PATH } from '@vendure/common/lib/shared-constants';
import { DefaultAssetNamingStrategy, NoopLogger, VendureConfig } from '@vendure/core';
import { defaultConfig } from '@vendure/core/dist/config/default-config';
import { mergeConfig } from '@vendure/core/dist/config/merge-config';
import path from 'path';

import { TestingAssetPreviewStrategy } from './testing-asset-preview-strategy';
import { TestingAssetStorageStrategy } from './testing-asset-storage-strategy';
import { TestingEntityIdStrategy } from './testing-entity-id-strategy';

/**
 * Config settings used for e2e tests
 */
export const testConfig: Required<VendureConfig> = mergeConfig(defaultConfig, {
    port: 3050,
    adminApiPath: ADMIN_API_PATH,
    shopApiPath: SHOP_API_PATH,
    cors: true,
    defaultChannelToken: 'e2e-default-channel',
    authOptions: {
        sessionSecret: 'some-secret',
        tokenMethod: 'bearer',
        requireVerification: true,
    },
    dbConnectionOptions: {
        type: 'sqljs',
        database: new Uint8Array([]),
        location: '',
        autoSave: false,
        logging: false,
    },
    promotionOptions: {},
    customFields: {},
    entityIdStrategy: new TestingEntityIdStrategy(),
    paymentOptions: {
        paymentMethodHandlers: [],
    },
    logger: new NoopLogger(),
    importExportOptions: {},
    assetOptions: {
        assetNamingStrategy: new DefaultAssetNamingStrategy(),
        assetStorageStrategy: new TestingAssetStorageStrategy(),
        assetPreviewStrategy: new TestingAssetPreviewStrategy(),
    },
    workerOptions: {
        runInMainProcess: true,
        transport: Transport.TCP,
        options: {
            port: 3051,
        },
    },
});
