import { mergeConfig } from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import { ListQueryPlugin } from './fixtures/test-plugins/list-query-plugin';
import { GetCustomerListQuery, GetCustomerListQueryVariables } from './graphql/generated-e2e-admin-types';
import { GET_CUSTOMER_LIST } from './graphql/shared-definitions';

/**
 * Tests edge-cases related to configurations with an `entityPrefix` defined in the
 * dbConnectionOptions.
 */
describe('Entity prefix edge-cases', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(
        mergeConfig(testConfig(), {
            dbConnectionOptions: {
                entityPrefix: 'prefix_',
            },
            plugins: [ListQueryPlugin],
        }),
    );

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
            customerCount: 5,
        });
        await adminClient.asSuperAdmin();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    // https://github.com/vendure-ecommerce/vendure/issues/1569
    it('customers list filter by postalCode', async () => {
        const result = await adminClient.query<GetCustomerListQuery, GetCustomerListQueryVariables>(
            GET_CUSTOMER_LIST,
            {
                options: {
                    filter: {
                        postalCode: {
                            eq: 'NU9 0PW',
                        },
                    },
                },
            },
        );

        expect(result.customers.items.length).toBe(1);
        expect(result.customers.items[0].emailAddress).toBe('eliezer56@yahoo.com');
    });
});
