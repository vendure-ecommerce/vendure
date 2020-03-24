import { Transport } from '@nestjs/microservices';
import { ADMIN_API_PATH, SHOP_API_PATH } from '@vendure/common/lib/shared-constants';
import {
    DefaultAssetNamingStrategy,
    defaultConfig,
    mergeConfig,
    NoopLogger,
    VendureConfig,
} from '@vendure/core';

import { TestingAssetPreviewStrategy } from './testing-asset-preview-strategy';
import { TestingAssetStorageStrategy } from './testing-asset-storage-strategy';
import { TestingEntityIdStrategy } from './testing-entity-id-strategy';

export const E2E_DEFAULT_CHANNEL_TOKEN = 'e2e-default-channel';

/**
 * @description
 * A {@link VendureConfig} object used for e2e tests. This configuration uses sqljs as the database
 * and configures some special settings which are optimized for e2e tests:
 *
 * * `entityIdStrategy: new TestingEntityIdStrategy()` This ID strategy uses auto-increment IDs but encodes all IDs
 * to be prepended with the string `'T_'`, so ID `1` becomes `'T_1'`.
 * * `logger: new NoopLogger()` Do no output logs by default
 * * `assetStorageStrategy: new TestingAssetStorageStrategy()` This strategy does not actually persist any binary data to disk.
 * * `assetPreviewStrategy: new TestingAssetPreviewStrategy()` This strategy is a no-op.
 *
 * @docsCategory testing
 */
export const testConfig: Required<VendureConfig> = mergeConfig(defaultConfig, {
    port: 3050,
    adminApiPath: ADMIN_API_PATH,
    shopApiPath: SHOP_API_PATH,
    cors: true,
    defaultChannelToken: E2E_DEFAULT_CHANNEL_TOKEN,
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
