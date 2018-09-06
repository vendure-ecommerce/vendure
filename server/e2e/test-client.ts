import { getDefaultChannelToken } from '../mock-data/get-default-channel-token';
import { SimpleGraphQLClient } from '../mock-data/simple-graphql-client';

import { testConfig } from './config/test-config';

/**
 * A GraphQL client for use in e2e tests configured to use the test server endpoint.
 */
export class TestClient extends SimpleGraphQLClient {
    constructor() {
        super();
    }

    async init() {
        const testingConfig = testConfig;
        const token = await getDefaultChannelToken(testingConfig.dbConnectionOptions);
        super.apiUrl = `http://localhost:${testConfig.port}/${testConfig.apiPath}?token=${token}`;
    }
}
