import gql from 'graphql-tag';
import path from 'path';

import { ProductVariant, StockMovementType, UpdateProductVariantInput } from '../../common/src/generated-types';

import { TEST_SETUP_TIMEOUT_MS } from './config/test-config';
import { TestAdminClient, TestShopClient } from './test-client';
import { TestServer } from './test-server';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';

jest.setTimeout(2137 * 1000);

describe('Stock control', () => {
    const adminClient = new TestAdminClient();
    const shopClient = new TestShopClient();
    const server = new TestServer();

    beforeAll(async () => {
        const token = await server.init(
            {
                productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
                customerCount: 2,
            },
        );
        await shopClient.init();
        await adminClient.init();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    describe('stock adjustments', () => {

        let variants: ProductVariant[];

        it('stockMovements are initially empty', async () => {
            const result = await adminClient.query(GET_STOCK_MOVEMENT, { id: 'T_1' });

            variants = result.product.variants;
            for (const variant of variants) {
                expect(variant.stockMovements.items).toEqual([]);
                expect(variant.stockMovements.totalItems).toEqual(0);
            }
        });

        it('updating ProductVariant with same stockOnHand does not create a StockMovement', async () => {
            const result = await adminClient.query(UPDATE_STOCK_ON_HAND, {
                input: [
                    {
                        id: variants[0].id,
                        stockOnHand: variants[0].stockOnHand,
                    },
                ] as UpdateProductVariantInput[],
            });

            expect(result.updateProductVariants[0].stockMovements.items).toEqual([]);
            expect(result.updateProductVariants[0].stockMovements.totalItems).toEqual(0);
        });

        it('increasing stockOnHand creates a StockMovement with correct quantity', async () => {
            const result = await adminClient.query(UPDATE_STOCK_ON_HAND, {
                input: [
                    {
                        id: variants[0].id,
                        stockOnHand: variants[0].stockOnHand + 5,
                    },
                ] as UpdateProductVariantInput[],
            });

            expect(result.updateProductVariants[0].stockOnHand).toBe(5);
            expect(result.updateProductVariants[0].stockMovements.totalItems).toEqual(1);
            expect(result.updateProductVariants[0].stockMovements.items[0].type).toBe(StockMovementType.ADJUSTMENT);
            expect(result.updateProductVariants[0].stockMovements.items[0].quantity).toBe(5);
        });

        it('decreasing stockOnHand creates a StockMovement with correct quantity', async () => {
            const result = await adminClient.query(UPDATE_STOCK_ON_HAND, {
                input: [
                    {
                        id: variants[0].id,
                        stockOnHand: variants[0].stockOnHand + 5 - 2,
                    },
                ] as UpdateProductVariantInput[],
            });

            expect(result.updateProductVariants[0].stockOnHand).toBe(3);
            expect(result.updateProductVariants[0].stockMovements.totalItems).toEqual(2);
            expect(result.updateProductVariants[0].stockMovements.items[1].type).toBe(StockMovementType.ADJUSTMENT);
            expect(result.updateProductVariants[0].stockMovements.items[1].quantity).toBe(-2);
        });

        it('attempting to set a negative stockOnHand throws', assertThrowsWithMessage(
            async () => {
                const result = await adminClient.query(UPDATE_STOCK_ON_HAND, {
                    input: [
                        {
                            id: variants[0].id,
                            stockOnHand: -1,
                        },
                    ] as UpdateProductVariantInput[],
                });
            },
            'stockOnHand cannot be a negative value'),
        );
    });

});

const VARIANT_WITH_STOCK_FRAGMENT = gql`
    fragment VariantWithStock on ProductVariant {
        id
        stockOnHand
        stockMovements {
            items {
                ...on StockMovement {
                    id
                    type
                    quantity
                }
            }
            totalItems
        }
    }
`;

const GET_STOCK_MOVEMENT = gql`
    query ($id: ID!) {
        product(id: $id) {
            id
            variants {
                ...VariantWithStock
            }
        }
    }
    ${VARIANT_WITH_STOCK_FRAGMENT}
`;

const UPDATE_STOCK_ON_HAND = gql`
    mutation ($input: [UpdateProductVariantInput!]!) {
        updateProductVariants(input: $input) {
            ...VariantWithStock
        }
    }
    ${VARIANT_WITH_STOCK_FRAGMENT}
`;
