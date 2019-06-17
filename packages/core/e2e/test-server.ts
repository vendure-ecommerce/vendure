import { INestApplication, INestMicroservice } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { Omit } from '@vendure/common/lib/omit';
import fs from 'fs';
import path from 'path';
import { ConnectionOptions } from 'typeorm';
import { SqljsConnectionOptions } from 'typeorm/driver/sqljs/SqljsConnectionOptions';

import { populateForTesting, PopulateOptions } from '../mock-data/populate-for-testing';
import { preBootstrapConfig, runPluginOnBootstrapMethods } from '../src/bootstrap';
import { Mutable } from '../src/common/types/common-types';
import { Logger } from '../src/config/logger/vendure-logger';
import { VendureConfig } from '../src/config/vendure-config';

import { testConfig } from './config/test-config';
import { setTestEnvironment } from './utils/test-environment';

// tslint:disable:no-console
/**
 * A server against which the e2e tests should be run.
 */
export class TestServer {
    app: INestApplication;
    worker?: INestMicroservice;

    /**
     * Bootstraps an instance of Vendure server and populates the database according to the options
     * passed in. Should be called immediately after creating the client in the `beforeAll` function.
     *
     * The populated data is saved into an .sqlite file for each test file. On subsequent runs, this file
     * is loaded so that the populate step can be skipped, which speeds up the tests significantly.
     */
    async init(
        options: Omit<PopulateOptions, 'initialDataPath'>,
        customConfig: Partial<VendureConfig> = {},
    ): Promise<void> {
        setTestEnvironment();
        const testingConfig = { ...testConfig, ...customConfig };
        if (options.logging) {
            (testingConfig.dbConnectionOptions as Mutable<ConnectionOptions>).logging = true;
        }
        const dbFilePath = this.getDbFilePath();
        (testingConfig.dbConnectionOptions as Mutable<SqljsConnectionOptions>).location = dbFilePath;
        if (!fs.existsSync(dbFilePath)) {
            if (options.logging) {
                console.log(`Test data not found. Populating database and caching...`);
            }
            await this.populateInitialData(testingConfig, options);
        }
        if (options.logging) {
            console.log(`Loading test data from "${dbFilePath}"`);
        }
        const [app, worker] = await this.bootstrapForTesting(testingConfig);
        if (app) {
            this.app = app;
        } else {
            console.error(`Could not bootstrap app`);
            process.exit(1);
        }
        if (worker) {
            this.worker = worker;
        }
    }

    /**
     * Destroy the Vendure instance. Should be called in the `afterAll` function.
     */
    async destroy() {
        await this.app.close();
        if (this.worker) {
            await this.worker.close();
        }
    }

    private getDbFilePath() {
        const dbDataDir = '__data__';
        // tslint:disable-next-line:no-non-null-assertion
        const testFilePath = module!.parent!.filename;
        const dbFileName = path.basename(testFilePath) + '.sqlite';
        const dbFilePath = path.join(path.dirname(testFilePath), dbDataDir, dbFileName);
        return dbFilePath;
    }

    /**
     * Populates an .sqlite database file based on the PopulateOptions.
     */
    private async populateInitialData(
        testingConfig: VendureConfig,
        options: Omit<PopulateOptions, 'initialDataPath'>,
    ): Promise<void> {
        (testingConfig.dbConnectionOptions as Mutable<SqljsConnectionOptions>).autoSave = true;

        const [app, worker] = await populateForTesting(testingConfig, this.bootstrapForTesting, {
            logging: false,
            ...{
                ...options,
                initialDataPath: path.join(__dirname, 'fixtures/e2e-initial-data.ts'),
            },
        });
        await app.close();
        if (worker) {
            await worker.close();
        }

        (testingConfig.dbConnectionOptions as Mutable<SqljsConnectionOptions>).autoSave = false;
    }

    /**
     * Bootstraps an instance of the Vendure server for testing against.
     */
    private async bootstrapForTesting(userConfig: Partial<VendureConfig>): Promise<[INestApplication, INestMicroservice | undefined]> {
        const config = await preBootstrapConfig(userConfig);
        const appModule = await import('../src/app.module');
        try {
            const app = await NestFactory.create(appModule.AppModule, {cors: config.cors, logger: false});
            let worker: INestMicroservice | undefined;
            await runPluginOnBootstrapMethods(config, app);
            await app.listen(config.port);
            if (config.workerOptions.runInMainProcess) {
                const workerModule = await import('../src/worker/worker.module');
                worker = await NestFactory.createMicroservice(workerModule.WorkerModule, {
                    transport: config.workerOptions.transport,
                    logger: new Logger(),
                    options: config.workerOptions.options,
                });
                await worker.listenAsync();
            }
            return [app, worker];
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
}
