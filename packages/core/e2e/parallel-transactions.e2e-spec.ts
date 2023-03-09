import gql from 'graphql-tag';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';
import { createTestEnvironment } from '../../testing/lib/create-test-environment';

import { SlowMutationPlugin } from './fixtures/test-plugins/slow-mutation-plugin';
import * as Codegen from './graphql/generated-e2e-admin-types';
import { LanguageCode } from './graphql/generated-e2e-admin-types';
import {
    ADD_OPTION_GROUP_TO_PRODUCT,
    CREATE_PRODUCT,
    CREATE_PRODUCT_OPTION_GROUP,
    CREATE_PRODUCT_VARIANTS,
} from './graphql/shared-definitions';

describe('Parallel transactions', () => {
    const { server, adminClient, shopClient } = createTestEnvironment({
        ...testConfig(),
        plugins: [SlowMutationPlugin],
    });

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
            customerCount: 2,
        });
        await adminClient.asSuperAdmin();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('does not fail on many concurrent, slow transactions', async () => {
        const CONCURRENCY_LIMIT = 20;

        const slowMutations = Array.from({ length: CONCURRENCY_LIMIT }).map(i =>
            adminClient.query(SLOW_MUTATION, { delay: 50 }),
        );
        const result = await Promise.all(slowMutations);

        expect(result).toEqual(Array.from({ length: CONCURRENCY_LIMIT }).map(() => ({ slowMutation: true })));
    }, 100000);

    it('does not fail on attempted deadlock', async () => {
        const CONCURRENCY_LIMIT = 4;

        const slowMutations = Array.from({ length: CONCURRENCY_LIMIT }).map(i =>
            adminClient.query(ATTEMPT_DEADLOCK),
        );
        const result = await Promise.all(slowMutations);

        expect(result).toEqual(
            Array.from({ length: CONCURRENCY_LIMIT }).map(() => ({ attemptDeadlock: true })),
        );
    }, 100000);

    // A real-world error-case originally reported in https://github.com/vendure-ecommerce/vendure/issues/527
    it('does not deadlock on concurrent creating ProductVariants', async () => {
        const CONCURRENCY_LIMIT = 4;

        const { createProduct } = await adminClient.query<
            Codegen.CreateProductMutation,
            Codegen.CreateProductMutationVariables
        >(CREATE_PRODUCT, {
            input: {
                translations: [
                    { languageCode: LanguageCode.en, name: 'Test', slug: 'test', description: 'test' },
                ],
            },
        });

        const sizes = Array.from({ length: CONCURRENCY_LIMIT }).map(i => `size-${i as string}`);

        const { createProductOptionGroup } = await adminClient.query<
            Codegen.CreateProductOptionGroupMutation,
            Codegen.CreateProductOptionGroupMutationVariables
        >(CREATE_PRODUCT_OPTION_GROUP, {
            input: {
                code: 'size',
                options: sizes.map(size => ({
                    code: size,
                    translations: [{ languageCode: LanguageCode.en, name: size }],
                })),
                translations: [{ languageCode: LanguageCode.en, name: 'size' }],
            },
        });

        await adminClient.query<
            Codegen.AddOptionGroupToProductMutation,
            Codegen.AddOptionGroupToProductMutationVariables
        >(ADD_OPTION_GROUP_TO_PRODUCT, {
            productId: createProduct.id,
            optionGroupId: createProductOptionGroup.id,
        });

        const createVariantMutations = createProductOptionGroup.options
            .filter((_, index) => index < CONCURRENCY_LIMIT)
            .map((option, i) => {
                return adminClient.query<
                    Codegen.CreateProductVariantsMutation,
                    Codegen.CreateProductVariantsMutationVariables
                >(CREATE_PRODUCT_VARIANTS, {
                    input: [
                        {
                            sku: `VARIANT-${i}`,
                            productId: createProduct.id,
                            optionIds: [option.id],
                            translations: [{ languageCode: LanguageCode.en, name: `Variant ${i}` }],
                            price: 1000,
                            taxCategoryId: 'T_1',
                            facetValueIds: ['T_1', 'T_2'],
                            featuredAssetId: 'T_1',
                            assetIds: ['T_1'],
                        },
                    ],
                });
            });

        const results = await Promise.all(createVariantMutations);
        expect(results.length).toBe(CONCURRENCY_LIMIT);
    }, 100000);
});

const SLOW_MUTATION = gql`
    mutation SlowMutation($delay: Int!) {
        slowMutation(delay: $delay)
    }
`;

const ATTEMPT_DEADLOCK = gql`
    mutation AttemptDeadlock {
        attemptDeadlock
    }
`;
