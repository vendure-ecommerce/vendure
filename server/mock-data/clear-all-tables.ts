import { ConnectionOptions, createConnection } from 'typeorm';

// tslint:disable:no-console
// tslint:disable:no-floating-promises
/**
 * A Class used for generating mock data directly into the database via TypeORM.
 */
export async function clearAllTables(connectionOptions: ConnectionOptions) {
    (connectionOptions as any).entities = [__dirname + '/../src/**/*.entity.ts'];
    const connection = await createConnection({ ...connectionOptions, name: 'clearAllTables' });
    console.log('Clearing all tables...');
    await connection.synchronize(true);
    await connection.close();
    console.log('Done!');
}
