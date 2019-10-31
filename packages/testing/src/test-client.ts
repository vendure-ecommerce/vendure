import { VendureConfig } from '@vendure/core';

import { testConfig } from './config/test-config';
import { SimpleGraphQLClient } from './simple-graphql-client';
import { getDefaultChannelToken } from './utils/get-default-channel-token';

// tslint:disable:no-console
/**
 * A GraphQL client for use in e2e tests.
 */
export class TestClient extends SimpleGraphQLClient {
    constructor(config: Required<VendureConfig>, apiPath: string) {
        super(config, `http://localhost:${testConfig.port}/${apiPath}`);
    }

    async init() {
        const token = await getDefaultChannelToken(false);
        this.setChannelToken(token);
    }
}
