import { INestApplication, INestMicroservice } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DefaultLogger, Logger, VendureConfig } from '@vendure/core';
import { preBootstrapConfig } from '@vendure/core/dist/bootstrap';

import { populateForTesting } from './data-population/populate-for-testing';
import { getInitializerFor } from './initializers/initializers';
import { TestServerOptions } from './types';

// tslint:disable:no-console
/**
 * @description
 * A real Vendure server against which the e2e tests should be run.
 *
 * @docsCategory testing
 */
export class TestServer {
    private app: INestApplication;
    private worker?: INestMicroservice;

    constructor(private vendureConfig: Required<VendureConfig>) {}

    /**
     * @description
     * Bootstraps an instance of Vendure server and populates the database according to the options
     * passed in. Should be called in the `beforeAll` function.
     *
     * The populated data is saved into an .sqlite file for each test file. On subsequent runs, this file
     * is loaded so that the populate step can be skipped, which speeds up the tests significantly.
     */
    async init(options: TestServerOptions): Promise<void> {
        const { type } = this.vendureConfig.dbConnectionOptions;
        const { dbConnectionOptions } = this.vendureConfig;
        const testFilename = this.getCallerFilename(1);
        const initializer = getInitializerFor(type);
        try {
            await initializer.init(testFilename, dbConnectionOptions);
            const populateFn = () => this.populateInitialData(this.vendureConfig, options);
            await initializer.populate(populateFn);
            await initializer.destroy();
        } catch (e) {
            console.error(e);
            process.exit(1);
        }

        const [app, worker] = await this.bootstrapForTesting(this.vendureConfig);
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
     * @description
     * Destroy the Vendure server instance and clean up all resources.
     * Should be called after all tests have run, e.g. in an `afterAll` function.
     */
    async destroy() {
        // allow a grace period of any outstanding async tasks to complete
        await new Promise(resolve => global.setTimeout(resolve, 500));
        await this.app.close();
        if (this.worker) {
            await this.worker.close();
        }
    }

    private getCallerFilename(depth: number): string {
        let pst: ErrorConstructor['prepareStackTrace'];
        let stack: any;
        let file: any;
        let frame: any;

        pst = Error.prepareStackTrace;
        Error.prepareStackTrace = (_, _stack) => {
            Error.prepareStackTrace = pst;
            return _stack;
        };

        stack = new Error().stack;
        stack = stack.slice(depth + 1);

        do {
            frame = stack.shift();
            file = frame && frame.getFileName();
        } while (stack.length && file === 'module.js');

        return file;
    }

    /**
     * Populates an .sqlite database file based on the PopulateOptions.
     */
    private async populateInitialData(
        testingConfig: Required<VendureConfig>,
        options: TestServerOptions,
    ): Promise<void> {
        const [app, worker] = await populateForTesting(testingConfig, this.bootstrapForTesting, {
            logging: false,
            ...options,
        });
        if (worker) {
            await worker.close();
        }
        await app.close();
    }

    /**
     * Bootstraps an instance of the Vendure server for testing against.
     */
    private async bootstrapForTesting(
        userConfig: Partial<VendureConfig>,
    ): Promise<[INestApplication, INestMicroservice | undefined]> {
        const config = await preBootstrapConfig(userConfig);
        Logger.useLogger(config.logger);
        const appModule = await import('@vendure/core/dist/app.module');
        try {
            DefaultLogger.hideNestBoostrapLogs();
            const app = await NestFactory.create(appModule.AppModule, {
                cors: config.cors,
                logger: new Logger(),
            });
            let worker: INestMicroservice | undefined;
            await app.listen(config.port);
            if (config.workerOptions.runInMainProcess) {
                const workerModule = await import('@vendure/core/dist/worker/worker.module');
                worker = await NestFactory.createMicroservice(workerModule.WorkerModule, {
                    transport: config.workerOptions.transport,
                    logger: new Logger(),
                    options: config.workerOptions.options,
                });
                await worker.listenAsync();
            }
            DefaultLogger.restoreOriginalLogLevel();
            return [app, worker];
        } catch (e) {
            console.log(e);
            throw e;
        }
    }
}
