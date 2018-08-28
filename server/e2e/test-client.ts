import { SimpleGraphQLClient } from '../mock-data/simple-graphql-client';

import { testConfig } from './config/test-config';

/**
 * A GraphQL client for use in e2e tests configured to use the test server endpoint.
 */
export class TestClient extends SimpleGraphQLClient {
    constructor() {
        super(`http://localhost:${testConfig.port}/${testConfig.apiPath}`);
    }
}
