import { INestApplication } from '@nestjs/common';

import { VendureBootstrapFunction } from '../src/bootstrap';
import { setConfig, VendureConfig } from '../src/config/vendure-config';
import { Channel } from '../src/entity/channel/channel.entity';

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
    setConfig(config);
    await clearAllTables(config.dbConnectionOptions, logging);
    const app = await bootstrapFn(config);
    const defaultChannelToken = await getDefaultChannelToken(logging);
    const client = new SimpleGraphQLClient(`http://localhost:${config.port}/${config.apiPath}`);
    client.setChannelToken(defaultChannelToken);
    await client.asSuperAdmin();
    const mockDataService = new MockDataService(client, logging);
    let channels: Channel[] = [];
    if (options.channels) {
        channels = await mockDataService.populateChannels(options.channels);
    }
    await mockDataService.populateOptions();
    await mockDataService.populateProducts(options.productCount);
    await mockDataService.populateCustomers(options.customerCount);
    await mockDataService.populateFacets();
    return app;
}
