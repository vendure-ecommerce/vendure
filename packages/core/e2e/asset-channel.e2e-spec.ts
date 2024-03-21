/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { createTestEnvironment, E2E_DEFAULT_CHANNEL_TOKEN } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';
import { DefaultLogger, LogLevel } from '../src/config';

import { ASSET_FRAGMENT } from './graphql/fragments';
import { CurrencyCode, LanguageCode } from './graphql/generated-e2e-admin-types';
import * as Codegen from './graphql/generated-e2e-admin-types';
import { DeletionResult } from './graphql/generated-e2e-shop-types';
import {
    ASSIGN_COLLECTIONS_TO_CHANNEL,
    ASSIGN_PRODUCT_TO_CHANNEL,
    CREATE_ASSETS,
    CREATE_CHANNEL,
    DELETE_ASSET,
    GET_ASSET,
    GET_PRODUCT_WITH_VARIANTS,
    UPDATE_COLLECTION,
    UPDATE_PRODUCT,
} from './graphql/shared-definitions';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';

const { server, adminClient } = createTestEnvironment(testConfig());
const SECOND_CHANNEL_TOKEN = 'second_channel_token';
let createdAssetId: string;
let channel2Id: string;
let featuredAssetId: string;

beforeAll(async () => {
    await server.init({
        initialData,
        productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
        customerCount: 1,
    });
    await adminClient.asSuperAdmin();
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
    channel2Id = createChannel.id;
}, TEST_SETUP_TIMEOUT_MS);

afterAll(async () => {
    await server.destroy();
});

describe('ChannelAware Assets', () => {
    it('Create asset in default channel', async () => {
        const filesToUpload = [path.join(__dirname, 'fixtures/assets/pps2.jpg')];
        const { createAssets }: Codegen.CreateAssetsMutation = await adminClient.fileUploadMutation({
            mutation: CREATE_ASSETS,
            filePaths: filesToUpload,
            mapVariables: filePaths => ({
                input: filePaths.map(p => ({ file: null })),
            }),
        });

        expect(createAssets.length).toBe(1);
        createdAssetId = createAssets[0].id;
        expect(createdAssetId).toBeDefined();
    });

    it('Get asset from default channel', async () => {
        const { asset } = await adminClient.query<Codegen.GetAssetQuery, Codegen.GetAssetQueryVariables>(
            GET_ASSET,
            {
                id: createdAssetId,
            },
        );
        expect(asset?.id).toEqual(createdAssetId);
    });

    it('Asset is not in channel2', async () => {
        adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
        const { asset } = await adminClient.query<Codegen.GetAssetQuery, Codegen.GetAssetQueryVariables>(
            GET_ASSET,
            {
                id: createdAssetId,
            },
        );
        expect(asset).toBe(null);
    });

    it('Add asset to channel2', async () => {
        adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
        const { assignAssetsToChannel: assets } = await adminClient.query<
            Codegen.AssignAssetsToChannelMutation,
            Codegen.AssignAssetsToChannelMutationVariables
        >(ASSIGN_ASSET_TO_CHANNEL, {
            input: {
                assetIds: [createdAssetId],
                channelId: channel2Id,
            },
        });
        expect(assets[0].id).toBe(createdAssetId);
    });

    it('Get asset from channel2', async () => {
        adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
        const { asset } = await adminClient.query<Codegen.GetAssetQuery, Codegen.GetAssetQueryVariables>(
            GET_ASSET,
            {
                id: createdAssetId,
            },
        );
        expect(asset?.id).toBe(createdAssetId);
    });

    it('Delete asset from channel2', async () => {
        const { deleteAsset } = await adminClient.query<
            Codegen.DeleteAssetMutation,
            Codegen.DeleteAssetMutationVariables
        >(DELETE_ASSET, {
            input: {
                assetId: createdAssetId,
            },
        });
        expect(deleteAsset.result).toBe(DeletionResult.DELETED);
    });

    it('Asset is available in default channel', async () => {
        adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
        const { asset } = await adminClient.query<Codegen.GetAssetQuery, Codegen.GetAssetQueryVariables>(
            GET_ASSET,
            {
                id: createdAssetId,
            },
        );
        expect(asset?.id).toEqual(createdAssetId);
    });

    it('Add asset to channel2', async () => {
        adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
        const { assignAssetsToChannel: assets } = await adminClient.query<
            Codegen.AssignAssetsToChannelMutation,
            Codegen.AssignAssetsToChannelMutationVariables
        >(ASSIGN_ASSET_TO_CHANNEL, {
            input: {
                assetIds: [createdAssetId],
                channelId: channel2Id,
            },
        });
        expect(assets[0].id).toBe(createdAssetId);
    });

    it(
        'Delete asset from all channels with insufficient permission',
        assertThrowsWithMessage(async () => {
            await adminClient.asAnonymousUser();
            const { deleteAsset } = await adminClient.query<
                Codegen.DeleteAssetMutation,
                Codegen.DeleteAssetMutationVariables
            >(DELETE_ASSET, {
                input: {
                    assetId: createdAssetId,
                    deleteFromAllChannels: true,
                },
            });
        }, 'You are not currently authorized to perform this action'),
    );

    it('Delete asset from all channels as superadmin', async () => {
        await adminClient.asSuperAdmin();
        adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
        const { deleteAsset } = await adminClient.query<
            Codegen.DeleteAssetMutation,
            Codegen.DeleteAssetMutationVariables
        >(DELETE_ASSET, {
            input: {
                assetId: createdAssetId,
                deleteFromAllChannels: true,
            },
        });
        expect(deleteAsset.result).toEqual(DeletionResult.DELETED);
    });

    it('Asset is also deleted in default channel', async () => {
        adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
        const { asset } = await adminClient.query<Codegen.GetAssetQuery, Codegen.GetAssetQueryVariables>(
            GET_ASSET,
            {
                id: createdAssetId,
            },
        );
        expect(asset?.id).toBeUndefined();
    });
});

