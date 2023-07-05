import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import { ZONE_FRAGMENT } from './graphql/fragments';
import * as Codegen from './graphql/generated-e2e-admin-types';
import { DeletionResult } from './graphql/generated-e2e-admin-types';
import { GET_COUNTRY_LIST, UPDATE_CHANNEL } from './graphql/shared-definitions';

/* eslint-disable @typescript-eslint/no-non-null-assertion */

describe('Zone resolver', () => {
    const { server, adminClient } = createTestEnvironment(testConfig());
    let countries: Codegen.GetCountryListQuery['countries']['items'];
    let zones: Array<{ id: string; name: string }>;
    let oceania: { id: string; name: string };
    let pangaea: { id: string; name: string; members: any[] };

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();

        const result = await adminClient.query<Codegen.GetCountryListQuery>(GET_COUNTRY_LIST, {});
        countries = result.countries.items;
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('zones', async () => {
        const result = await adminClient.query<Codegen.GetZonesQuery>(GET_ZONE_LIST);
        expect(result.zones.items.length).toBe(5);
        zones = result.zones.items;
        oceania = zones[0];
    });

    it('zone', async () => {
        const result = await adminClient.query<Codegen.GetZoneQuery, Codegen.GetZoneQueryVariables>(
            GET_ZONE,
            {
                id: oceania.id,
            },
        );

        expect(result.zone!.name).toBe('Oceania');
    });

    it('zone.members field resolver', async () => {
        const { activeChannel } = await adminClient.query<Codegen.GetActiveChannelWithZoneMembersQuery>(
            GET_ACTIVE_CHANNEL_WITH_ZONE_MEMBERS,
        );

        expect(activeChannel.defaultShippingZone?.members.length).toBe(2);
    });

    it('updateZone', async () => {
        const result = await adminClient.query<
            Codegen.UpdateZoneMutation,
            Codegen.UpdateZoneMutationVariables
        >(UPDATE_ZONE, {
            input: {
                id: oceania.id,
                name: 'oceania2',
            },
        });

        expect(result.updateZone.name).toBe('oceania2');
    });

    it('createZone', async () => {
        const result = await adminClient.query<
            Codegen.CreateZoneMutation,
            Codegen.CreateZoneMutationVariables
        >(CREATE_ZONE, {
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
        const result = await adminClient.query<
            Codegen.AddMembersToZoneMutation,
            Codegen.AddMembersToZoneMutationVariables
        >(ADD_MEMBERS_TO_ZONE, {
            zoneId: oceania.id,
            memberIds: [countries[2].id, countries[3].id],
        });

        expect(!!result.addMembersToZone.members.find(m => m.name === countries[2].name)).toBe(true);
        expect(!!result.addMembersToZone.members.find(m => m.name === countries[3].name)).toBe(true);
    });

    it('removeMembersFromZone', async () => {
        const result = await adminClient.query<
            Codegen.RemoveMembersFromZoneMutation,
            Codegen.RemoveMembersFromZoneMutationVariables
        >(REMOVE_MEMBERS_FROM_ZONE, {
            zoneId: oceania.id,
            memberIds: [countries[0].id, countries[2].id],
        });

        expect(!!result.removeMembersFromZone.members.find(m => m.name === countries[0].name)).toBe(false);
        expect(!!result.removeMembersFromZone.members.find(m => m.name === countries[2].name)).toBe(false);
        expect(!!result.removeMembersFromZone.members.find(m => m.name === countries[3].name)).toBe(true);
    });

    describe('deletion', () => {
        it('deletes Zone not used in any TaxRate', async () => {
            const result1 = await adminClient.query<
                Codegen.DeleteZoneMutation,
                Codegen.DeleteZoneMutationVariables
            >(DELETE_ZONE, {
                id: pangaea.id,
            });

            expect(result1.deleteZone).toEqual({
                result: DeletionResult.DELETED,
                message: '',
            });

            const result2 = await adminClient.query<Codegen.GetZonesQuery>(GET_ZONE_LIST);
            expect(result2.zones.items.find(c => c.id === pangaea.id)).toBeUndefined();
        });

        it('does not delete Zone that is used in one or more TaxRates', async () => {
            const result1 = await adminClient.query<
                Codegen.DeleteZoneMutation,
                Codegen.DeleteZoneMutationVariables
            >(DELETE_ZONE, {
                id: oceania.id,
            });

            expect(result1.deleteZone).toEqual({
                result: DeletionResult.NOT_DELETED,
                message:
                    'The selected Zone cannot be deleted as it is used in the following ' +
                    'TaxRates: Standard Tax Oceania, Reduced Tax Oceania, Zero Tax Oceania',
            });

            const result2 = await adminClient.query<Codegen.GetZonesQuery>(GET_ZONE_LIST);
            expect(result2.zones.items.find(c => c.id === oceania.id)).not.toBeUndefined();
        });

        it('does not delete Zone that is used as a Channel defaultTaxZone', async () => {
            await adminClient.query<Codegen.UpdateChannelMutation, Codegen.UpdateChannelMutationVariables>(
                UPDATE_CHANNEL,
                {
                    input: {
                        id: 'T_1',
                        defaultTaxZoneId: oceania.id,
                    },
                },
            );

            const result1 = await adminClient.query<
                Codegen.DeleteZoneMutation,
                Codegen.DeleteZoneMutationVariables
            >(DELETE_ZONE, {
                id: oceania.id,
            });

            expect(result1.deleteZone).toEqual({
                result: DeletionResult.NOT_DELETED,
                message:
                    'The selected Zone cannot be deleted as it used as a default in the following Channels: ' +
                    '__default_channel__',
            });

            const result2 = await adminClient.query<Codegen.GetZonesQuery>(GET_ZONE_LIST);
            expect(result2.zones.items.find(c => c.id === oceania.id)).not.toBeUndefined();
        });

        it('does not delete Zone that is used as a Channel defaultShippingZone', async () => {
            await adminClient.query<Codegen.UpdateChannelMutation, Codegen.UpdateChannelMutationVariables>(
                UPDATE_CHANNEL,
                {
                    input: {
                        id: 'T_1',
                        defaultTaxZoneId: 'T_1',
                        defaultShippingZoneId: oceania.id,
                    },
                },
            );

            const result1 = await adminClient.query<
                Codegen.DeleteZoneMutation,
                Codegen.DeleteZoneMutationVariables
            >(DELETE_ZONE, {
                id: oceania.id,
            });

            expect(result1.deleteZone).toEqual({
                result: DeletionResult.NOT_DELETED,
                message:
                    'The selected Zone cannot be deleted as it used as a default in the following Channels: ' +
                    '__default_channel__',
            });

            const result2 = await adminClient.query<Codegen.GetZonesQuery>(GET_ZONE_LIST);
            expect(result2.zones.items.find(c => c.id === oceania.id)).not.toBeUndefined();
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
    query GetZones($options: ZoneListOptions) {
        zones(options: $options) {
            items {
                id
                name
            }
            totalItems
        }
    }
`;

export const GET_ZONE = gql`
    query GetZone($id: ID!) {
        zone(id: $id) {
            ...Zone
        }
    }
    ${ZONE_FRAGMENT}
`;

export const GET_ACTIVE_CHANNEL_WITH_ZONE_MEMBERS = gql`
    query GetActiveChannelWithZoneMembers {
        activeChannel {
            id
            defaultShippingZone {
                id
                members {
                    name
                }
            }
        }
    }
`;

export const CREATE_ZONE = gql`
    mutation CreateZone($input: CreateZoneInput!) {
        createZone(input: $input) {
            ...Zone
        }
    }
    ${ZONE_FRAGMENT}
`;

export const UPDATE_ZONE = gql`
    mutation UpdateZone($input: UpdateZoneInput!) {
        updateZone(input: $input) {
            ...Zone
        }
    }
    ${ZONE_FRAGMENT}
`;

export const ADD_MEMBERS_TO_ZONE = gql`
    mutation AddMembersToZone($zoneId: ID!, $memberIds: [ID!]!) {
        addMembersToZone(zoneId: $zoneId, memberIds: $memberIds) {
            ...Zone
        }
    }
    ${ZONE_FRAGMENT}
`;

export const REMOVE_MEMBERS_FROM_ZONE = gql`
    mutation RemoveMembersFromZone($zoneId: ID!, $memberIds: [ID!]!) {
        removeMembersFromZone(zoneId: $zoneId, memberIds: $memberIds) {
            ...Zone
        }
    }
    ${ZONE_FRAGMENT}
`;
