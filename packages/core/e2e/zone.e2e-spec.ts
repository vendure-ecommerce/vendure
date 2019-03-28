import {
    AddMembersToZone,
    CreateZone,
    DeletionResult,
    GetCountryList,
    GetZone,
    RemoveMembersFromZone,
    UpdateZone,
} from '@vendure/common/generated-types';
import gql from 'graphql-tag';
import path from 'path';

import {
    ADD_MEMBERS_TO_ZONE,
    CREATE_ZONE,
    GET_COUNTRY_LIST,
    GET_ZONE,
    REMOVE_MEMBERS_FROM_ZONE,
    UPDATE_ZONE,
} from '../../../admin-ui/src/app/data/definitions/settings-definitions';

import { TEST_SETUP_TIMEOUT_MS } from './config/test-config';
import { TestAdminClient } from './test-client';
import { TestServer } from './test-server';

// tslint:disable:no-non-null-assertion

describe('Facet resolver', () => {
    const client = new TestAdminClient();
    const server = new TestServer();
    let countries: GetCountryList.Items[];
    let zones: Array<{ id: string; name: string }>;
    let oceania: { id: string; name: string };
    let pangaea: { id: string; name: string; members: any[] };

    beforeAll(async () => {
        await server.init({
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
            customerCount: 1,
        });
        await client.init();

        const result = await client.query<GetCountryList.Query>(GET_COUNTRY_LIST, {});
        countries = result.countries.items;
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('zones', async () => {
        const result = await client.query(GET_ZONE_LIST);

        expect(result.zones.length).toBe(5);
        zones = result.zones;
        oceania = zones[0];
    });

    it('zone', async () => {
        const result = await client.query<GetZone.Query, GetZone.Variables>(GET_ZONE, {
            id: oceania.id,
        });

        expect(result.zone!.name).toBe('Oceania');
    });

    it('updateZone', async () => {
        const result = await client.query<UpdateZone.Mutation, UpdateZone.Variables>(UPDATE_ZONE, {
            input: {
                id: oceania.id,
                name: 'oceania2',
            },
        });

        expect(result.updateZone.name).toBe('oceania2');
    });

    it('createZone', async () => {
        const result = await client.query<CreateZone.Mutation, CreateZone.Variables>(CREATE_ZONE, {
            input: {
                name: 'Pangaea',
                memberIds: [countries[0].id, countries[1].id],
            },
        });

        pangaea = result.createZone;
        expect(pangaea.name).toBe('Pangaea');
        expect(pangaea.members.map(m => m.name)).toEqual([countries[0].name, countries[1].name]);
    });

    it('addMembersToZone', async () => {
        const result = await client.query<AddMembersToZone.Mutation, AddMembersToZone.Variables>(
            ADD_MEMBERS_TO_ZONE,
            {
                zoneId: oceania.id,
                memberIds: [countries[2].id, countries[3].id],
            },
        );

        expect(!!result.addMembersToZone.members.find(m => m.name === countries[2].name)).toBe(true);
        expect(!!result.addMembersToZone.members.find(m => m.name === countries[3].name)).toBe(true);
    });

    it('removeMembersFromZone', async () => {
        const result = await client.query<RemoveMembersFromZone.Mutation, RemoveMembersFromZone.Variables>(
            REMOVE_MEMBERS_FROM_ZONE,
            {
                zoneId: oceania.id,
                memberIds: [countries[0].id, countries[2].id],
            },
        );

        expect(!!result.removeMembersFromZone.members.find(m => m.name === countries[0].name)).toBe(false);
        expect(!!result.removeMembersFromZone.members.find(m => m.name === countries[2].name)).toBe(false);
        expect(!!result.removeMembersFromZone.members.find(m => m.name === countries[3].name)).toBe(true);
    });

    describe('deletion', () => {
        it('deletes Zone not used in any TaxRate', async () => {
            const result1 = await client.query(DELETE_ZONE, { id: pangaea.id });

            expect(result1.deleteZone).toEqual({
                result: DeletionResult.DELETED,
                message: '',
            });

            const result2 = await client.query(GET_ZONE_LIST, {});
            expect(result2.zones.find(c => c.id === pangaea.id)).toBeUndefined();
        });

        it('does not delete Zone that is used in one or more TaxRates', async () => {
            const result1 = await client.query(DELETE_ZONE, { id: oceania.id });

            expect(result1.deleteZone).toEqual({
                result: DeletionResult.NOT_DELETED,
                message:
                    'The selected Zone cannot be deleted as it is used in the following ' +
                    'TaxRates: Standard Tax Oceania, Reduced Tax Oceania, Zero Tax Oceania',
            });

            const result2 = await client.query(GET_ZONE_LIST, {});
            expect(result2.zones.find(c => c.id === oceania.id)).not.toBeUndefined();
        });
    });
});

const DELETE_ZONE = gql`
    mutation DeleteZone($id: ID!) {
        deleteZone(id: $id) {
            result
            message
        }
    }
`;

const GET_ZONE_LIST = gql`
    query GetZones {
        zones {
            id
            name
        }
    }
`;
