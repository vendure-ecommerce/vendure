/* tslint:disable:no-non-null-assertion */
import { createTestEnvironment, E2E_DEFAULT_CHANNEL_TOKEN } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';
import { DefaultLogger, LogLevel } from '../src/config';

import { ASSET_FRAGMENT } from './graphql/fragments';
import {
    AssignAssetsToChannel,
    AssignProductsToChannel,
    CreateAssets,
    CreateChannel,
    CurrencyCode,
    DeleteAsset,
    DeletionResult,
    GetAsset,
    GetProductWithVariants,
    LanguageCode,
} from './graphql/generated-e2e-admin-types';
import {
    ASSIGN_PRODUCT_TO_CHANNEL,
    CREATE_ASSETS,
    CREATE_CHANNEL,
    DELETE_ASSET,
    GET_ASSET,
    GET_PRODUCT_WITH_VARIANTS,
} from './graphql/shared-definitions';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';

const { server, adminClient } = createTestEnvironment(testConfig);
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
    const { createChannel } = await adminClient.query<CreateChannel.Mutation, CreateChannel.Variables>(
        CREATE_CHANNEL,
        {
            input: {
                code: 'second-channel',
                token: SECOND_CHANNEL_TOKEN,
                defaultLanguageCode: LanguageCode.en,
                currencyCode: CurrencyCode.GBP,
                pricesIncludeTax: true,
                defaultShippingZoneId: 'T_1',
                defaultTaxZoneId: 'T_1',
            },
        },
    );
    channel2Id = createChannel.id;
}, TEST_SETUP_TIMEOUT_MS);

afterAll(async () => {
    await server.destroy();
});

describe('ChannelAware Assets', () => {
    it('Create asset in default channel', async () => {
        const filesToUpload = [path.join(__dirname, 'fixtures/assets/pps2.jpg')];
        const { createAssets }: CreateAssets.Mutation = await adminClient.fileUploadMutation({
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
        const { asset } = await adminClient.query<GetAsset.Query, GetAsset.Variables>(GET_ASSET, {
            id: createdAssetId,
        });
        expect(asset?.id).toEqual(createdAssetId);
    });

    it('Asset is not in channel2', async () => {
        await adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
        const { asset } = await adminClient.query<GetAsset.Query, GetAsset.Variables>(GET_ASSET, {
            id: createdAssetId,
        });
        expect(asset).toBe(null);
    });

    it('Add asset to channel2', async () => {
        await adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
        const { assignAssetsToChannel: assets } = await adminClient.query<
            AssignAssetsToChannel.Mutation,
            AssignAssetsToChannel.Variables
        >(ASSIGN_ASSET_TO_CHANNEL, {
            input: {
                assetIds: [createdAssetId],
                channelId: channel2Id,
            },
        });
        expect(assets[0].id).toBe(createdAssetId);
    });

    it('Get asset from channel2', async () => {
        await adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
        const { asset } = await adminClient.query<GetAsset.Query, GetAsset.Variables>(GET_ASSET, {
            id: createdAssetId,
        });
        expect(asset?.id).toBe(createdAssetId);
    });

    it('Delete asset from channel2', async () => {
        const { deleteAsset } = await adminClient.query<DeleteAsset.Mutation, DeleteAsset.Variables>(
            DELETE_ASSET,
            {
                input: {
                    assetId: createdAssetId,
                },
            },
        );
        expect(deleteAsset.result).toBe(DeletionResult.DELETED);
    });

    it('Asset is available in default channel', async () => {
        await adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
        const { asset } = await adminClient.query<GetAsset.Query, GetAsset.Variables>(GET_ASSET, {
            id: createdAssetId,
        });
        expect(asset?.id).toEqual(createdAssetId);
    });

    it('Add asset to channel2', async () => {
        await adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
        const { assignAssetsToChannel: assets } = await adminClient.query<
            AssignAssetsToChannel.Mutation,
            AssignAssetsToChannel.Variables
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
            const { deleteAsset } = await adminClient.query<DeleteAsset.Mutation, DeleteAsset.Variables>(
                DELETE_ASSET,
                {
                    input: {
                        assetId: createdAssetId,
                        deleteFromAllChannels: true,
                    },
                },
            );
        }, `You are not currently authorized to perform this action`),
    );

    it('Delete asset from all channels as superadmin', async () => {
        await adminClient.asSuperAdmin();
        await adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
        const { deleteAsset } = await adminClient.query<DeleteAsset.Mutation, DeleteAsset.Variables>(
            DELETE_ASSET,
            {
                input: {
                    assetId: createdAssetId,
                    deleteFromAllChannels: true,
                },
            },
        );
        expect(deleteAsset.result).toEqual(DeletionResult.DELETED);
    });

    it('Asset is also deleted in default channel', async () => {
        await adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
        const { asset } = await adminClient.query<GetAsset.Query, GetAsset.Variables>(GET_ASSET, {
            id: createdAssetId,
        });
        expect(asset?.id).toBeUndefined();
    });
});

describe('Product related assets', () => {
    it('Featured asset is available in default channel', async () => {
        await adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
        const { product } = await adminClient.query<
            GetProductWithVariants.Query,
            GetProductWithVariants.Variables
        >(GET_PRODUCT_WITH_VARIANTS, {
            id: 'T_1',
        });
        featuredAssetId = product!.featuredAsset!.id;
        expect(featuredAssetId).toBeDefined();

        await adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
        const { asset } = await adminClient.query<GetAsset.Query, GetAsset.Variables>(GET_ASSET, {
            id: featuredAssetId,
        });
        expect(asset?.id).toEqual(featuredAssetId);
    });

    it('Featured asset is not available in channel2', async () => {
        await adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
        const { asset } = await adminClient.query<GetAsset.Query, GetAsset.Variables>(GET_ASSET, {
            id: featuredAssetId,
        });
        expect(asset?.id).toBeUndefined();
    });

    it('Add Product to channel2', async () => {
        await adminClient.setChannelToken(E2E_DEFAULT_CHANNEL_TOKEN);
        const { assignProductsToChannel } = await adminClient.query<
            AssignProductsToChannel.Mutation,
            AssignProductsToChannel.Variables
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
        await adminClient.setChannelToken(SECOND_CHANNEL_TOKEN);
        const { asset } = await adminClient.query<GetAsset.Query, GetAsset.Variables>(GET_ASSET, {
            id: featuredAssetId,
        });
        expect(asset?.id).toEqual(featuredAssetId);
    });
});

export const ASSIGN_ASSET_TO_CHANNEL = gql`
    mutation assignAssetsToChannel($input: AssignAssetsToChannelInput!) {
        assignAssetsToChannel(input: $input) {
            ...Asset
        }
    }
    ${ASSET_FRAGMENT}
`;
