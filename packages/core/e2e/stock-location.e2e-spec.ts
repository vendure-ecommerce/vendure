import { mergeConfig } from '@vendure/core';
import {
    createErrorResultGuard,
    createTestEnvironment,
    E2E_DEFAULT_CHANNEL_TOKEN,
    ErrorResultGuard,
} from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

import { testSuccessfulPaymentMethod } from './fixtures/test-payment-methods';
import * as Codegen from './graphql/generated-e2e-admin-types';
import {
    AssignProductsToChannelDocument,
    CurrencyCode,
    DeletionResult,
    LanguageCode,
    SortOrder,
    TestAssignStockLocationToChannelDocument,
    TestCreateStockLocationDocument,
    TestDeleteStockLocationDocument,
    TestGetStockLevelsForVariantDocument,
    TestGetStockLocationsListDocument,
    TestRemoveStockLocationsFromChannelDocument,
    TestSetStockLevelInLocationDocument,
    TestUpdateStockLocationDocument,
} from './graphql/generated-e2e-admin-types';
import * as CodegenShop from './graphql/generated-e2e-shop-types';
import { CREATE_CHANNEL } from './graphql/shared-definitions';

describe('Stock location', () => {
    const defaultStockLocationId = 'T_1';
    let secondStockLocationId: string;

    const { server, adminClient, shopClient } = createTestEnvironment(
        mergeConfig(testConfig(), {
            paymentOptions: {
                paymentMethodHandlers: [testSuccessfulPaymentMethod],
            },
        }),
    );

    const orderGuard: ErrorResultGuard<
        CodegenShop.TestOrderFragmentFragment | CodegenShop.UpdatedOrderFragment
    > = createErrorResultGuard(input => !!input.lines);

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-stock-control-multi.csv'),
            customerCount: 3,
        });
        await adminClient.asSuperAdmin();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('createStockLocation', async () => {
        const { createStockLocation } = await adminClient.query(TestCreateStockLocationDocument, {
            input: {
                name: 'Second location',
                description: 'Second location description',
            },
        });

        expect(createStockLocation.name).toBe('Second location');
        expect(createStockLocation.description).toBe('Second location description');
        secondStockLocationId = createStockLocation.id;
    });

    it('updateStockLocation', async () => {
        const { updateStockLocation } = await adminClient.query(TestUpdateStockLocationDocument, {
            input: {
                id: secondStockLocationId,
                name: 'Second location updated',
                description: 'Second location description updated',
            },
        });

        expect(updateStockLocation.name).toBe('Second location updated');
        expect(updateStockLocation.description).toBe('Second location description updated');
    });

    it('get stock locations list', async () => {
        const { stockLocations } = await adminClient.query(TestGetStockLocationsListDocument, {
            options: {
                sort: {
                    id: SortOrder.ASC,
                },
            },
        });

        expect(stockLocations.items.length).toBe(2);
        expect(stockLocations.items[0].name).toBe('Default Stock Location');
        expect(stockLocations.items[1].name).toBe('Second location updated');
    });

    it('assign stock to second location', async () => {
        const { updateProductVariants } = await adminClient.query(TestSetStockLevelInLocationDocument, {
            input: {
                id: 'T_1',
                stockLevels: [
                    {
                        stockLocationId: secondStockLocationId,
                        stockOnHand: 50,
                    },
                ],
            },
        });
        expect(
            updateProductVariants[0]?.stockLevels.find(sl => sl.stockLocationId === defaultStockLocationId),
        ).toEqual({
            stockOnHand: 100,
            stockAllocated: 0,
            stockLocationId: defaultStockLocationId,
        });
        expect(
            updateProductVariants[0]?.stockLevels.find(sl => sl.stockLocationId === secondStockLocationId),
        ).toEqual({
            stockOnHand: 50,
            stockAllocated: 0,
            stockLocationId: secondStockLocationId,
        });
    });

    it('delete second stock location and assign stock to default location', async () => {
        const { deleteStockLocation } = await adminClient.query(TestDeleteStockLocationDocument, {
            input: {
                id: secondStockLocationId,
                transferToLocationId: defaultStockLocationId,
            },
        });

        expect(deleteStockLocation.result).toBe(DeletionResult.DELETED);

        const { productVariant } = await adminClient.query(TestGetStockLevelsForVariantDocument, {
            id: 'T_1',
        });

        expect(productVariant?.stockLevels.length).toBe(1);
        expect(productVariant?.stockLevels[0]).toEqual({
            stockOnHand: 150,
            stockAllocated: 0,
            stockLocationId: defaultStockLocationId,
        });
    });

    it('cannot delete last remaining stock location', async () => {
        const { deleteStockLocation } = await adminClient.query(TestDeleteStockLocationDocument, {
            input: {
                id: defaultStockLocationId,
            },
        });

        expect(deleteStockLocation.result).toBe(DeletionResult.NOT_DELETED);
        expect(deleteStockLocation.message).toBe('The last remaining StockLocation cannot be deleted');

        const { stockLocations } = await adminClient.query(TestGetStockLocationsListDocument);

        expect(stockLocations.items.length).toBe(1);
    });

    describe('multi channel', () => {
        const SECOND_CHANNEL_TOKEN = 'second_channel_token';
        let channelStockLocationId: string;
        let secondChannelId: string;
        const channelGuard: ErrorResultGuard<Codegen.ChannelFragment> =
            createErrorResultGuard<Codegen.ChannelFragment>(input => !!input.defaultLanguageCode);

        beforeAll(async () => {
            const { createStockLocation } = await adminClient.query(TestCreateStockLocationDocument, {
                input: {
                    name: 'Channel location',
                },
            });
            channelStockLocationId = createStockLocation.id;
            const { createChannel } = await adminClient.query<
                Codegen.CreateChannelMutation,
                Codegen.CreateChannelMutationVariables
            >(CREATE_CHANNEL, {
                input: {
                    code: 'second-channel',
                    token: SECOND_CHANNEL_TOKEN,
                    defaultLanguageCode: LanguageCode.en,
                    currencyCode: CurrencyCode.GBP,
                    pricesIncludeTax: true,
                    defaultShippingZoneId: 'T_1',
                    defaultTaxZoneId: 'T_1',
                },
            });
            channelGuard.assertSuccess(createChannel);
            secondChannelId = createChannel.id;

            await adminClient.query(AssignProductsToChannelDocument, {
                input: {
                    channelId: secondChannelId,
                    productIds: ['T_1'],
                },
            });
        });

        it('stock location not visible in channel before being assigned', async () => {
            adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
            const { stockLocations } = await adminClient.query(TestGetStockLocationsListDocument);

            expect(stockLocations.items.length).toBe(0);
        });

        it('assign stock location to channel', async () => {
            adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            const { assignStockLocationsToChannel } = await adminClient.query(
                TestAssignStockLocationToChannelDocument,
                {
                    input: {
                        stockLocationIds: [channelStockLocationId],
                        channelId: secondChannelId,
                    },
                },
            );
            expect(assignStockLocationsToChannel.length).toBe(1);
            expect(assignStockLocationsToChannel[0].name).toBe('Channel location');
        });

        it('stock location visible in channel once assigned', async () => {
            adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
            const { stockLocations } = await adminClient.query(TestGetStockLocationsListDocument);

            expect(stockLocations.items.length).toBe(1);
            expect(stockLocations.items[0].name).toBe('Channel location');
        });

        it('assign stock to location in channel', async () => {
            adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
            const { updateProductVariants } = await adminClient.query(TestSetStockLevelInLocationDocument, {
                input: {
                    id: 'T_1',
                    stockLevels: [
                        {
                            stockLocationId: channelStockLocationId,
                            stockOnHand: 10,
                        },
                    ],
                },
            });
        });

        it('assigned variant stock level visible in channel', async () => {
            adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
            const { productVariant } = await adminClient.query(TestGetStockLevelsForVariantDocument, {
                id: 'T_1',
            });

            expect(productVariant?.stockLevels.length).toBe(1);
            expect(productVariant?.stockLevels[0]).toEqual({
                stockOnHand: 10,
                stockAllocated: 0,
                stockLocationId: channelStockLocationId,
            });
        });

        it('remove stock location from channel', async () => {
            adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
            const { removeStockLocationsFromChannel } = await adminClient.query(
                TestRemoveStockLocationsFromChannelDocument,
                {
                    input: {
                        stockLocationIds: [channelStockLocationId],
                        channelId: secondChannelId,
                    },
                },
            );

            expect(removeStockLocationsFromChannel.length).toBe(1);
            expect(removeStockLocationsFromChannel[0].name).toBe('Channel location');
        });

        it('variant stock level no longer visible once removed from channel', async () => {
            adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
            const { productVariant } = await adminClient.query(TestGetStockLevelsForVariantDocument, {
                id: 'T_1',
            });

            expect(productVariant?.stockLevels.length).toBe(0);
        });
    });
});

