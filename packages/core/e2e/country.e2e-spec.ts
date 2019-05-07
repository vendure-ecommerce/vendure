import gql from 'graphql-tag';
import path from 'path';

import { TEST_SETUP_TIMEOUT_MS } from './config/test-config';
import { COUNTRY_FRAGMENT } from './graphql/fragments';
import { DeletionResult, GetCountryList, LanguageCode, GetCountry, UpdateCountry, CreateCountry } from './graphql/generated-e2e-admin-types';
import { GET_COUNTRY_LIST, UPDATE_COUNTRY } from './graphql/shared-definitions';
import { TestAdminClient } from './test-client';
import { TestServer } from './test-server';

// tslint:disable:no-non-null-assertion

describe('Facet resolver', () => {
    const client = new TestAdminClient();
    const server = new TestServer();
    let countries: GetCountryList.Items[];
    let GB: GetCountryList.Items;
    let AT: GetCountryList.Items;

    beforeAll(async () => {
        await server.init({
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
            customerCount: 1,
        });
        await client.init();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('countries', async () => {
        const result = await client.query<GetCountryList.Query>(GET_COUNTRY_LIST, {});

        expect(result.countries.totalItems).toBe(7);
        countries = result.countries.items;
        GB = countries.find(c => c.code === 'GB')!;
        AT = countries.find(c => c.code === 'AT')!;
    });

    it('country', async () => {
        const result = await client.query<GetCountry.Query, GetCountry.Variables>(GET_COUNTRY, {
            id: GB.id,
        });

        expect(result.country!.name).toBe(GB.name);
    });

    it('updateCountry', async () => {
        const result = await client.query<UpdateCountry.Mutation, UpdateCountry.Variables>(UPDATE_COUNTRY, {
            input: {
                id: AT.id,
                enabled: false,
            },
        });

        expect(result.updateCountry.enabled).toBe(false);
    });

    it('createCountry', async () => {
        const result = await client.query<CreateCountry.Mutation, CreateCountry.Variables>(CREATE_COUNTRY, {
            input: {
                code: 'GL',
                enabled: true,
                translations: [{ languageCode: LanguageCode.en, name: 'Gondwanaland' }],
            },
        });

        expect(result.createCountry.name).toBe('Gondwanaland');
    });

    describe('deletion', () => {
        it('deletes Country not used in any address', async () => {
            const result1 = await client.query(DELETE_COUNTRY, { id: AT.id });

            expect(result1.deleteCountry).toEqual({
                result: DeletionResult.DELETED,
                message: '',
            });

            const result2 = await client.query<GetCountryList.Query>(GET_COUNTRY_LIST, {});
            expect(result2.countries.items.find(c => c.id === AT.id)).toBeUndefined();
        });

        it('does not delete Country that is used in one or more addresses', async () => {
            const result1 = await client.query(DELETE_COUNTRY, { id: GB.id });

            expect(result1.deleteCountry).toEqual({
                result: DeletionResult.NOT_DELETED,
                message: 'The selected Country cannot be deleted as it is used in 1 Address',
            });

            const result2 = await client.query<GetCountryList.Query>(GET_COUNTRY_LIST, {});
            expect(result2.countries.items.find(c => c.id === GB.id)).not.toBeUndefined();
        });
    });
});

export const DELETE_COUNTRY = gql`
    mutation DeleteCountry($id: ID!) {
        deleteCountry(id: $id) {
            result
            message
        }
    }
`;

export const GET_COUNTRY = gql`
    query GetCountry($id: ID!) {
        country(id: $id) {
            ...Country
        }
    }
    ${COUNTRY_FRAGMENT}
`;

export const CREATE_COUNTRY = gql`
    mutation CreateCountry($input: CreateCountryInput!) {
        createCountry(input: $input) {
            ...Country
        }
    }
    ${COUNTRY_FRAGMENT}
`;
