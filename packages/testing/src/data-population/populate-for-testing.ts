/* tslint:disable:no-console */
import { INestApplication, INestMicroservice } from '@nestjs/common';
import { LanguageCode } from '@vendure/common/lib/generated-types';
import { VendureConfig } from '@vendure/core';
import { importProductsFromCsv, populateCollections, populateInitialData } from '@vendure/core/cli';

import { TestServerOptions } from '../types';

import { populateCustomers } from './populate-customers';

// tslint:disable:no-floating-promises
/**
 * Clears all tables from the database and populates with (deterministic) random data.
 */
export async function populateForTesting(
    config: Required<VendureConfig>,
    bootstrapFn: (config: VendureConfig) => Promise<[INestApplication, INestMicroservice | undefined]>,
    options: TestServerOptions,
): Promise<[INestApplication, INestMicroservice | undefined]> {
    (config.dbConnectionOptions as any).logging = false;
    const logging = options.logging === undefined ? true : options.logging;
    const originalRequireVerification = config.authOptions.requireVerification;
    config.authOptions.requireVerification = false;

    const [app, worker] = await bootstrapFn(config);

    const logFn = (message: string) => (logging ? console.log(message) : null);

    await populateInitialData(app, options.initialData, logFn);
    await populateProducts(app, options.productsCsvPath, logging);
    await populateCollections(app, options.initialData, logFn);
    await populateCustomers(options.customerCount || 10, config, logging);

    config.authOptions.requireVerification = originalRequireVerification;
    return [app, worker];
}

async function populateProducts(app: INestApplication, productsCsvPath: string, logging: boolean) {
    const importResult = await importProductsFromCsv(app, productsCsvPath, LanguageCode.en);
    if (importResult.errors && importResult.errors.length) {
        console.log(`${importResult.errors.length} errors encountered when importing product data:`);
        await console.log(importResult.errors.join('\n'));
    }

    if (logging) {
        console.log(`\nImported ${importResult.imported} products`);
    }
}
