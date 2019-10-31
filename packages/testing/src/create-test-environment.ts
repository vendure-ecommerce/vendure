import { VendureConfig } from '@vendure/core';

import { TestClient } from './test-client';
import { TestServer } from './test-server';

export interface TestEnvironment {
    server: TestServer;
    adminClient: TestClient;
    shopClient: TestClient;
}

export function createTestEnvironment(config: Required<VendureConfig>): TestEnvironment {
    const server = new TestServer(config);
    const adminClient = new TestClient(config, config.adminApiPath);
    const shopClient = new TestClient(config, config.shopApiPath);
    return {
        server,
        adminClient,
        shopClient,
    };
}