const GET_STOCK_LOCATIONS_LIST = gql`
    query TestGetStockLocationsList($options: StockLocationListOptions) {
        stockLocations(options: $options) {
            items {
                id
                name
                description
            }
            totalItems
        }
    }
`;

const GET_STOCK_LOCATION = gql`
    query TestGetStockLocation($id: ID!) {
        stockLocation(id: $id) {
            id
            name
            description
        }
    }
`;

const CREATE_STOCK_LOCATION = gql`
    mutation TestCreateStockLocation($input: CreateStockLocationInput!) {
        createStockLocation(input: $input) {
            id
            name
            description
        }
    }
`;

const UPDATE_STOCK_LOCATION = gql`
    mutation TestUpdateStockLocation($input: UpdateStockLocationInput!) {
        updateStockLocation(input: $input) {
            id
            name
            description
        }
    }
`;

const DELETE_STOCK_LOCATION = gql`
    mutation TestDeleteStockLocation($input: DeleteStockLocationInput!) {
        deleteStockLocation(input: $input) {
            result
            message
        }
    }
`;

const GET_STOCK_LEVELS_FOR_VARIANT = gql`
    query TestGetStockLevelsForVariant($id: ID!) {
        productVariant(id: $id) {
            id
            stockLevels {
                stockOnHand
                stockAllocated
                stockLocationId
            }
        }
    }
`;

const SET_STOCK_LEVEL_IN_LOCATION = gql`
    mutation TestSetStockLevelInLocation($input: UpdateProductVariantInput!) {
        updateProductVariants(input: [$input]) {
            id
            stockLevels {
                stockOnHand
                stockAllocated
                stockLocationId
            }
        }
    }
`;

const ASSIGN_STOCK_LOCATION_TO_CHANNEL = gql`
    mutation TestAssignStockLocationToChannel($input: AssignStockLocationsToChannelInput!) {
        assignStockLocationsToChannel(input: $input) {
            id
            name
        }
    }
`;

const REMOVE_STOCK_LOCATIONS_FROM_CHANNEL = gql`
    mutation TestRemoveStockLocationsFromChannel($input: RemoveStockLocationsFromChannelInput!) {
        removeStockLocationsFromChannel(input: $input) {
            id
            name
        }
    }
`;
