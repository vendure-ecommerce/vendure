import { mergeConfig } from '@vendure/core';
import {
    MysqlInitializer,
    PostgresInitializer,
    registerInitializer,
    SqljsInitializer,
    testConfig as defaultTestConfig,
} from '@vendure/testing';
import path from 'path';
import { ConnectionOptions } from 'typeorm';

import { getPackageDir } from './get-package-dir';

/**
 * We use a relatively long timeout on the initial beforeAll() function of the
 * e2e tests because on the first run (and always in CI) the sqlite databases
 * need to be generated, which can take a while.
 */
export const TEST_SETUP_TIMEOUT_MS = process.env.E2E_DEBUG ? 1800 * 1000 : 120000;

const packageDir = getPackageDir();

registerInitializer('sqljs', new SqljsInitializer(path.join(packageDir, '__data__')));
registerInitializer('postgres', new PostgresInitializer());
registerInitializer('mysql', new MysqlInitializer());

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
 * Increase default timeout in CI to 10 seconds because occasionally valid tests fail due to
 * timeouts.
 */
if (process.env.CI) {
    jest.setTimeout(10 * 1000);
}

export const testConfig = mergeConfig(defaultTestConfig, {
    importExportOptions: {
        importAssetsDir: path.join(packageDir, 'fixtures/assets'),
    },
    jobQueueOptions: {
        pollInterval: 100,
    },
    dbConnectionOptions: getDbConfig(),
});

function getDbConfig(): ConnectionOptions {
    const dbType = process.env.DB || 'sqljs';
    switch (dbType) {
        case 'postgres':
            return {
                synchronize: true,
                type: 'postgres',
                host: '127.0.0.1',
                port: process.env.CI ? +(process.env.E2E_POSTGRES_PORT || 5432) : 5432,
                username: 'admin',
                password: 'secret',
            };
        case 'mysql':
            return {
                synchronize: true,
                type: 'mysql',
                host: '127.0.0.1',
                port: process.env.CI ? +(process.env.E2E_MYSQL_PORT || 3306) : 3306,
                username: 'root',
                password: '',
            };
        case 'sqljs':
        default:
            return defaultTestConfig.dbConnectionOptions;
    }
}
