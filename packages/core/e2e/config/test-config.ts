import { Transport } from '@nestjs/microservices';
import { ADMIN_API_PATH, SHOP_API_PATH } from '@vendure/common/lib/shared-constants';
import path from 'path';

import { DefaultAssetNamingStrategy } from '../../src/config/asset-naming-strategy/default-asset-naming-strategy';
import { NoopLogger } from '../../src/config/logger/noop-logger';
import { VendureConfig } from '../../src/config/vendure-config';

import { TestingAssetPreviewStrategy } from './testing-asset-preview-strategy';
import { TestingAssetStorageStrategy } from './testing-asset-storage-strategy';
import { TestingEntityIdStrategy } from './testing-entity-id-strategy';

/**
 * We use a relatively long timeout on the initial beforeAll() function of the
 * e2e tests because on the first run (and always in CI) the sqlite databases
 * need to be generated, which can take a while.
 */
export const TEST_SETUP_TIMEOUT_MS = process.env.E2E_DEBUG ? 1800 * 1000 : 120000;

/**
 * For local debugging of the e2e tests, we set a very long timeout value otherwise tests will
 * automatically fail for going over the 5 second default timeout.
 */
if (process.env.E2E_DEBUG) {
    // tslint:disable-next-line:no-console
    console.log('E2E_DEBUG', process.env.E2E_DEBUG, ' - setting long timeout');
    jest.setTimeout(1800 * 1000);
}

/**
 * Config settings used for e2e tests
 */
export const testConfig: VendureConfig = {
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
    importExportOptions: {
        importAssetsDir: path.join(__dirname, '..', 'fixtures/assets'),
    },
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
};
