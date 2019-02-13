import path from 'path';

import { devConfig } from '../dev-config';
import { bootstrap } from '../src';
import { VendureConfig } from '../src/config/vendure-config';

import { populate } from './populate';

/**
 * A CLI script which populates the dev database with deterministic random data.
 */
if (require.main === module) {
    // Running from command line
    const populateConfig: VendureConfig = {
        ...devConfig,
        authOptions: {
            tokenMethod: 'bearer',
        },
        importExportOptions: {
            importAssetsDir: path.join(__dirname, 'assets'),
        },
        customFields: {},
    };
    // tslint:disable
    populate(populateConfig, bootstrap, {
        logging: true,
        customerCount: 10,
        productsCsvPath: path.join(__dirname, 'data-sources/products.csv'),
        initialDataPath: path.join(__dirname, 'data-sources/initial-data'),
    })
        .then(app => app.close())
        .then(
            () => process.exit(0),
            err => {
                console.log(err);
                process.exit(1);
            },
        );
}
