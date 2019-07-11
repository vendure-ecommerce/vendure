import { createConnection } from 'typeorm';

import { isTestEnvironment } from '../e2e/utils/test-environment';
import { registerCustomEntityFields } from '../src/entity/register-custom-entity-fields';

// tslint:disable:no-console
// tslint:disable:no-floating-promises
/**
 * Clears all tables in the detabase sepcified by the connectionOptions
 */
export async function clearAllTables(config: any, logging = true) {
    (config.dbConnectionOptions as any).entities = [__dirname + '/../src/**/*.entity.ts'];
    const name = isTestEnvironment() ? undefined : 'clearAllTables';
    registerCustomEntityFields(config);
    const connection = await createConnection({ ...config.dbConnectionOptions, name });
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
