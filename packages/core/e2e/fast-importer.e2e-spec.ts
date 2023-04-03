import { CreateProductInput, ProductTranslationInput } from '@vendure/common/lib/generated-types';
import { ensureConfigLoaded, FastImporterService, LanguageCode } from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';
import { initialData } from '../mock-data/data-sources/initial-data';

import {
    GetProductWithVariantsQuery,
    GetProductWithVariantsQueryVariables,
} from './graphql/generated-e2e-admin-types';
import { GET_PRODUCT_WITH_VARIANTS } from './graphql/shared-definitions';

describe('FastImporterService resolver', () => {
    const { server, adminClient } = createTestEnvironment(testConfig());

    let fastImporterService: FastImporterService;

    beforeAll(async () => {
        await ensureConfigLoaded();
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
        });
        await adminClient.asSuperAdmin();
        fastImporterService = server.app.get(FastImporterService);
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('creates normalized slug', async () => {
        const productTranslation: ProductTranslationInput = {
            languageCode: LanguageCode.en,
            name: 'test product',
            slug: 'test product',
            description: 'test description',
        };
        const createProductInput: CreateProductInput = {
            translations: [productTranslation],
        };
        await fastImporterService.initialize();
        const productId = await fastImporterService.createProduct(createProductInput);

        const { product } = await adminClient.query<
            GetProductWithVariantsQuery,
            GetProductWithVariantsQueryVariables
        >(GET_PRODUCT_WITH_VARIANTS, {
            id: productId as string,
        });

        expect(product?.slug).toMatch('test-product');
    });
});
