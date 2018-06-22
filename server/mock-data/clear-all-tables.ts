import { ConnectionOptions, createConnection } from 'typeorm';

// tslint:disable:no-console
/**
 * A Class used for generating mock data directly into the database via TypeORM.
 */
export async function clearAllTables(connectionOptions: ConnectionOptions) {
    (connectionOptions as any).entities = [__dirname + '/../src/**/*.entity.ts'];
    const connection = await createConnection(connectionOptions);
    await connection.synchronize(true);
    console.log('Cleared all tables');
}