describe('Product related assets', () => {
    it('Featured asset is available in default channel', async () => {
        adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
        const { product } = await adminClient.query<
            Codegen.GetProductWithVariantsQuery,
            Codegen.GetProductWithVariantsQueryVariables
        >(GET_PRODUCT_WITH_VARIANTS, {
            id: 'T_1',
        });
        featuredAssetId = product!.featuredAsset!.id;
        expect(featuredAssetId).toBeDefined();

        adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
        const { asset } = await adminClient.query<Codegen.GetAssetQuery, Codegen.GetAssetQueryVariables>(
            GET_ASSET,
            {
                id: featuredAssetId,
            },
        );
        expect(asset?.id).toEqual(featuredAssetId);
    });

    it('Featured asset is not available in channel2', async () => {
        adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
        const { asset } = await adminClient.query<Codegen.GetAssetQuery, Codegen.GetAssetQueryVariables>(
            GET_ASSET,
            {
                id: featuredAssetId,
            },
        );
        expect(asset?.id).toBeUndefined();
    });

    it('Add Product to channel2', async () => {
        adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
        const { assignProductsToChannel } = await adminClient.query<
            Codegen.AssignProductsToChannelMutation,
            Codegen.AssignProductsToChannelMutationVariables
        >(ASSIGN_PRODUCT_TO_CHANNEL, {
            input: {
                channelId: channel2Id,
                productIds: ['T_1'],
            },
        });
        expect(assignProductsToChannel[0].id).toEqual('T_1');
        expect(assignProductsToChannel[0].channels.map(c => c.id)).toContain(channel2Id);
    });

    it('Get featured asset from channel2', async () => {
        adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
        const { asset } = await adminClient.query<Codegen.GetAssetQuery, Codegen.GetAssetQueryVariables>(
            GET_ASSET,
            {
                id: featuredAssetId,
            },
        );
        expect(asset?.id).toEqual(featuredAssetId);
    });

    it('Add Product 2 to channel2', async () => {
        adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
        const { assignProductsToChannel } = await adminClient.query<
            Codegen.AssignProductsToChannelMutation,
            Codegen.AssignProductsToChannelMutationVariables
        >(ASSIGN_PRODUCT_TO_CHANNEL, {
            input: {
                channelId: channel2Id,
                productIds: ['T_2'],
            },
        });
        expect(assignProductsToChannel[0].id).toEqual('T_2');
        expect(assignProductsToChannel[0].channels.map(c => c.id)).toContain(channel2Id);
    });

    it('Add asset A to Product 2 in default channel', async () => {
        adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
        const { updateProduct } = await adminClient.query<
            Codegen.UpdateProductMutation,
            Codegen.UpdateProductMutationVariables
        >(UPDATE_PRODUCT, {
            input: {
                id: 'T_2',
                assetIds: ['T_3'],
            },
        });
        expect(updateProduct.assets.map(a => a.id)).toContain('T_3');
    });

    it('Channel2 does not have asset A', async () => {
        adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
        const { product } = await adminClient.query<
            Codegen.GetProductWithVariantsQuery,
            Codegen.GetProductWithVariantsQueryVariables
        >(GET_PRODUCT_WITH_VARIANTS, {
            id: 'T_2',
        });
        expect(product!.assets.find(a => a.id === 'T_3')).toBeUndefined();
    });
});

