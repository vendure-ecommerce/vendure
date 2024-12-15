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
import { globSync } from 'glob';

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
    // this initial port value will be incremented according to which test we're
    // running
    let testPort = 3010;

    // this regex extracts the filename of the e2e test we're running from the
    // call stack of this function
    const testFileNameRegex = /[\w-]+\.e2e-spec\.ts/;

    // get the call stack of this function and find the filename of the e2e test
    // we're running in it.

    // `Error.prototype.stack` is not strictly standardized but is supported by
    // all major JavaScript engines, including Node.js since version 0.10.0:
    // https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Error/stack
    const stack = new Error().stack;
    if (!stack) {
        throw new Error('could not get caller from stack in Error object');
    }
    const testFileNameMatch = stack.match(testFileNameRegex);
    if (!testFileNameMatch) {
        throw new Error("could not derive the current test file's name from this stack: \n" + stack);
    }
    const testFileName = testFileNameMatch[0];

    // get an array of all of the e2e test files in this project, and find the
    // current test's position in it
    const e2eTests = globSync('../**/*.e2e-spec.ts')
        .sort()
        .map(testFilePath => path.basename(testFilePath));
    const thisTestsIndex = e2eTests.indexOf(testFileName);

    // increment the test port by the position of this test in the array of all
    // tests, to ensure that this test gets a unique port value
    testPort += thisTestsIndex;

    return mergeConfig(defaultTestConfig, {
        apiOptions: {
            port: testPort,
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
