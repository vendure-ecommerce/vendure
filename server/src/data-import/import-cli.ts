import * as path from 'path';

import { devConfig } from '../../dev-config';
import { SimpleGraphQLClient } from '../../mock-data/simple-graphql-client';
import { bootstrap } from '../bootstrap';
import { setConfig, VendureConfig } from '../config/vendure-config';

// tslint:disable:no-console
/**
 * A CLI script which imports products from a CSV file.
 */
if (require.main === module) {
    // Running from command line
    const csvFile = process.argv[2];
    const csvPath = path.join(__dirname, csvFile);
    getClient()
        .then(client => importProducts(client, csvPath))
        .then(
            () => process.exit(0),
            err => {
                console.log(err);
                process.exit(1);
            },
        );
}

async function getClient() {
    const config: VendureConfig = {
        ...devConfig,
        port: 3020,
        authOptions: {
            tokenMethod: 'bearer',
        },
        plugins: [],
    };
    (config.dbConnectionOptions as any).logging = false;
    setConfig(config);
    const app = await bootstrap(config);
    const client = new SimpleGraphQLClient(`http://localhost:${config.port}/${config.apiPath}`);
    client.setChannelToken(devConfig.defaultChannelToken || 'no-default-channel-token');
    await client.asSuperAdmin();
    return client;
}

async function importProducts(client: SimpleGraphQLClient, csvFile: string) {
    console.log(`loading data from "${csvFile}"`);
    const result = await client.importProducts(csvFile);
    console.log(result);
}
