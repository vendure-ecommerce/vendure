/* tslint:disable:no-console */
import { AssetServerPlugin } from '@vendure/asset-server-plugin';
import {
    defaultConfig,
    DefaultLogger,
    DefaultSearchPlugin,
    dummyPaymentHandler,
    InMemorySessionCacheStrategy,
    LogLevel,
    mergeConfig,
    VendureConfig,
} from '@vendure/core';
import path from 'path';

export function getMysqlConnectionOptions(count: number) {
    return {
        type: 'mysql' as const,
        host: '127.0.0.1',
        port: 3306,
        username: 'root',
        password: '',
        database: `vendure-load-testing-${count}`,
        extra: {
            // connectionLimit: 150,
        },
    };
}
export function getPostgresConnectionOptions(count: number) {
    return {
        type: 'postgres' as const,
        host: '127.0.0.1',
        port: 5432,
        username: 'admin',
        password: 'secret',
        database: `vendure-load-testing-${count}`,
    };
}

export function getLoadTestConfig(tokenMethod: 'cookie' | 'bearer'): Required<VendureConfig> {
    const count = getProductCount();
    return mergeConfig(defaultConfig, {
        paymentOptions: {
            paymentMethodHandlers: [dummyPaymentHandler],
        },
        orderOptions: {
            orderItemsLimit: 99999,
        },
        logger: new DefaultLogger({ level: LogLevel.Info }),
        dbConnectionOptions: getMysqlConnectionOptions(count),
        authOptions: {
            tokenMethod,
            requireVerification: false,
            sessionCacheStrategy: new InMemorySessionCacheStrategy(),
        },
        importExportOptions: {
            importAssetsDir: path.join(__dirname, './data-sources'),
        },
        customFields: {},
        plugins: [
            AssetServerPlugin.init({
                assetUploadDir: path.join(__dirname, 'static/assets'),
                route: 'assets',
            }),
            DefaultSearchPlugin,
        ],
    });
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

export function getScriptToRun(): string[] | undefined {
    const script = process.argv[3];
    if (script) {
        return [script];
    }
}
