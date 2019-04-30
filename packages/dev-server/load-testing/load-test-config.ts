/* tslint:disable:no-console */
import { VendureConfig } from '@vendure/core';
import path from 'path';

import { devConfig } from '../dev-config';

export function getMysqlConnectionOptions(count: number) {
    return {
        type: 'mysql',
        host: '192.168.99.100',
        port: 3306,
        username: 'root',
        password: '',
        database: `vendure-load-testing-${count}`,
    };
}

export function getLoadTestConfig(tokenMethod: 'cookie' | 'bearer'): VendureConfig {
    const count = getProductCount();
    return {
        ...devConfig as any,
        dbConnectionOptions: getMysqlConnectionOptions(count),
        authOptions: {
            tokenMethod,
            requireVerification: false,
        },
        importExportOptions: {
            importAssetsDir: path.join(__dirname, './data-sources'),
        },
        customFields: {},
    };
}

export function getProductCsvFilePath() {
    const count = getProductCount();
    return path.join(__dirname, `./data-sources/products-${count}.csv`);
}

export function getProductCount() {
    const count = +process.argv[2];
    if (!count) {
        console.error(`Please specify the number of products to generate`);
        process.exit(1);
    }
    return count;
}
