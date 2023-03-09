import path from 'path';
import { DataSourceOptions } from 'typeorm';
import { MysqlConnectionOptions } from 'typeorm/driver/mysql/MysqlConnectionOptions';
import { promisify } from 'util';

import { TestDbInitializer } from './test-db-initializer';

export class MysqlInitializer implements TestDbInitializer<MysqlConnectionOptions> {
    private conn: import('mysql').Connection;

    async init(
        testFileName: string,
        connectionOptions: MysqlConnectionOptions,
    ): Promise<MysqlConnectionOptions> {
        const dbName = this.getDbNameFromFilename(testFileName);
        this.conn = await this.getMysqlConnection(connectionOptions);
        (connectionOptions as any).database = dbName;
        (connectionOptions as any).synchronize = true;
        const query = promisify(this.conn.query).bind(this.conn);
        await query(`DROP DATABASE IF EXISTS ${dbName}`);
        await query(`CREATE DATABASE IF NOT EXISTS ${dbName}`);
        return connectionOptions;
    }

    async populate(populateFn: () => Promise<void>): Promise<void> {
        await populateFn();
    }

    async destroy() {
        // eslint-disable-next-line @typescript-eslint/unbound-method
        await promisify(this.conn.end).bind(this.conn)();
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
        // eslint-disable-next-line @typescript-eslint/unbound-method
        const connect = promisify(conn.connect).bind(conn);
        await connect();
        return conn;
    }

    private getDbNameFromFilename(filename: string): string {
        return 'e2e_' + path.basename(filename).replace(/[^a-z0-9_]/gi, '_');
    }
}
