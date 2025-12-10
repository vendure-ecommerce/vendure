import { Facet, LanguageCode, mergeConfig } from '@vendure/core';
import { DeletionResult } from '@vendure/common/lib/generated-types';
import { createTestEnvironment } from '@vendure/testing';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

import { ResultOf, VariablesOf, graphql } from './graphql/graphql-admin';
import {
    addMembersToZoneDocument,
    createZoneDocument,
    deleteZoneDocument,
    getActiveChannelWithZoneMembersDocument,
    getCountryListDocument,
    getZoneDocument,
    getZonesDocument,
    removeMembersFromZoneDocument,
    updateChannelDocument,
    updateZoneDocument,
    createFacetDocument,
} from './graphql/shared-definitions';

/* eslint-disable @typescript-eslint/no-non-null-assertion */

describe('Zone resolver', () => {
    const { server, adminClient } = createTestEnvironment(
        mergeConfig(testConfig(), {
            customFields: {
                Zone: [
                    {
                        name: 'relatedFacet',
                        type: 'relation',
                        entity: Facet,
                    },
                ],
            },
        }),
    );
    let countries: ResultOf<typeof getCountryListDocument>['countries']['items'];
    let zones: Array<{ id: string; name: string }>;
    let oceania: { id: string; name: string };
    let pangaea: ResultOf<typeof createZoneDocument>['createZone'];

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-minimal.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();

        const result = await adminClient.query(getCountryListDocument, {});
        countries = result.countries.items;
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('zones', async () => {
        const result = await adminClient.query(getZonesDocument);
        expect(result.zones.items.length).toBe(5);
        zones = result.zones.items;
        oceania = zones[0];
    });

    it('zone', async () => {
        const result = await adminClient.query(getZoneDocument, {
            id: oceania.id,
        });

        expect(result.zone!.name).toBe('Oceania');
    });

    it('zone.members field resolver', async () => {
        const { activeChannel } = await adminClient.query(getActiveChannelWithZoneMembersDocument);

        expect(activeChannel.defaultShippingZone?.members.length).toBe(2);
    });

    it('updateZone', async () => {
        const result = await adminClient.query(updateZoneDocument, {
            input: {
                id: oceania.id,
                name: 'oceania2',
            },
        });

        expect(result.updateZone.name).toBe('oceania2');
    });

    it('createZone', async () => {
        const result = await adminClient.query(createZoneDocument, {
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
        const result = await adminClient.query(addMembersToZoneDocument, {
            zoneId: oceania.id,
            memberIds: [countries[2].id, countries[3].id],
        });

        expect(!!result.addMembersToZone.members.find(m => m.name === countries[2].name)).toBe(true);
        expect(!!result.addMembersToZone.members.find(m => m.name === countries[3].name)).toBe(true);
    });

    it('removeMembersFromZone', async () => {
        const result = await adminClient.query(removeMembersFromZoneDocument, {
            zoneId: oceania.id,
            memberIds: [countries[0].id, countries[2].id],
        });

        expect(!!result.removeMembersFromZone.members.find(m => m.name === countries[0].name)).toBe(false);
        expect(!!result.removeMembersFromZone.members.find(m => m.name === countries[2].name)).toBe(false);
        expect(!!result.removeMembersFromZone.members.find(m => m.name === countries[3].name)).toBe(true);
    });

    describe('deletion', () => {
        it('deletes Zone not used in any TaxRate', async () => {
            const result1 = await adminClient.query(deleteZoneDocument, {
                id: pangaea.id,
            });

            expect(result1.deleteZone).toEqual({
                result: DeletionResult.DELETED,
                message: '',
            });

            const result2 = await adminClient.query(getZonesDocument);
            expect(result2.zones.items.find(c => c.id === pangaea.id)).toBeUndefined();
        });

        it('does not delete Zone that is used in one or more TaxRates', async () => {
            const result1 = await adminClient.query(deleteZoneDocument, {
                id: oceania.id,
            });

            expect(result1.deleteZone).toEqual({
                result: DeletionResult.NOT_DELETED,
                message:
                    'The selected Zone cannot be deleted as it is used in the following ' +
                    'TaxRates: Standard Tax Oceania, Reduced Tax Oceania, Zero Tax Oceania',
            });

            const result2 = await adminClient.query(getZonesDocument);
            expect(result2.zones.items.find(c => c.id === oceania.id)).not.toBeUndefined();
        });

        it('does not delete Zone that is used as a Channel defaultTaxZone', async () => {
            await adminClient.query(updateChannelDocument, {
                input: {
                    id: 'T_1',
                    defaultTaxZoneId: oceania.id,
                },
            });

            const result1 = await adminClient.query(deleteZoneDocument, {
                id: oceania.id,
            });

            expect(result1.deleteZone).toEqual({
                result: DeletionResult.NOT_DELETED,
                message:
                    'The selected Zone cannot be deleted as it used as a default in the following Channels: ' +
                    '__default_channel__',
            });

            const result2 = await adminClient.query(getZonesDocument);
            expect(result2.zones.items.find(c => c.id === oceania.id)).not.toBeUndefined();
        });

        it('does not delete Zone that is used as a Channel defaultShippingZone', async () => {
            await adminClient.query(updateChannelDocument, {
                input: {
                    id: 'T_1',
                    defaultTaxZoneId: 'T_1',
                    defaultShippingZoneId: oceania.id,
                },
            });

            const result1 = await adminClient.query(deleteZoneDocument, {
                id: oceania.id,
            });

            expect(result1.deleteZone).toEqual({
                result: DeletionResult.NOT_DELETED,
                message:
                    'The selected Zone cannot be deleted as it used as a default in the following Channels: ' +
                    '__default_channel__',
            });

            const result2 = await adminClient.query(getZonesDocument);
            expect(result2.zones.items.find(c => c.id === oceania.id)).not.toBeUndefined();
        });
    });

    describe('Zone custom fields', () => {
        let testFacet: ResultOf<typeof createFacetDocument>['createFacet'];
        // Create a target entity (Facet) to link the Zone to
        it('create a target Facet', async () => {
            const result = await adminClient.query(createFacetDocument, {
                input: {
                    code: 'test-relation-facet',
                    isPrivate: false,
                    translations: [{ languageCode: LanguageCode.en, name: 'Test Relation Facet' }],
                },
            });

            testFacet = result.createFacet;
            expect(testFacet.name).toBe('Test Relation Facet');
        });

        // Test createZone with a custom relation field
        it('createZone persists custom relation field', async () => {
            const input: VariablesOf<typeof createZoneDocument>['input'] = {
                name: 'Zone with Custom Relation',
                memberIds: [],
                customFields: {
                    relatedFacetId: testFacet.id,
                },
            };

            const result = await adminClient.query(CREATE_ZONE_WITH_CF, { input });

            //  Verify the return value
            expect(result.createZone.customFields.relatedFacet.id).toBe(testFacet.id);
            //  Verify by querying it again from the database
            const result2 = await adminClient.query(
                GET_ZONE_WITH_CUSTOM_FIELDS,
                { id: result.createZone.id },
            );
            expect(result2.zone?.customFields.relatedFacet.id).toBe(testFacet.id);
        });

        // Test updateZone with a custom relation field
        it('updateZone persists custom relation field', async () => {
            const result = await adminClient.query(UPDATE_ZONE_WITH_CF, {
                input: {
                    id: zones[1].id,
                    customFields: {
                        relatedFacetId: testFacet.id,
                    },
                },
            });

            // Verify the return value
            expect(result.updateZone.customFields.relatedFacet.id).toBe(testFacet.id);

            // Verify by querying it again from the database
            const result2 = await adminClient.query(
                GET_ZONE_WITH_CUSTOM_FIELDS,
                { id: zones[1].id },
            );
            expect(result2.zone?.customFields.relatedFacet.id).toBe(testFacet.id);
        });
    });
});

type ZoneWithCustomFields = Omit<ResultOf<typeof getZoneDocument>['zone'], 'customFields'> & {
    customFields: {
        relatedFacet: {
            id: string;
        };
    };
};

type CreateZoneMutationWithCF = Omit<ResultOf<typeof updateZoneDocument>, 'createZone'> & {
    createZone: ZoneWithCustomFields;
};

type UpdateZoneMutationWithCF = Omit<ResultOf<typeof updateZoneDocument>, 'updateZone'> & {
    updateZone: ZoneWithCustomFields;
};

type GetZoneQueryWithCF = Omit<ResultOf<typeof getZoneDocument>, 'zone'> & {
    zone: ZoneWithCustomFields;
};

const CREATE_FACET_WITH_VALUE = graphql(`
    mutation CreateFacetWithValue($input: CreateFacetInput!) {
        createFacet(input: $input) {
            id
            name
        }
    }
`);

// A new fragment to include the custom fields
const ZONE_CUSTOM_FIELDS_FRAGMENT = graphql(`
    fragment ZoneCustomFields on Zone {
        customFields {
            relatedFacet {
                id
            }
        }
    }
`);

// A new mutation to create a Zone with custom fields
const CREATE_ZONE_WITH_CF = graphql(`
    mutation CreateZoneWithCF($input: CreateZoneInput!) {
        createZone(input: $input) {
            id
            name
            ...ZoneCustomFields
        }
    }
`, [ZONE_CUSTOM_FIELDS_FRAGMENT]);

// A new mutation to update a Zone with custom fields
const UPDATE_ZONE_WITH_CF = graphql(`
    mutation UpdateZoneWithCF($input: UpdateZoneInput!) {
        updateZone(input: $input) {
            id
            name
            ...ZoneCustomFields
        }
    }
`, [ZONE_CUSTOM_FIELDS_FRAGMENT]);

// A new query to fetch the Zone with its custom fields
const GET_ZONE_WITH_CUSTOM_FIELDS = graphql(`
    query GetZoneWithCustomFields($id: ID!) {
        zone(id: $id) {
            id
            name
            ...ZoneCustomFields
        }
    }
`, [ZONE_CUSTOM_FIELDS_FRAGMENT]);
