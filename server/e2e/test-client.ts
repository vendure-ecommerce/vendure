import { getDefaultChannelToken } from '../mock-data/get-default-channel-token';
import { SimpleGraphQLClient } from '../mock-data/simple-graphql-client';

import { testConfig } from './config/test-config';

// tslint:disable:no-console
/**
 * A GraphQL client for use in e2e tests configured to use the test server endpoint.
 */
export class TestClient extends SimpleGraphQLClient {
    constructor() {
        super(`http://localhost:${testConfig.port}/${testConfig.apiPath}`);
    }

    async init() {
        const token = await getDefaultChannelToken(false);
        this.setChannelToken(token);
        await this.asSuperAdmin();
    }
}
