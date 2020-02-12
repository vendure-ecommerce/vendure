import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

import {
    CreateTaxCategory,
    DeleteTaxCategory,
    DeletionResult,
    GetTaxCategory,
    GetTaxCategoryList,
    UpdateTaxCategory,
} from './graphql/generated-e2e-admin-types';
import { sortById } from './utils/test-order-utils';

describe('TaxCategory resolver', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(testConfig);

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

    it('taxCategories', async () => {
        const { taxCategories } = await adminClient.query<GetTaxCategoryList.Query>(GET_TAX_CATEGORY_LIST);

        expect(taxCategories.sort(sortById)).toEqual([
            { id: 'T_1', name: 'Standard Tax' },
            { id: 'T_2', name: 'Reduced Tax' },
            { id: 'T_3', name: 'Zero Tax' },
        ]);
    });

    it('taxCategory', async () => {
        const { taxCategory } = await adminClient.query<GetTaxCategory.Query, GetTaxCategory.Variables>(
            GET_TAX_CATEGORY,
            {
                id: 'T_2',
            },
        );

        expect(taxCategory).toEqual({
            id: 'T_2',
            name: 'Reduced Tax',
        });
    });

    it('createTaxCategory', async () => {
        const { createTaxCategory } = await adminClient.query<
            CreateTaxCategory.Mutation,
            CreateTaxCategory.Variables
        >(CREATE_TAX_CATEGORY, {
            input: {
                name: 'New Category',
            },
        });

        expect(createTaxCategory).toEqual({
            id: 'T_4',
            name: 'New Category',
        });
    });

    it('updateCategory', async () => {
        const { updateTaxCategory } = await adminClient.query<
            UpdateTaxCategory.Mutation,
            UpdateTaxCategory.Variables
        >(UPDATE_TAX_CATEGORY, {
            input: {
                id: 'T_4',
                name: 'New Category Updated',
            },
        });

        expect(updateTaxCategory).toEqual({
            id: 'T_4',
            name: 'New Category Updated',
        });
    });

    describe('deletion', () => {
        it('cannot delete if used by a TaxRate', async () => {
            const { deleteTaxCategory } = await adminClient.query<
                DeleteTaxCategory.Mutation,
                DeleteTaxCategory.Variables
            >(DELETE_TAX_CATEGORY, {
                id: 'T_2',
            });

            expect(deleteTaxCategory.result).toBe(DeletionResult.NOT_DELETED);
            expect(deleteTaxCategory.message).toBe(
                `Cannot remove TaxCategory "Reduced Tax" as it is referenced by 5 TaxRates`,
            );
        });

        it('can delete if not used by TaxRate', async () => {
            const { deleteTaxCategory } = await adminClient.query<
                DeleteTaxCategory.Mutation,
                DeleteTaxCategory.Variables
            >(DELETE_TAX_CATEGORY, {
                id: 'T_4',
            });

            expect(deleteTaxCategory.result).toBe(DeletionResult.DELETED);
            expect(deleteTaxCategory.message).toBeNull();

            const { taxCategory } = await adminClient.query<GetTaxCategory.Query, GetTaxCategory.Variables>(
                GET_TAX_CATEGORY,
                {
                    id: 'T_4',
                },
            );

            expect(taxCategory).toBeNull();
        });
    });
});

const GET_TAX_CATEGORY_LIST = gql`
    query GetTaxCategoryList {
        taxCategories {
            id
            name
        }
    }
`;

const GET_TAX_CATEGORY = gql`
    query GetTaxCategory($id: ID!) {
        taxCategory(id: $id) {
            id
            name
        }
    }
`;

const CREATE_TAX_CATEGORY = gql`
    mutation CreateTaxCategory($input: CreateTaxCategoryInput!) {
        createTaxCategory(input: $input) {
            id
            name
        }
    }
`;

const UPDATE_TAX_CATEGORY = gql`
    mutation UpdateTaxCategory($input: UpdateTaxCategoryInput!) {
        updateTaxCategory(input: $input) {
            id
            name
        }
    }
`;

const DELETE_TAX_CATEGORY = gql`
    mutation DeleteTaxCategory($id: ID!) {
        deleteTaxCategory(id: $id) {
            result
            message
        }
    }
`;
