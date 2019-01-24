import gql from 'graphql-tag';

import {
    CREATE_COUNTRY,
    GET_AVAILABLE_COUNTRIES,
    GET_COUNTRY,
    GET_COUNTRY_LIST,
    UPDATE_COUNTRY,
} from '../../admin-ui/src/app/data/definitions/settings-definitions';
import {
    CreateCountry,
    DeletionResult,
    GetAvailableCountries,
    GetCountry,
    GetCountryList,
    LanguageCode,
    UpdateCountry,
} from '../../shared/generated-types';

import { TEST_SETUP_TIMEOUT_MS } from './config/test-config';
import { TestClient } from './test-client';
import { TestServer } from './test-server';

// tslint:disable:no-non-null-assertion

describe('Facet resolver', () => {
    const client = new TestClient();
    const server = new TestServer();
    let countries: GetCountryList.Items[];
    let GB: GetCountryList.Items;
    let AT: GetCountryList.Items;

    beforeAll(async () => {
        await server.init({
            productCount: 2,
            customerCount: 1,
        });
        await client.init();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('countries', async () => {
        const result = await client.query<GetCountryList.Query>(GET_COUNTRY_LIST, {});

        expect(result.countries.totalItems).toBe(9);
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

    it('availableCountries returns enabled countries', async () => {
        const result = await client.query<GetAvailableCountries.Query>(GET_AVAILABLE_COUNTRIES);

        expect(result.availableCountries.length).toBe(countries.length - 1);
        expect(result.availableCountries.find(c => c.id === AT.id)).toBeUndefined();
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

const DELETE_COUNTRY = gql`
    mutation DeleteCountry($id: ID!) {
        deleteCountry(id: $id) {
            result
            message
        }
    }
`;
