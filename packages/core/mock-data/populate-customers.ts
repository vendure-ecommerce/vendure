import { VendureConfig } from '../src/config/vendure-config';

import { MockDataService } from './mock-data.service';
import { SimpleGraphQLClient } from './simple-graphql-client';

/**
 * Creates customers with addresses by making API calls to the Admin API.
 */
export async function populateCustomers(count: number, config: VendureConfig, logging: boolean = false) {
    const client = new SimpleGraphQLClient(`http://localhost:${config.port}/${config.adminApiPath}`);
    await client.asSuperAdmin();
    const mockDataService = new MockDataService(client, logging);
    await mockDataService.populateCustomers(count);
}
