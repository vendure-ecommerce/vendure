import { mergeConfig } from '@vendure/core';
import {
    MysqlInitializer,
    PostgresInitializer,
    registerInitializer,
    SqljsInitializer,
    testConfig as defaultTestConfig,
} from '@vendure/testing';
import path from 'path';
import { DataSourceOptions } from 'typeorm';

import { getPackageDir } from './get-package-dir';

declare global {
    namespace NodeJS {
        interface Global {
            e2eServerPortsUsed: number[];
        }
    }
}

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
registerInitializer('mariadb', new MysqlInitializer());

export const testConfig = () => {
    const testWorkerId = Number(process.env.VITEST_WORKER_ID);
    if (!testWorkerId || isNaN(testWorkerId)) {
        console.warn(
            `VITEST_WORKER_ID has value ${testWorkerId} in the environment; ` +
                "port numbers can't be reliably allocated to test suites",
        );
    }
    return mergeConfig(defaultTestConfig, {
        apiOptions: {
            port: 3010 + testWorkerId,
        },
        importExportOptions: {
            importAssetsDir: path.join(packageDir, 'fixtures/assets'),
        },
        dbConnectionOptions: getDbConfig(),
    });
};

function getDbConfig(): DataSourceOptions {
    const dbType = process.env.DB || 'sqljs';
    switch (dbType) {
        case 'postgres':
            return {
                synchronize: true,
                type: 'postgres',
                host: '127.0.0.1',
                port: process.env.CI ? +(process.env.E2E_POSTGRES_PORT || 5432) : 5432,
                username: 'vendure',
                password: 'password',
            };
        case 'mariadb':
            return {
                synchronize: true,
                type: 'mariadb',
                host: '127.0.0.1',
                port: process.env.CI ? +(process.env.E2E_MARIADB_PORT || 3306) : 3306,
                username: 'vendure',
                password: 'password',
            };
        case 'mysql':
            return {
                synchronize: true,
                type: 'mysql',
                host: '127.0.0.1',
                port: process.env.CI ? +(process.env.E2E_MYSQL_PORT || 3306) : 3306,
                username: 'vendure',
                password: 'password',
            };
        case 'sqljs':
        default:
            return defaultTestConfig.dbConnectionOptions;
    }
}
