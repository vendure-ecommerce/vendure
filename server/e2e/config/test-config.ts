import { API_PATH } from 'shared/shared-constants';

import { VendureConfig } from '../../src/config/vendure-config';

import { TestingAssetPreviewStrategy } from './testing-asset-preview-strategy';
import { TestingAssetStorageStrategy } from './testing-asset-storage-strategy';
import { TestingEntityIdStrategy } from './testing-entity-id-strategy';

export const TEST_CONNECTION_NAME = undefined;

/**
 * Config settings used for e2e tests
 */
export const testConfig: VendureConfig = {
    port: 3050,
    apiPath: API_PATH,
    cors: true,
    authOptions: {
        sessionSecret: 'some-secret',
    },
    dbConnectionOptions: {
        type: 'sqljs',
        database: new Uint8Array([]),
        location: '',
        autoSave: false,
        logging: false,
    },
    customFields: {},
    entityIdStrategy: new TestingEntityIdStrategy(),
    assetStorageStrategy: new TestingAssetStorageStrategy(),
    assetPreviewStrategy: new TestingAssetPreviewStrategy(),
};
