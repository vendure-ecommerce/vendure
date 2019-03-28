import { ConnectionOptions, createConnection } from 'typeorm';

import { isTestEnvironment } from '../e2e/utils/test-environment';

// tslint:disable:no-console
// tslint:disable:no-floating-promises
/**
 * A Class used for generating mock data directly into the database via TypeORM.
 */
export async function clearAllTables(connectionOptions: ConnectionOptions, logging = true) {
    (connectionOptions as any).entities = [__dirname + '/../src/**/*.entity.ts'];
    const name = isTestEnvironment() ? undefined : 'clearAllTables';
    const connection = await createConnection({ ...connectionOptions, name });
    if (logging) {
        console.log('Clearing all tables...');
    }
    try {
        await connection.synchronize(true);
    } catch (err) {
        console.error('Error occurred when attempting to clear tables!');
        console.error(err);
    } finally {
        await connection.close();
    }
    if (logging) {
        console.log('Done!');
    }
}
