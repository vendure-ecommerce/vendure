import gql from 'graphql-tag';
import path from 'path';

import { pick } from '../../common/lib/pick';

import { TEST_SETUP_TIMEOUT_MS } from './config/test-config';
import {
    GetProductWithVariants,
    LanguageCode,
    UpdateOptionGroup,
    UpdateProduct,
} from './graphql/generated-e2e-admin-types';
import { GET_PRODUCT_WITH_VARIANTS, UPDATE_PRODUCT } from './graphql/shared-definitions';
import { TestAdminClient } from './test-client';
import { TestServer } from './test-server';

/* tslint:disable:no-non-null-assertion */
describe('Role resolver', () => {
    const client = new TestAdminClient();
    const server = new TestServer();

    beforeAll(async () => {
        const token = await server.init({
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
            customerCount: 1,
        });
        await client.init();

        const { updateProduct } = await client.query<UpdateProduct.Mutation, UpdateProduct.Variables>(
            UPDATE_PRODUCT,
            {
                input: {
                    id: 'T_1',
                    translations: [
                        {
                            languageCode: LanguageCode.en,
                            name: 'en name',
                            slug: 'en-slug',
                            description: 'en-description',
                        },
                        {
                            languageCode: LanguageCode.de,
                            name: 'de name',
                            slug: 'de-slug',
                            description: 'de-description',
                        },
                        {
                            languageCode: LanguageCode.zh,
                            name: 'zh name',
                            slug: 'zh-slug',
                            description: 'zh-description',
                        },
                    ],
                },
            },
        );

        await client.query<UpdateOptionGroup.Mutation, UpdateOptionGroup.Variables>(UPDATE_OPTION_GROUP, {
            input: {
                id: 'T_1',
                translations: [
                    { languageCode: LanguageCode.en, name: 'en name' },
                    { languageCode: LanguageCode.de, name: 'de name' },
                    { languageCode: LanguageCode.zh, name: 'zh name' },
                ],
            },
        });
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('returns default language when none specified', async () => {
        const { product } = await client.query<
            GetProductWithVariants.Query,
            GetProductWithVariants.Variables
        >(GET_PRODUCT_WITH_VARIANTS, {
            id: 'T_1',
        });
        expect(pick(product!, ['name', 'slug', 'description'])).toEqual({
            name: 'en name',
            slug: 'en-slug',
            description: 'en-description',
        });
    });

    it('returns specified language', async () => {
        const { product } = await client.query<
            GetProductWithVariants.Query,
            GetProductWithVariants.Variables
        >(
            GET_PRODUCT_WITH_VARIANTS,
            {
                id: 'T_1',
            },
            { languageCode: LanguageCode.de },
        );
        expect(pick(product!, ['name', 'slug', 'description'])).toEqual({
            name: 'de name',
            slug: 'de-slug',
            description: 'de-description',
        });
    });

    it('falls back to default language code', async () => {
        const { product } = await client.query<
            GetProductWithVariants.Query,
            GetProductWithVariants.Variables
        >(
            GET_PRODUCT_WITH_VARIANTS,
            {
                id: 'T_1',
            },
            { languageCode: LanguageCode.ga },
        );
        expect(pick(product!, ['name', 'slug', 'description'])).toEqual({
            name: 'en name',
            slug: 'en-slug',
            description: 'en-description',
        });
    });

    it('nested entites are translated', async () => {
        const { product } = await client.query<
            GetProductWithVariants.Query,
            GetProductWithVariants.Variables
        >(
            GET_PRODUCT_WITH_VARIANTS,
            {
                id: 'T_1',
            },
            { languageCode: LanguageCode.zh },
        );
        expect(pick(product!.optionGroups[0], ['name'])).toEqual({
            name: 'zh name',
        });
    });

    it('translates results of mutation', async () => {
        const { updateProduct } = await client.query<UpdateProduct.Mutation, UpdateProduct.Variables>(
            UPDATE_PRODUCT,
            {
                input: {
                    id: 'T_1',
                    enabled: true,
                },
            },
            { languageCode: LanguageCode.zh },
        );
        expect(updateProduct.name).toBe('zh name');
        expect(pick(updateProduct.optionGroups[0], ['name'])).toEqual({
            name: 'zh name',
        });
    });
});

const UPDATE_OPTION_GROUP = gql`
    mutation UpdateOptionGroup($input: UpdateProductOptionGroupInput!) {
        updateProductOptionGroup(input: $input) {
            id
        }
    }
`;
