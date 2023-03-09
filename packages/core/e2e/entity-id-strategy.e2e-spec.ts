/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import {
    IdTest1,
    IdTest2,
    IdTest3,
    IdTest4,
    IdTest5,
    IdTest6,
    IdTest7,
    IdTest8,
    LanguageCode,
} from './graphql/generated-e2e-admin-types';
import { sortById } from './utils/test-order-utils';

describe('EntityIdStrategy', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(testConfig());

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('encodes ids', async () => {
        const { products } = await shopClient.query<IdTest1.Query>(gql`
            query IdTest1 {
                products(options: { take: 5 }) {
                    items {
                        id
                    }
                }
            }
        `);
        expect(products.items.sort(sortById)).toEqual([
            { id: 'T_1' },
            { id: 'T_2' },
            { id: 'T_3' },
            { id: 'T_4' },
            { id: 'T_5' },
        ]);
    });

    it('Does not doubly-encode ids from resolved properties', async () => {
        const { products } = await shopClient.query<IdTest2.Query>(gql`
            query IdTest2 {
                products(options: { take: 1 }) {
                    items {
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
            }
        `);

        expect(products.items[0].id).toBe('T_1');
        expect(products.items[0].variants[0].id).toBe('T_1');
        expect(products.items[0].variants[0].options.map(o => o.id).sort()).toEqual(['T_1', 'T_3']);
    });

    it('decodes embedded argument', async () => {
        const { product } = await shopClient.query<IdTest3.Query>(gql`
            query IdTest3 {
                product(id: "T_1") {
                    id
                }
            }
        `);
        expect(product).toEqual({
            id: 'T_1',
        });
    });

    it('decodes embedded nested id', async () => {
        const { updateProduct } = await adminClient.query<IdTest4.Mutation>(gql`
            mutation IdTest4 {
                updateProduct(input: { id: "T_1", featuredAssetId: "T_3" }) {
                    id
                    featuredAsset {
                        id
                    }
                }
            }
        `);
        expect(updateProduct).toEqual({
            id: 'T_1',
            featuredAsset: {
                id: 'T_3',
            },
        });
    });

    it('decodes embedded nested object id', async () => {
        const { updateProduct } = await adminClient.query<IdTest5.Mutation>(gql`
            mutation IdTest5 {
                updateProduct(
                    input: { id: "T_1", translations: [{ id: "T_1", languageCode: en, name: "changed" }] }
                ) {
                    id
                    name
                }
            }
        `);
        expect(updateProduct).toEqual({
            id: 'T_1',
            name: 'changed',
        });
    });

    it('decodes argument as variable', async () => {
        const { product } = await shopClient.query<IdTest6.Query, IdTest6.Variables>(
            gql`
                query IdTest6($id: ID!) {
                    product(id: $id) {
                        id
                    }
                }
            `,
            { id: 'T_1' },
        );
        expect(product).toEqual({
            id: 'T_1',
        });
    });

    it('decodes nested id as variable', async () => {
        const { updateProduct } = await adminClient.query<IdTest7.Mutation, IdTest7.Variables>(
            gql`
                mutation IdTest7($input: UpdateProductInput!) {
                    updateProduct(input: $input) {
                        id
                        featuredAsset {
                            id
                        }
                    }
                }
            `,
            {
                input: {
                    id: 'T_1',
                    featuredAssetId: 'T_2',
                },
            },
        );
        expect(updateProduct).toEqual({
            id: 'T_1',
            featuredAsset: {
                id: 'T_2',
            },
        });
    });

    it('decodes nested object id as variable', async () => {
        const { updateProduct } = await adminClient.query<IdTest8.Mutation, IdTest8.Variables>(
            gql`
                mutation IdTest8($input: UpdateProductInput!) {
                    updateProduct(input: $input) {
                        id
                        name
                    }
                }
            `,
            {
                input: {
                    id: 'T_1',
                    translations: [{ id: 'T_1', languageCode: LanguageCode.en, name: 'changed again' }],
                },
            },
        );
        expect(updateProduct).toEqual({
            id: 'T_1',
            name: 'changed again',
        });
    });

    it('encodes ids in fragment', async () => {
        const { products } = await shopClient.query<IdTest1.Query>(gql`
            query IdTest9 {
                products(options: { take: 1 }) {
                    items {
                        ...ProdFragment
                    }
                }
            }
            fragment ProdFragment on Product {
                id
                featuredAsset {
                    id
                }
            }
        `);

        expect(products).toEqual({
            items: [
                {
                    id: 'T_1',
                    featuredAsset: {
                        id: 'T_2',
                    },
                },
            ],
        });
    });

    it('encodes ids in doubly-nested fragment', async () => {
        const { products } = await shopClient.query<IdTest1.Query>(gql`
            query IdTest10 {
                products(options: { take: 1 }) {
                    items {
                        ...ProdFragment1
                    }
                }
            }
            fragment ProdFragment1 on Product {
                ...ProdFragment2
            }
            fragment ProdFragment2 on Product {
                id
                featuredAsset {
                    id
                }
            }
        `);

        expect(products).toEqual({
            items: [
                {
                    id: 'T_1',
                    featuredAsset: {
                        id: 'T_2',
                    },
                },
            ],
        });
    });

    it('encodes ids in triply-nested fragment', async () => {
        const { products } = await shopClient.query<IdTest1.Query>(gql`
            query IdTest11 {
                products(options: { take: 1 }) {
                    items {
                        ...ProdFragment1_1
                    }
                }
            }
            fragment ProdFragment1_1 on Product {
                ...ProdFragment2_1
            }
            fragment ProdFragment2_1 on Product {
                ...ProdFragment3_1
            }
            fragment ProdFragment3_1 on Product {
                id
                featuredAsset {
                    id
                }
            }
        `);

        expect(products).toEqual({
            items: [
                {
                    id: 'T_1',
                    featuredAsset: {
                        id: 'T_2',
                    },
                },
            ],
        });
    });
});
