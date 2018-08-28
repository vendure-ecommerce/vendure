import { API_PATH } from 'shared/shared-constants';

import { VendureConfig } from '../../src/config/vendure-config';

/**
 * Config settings used for e2e tests
 */
export const testConfig: VendureConfig = {
    port: 3050,
    apiPath: API_PATH,
    cors: true,
    jwtSecret: 'some-secret',
    dbConnectionOptions: {
        type: 'sqljs',
        database: new Uint8Array([]),
        location: '',
        autoSave: false,
        logging: false,
    },
    customFields: {},
};
