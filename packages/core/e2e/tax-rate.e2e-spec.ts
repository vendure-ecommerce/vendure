/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { pick } from '@vendure/common/lib/pick';
import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import { TAX_RATE_FRAGMENT } from './graphql/fragments';
import * as Codegen from './graphql/generated-e2e-admin-types';
import { DeletionResult } from './graphql/generated-e2e-admin-types';
import { GET_TAX_RATES_LIST, UPDATE_TAX_RATE } from './graphql/shared-definitions';

describe('TaxRate resolver', () => {
    const { server, adminClient, shopClient } = createTestEnvironment(testConfig());

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

    it('taxRates list', async () => {
        const { taxRates } = await adminClient.query<Codegen.GetTaxRatesQuery>(GET_TAX_RATES_LIST);

        expect(taxRates.totalItems).toBe(15);
    });

    it('taxRate', async () => {
        const { taxRate } = await adminClient.query<
            Codegen.GetTaxRateQuery,
            Codegen.GetTaxRateQueryVariables
        >(GET_TAX_RATE, {
            id: 'T_1',
        });

        expect(pick(taxRate!, ['id', 'name', 'enabled', 'value'])).toEqual({
            id: 'T_1',
            name: 'Standard Tax Oceania',
            enabled: true,
            value: 20,
        });
        expect(taxRate!.category.name).toBe('Standard Tax');
        expect(taxRate!.zone.name).toBe('Oceania');
    });

    it('createTaxRate', async () => {
        const { createTaxRate } = await adminClient.query<
            Codegen.CreateTaxRateMutation,
            Codegen.CreateTaxRateMutationVariables
        >(CREATE_TAX_RATE, {
            input: {
                name: 'My Tax Rate',
                categoryId: 'T_1',
                zoneId: 'T_1',
                enabled: true,
                value: 17.5,
            },
        });

        expect(createTaxRate.name).toBe('My Tax Rate');
        expect(createTaxRate.value).toBe(17.5);
    });

    it('updateTaxRate', async () => {
        const { updateTaxRate } = await adminClient.query<
            Codegen.UpdateTaxRateMutation,
            Codegen.UpdateTaxRateMutationVariables
        >(UPDATE_TAX_RATE, {
            input: {
                id: 'T_1',
                value: 17.5,
            },
        });

        expect(updateTaxRate.value).toBe(17.5);
    });

    it('deleteTaxRate', async () => {
        const { deleteTaxRate } = await adminClient.query<
            Codegen.DeleteTaxRateMutation,
            Codegen.DeleteTaxRateMutationVariables
        >(DELETE_TAX_RATE, {
            id: 'T_3',
        });

        expect(deleteTaxRate.result).toBe(DeletionResult.DELETED);
        expect(deleteTaxRate.message).toBeNull();

        const { taxRates } = await adminClient.query<Codegen.GetTaxRatesQuery>(GET_TAX_RATES_LIST);
        expect(taxRates.items.find(x => x.id === 'T_3')).toBeUndefined();
    });
});

export const GET_TAX_RATE = gql`
    query GetTaxRate($id: ID!) {
        taxRate(id: $id) {
            ...TaxRate
        }
    }
    ${TAX_RATE_FRAGMENT}
`;

export const CREATE_TAX_RATE = gql`
    mutation CreateTaxRate($input: CreateTaxRateInput!) {
        createTaxRate(input: $input) {
            ...TaxRate
        }
    }
    ${TAX_RATE_FRAGMENT}
`;

export const DELETE_TAX_RATE = gql`
    mutation DeleteTaxRate($id: ID!) {
        deleteTaxRate(id: $id) {
            result
            message
        }
    }
`;
