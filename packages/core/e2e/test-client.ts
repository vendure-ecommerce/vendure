import { getDefaultChannelToken } from '../mock-data/get-default-channel-token';
import { SimpleGraphQLClient } from '../mock-data/simple-graphql-client';

import { testConfig } from './config/test-config';

// tslint:disable:no-console
/**
 * A GraphQL client for use in e2e tests configured to use the test admin server endpoint.
 */
export class TestAdminClient extends SimpleGraphQLClient {
    constructor() {
        super(`http://localhost:${testConfig.port}/${testConfig.adminApiPath}`);
    }

    async init() {
        const token = await getDefaultChannelToken(false);
        this.setChannelToken(token);
        await this.asSuperAdmin();
    }
}

/**
 * A GraphQL client for use in e2e tests configured to use the test shop server endpoint.
 */
export class TestShopClient extends SimpleGraphQLClient {
    constructor() {
        super(`http://localhost:${testConfig.port}/${testConfig.shopApiPath}`);
    }

    async init() {
        const token = await getDefaultChannelToken(false);
        this.setChannelToken(token);
    }
}
