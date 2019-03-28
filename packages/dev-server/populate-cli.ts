import path from 'path';

import { populate } from '../core/mock-data/populate';
import { bootstrap, VendureConfig } from '../core/src';

import { devConfig } from './dev-config';

/**
 * A CLI script which populates the dev database with deterministic random data.
 */
if (require.main === module) {
    console.log('yolo');
    // Running from command line
    const populateConfig: VendureConfig = {
        ...devConfig as any,
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
        productsCsvPath: path.join(__dirname, '../core/mock-data/data-sources/products.csv'),
        initialDataPath: path.join(__dirname, '../core/mock-data/data-sources/initial-data'),
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
