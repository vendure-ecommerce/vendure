/* tslint:disable:no-non-null-assertion */
import path from 'path';

import { UuidIdStrategy } from '../src/config/entity-id-strategy/uuid-id-strategy';
// This import is here to simulate the behaviour of
// the package end-user importing symbols from the
// @vendure/core barrel file. Doing so will then cause the
// recusrsive evaluation of all imported files. This tests
// the resilience of the id strategy implementation to the
// order of file evaluation.
import '../src/index';

import { TEST_SETUP_TIMEOUT_MS } from './config/test-config';
import { GetProductList } from './graphql/generated-e2e-admin-types';
import { GET_PRODUCT_LIST } from './graphql/shared-definitions';
import { TestAdminClient } from './test-client';
import { TestServer } from './test-server';

describe('UuidIdStrategy', () => {
    const adminClient = new TestAdminClient();
    const server = new TestServer();

    beforeAll(async () => {
        await server.init(
            {
                productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
                customerCount: 1,
            },
            {
                entityIdStrategy: new UuidIdStrategy(),
            },
        );
        await adminClient.init();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('uses uuids', async () => {
        const { products } = await adminClient.query<GetProductList.Query, GetProductList.Variables>(
            GET_PRODUCT_LIST,
            {
                options: {
                    take: 1,
                },
            },
        );

        expect(isV4Uuid(products.items[0].id)).toBe(true);
    });
});

/**
 * Returns true if the id string matches the format for a v4 UUID.
 */
function isV4Uuid(id: string): boolean {
    return /^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i.test(id);
}
