import { VendureConfig } from '@vendure/core';

import { SimpleGraphQLClient } from '../simple-graphql-client';

import { MockDataService } from './mock-data.service';

/**
 * Creates customers with addresses by making API calls to the Admin API.
 */
export async function populateCustomers(
    count: number,
    config: Required<VendureConfig>,
    logging: boolean = false,
    simpleGraphQLClient = new SimpleGraphQLClient(
        config,
        `http://localhost:${config.apiOptions.port}/${config.apiOptions.adminApiPath}`,
    ),
) {
    const client = simpleGraphQLClient;
    await client.asSuperAdmin();
    const mockDataService = new MockDataService(client, logging);
    await mockDataService.populateCustomers(count);
}
