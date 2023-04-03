import { mergeConfig } from '@vendure/core';
import {
    MysqlInitializer,
    PostgresInitializer,
    registerInitializer,
    SqljsInitializer,
    testConfig as defaultTestConfig,
} from '@vendure/testing';
import fs from 'fs-extra';
import path from 'path';
import { DataSourceOptions } from 'typeorm';
import { fileURLToPath } from 'url';

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
    // @ts-ignore
    const portsFile = fileURLToPath(new URL('ports.json', import.meta.url));
    fs.ensureFileSync(portsFile);
    let usedPorts: number[];
    try {
        usedPorts = fs.readJSONSync(portsFile) ?? [3010];
    } catch (e: any) {
        usedPorts = [3010];
    }
    const nextPort = Math.max(...usedPorts) + 1;
    usedPorts.push(nextPort);
    if (100 < usedPorts.length) {
        // reset the used ports after it gets 100 entries long
        usedPorts = [3010];
    }
    fs.writeJSONSync(portsFile, usedPorts);
    return mergeConfig(defaultTestConfig, {
        apiOptions: {
            port: nextPort,
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
                username: 'admin',
                password: 'secret',
            };
        case 'mariadb':
            return {
                synchronize: true,
                type: 'mariadb',
                host: '127.0.0.1',
                port: process.env.CI ? +(process.env.E2E_MARIADB_PORT || 3306) : 3306,
                username: 'root',
                password: '',
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
