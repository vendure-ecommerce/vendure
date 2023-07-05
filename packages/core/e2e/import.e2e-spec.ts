import { omit } from '@vendure/common/lib/omit';
import { User } from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import * as fs from 'fs';
import gql from 'graphql-tag';
import http from 'http';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

describe('Import resolver', () => {
    const { server, adminClient } = createTestEnvironment({
        ...testConfig(),
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
            ProductVariant: [
                { type: 'boolean', name: 'valid' },
                { type: 'int', name: 'weight' },
            ],
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
            'Invalid Record Length: header length is 20, got 1 on line 8',
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
                                    valid
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

        // Import non-list custom fields
        expect(smock.variants[0].customFields.valid).toEqual(true);
        expect(smock.variants[0].customFields.weight).toEqual(500);
        expect(smock.variants[1].customFields.valid).toEqual(false);
        expect(smock.variants[1].customFields.weight).toEqual(500);
        expect(smock.variants[2].customFields.valid).toEqual(null);
        expect(smock.variants[2].customFields.weight).toEqual(500);
        expect(smock.variants[3].customFields.valid).toEqual(true);
        expect(smock.variants[3].customFields.weight).toEqual(500);
        expect(smock.variants[4].customFields.valid).toEqual(false);
        expect(smock.variants[4].customFields.weight).toEqual(null);

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

    it('imports products with multiple languages', async () => {
        // TODO: see test above
        const timeout = process.env.CI ? 2000 : 1000;
        await new Promise(resolve => {
            setTimeout(resolve, timeout);
        });

        const csvFile = path.join(__dirname, 'fixtures', 'e2e-product-import-multi-languages.csv');
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

        expect(result.importProducts.errors).toEqual([]);
        expect(result.importProducts.imported).toBe(1);
        expect(result.importProducts.processed).toBe(1);

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
                                    name
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
            {
                languageCode: 'zh_Hans',
            },
        );

        expect(productResult.products.totalItems).toBe(5);

        const paperStretcher = productResult.products.items.find((p: any) => p.name === '奇妙的纸张拉伸器');

        // Omit FacetValues & options due to variations in the ordering between different DB engines
        expect(omit(paperStretcher, ['facetValues', 'options'], true)).toMatchSnapshot();

        const byName = (e: { name: string }) => e.name;

        expect(paperStretcher.facetValues.map(byName).sort()).toEqual(['KB', '饰品']);

        expect(paperStretcher.variants[0].options.map(byName).sort()).toEqual(['半英制']);
        expect(paperStretcher.variants[1].options.map(byName).sort()).toEqual(['四分之一英制']);
        expect(paperStretcher.variants[2].options.map(byName).sort()).toEqual(['全英制']);

        // Import list custom fields
        expect(paperStretcher.customFields.keywords).toEqual(['paper, stretch']);

        // Import localeString custom fields
        expect(paperStretcher.customFields.localName).toEqual('纸张拉伸器');
    }, 20000);

    describe('asset urls', () => {
        let staticServer: http.Server;

        beforeAll(() => {
            // Set up minimal static file server
            staticServer = http
                .createServer((req, res) => {
                    const filePath = path.join(__dirname, 'fixtures/assets', req?.url ?? '');
                    fs.readFile(filePath, (err, data) => {
                        if (err) {
                            res.writeHead(404);
                            res.end(JSON.stringify(err));
                            return;
                        }
                        res.writeHead(200);
                        res.end(data);
                    });
                })
                .listen(3456);
        });

        afterAll(() => {
            if (staticServer) {
                return new Promise<void>((resolve, reject) => {
                    staticServer.close(err => {
                        if (err) {
                            reject(err);
                        } else {
                            resolve();
                        }
                    });
                });
            }
        });

        it('imports assets with url paths', async () => {
            const timeout = process.env.CI ? 2000 : 1000;
            await new Promise(resolve => {
                setTimeout(resolve, timeout);
            });

            const csvFile = path.join(__dirname, 'fixtures', 'e2e-product-import-asset-urls.csv');
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

            expect(result.importProducts.errors).toEqual([]);
            expect(result.importProducts.imported).toBe(1);
            expect(result.importProducts.processed).toBe(1);

            const productResult = await adminClient.query(
                gql`
                    query GetProducts($options: ProductListOptions) {
                        products(options: $options) {
                            totalItems
                            items {
                                id
                                name
                                featuredAsset {
                                    id
                                    name
                                    preview
                                }
                            }
                        }
                    }
                `,
                {
                    options: {
                        filter: {
                            name: { contains: 'guitar' },
                        },
                    },
                },
            );

            expect(productResult.products.items.length).toBe(1);
            expect(productResult.products.items[0].featuredAsset.preview).toBe(
                'test-url/test-assets/guitar__preview.jpg',
            );
        });
    });
});
