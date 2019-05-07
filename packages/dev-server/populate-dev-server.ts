// tslint:disable-next-line:no-reference
/// <reference path="../core/typings.d.ts" />
import { bootstrap, VendureConfig } from '@vendure/core';
import { populate } from '@vendure/core/cli/populate';
import path from 'path';

import { clearAllTables } from '../core/mock-data/clear-all-tables';
import { populateCustomers } from '../core/mock-data/populate-customers';

import { devConfig } from './dev-config';

// tslint:disable:no-console

/**
 * A CLI script which populates the dev database with deterministic random data.
 */
if (require.main === module) {
    // Running from command line
    const populateConfig: VendureConfig = {
        ...devConfig as any,
        authOptions: {
            tokenMethod: 'bearer',
            requireVerification: false,
        },
        importExportOptions: {
            importAssetsDir: path.join(__dirname, '../core/mock-data/assets'),
        },
        customFields: {},
    };
    clearAllTables(populateConfig.dbConnectionOptions, true)
        .then(() => populate(() => bootstrap(populateConfig),
            path.join(__dirname, '../create/assets/initial-data.json'),
            path.join(__dirname, '../create/assets/products.csv'),
        ))
        .then(async app => {
            console.log('populating customers...');
            await populateCustomers(10, populateConfig as any, true);
            return app.close();
        })
        .then(
            () => process.exit(0),
            err => {
                console.log(err);
                process.exit(1);
            },
        );
}
