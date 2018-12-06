import { INestApplication } from '@nestjs/common';

import { Channel } from '../../shared/generated-types';
import { VendureBootstrapFunction } from '../src/bootstrap';
import { setConfig } from '../src/config/config-helpers';
import { VendureConfig } from '../src/config/vendure-config';

import { clearAllTables } from './clear-all-tables';
import { getDefaultChannelToken } from './get-default-channel-token';
import { MockDataService } from './mock-data.service';
import { SimpleGraphQLClient } from './simple-graphql-client';

export interface PopulateOptions {
    logging?: boolean;
    productCount: number;
    customerCount: number;
    channels?: string[];
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
    const defaultChannelToken = await getDefaultChannelToken(logging);
    const client = new SimpleGraphQLClient(`http://localhost:${config.port}/${config.apiPath}`);
    client.setChannelToken(defaultChannelToken);
    await client.asSuperAdmin();
    const mockDataService = new MockDataService(client, logging);
    if (options.channels) {
        await mockDataService.populateChannels(options.channels);
    }
    const zones = await mockDataService.populateCountries();
    await mockDataService.setChannelDefaultZones(zones);
    await mockDataService.populateShippingMethods();
    const assets = await mockDataService.populateAssets();
    const optionGroupId = await mockDataService.populateOptions();
    const taxCategories = await mockDataService.populateTaxCategories(zones);
    await mockDataService.populateProducts(options.productCount, optionGroupId, assets, taxCategories);
    await mockDataService.populateCustomers(options.customerCount);
    await mockDataService.populateFacets();

    config.authOptions.requireVerification = originalRequireVerification;
    return app;
}
