import { omit } from '@vendure/common/lib/omit';
import { User } from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

describe('Import resolver', () => {
    const { server, adminClient } = createTestEnvironment({
        ...testConfig,
        customFields: {
            Product: [
                { type: 'string', name: 'pageType' },
                {
                    name: 'owner',
                    public: true,
                    nullable: true,
                    type: 'relation',
                    entity: User,
                    eager: true,
                },
                {
                    name: 'keywords',
                    public: true,
                    nullable: true,
                    type: 'string',
                    list: true,
                },
                {
                    name: 'localName',
                    type: 'localeString',
                },
            ],
            ProductVariant: [{ type: 'int', name: 'weight' }],
        },
    });

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-empty.csv'),
            customerCount: 0,
        });
        await adminClient.asSuperAdmin();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('imports products', async () => {
        // TODO: waste a few more hours actually fixing this for real
        // Forgive me this abomination of a work-around.
        // On the inital run (as in CI), when the sqlite db has just been populated,
        // this test will fail due to an "out of memory" exception originating from
        // SqljsQueryRunner.ts:79:22, which is part of the findOne() operation on the
        // Session repository called from the AuthService.validateSession() method.
        // After several hours of fruitless hunting, I did what any desperate JavaScript
        // developer would do, and threw in a setTimeout. Which of course "works"...
        const timeout = process.env.CI ? 2000 : 1000;
        await new Promise(resolve => {
            setTimeout(resolve, timeout);
        });

        const csvFile = path.join(__dirname, 'fixtures', 'product-import.csv');
        const result = await adminClient.fileUploadMutation({
            mutation: gql`
                mutation ImportProducts($csvFile: Upload!) {
                    importProducts(csvFile: $csvFile) {
                        imported
                        processed
                        errors
                    }
                }
            `,
            filePaths: [csvFile],
            mapVariables: () => ({ csvFile: null }),
        });

        expect(result.importProducts.errors).toEqual([
            'Invalid Record Length: header length is 19, got 1 on line 8',
        ]);
        expect(result.importProducts.imported).toBe(4);
        expect(result.importProducts.processed).toBe(4);

        const productResult = await adminClient.query(
            gql`
                query GetProducts($options: ProductListOptions) {
                    products(options: $options) {
                        totalItems
                        items {
                            id
                            name
                            slug
                            description
                            featuredAsset {
                                id
                                name
                                preview
                                source
                            }
                            assets {
                                id
                                name
                                preview
                                source
                            }
                            optionGroups {
                                id
                                code
                                name
                            }
                            facetValues {
                                id
                                name
                                facet {
                                    id
                                    name
                                }
                            }
                            customFields {
                                pageType
                                owner {
                                    id
                                }
                                keywords
                                localName
                            }
                            variants {
                                id
                                name
                                sku
                                price
                                taxCategory {
                                    id
                                    name
                                }
                                options {
                                    id
                                    code
                                }
                                assets {
                                    id
                                    name
                                    preview
                                    source
                                }
                                featuredAsset {
                                    id
                                    name
                                    preview
                                    source
                                }
                                facetValues {
                                    id
                                    code
                                    name
                                    facet {
                                        id
                                        name
                                    }
                                }
                                stockOnHand
                                trackInventory
                                stockMovements {
                                    items {
                                        ... on StockMovement {
                                            id
                                            type
                                            quantity
                                        }
                                    }
                                }
                                customFields {
                                    weight
                                }
                            }
                        }
                    }
                }
            `,
            {
                options: {},
            },
        );

        expect(productResult.products.totalItems).toBe(4);

        const paperStretcher = productResult.products.items.find(
            (p: any) => p.name === 'Perfect Paper Stretcher',
        );
        const easel = productResult.products.items.find((p: any) => p.name === 'Mabef M/02 Studio Easel');
        const pencils = productResult.products.items.find((p: any) => p.name === 'Giotto Mega Pencils');
        const smock = productResult.products.items.find((p: any) => p.name === 'Artists Smock');

        // Omit FacetValues & options due to variations in the ordering between different DB engines
        expect(omit(paperStretcher, ['facetValues', 'options'], true)).toMatchSnapshot();
        expect(omit(easel, ['facetValues', 'options'], true)).toMatchSnapshot();
        expect(omit(pencils, ['facetValues', 'options'], true)).toMatchSnapshot();
        expect(omit(smock, ['facetValues', 'options'], true)).toMatchSnapshot();

        const byName = (e: { name: string }) => e.name;
        const byCode = (e: { code: string }) => e.code;

        expect(paperStretcher.facetValues).toEqual([]);
        expect(easel.facetValues).toEqual([]);
        expect(pencils.facetValues).toEqual([]);
        expect(smock.facetValues.map(byName).sort()).toEqual(['Denim', 'clothes']);

        expect(paperStretcher.variants[0].facetValues.map(byName).sort()).toEqual(['Accessory', 'KB']);
        expect(paperStretcher.variants[1].facetValues.map(byName).sort()).toEqual(['Accessory', 'KB']);
        expect(paperStretcher.variants[2].facetValues.map(byName).sort()).toEqual(['Accessory', 'KB']);
        expect(paperStretcher.variants[0].options.map(byCode).sort()).toEqual(['half-imperial']);
        expect(paperStretcher.variants[1].options.map(byCode).sort()).toEqual(['quarter-imperial']);
        expect(paperStretcher.variants[2].options.map(byCode).sort()).toEqual(['full-imperial']);
        expect(easel.variants[0].facetValues.map(byName).sort()).toEqual(['Easel', 'Mabef']);
        expect(pencils.variants[0].facetValues.map(byName).sort()).toEqual(['Xmas Sale']);
        expect(pencils.variants[1].facetValues.map(byName).sort()).toEqual(['Xmas Sale']);
        expect(pencils.variants[0].options.map(byCode).sort()).toEqual(['box-of-8']);
        expect(pencils.variants[1].options.map(byCode).sort()).toEqual(['box-of-12']);
        expect(smock.variants[0].facetValues.map(byName).sort()).toEqual([]);
        expect(smock.variants[1].facetValues.map(byName).sort()).toEqual([]);
        expect(smock.variants[2].facetValues.map(byName).sort()).toEqual([]);
        expect(smock.variants[3].facetValues.map(byName).sort()).toEqual([]);
        expect(smock.variants[0].options.map(byCode).sort()).toEqual(['beige', 'small']);
        expect(smock.variants[1].options.map(byCode).sort()).toEqual(['beige', 'large']);
        expect(smock.variants[2].options.map(byCode).sort()).toEqual(['navy', 'small']);
        expect(smock.variants[3].options.map(byCode).sort()).toEqual(['large', 'navy']);

        // Import relation custom fields
        expect(paperStretcher.customFields.owner.id).toBe('T_1');
        expect(easel.customFields.owner.id).toBe('T_1');
        expect(pencils.customFields.owner.id).toBe('T_1');
        expect(smock.customFields.owner.id).toBe('T_1');

        // Import list custom fields
        expect(paperStretcher.customFields.keywords).toEqual(['paper', 'stretching', 'watercolor']);
        expect(easel.customFields.keywords).toEqual([]);
        expect(pencils.customFields.keywords).toEqual([]);
        expect(smock.customFields.keywords).toEqual(['apron', 'clothing']);

        // Import localeString custom fields
        expect(paperStretcher.customFields.localName).toEqual('localPPS');
        expect(easel.customFields.localName).toEqual('localMabef');
        expect(pencils.customFields.localName).toEqual('localGiotto');
        expect(smock.customFields.localName).toEqual('localSmock');
    }, 20000);
});
