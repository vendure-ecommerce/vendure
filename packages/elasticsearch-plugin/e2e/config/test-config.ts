import { mergeConfig } from '@vendure/core';
import { testConfig as defaultTestConfig } from '@vendure/testing';
import path from 'path';

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

export const dataDir = path.join(__dirname, '../__data__');

export const testConfig = mergeConfig(defaultTestConfig, {
    importExportOptions: {
        importAssetsDir: path.join(__dirname, '..', 'fixtures/assets'),
    },
});