describe('Collection related assets', () => {
    let collectionFeaturedAssetId: string;
    it('Featured asset is available in default channel', async () => {
        adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);

        await adminClient.query<Codegen.UpdateCollectionMutation, Codegen.UpdateCollectionMutationVariables>(
            UPDATE_COLLECTION,
            {
                input: {
                    id: 'T_2',
                    featuredAssetId: 'T_3',
                    assetIds: ['T_3'],
                },
            },
        );

        const { collection } = await adminClient.query<
            Codegen.GetCollectionWithAssetsQuery,
            Codegen.GetCollectionWithAssetsQueryVariables
        >(GET_COLLECTION_WITH_ASSETS, {
            id: 'T_2',
        });
        collectionFeaturedAssetId = collection!.featuredAsset!.id;
        expect(collectionFeaturedAssetId).toBeDefined();

        adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
        const { asset } = await adminClient.query<Codegen.GetAssetQuery, Codegen.GetAssetQueryVariables>(
            GET_ASSET,
            {
                id: collectionFeaturedAssetId,
            },
        );
        expect(asset?.id).toEqual(collectionFeaturedAssetId);
    });

    it('Featured asset is not available in channel2', async () => {
        adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
        const { asset } = await adminClient.query<Codegen.GetAssetQuery, Codegen.GetAssetQueryVariables>(
            GET_ASSET,
            {
                id: collectionFeaturedAssetId,
            },
        );
        expect(asset?.id).toBeUndefined();
    });

    it('Add Collection to channel2', async () => {
        adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
        const { assignCollectionsToChannel } = await adminClient.query<
            Codegen.AssignCollectionsToChannelMutation,
            Codegen.AssignCollectionsToChannelMutationVariables
        >(ASSIGN_COLLECTIONS_TO_CHANNEL, {
            input: {
                channelId: channel2Id,
                collectionIds: ['T_2'],
            },
        });
        expect(assignCollectionsToChannel[0].id).toEqual('T_2');
    });

    it('Get featured asset from channel2', async () => {
        adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
        const { asset } = await adminClient.query<Codegen.GetAssetQuery, Codegen.GetAssetQueryVariables>(
            GET_ASSET,
            {
                id: collectionFeaturedAssetId,
            },
        );
        expect(asset?.id).toEqual(collectionFeaturedAssetId);
    });
});

const GET_COLLECTION_WITH_ASSETS = gql`
    query GetCollectionWithAssets($id: ID!) {
        collection(id: $id) {
            id
            name
            featuredAsset {
                ...Asset
            }
            assets {
                ...Asset
            }
        }
    }
    ${ASSET_FRAGMENT}
`;

export const ASSIGN_ASSET_TO_CHANNEL = gql`
    mutation assignAssetsToChannel($input: AssignAssetsToChannelInput!) {
        assignAssetsToChannel(input: $input) {
            ...Asset
        }
    }
    ${ASSET_FRAGMENT}
`;
