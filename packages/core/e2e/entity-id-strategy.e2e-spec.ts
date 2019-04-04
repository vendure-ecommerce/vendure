import { CreateFacet, LanguageCode } from '@vendure/common/lib/generated-types';
import gql from 'graphql-tag';
import path from 'path';

import { CREATE_FACET } from '../../../admin-ui/src/app/data/definitions/facet-definitions';

import { TEST_SETUP_TIMEOUT_MS } from './config/test-config';
import { TestShopClient } from './test-client';
import { TestServer } from './test-server';

describe('EntityIdStrategy', () => {
    const shopClient = new TestShopClient();
    const server = new TestServer();

    beforeAll(async () => {
        await server.init({
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
            customerCount: 1,
        });
        await shopClient.init();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('Does not doubly-encode ids from resolved properties', async () => {
        const result = await shopClient.query(gql`
            query {
                product(id: "T_1", languageCode: en) {
                    id
                    variants {
                        id
                        options {
                            id
                            name
                        }
                    }
                }
            }
        `);

        expect(result.product.id).toBe('T_1');
        expect(result.product.variants[0].id).toBe('T_1');
        expect(result.product.variants[0].options[0].id).toBe('T_1');
    });
});
