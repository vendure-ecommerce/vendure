import { INestApplication, INestMicroservice } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { DefaultLogger, Logger, VendureConfig } from '@vendure/core';
import { preBootstrapConfig } from '@vendure/core/dist/bootstrap';
import fs from 'fs';
import path from 'path';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { PostgresConnectionOptions } from 'typeorm/driver/postgres/PostgresConnectionOptions';
import { SqljsConnectionOptions } from 'typeorm/driver/sqljs/SqljsConnectionOptions';

import { populateForTesting } from './data-population/populate-for-testing';
import { Mutable, TestServerOptions } from './types';

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
        switch (type) {
            case 'sqljs':
                await this.initSqljs(options);
                break;
            case 'mysql':
                await this.initMysql(dbConnectionOptions as MysqlConnectionOptions, options);
                break;
            case 'postgres':
                await this.initPostgres(dbConnectionOptions as PostgresConnectionOptions, options);
                break;
            default:
                throw new Error(`The TestServer does not support the database type "${type}"`);
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

    private async initSqljs(options: TestServerOptions) {
        const dbFilePath = this.getDbFilePath(options.dataDir);
        (this.vendureConfig.dbConnectionOptions as Mutable<SqljsConnectionOptions>).location = dbFilePath;
        if (!fs.existsSync(dbFilePath)) {
            if (options.logging) {
                console.log(`Test data not found. Populating database and caching...`);
            }
            await this.populateInitialData(this.vendureConfig, options);
        }
        if (options.logging) {
            console.log(`Loading test data from "${dbFilePath}"`);
        }
    }

    private async initMysql(connectionOptions: MysqlConnectionOptions, options: TestServerOptions) {
        const filename = this.getCallerFilename(2);
        const dbName = this.getDbNameFromFilename(filename);
        const conn = await this.getMysqlConnection(connectionOptions);
        (connectionOptions as any).database = dbName;
        (connectionOptions as any).synchronize = true;
        await new Promise((resolve, reject) => {
            conn.query(`DROP DATABASE IF EXISTS ${dbName}`, err => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve();
            });
        });
        await new Promise((resolve, reject) => {
            conn.query(`CREATE DATABASE IF NOT EXISTS ${dbName}`, err => {
                if (err) {
                    console.log(err);
                    reject(err);
                    return;
                }
                resolve();
            });
        });
        await this.populateInitialData(this.vendureConfig, options);
        conn.destroy();
    }

    private async initPostgres(connectionOptions: PostgresConnectionOptions, options: TestServerOptions) {
        const filename = this.getCallerFilename(2);
        const dbName = this.getDbNameFromFilename(filename);
        (connectionOptions as any).database = dbName;
        (connectionOptions as any).synchronize = true;
        const client = await this.getPostgresConnection(connectionOptions);
        await client.query(`DROP DATABASE IF EXISTS ${dbName}`);
        await client.query(`CREATE DATABASE ${dbName}`);
        await this.populateInitialData(this.vendureConfig, options);
        await client.end();
    }

    private async getMysqlConnection(
        connectionOptions: MysqlConnectionOptions,
    ): Promise<import('mysql').Connection> {
        const { createConnection } = await import('mysql');
        const conn = createConnection({
            host: connectionOptions.host,
            port: connectionOptions.port,
            user: connectionOptions.username,
            password: connectionOptions.password,
        });
        await new Promise((resolve, reject) => {
            conn.connect(err => {
                if (err) {
                    reject(err);
                    return;
                }
                resolve();
            });
        });
        return conn;
    }

    private async getPostgresConnection(
        connectionOptions: PostgresConnectionOptions,
    ): Promise<import('pg').Client> {
        const { Client } = require('pg');
        const client = new Client({
            host: connectionOptions.host,
            port: connectionOptions.port,
            user: connectionOptions.username,
            password: connectionOptions.password,
            database: 'postgres',
        });
        await client.connect();
        return client;
    }

    private getDbFilePath(dataDir: string) {
        // tslint:disable-next-line:no-non-null-assertion
        const testFilePath = this.getCallerFilename(3);
        const dbFileName = path.basename(testFilePath) + '.sqlite';
        const dbFilePath = path.join(dataDir, dbFileName);
        return dbFilePath;
    }

    private getDbNameFromFilename(filename: string): string {
        return 'e2e_' + path.basename(filename).replace(/[^a-z0-9_]/gi, '_');
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
        const isSqljs = testingConfig.dbConnectionOptions.type === 'sqljs';
        if (isSqljs) {
            (testingConfig.dbConnectionOptions as Mutable<SqljsConnectionOptions>).autoSave = true;
            (testingConfig.dbConnectionOptions as Mutable<SqljsConnectionOptions>).synchronize = true;
        }

        const [app, worker] = await populateForTesting(testingConfig, this.bootstrapForTesting, {
            logging: false,
            ...options,
        });
        if (worker) {
            await worker.close();
        }
        await app.close();

        if (isSqljs) {
            (testingConfig.dbConnectionOptions as Mutable<SqljsConnectionOptions>).autoSave = false;
        }
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
            const app = await NestFactory.create(appModule.AppModule, { cors: config.cors, logger: false });
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
