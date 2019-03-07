/* tslint:disable:no-console */
import { INestApplication } from '@nestjs/common';
import fs from 'fs-extra';
import path from 'path';

import { LanguageCode } from '../../shared/generated-types';
import { VendureBootstrapFunction } from '../src/bootstrap';
import { setConfig } from '../src/config/config-helpers';
import { VendureConfig } from '../src/config/vendure-config';

import { clearAllTables } from './clear-all-tables';
import { getDefaultChannelToken } from './get-default-channel-token';
import { MockDataService } from './mock-data.service';
import { SimpleGraphQLClient } from './simple-graphql-client';

export interface PopulateOptions {
    logging?: boolean;
    customerCount: number;
    productsCsvPath: string;
    initialDataPath: string;
}

// tslint:disable:no-floating-promises
/**
 * Clears all tables from the database and populates with (deterministic) random data.
 */
export async function populate(
    config: VendureConfig,
    bootstrapFn: VendureBootstrapFunction,
    options: PopulateOptions,
): Promise<INestApplication> {
    (config.dbConnectionOptions as any).logging = false;
    const logging = options.logging === undefined ? true : options.logging;
    const originalRequireVerification = config.authOptions.requireVerification;
    config.authOptions.requireVerification = false;

    setConfig(config);
    await clearAllTables(config.dbConnectionOptions, logging);
    const app = await bootstrapFn(config);

    await populateInitialData(app, options.initialDataPath, logging);
    await populateProducts(app, options.productsCsvPath, logging);
    await populateCollections(app, options.initialDataPath, logging);

    const defaultChannelToken = await getDefaultChannelToken(logging);
    const client = new SimpleGraphQLClient(`http://localhost:${config.port}/${config.adminApiPath}`);
    client.setChannelToken(defaultChannelToken);
    await client.asSuperAdmin();
    const mockDataService = new MockDataService(client, logging);
    await mockDataService.populateCustomers(options.customerCount);

    config.authOptions.requireVerification = originalRequireVerification;
    return app;
}

async function populateInitialData(app: INestApplication, initialDataPath: string, logging: boolean) {
    const { Populator } = await import('../src/data-import/providers/populator/populator');
    const { initialData } = await import(initialDataPath);
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

async function populateCollections(app: INestApplication, initialDataPath: string, logging: boolean) {
    const { Populator } = await import('../src/data-import/providers/populator/populator');
    const { initialData } = await import(initialDataPath);
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
        console.error(err.message);
    }
}

async function populateProducts(app: INestApplication, productsCsvPath: string, logging: boolean) {
    const { Importer } = await import('../src/data-import/providers/importer/importer');
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
