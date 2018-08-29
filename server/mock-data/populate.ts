import { INestApplication } from '@nestjs/common';

import { VendureBootstrapFunction } from '../src/bootstrap';
import { setConfig, VendureConfig } from '../src/config/vendure-config';

import { clearAllTables } from './clear-all-tables';
import { MockDataService } from './mock-data.service';
import { SimpleGraphQLClient } from './simple-graphql-client';

export interface PopulateOptions {
    logging?: boolean;
    productCount: number;
    customerCount: number;
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
    setConfig(config);
    await clearAllTables(config.dbConnectionOptions, logging);
    const app = await bootstrapFn(config);
    const client = new SimpleGraphQLClient(`http://localhost:${config.port}/${config.apiPath}`);
    const mockDataClientService = new MockDataService(client, logging);
    await mockDataClientService.populateOptions();
    await mockDataClientService.populateProducts(options.productCount);
    await mockDataClientService.populateCustomers(options.customerCount);
    await mockDataClientService.populateFacets();
    await mockDataClientService.populateAdmins();
    return app;
}
