import { VendureConfig } from '@vendure/core';

import { SimpleGraphQLClient } from './simple-graphql-client';
import { TestServer } from './test-server';

export interface TestEnvironment {
    server: TestServer;
    /**
     * @description
     * A GraphQL client configured for the Admin API.
     */
    adminClient: SimpleGraphQLClient;
    /**
     * @description
     * A GraphQL client configured for the Shop API.
     */
    shopClient: SimpleGraphQLClient;
}

export function createTestEnvironment(config: Required<VendureConfig>): TestEnvironment {
    const server = new TestServer(config);
    const adminClient = new SimpleGraphQLClient(
        config,
        `http://localhost:${config.port}/${config.adminApiPath}`,
    );
    const shopClient = new SimpleGraphQLClient(
        config,
        `http://localhost:${config.port}/${config.shopApiPath}`,
    );
    return {
        server,
        adminClient,
        shopClient,
    };
}
