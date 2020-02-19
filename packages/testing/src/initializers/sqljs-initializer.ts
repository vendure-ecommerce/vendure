import fs from 'fs';
import path from 'path';
import { SqljsConnectionOptions } from 'typeorm/driver/sqljs/SqljsConnectionOptions';

import { Mutable } from '../types';

import { TestDbInitializer } from './test-db-initializer';

export class SqljsInitializer implements TestDbInitializer<SqljsConnectionOptions> {
    private dbFilePath: string;
    private connectionOptions: SqljsConnectionOptions;
    constructor(private dataDir: string) {}

    async init(
        testFileName: string,
        connectionOptions: SqljsConnectionOptions,
    ): Promise<SqljsConnectionOptions> {
        this.dbFilePath = this.getDbFilePath(testFileName);
        this.connectionOptions = connectionOptions;
        (connectionOptions as Mutable<SqljsConnectionOptions>).location = this.dbFilePath;
        return connectionOptions;
    }

    async populate(populateFn: () => Promise<void>): Promise<void> {
        if (!fs.existsSync(this.dbFilePath)) {
            const dirName = path.dirname(this.dbFilePath);
            if (!fs.existsSync(dirName)) {
                fs.mkdirSync(dirName);
            }
            (this.connectionOptions as Mutable<SqljsConnectionOptions>).autoSave = true;
            (this.connectionOptions as Mutable<SqljsConnectionOptions>).synchronize = true;
            await populateFn();
            (this.connectionOptions as Mutable<SqljsConnectionOptions>).autoSave = false;
            (this.connectionOptions as Mutable<SqljsConnectionOptions>).synchronize = false;
        }
    }

    destroy(): void | Promise<void> {
        return undefined;
    }

    private getDbFilePath(testFileName: string) {
        // tslint:disable-next-line:no-non-null-assertion
        const dbFileName = path.basename(testFileName) + '.sqlite';
        const dbFilePath = path.join(this.dataDir, dbFileName);
        return dbFilePath;
    }
}
