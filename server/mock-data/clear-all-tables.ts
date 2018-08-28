import { ConnectionOptions, createConnection } from 'typeorm';

// tslint:disable:no-console
// tslint:disable:no-floating-promises
/**
 * A Class used for generating mock data directly into the database via TypeORM.
 */
export async function clearAllTables(connectionOptions: ConnectionOptions, logging = true) {
    (connectionOptions as any).entities = [__dirname + '/../src/**/*.entity.ts'];
    const connection = await createConnection({ ...connectionOptions, name: 'clearAllTables' });
    if (logging) {
        console.log('Clearing all tables...');
    }
    await connection.synchronize(true);
    await connection.close();
    if (logging) {
        console.log('Done!');
    }
}
