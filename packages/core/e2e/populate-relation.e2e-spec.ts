import { User } from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

describe('Populate custom field relation', () => {
    const { server, adminClient } = createTestEnvironment({
        ...testConfig,
        customFields: {
            Product: [
                {
                    name: 'owner',
                    public: true,
                    nullable: true,
                    type: 'relation',
                    entity: User,
                    eager: true,
                },
            ],
        },
    });

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-relation.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('check product relation', async () => {
        const productResult = await adminClient.query(
            gql`
                query GetProduct {
                    product(id: "T_1") {
                        id
                        name
                        customFields {
                            owner {
                                id
                                identifier
                            }
                        }
                    }
                }
            `,
            {
                options: {},
            },
        );

        expect(productResult.product.customFields.owner).toBeDefined();
        // Check if owner is User with ID:1 (superadmin)
        expect(productResult.product.customFields.owner.id).toBe('T_1');
        expect(productResult.product.customFields.owner.identifier).toBe('superadmin');
    }, 20000);
});
