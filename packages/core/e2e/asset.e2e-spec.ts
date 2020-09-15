/* tslint:disable:no-non-null-assertion */
import { omit } from '@vendure/common/lib/omit';
import { mergeConfig } from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import gql from 'graphql-tag';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';

import { ASSET_FRAGMENT } from './graphql/fragments';
import {
    CreateAssets,
    DeleteAsset,
    DeletionResult,
    GetAsset,
    GetAssetList,
    GetProductWithVariants,
    SortOrder,
    UpdateAsset,
} from './graphql/generated-e2e-admin-types';
import {
    DELETE_ASSET,
    GET_ASSET_LIST,
    GET_PRODUCT_WITH_VARIANTS,
    UPDATE_ASSET,
} from './graphql/shared-definitions';
import { assertThrowsWithMessage } from './utils/assert-throws-with-message';

describe('Asset resolver', () => {
    const { server, adminClient } = createTestEnvironment(
        mergeConfig(testConfig, {
            assetOptions: {
                permittedFileTypes: ['image/*', '.pdf'],
            },
        }),
    );

    let firstAssetId: string;
    let createdAssetId: string;

    beforeAll(async () => {
        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-full.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('assets', async () => {
        const { assets } = await adminClient.query<GetAssetList.Query, GetAssetList.Variables>(
            GET_ASSET_LIST,
            {
                options: {
                    sort: {
                        name: SortOrder.ASC,
                    },
                },
            },
        );

        expect(assets.totalItems).toBe(4);
        expect(assets.items.map(a => omit(a, ['id']))).toEqual([
            {
                fileSize: 1680,
                mimeType: 'image/jpeg',
                name: 'alexandru-acea-686569-unsplash.jpg',
                preview: 'test-url/test-assets/alexandru-acea-686569-unsplash__preview.jpg',
                source: 'test-url/test-assets/alexandru-acea-686569-unsplash.jpg',
                type: 'IMAGE',
            },
            {
                fileSize: 1680,
                mimeType: 'image/jpeg',
                name: 'derick-david-409858-unsplash.jpg',
                preview: 'test-url/test-assets/derick-david-409858-unsplash__preview.jpg',
                source: 'test-url/test-assets/derick-david-409858-unsplash.jpg',
                type: 'IMAGE',
            },
            {
                fileSize: 1680,
                mimeType: 'image/jpeg',
                name: 'florian-olivo-1166419-unsplash.jpg',
                preview: 'test-url/test-assets/florian-olivo-1166419-unsplash__preview.jpg',
                source: 'test-url/test-assets/florian-olivo-1166419-unsplash.jpg',
                type: 'IMAGE',
            },
            {
                fileSize: 1680,
                mimeType: 'image/jpeg',
                name: 'vincent-botta-736919-unsplash.jpg',
                preview: 'test-url/test-assets/vincent-botta-736919-unsplash__preview.jpg',
                source: 'test-url/test-assets/vincent-botta-736919-unsplash.jpg',
                type: 'IMAGE',
            },
        ]);

        firstAssetId = assets.items[0].id;
    });

    it('asset', async () => {
        const { asset } = await adminClient.query<GetAsset.Query, GetAsset.Variables>(GET_ASSET, {
            id: firstAssetId,
        });

        expect(asset).toEqual({
            fileSize: 1680,
            height: 48,
            id: firstAssetId,
            mimeType: 'image/jpeg',
            name: 'alexandru-acea-686569-unsplash.jpg',
            preview: 'test-url/test-assets/alexandru-acea-686569-unsplash__preview.jpg',
            source: 'test-url/test-assets/alexandru-acea-686569-unsplash.jpg',
            type: 'IMAGE',
            width: 48,
        });
    });

    describe('createAssets', () => {
        it('permitted types by mime type', async () => {
            const filesToUpload = [
                path.join(__dirname, 'fixtures/assets/pps1.jpg'),
                path.join(__dirname, 'fixtures/assets/pps2.jpg'),
            ];
            const { createAssets }: CreateAssets.Mutation = await adminClient.fileUploadMutation({
                mutation: CREATE_ASSETS,
                filePaths: filesToUpload,
                mapVariables: filePaths => ({
                    input: filePaths.map(p => ({ file: null })),
                }),
            });

            expect(createAssets.map(a => omit(a, ['id'])).sort((a, b) => (a.name < b.name ? -1 : 1))).toEqual(
                [
                    {
                        fileSize: 1680,
                        focalPoint: null,
                        mimeType: 'image/jpeg',
                        name: 'pps1.jpg',
                        preview: 'test-url/test-assets/pps1__preview.jpg',
                        source: 'test-url/test-assets/pps1.jpg',
                        type: 'IMAGE',
                    },
                    {
                        fileSize: 1680,
                        focalPoint: null,
                        mimeType: 'image/jpeg',
                        name: 'pps2.jpg',
                        preview: 'test-url/test-assets/pps2__preview.jpg',
                        source: 'test-url/test-assets/pps2.jpg',
                        type: 'IMAGE',
                    },
                ],
            );

            createdAssetId = createAssets[0].id;
        });

        it('permitted type by file extension', async () => {
            const filesToUpload = [path.join(__dirname, 'fixtures/assets/dummy.pdf')];
            const { createAssets }: CreateAssets.Mutation = await adminClient.fileUploadMutation({
                mutation: CREATE_ASSETS,
                filePaths: filesToUpload,
                mapVariables: filePaths => ({
                    input: filePaths.map(p => ({ file: null })),
                }),
            });

            expect(createAssets.map(a => omit(a, ['id']))).toEqual([
                {
                    fileSize: 1680,
                    focalPoint: null,
                    mimeType: 'application/pdf',
                    name: 'dummy.pdf',
                    preview: 'test-url/test-assets/dummy__preview.pdf.png',
                    source: 'test-url/test-assets/dummy.pdf',
                    type: 'BINARY',
                },
            ]);
        });

        it(
            'not permitted type',
            assertThrowsWithMessage(async () => {
                const filesToUpload = [path.join(__dirname, 'fixtures/assets/dummy.txt')];
                const { createAssets }: CreateAssets.Mutation = await adminClient.fileUploadMutation({
                    mutation: CREATE_ASSETS,
                    filePaths: filesToUpload,
                    mapVariables: filePaths => ({
                        input: filePaths.map(p => ({ file: null })),
                    }),
                });
            }, `The MIME type 'text/plain' is not permitted.`),
        );
    });

    describe('updateAsset', () => {
        it('update name', async () => {
            const { updateAsset } = await adminClient.query<UpdateAsset.Mutation, UpdateAsset.Variables>(
                UPDATE_ASSET,
                {
                    input: {
                        id: firstAssetId,
                        name: 'new name',
                    },
                },
            );

            expect(updateAsset.name).toEqual('new name');
        });

        it('update focalPoint', async () => {
            const { updateAsset } = await adminClient.query<UpdateAsset.Mutation, UpdateAsset.Variables>(
                UPDATE_ASSET,
                {
                    input: {
                        id: firstAssetId,
                        focalPoint: {
                            x: 0.3,
                            y: 0.9,
                        },
                    },
                },
            );

            expect(updateAsset.focalPoint).toEqual({
                x: 0.3,
                y: 0.9,
            });
        });

        it('unset focalPoint', async () => {
            const { updateAsset } = await adminClient.query<UpdateAsset.Mutation, UpdateAsset.Variables>(
                UPDATE_ASSET,
                {
                    input: {
                        id: firstAssetId,
                        focalPoint: null,
                    },
                },
            );

            expect(updateAsset.focalPoint).toEqual(null);
        });
    });

    describe('deleteAsset', () => {
        let firstProduct: GetProductWithVariants.Product;

        beforeAll(async () => {
            const { product } = await adminClient.query<
                GetProductWithVariants.Query,
                GetProductWithVariants.Variables
            >(GET_PRODUCT_WITH_VARIANTS, {
                id: 'T_1',
            });

            firstProduct = product!;
        });

        it('non-featured asset', async () => {
            const { deleteAsset } = await adminClient.query<DeleteAsset.Mutation, DeleteAsset.Variables>(
                DELETE_ASSET,
                {
                    id: createdAssetId,
                },
            );

            expect(deleteAsset.result).toBe(DeletionResult.DELETED);

            const { asset } = await adminClient.query<GetAsset.Query, GetAsset.Variables>(GET_ASSET, {
                id: createdAssetId,
            });
            expect(asset).toBeNull();
        });

        it('featured asset not deleted', async () => {
            const { deleteAsset } = await adminClient.query<DeleteAsset.Mutation, DeleteAsset.Variables>(
                DELETE_ASSET,
                {
                    id: firstProduct.featuredAsset!.id,
                },
            );

            expect(deleteAsset.result).toBe(DeletionResult.NOT_DELETED);
            expect(deleteAsset.message).toContain(`The selected Asset is featured by 1 Product`);

            const { asset } = await adminClient.query<GetAsset.Query, GetAsset.Variables>(GET_ASSET, {
                id: firstAssetId,
            });
            expect(asset).not.toBeNull();
        });

        it('featured asset force deleted', async () => {
            const { product: p1 } = await adminClient.query<
                GetProductWithVariants.Query,
                GetProductWithVariants.Variables
            >(GET_PRODUCT_WITH_VARIANTS, {
                id: firstProduct.id,
            });
            expect(p1!.assets.length).toEqual(1);

            const { deleteAsset } = await adminClient.query<DeleteAsset.Mutation, DeleteAsset.Variables>(
                DELETE_ASSET,
                {
                    id: firstProduct.featuredAsset!.id,
                    force: true,
                },
            );

            expect(deleteAsset.result).toBe(DeletionResult.DELETED);

            const { asset } = await adminClient.query<GetAsset.Query, GetAsset.Variables>(GET_ASSET, {
                id: firstAssetId,
            });
            expect(asset).not.toBeNull();

            const { product } = await adminClient.query<
                GetProductWithVariants.Query,
                GetProductWithVariants.Variables
            >(GET_PRODUCT_WITH_VARIANTS, {
                id: firstProduct.id,
            });
            expect(product!.featuredAsset).toBeNull();
            expect(product!.assets.length).toEqual(0);
        });
    });
});

export const GET_ASSET = gql`
    query GetAsset($id: ID!) {
        asset(id: $id) {
            ...Asset
            width
            height
        }
    }
    ${ASSET_FRAGMENT}
`;

export const CREATE_ASSETS = gql`
    mutation CreateAssets($input: [CreateAssetInput!]!) {
        createAssets(input: $input) {
            ...Asset
            focalPoint {
                x
                y
            }
        }
    }
    ${ASSET_FRAGMENT}
`;
