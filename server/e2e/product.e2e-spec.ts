import {
    CreateProduct,
    CreateProductVariables,
    GetProductList,
    GetProductListVariables,
    GetProductWithVariants,
    GetProductWithVariantsVariables,
    LanguageCode,
    SortOrder,
} from 'shared/generated-types';

import { CREATE_PRODUCT } from '../../admin-ui/src/app/data/mutations/product-mutations';
import {
    GET_PRODUCT_LIST,
    GET_PRODUCT_WITH_VARIANTS,
} from '../../admin-ui/src/app/data/queries/product-queries';

import { TestClient } from './test-client';
import { TestServer } from './test-server';

describe('Product resolver', () => {
    const client = new TestClient();
    const server = new TestServer();

    beforeAll(async () => {
        await server.init({
            productCount: 20,
            customerCount: 1,
        });
    }, 30000);

    afterAll(async () => {
        await server.destroy();
    });

    describe('products list query', () => {
        it('returns all products when no options passed', async () => {
            const result = await client.query<GetProductList, GetProductListVariables>(GET_PRODUCT_LIST, {
                languageCode: LanguageCode.en,
            });

            expect(result.products.items.length).toBe(20);
            expect(result.products.totalItems).toBe(20);
        });

        it('limits result set with skip & take', async () => {
            const result = await client.query<GetProductList, GetProductListVariables>(GET_PRODUCT_LIST, {
                languageCode: LanguageCode.en,
                options: {
                    skip: 0,
                    take: 3,
                },
            });

            expect(result.products.items.length).toBe(3);
            expect(result.products.totalItems).toBe(20);
        });

        it('filters by name', async () => {
            const result = await client.query<GetProductList, GetProductListVariables>(GET_PRODUCT_LIST, {
                languageCode: LanguageCode.en,
                options: {
                    filter: {
                        name: {
                            contains: 'fish',
                        },
                    },
                },
            });

            expect(result.products.items.length).toBe(1);
            expect(result.products.items[0].name).toBe('en Practical Frozen Fish');
        });

        it('sorts by name', async () => {
            const result = await client.query<GetProductList, GetProductListVariables>(GET_PRODUCT_LIST, {
                languageCode: LanguageCode.en,
                options: {
                    sort: {
                        name: SortOrder.ASC,
                    },
                },
            });

            expect(result.products.items.map(p => p.name)).toEqual([
                'en Fantastic Granite Salad',
                'en Fantastic Rubber Sausages',
                'en Generic Metal Keyboard',
                'en Generic Wooden Sausages',
                'en Handcrafted Granite Shirt',
                'en Handcrafted Plastic Gloves',
                'en Handmade Cotton Salad',
                'en Incredible Metal Shirt',
                'en Incredible Steel Cheese',
                'en Intelligent Frozen Ball',
                'en Intelligent Wooden Car',
                'en Licensed Cotton Shirt',
                'en Licensed Frozen Chair',
                'en Practical Frozen Fish',
                'en Refined Fresh Bacon',
                'en Rustic Steel Salad',
                'en Rustic Wooden Hat',
                'en Small Granite Chicken',
                'en Small Steel Cheese',
                'en Tasty Soft Gloves',
            ]);
        });
    });

    describe('product query', () => {
        it('returns expected properties', async () => {
            const result = await client.query<GetProductWithVariants, GetProductWithVariantsVariables>(
                GET_PRODUCT_WITH_VARIANTS,
                {
                    languageCode: LanguageCode.en,
                    id: '2',
                },
            );

            if (!result.product) {
                fail('Product not found');
                return;
            }
            expect(result.product).toEqual(
                expect.objectContaining({
                    description: 'en Ut nulla quam ipsam nobis cupiditate sed dignissimos debitis incidunt.',
                    id: '2',
                    image: 'http://lorempixel.com/640/480',
                    languageCode: 'en',
                    name: 'en Incredible Metal Shirt',
                    optionGroups: [
                        {
                            code: 'size',
                            id: '1',
                            languageCode: 'en',
                            name: 'Size',
                        },
                    ],
                    slug: 'en incredible-metal-shirt',
                    translations: [
                        {
                            description:
                                'en Ut nulla quam ipsam nobis cupiditate sed dignissimos debitis incidunt.',
                            languageCode: 'en',
                            name: 'en Incredible Metal Shirt',
                            slug: 'en incredible-metal-shirt',
                        },
                        {
                            description:
                                'de Ut nulla quam ipsam nobis cupiditate sed dignissimos debitis incidunt.',
                            languageCode: 'de',
                            name: 'de Incredible Metal Shirt',
                            slug: 'de incredible-metal-shirt',
                        },
                    ],
                }),
            );
        });

        it('returns null when id not found', async () => {
            const result = await client.query<GetProductWithVariants, GetProductWithVariantsVariables>(
                GET_PRODUCT_WITH_VARIANTS,
                {
                    languageCode: LanguageCode.en,
                    id: 'bad_id',
                },
            );

            expect(result.product).toBeNull();
        });
    });

    describe('createProduct mutation', () => {
        it('creates a new Product', async () => {
            const result = await client.query<CreateProduct, CreateProductVariables>(CREATE_PRODUCT, {
                input: {
                    image: 'baked-potato',
                    translations: [
                        {
                            languageCode: LanguageCode.en,
                            name: 'en Baked Potato',
                            slug: 'en-baked-potato',
                            description: 'A baked potato',
                        },
                        {
                            languageCode: LanguageCode.de,
                            name: 'de Baked Potato',
                            slug: 'de-baked-potato',
                            description: 'Eine baked Erdapfel',
                        },
                    ],
                },
            });
            expect(result.createProduct).toMatchSnapshot();
        });
    });
});
