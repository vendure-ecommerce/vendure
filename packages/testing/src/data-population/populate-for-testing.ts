/* tslint:disable:no-console */
import { INestApplication, INestMicroservice } from '@nestjs/common';
import { LanguageCode } from '@vendure/common/lib/generated-types';
import { InitialData, VendureConfig } from '@vendure/core';
import fs from 'fs-extra';

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

    await populateInitialData(app, options.initialData, logging);
    await populateProducts(app, options.productsCsvPath, logging);
    await populateCollections(app, options.initialData, logging);
    await populateCustomers(options.customerCount || 10, config, logging);

    config.authOptions.requireVerification = originalRequireVerification;
    return [app, worker];
}

async function populateInitialData(app: INestApplication, initialData: InitialData, logging: boolean) {
    const { Populator } = await import('@vendure/core');
    const populator = app.get(Populator);
    try {
        await populator.populateInitialData(initialData);
        if (logging) {
            console.log(`\nPopulated initial data`);
        }
    } catch (err) {
        console.error(err.message);
    }
}

async function populateCollections(app: INestApplication, initialData: InitialData, logging: boolean) {
    const { Populator } = await import('@vendure/core');
    if (!initialData.collections.length) {
        return;
    }
    const populator = app.get(Populator);
    try {
        await populator.populateCollections(initialData);
        if (logging) {
            console.log(`\nCreated ${initialData.collections.length} Collections`);
        }
    } catch (err) {
        console.error(err);
    }
}

async function populateProducts(app: INestApplication, productsCsvPath: string, logging: boolean) {
    const { Importer } = await import('@vendure/core');
    const importer = app.get(Importer);
    const productData = await fs.readFile(productsCsvPath, 'utf-8');

    const importResult = await importer.parseAndImport(productData, LanguageCode.en, false).toPromise();
    if (importResult.errors && importResult.errors.length) {
        console.log(`${importResult.errors.length} errors encountered when importing product data:`);
        await console.log(importResult.errors.join('\n'));
    }

    if (logging) {
        console.log(`\nImported ${importResult.imported} products`);
    }
}
