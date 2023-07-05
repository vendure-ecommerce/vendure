/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { omit } from '@vendure/common/lib/omit';
import { pick } from '@vendure/common/lib/pick';
import { mergeConfig } from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import fs from 'fs-extra';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';

import {
    AssetFragment,
    AssetWithTagsAndFocalPointFragment,
    CreateAssetsMutation,
    DeletionResult,
    GetProductWithVariantsQuery,
    LogicalOperator,
    SortOrder,
} from './graphql/generated-e2e-admin-types';
import * as Codegen from './graphql/generated-e2e-admin-types';
import {
    CREATE_ASSETS,
    DELETE_ASSET,
    GET_ASSET,
    GET_ASSET_FRAGMENT_FIRST,
    GET_ASSET_LIST,
    GET_PRODUCT_WITH_VARIANTS,
    UPDATE_ASSET,
} from './graphql/shared-definitions';

describe('Asset resolver', () => {
    const { server, adminClient } = createTestEnvironment(
        mergeConfig(testConfig(), {
            assetOptions: {
                permittedFileTypes: ['image/*', '.pdf', '.zip'],
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
        const { assets } = await adminClient.query<
            Codegen.GetAssetListQuery,
            Codegen.GetAssetListQueryVariables
        >(GET_ASSET_LIST, {
            options: {
                sort: {
                    name: SortOrder.ASC,
                },
            },
        });

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
        const { asset } = await adminClient.query<Codegen.GetAssetQuery, Codegen.GetAssetQueryVariables>(
            GET_ASSET,
            {
                id: firstAssetId,
            },
        );

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

    /**
     * https://github.com/vendure-ecommerce/vendure/issues/459
     */
    it('transforms URL when fragment defined before query (GH issue #459)', async () => {
        const { asset } = await adminClient.query<
            Codegen.GetAssetFragmentFirstQuery,
            Codegen.GetAssetFragmentFirstQueryVariables
        >(GET_ASSET_FRAGMENT_FIRST, {
            id: firstAssetId,
        });

        expect(asset?.preview).toBe('test-url/test-assets/alexandru-acea-686569-unsplash__preview.jpg');
    });

    describe('createAssets', () => {
        function isAsset(
            input: CreateAssetsMutation['createAssets'][number],
        ): input is AssetWithTagsAndFocalPointFragment {
            return input.hasOwnProperty('name');
        }

        it('permitted types by mime type', async () => {
            const filesToUpload = [
                path.join(__dirname, 'fixtures/assets/pps1.jpg'),
                path.join(__dirname, 'fixtures/assets/pps2.jpg'),
            ];
            const { createAssets }: Codegen.CreateAssetsMutation = await adminClient.fileUploadMutation({
                mutation: CREATE_ASSETS,
                filePaths: filesToUpload,
                mapVariables: filePaths => ({
                    input: filePaths.map(p => ({ file: null })),
                }),
            });

            expect(createAssets.length).toBe(2);
            const results = createAssets.filter(isAsset);
            expect(results.map(a => omit(a, ['id'])).sort((a, b) => (a.name < b.name ? -1 : 1))).toEqual([
                {
                    fileSize: 1680,
                    focalPoint: null,
                    mimeType: 'image/jpeg',
                    name: 'pps1.jpg',
                    preview: 'test-url/test-assets/pps1__preview.jpg',
                    source: 'test-url/test-assets/pps1.jpg',
                    tags: [],
                    type: 'IMAGE',
                },
                {
                    fileSize: 1680,
                    focalPoint: null,
                    mimeType: 'image/jpeg',
                    name: 'pps2.jpg',
                    preview: 'test-url/test-assets/pps2__preview.jpg',
                    source: 'test-url/test-assets/pps2.jpg',
                    tags: [],
                    type: 'IMAGE',
                },
            ]);

            createdAssetId = results[0].id;
        });

        it('permitted type by file extension', async () => {
            const filesToUpload = [path.join(__dirname, 'fixtures/assets/dummy.pdf')];
            const { createAssets }: Codegen.CreateAssetsMutation = await adminClient.fileUploadMutation({
                mutation: CREATE_ASSETS,
                filePaths: filesToUpload,
                mapVariables: filePaths => ({
                    input: filePaths.map(p => ({ file: null })),
                }),
            });

            expect(createAssets.length).toBe(1);
            const results = createAssets.filter(isAsset);
            expect(results.map(a => omit(a, ['id']))).toEqual([
                {
                    fileSize: 1680,
                    focalPoint: null,
                    mimeType: 'application/pdf',
                    name: 'dummy.pdf',
                    preview: 'test-url/test-assets/dummy__preview.pdf.png',
                    source: 'test-url/test-assets/dummy.pdf',
                    tags: [],
                    type: 'BINARY',
                },
            ]);
        });

        // https://github.com/vendure-ecommerce/vendure/issues/727
        it('file extension with shared type', async () => {
            const filesToUpload = [path.join(__dirname, 'fixtures/assets/dummy.zip')];
            const { createAssets }: Codegen.CreateAssetsMutation = await adminClient.fileUploadMutation({
                mutation: CREATE_ASSETS,
                filePaths: filesToUpload,
                mapVariables: filePaths => ({
                    input: filePaths.map(p => ({ file: null })),
                }),
            });

            expect(createAssets.length).toBe(1);

            expect(isAsset(createAssets[0])).toBe(true);
            const results = createAssets.filter(isAsset);
            expect(results.map(a => omit(a, ['id']))).toEqual([
                {
                    fileSize: 1680,
                    focalPoint: null,
                    mimeType: 'application/zip',
                    name: 'dummy.zip',
                    preview: 'test-url/test-assets/dummy__preview.zip.png',
                    source: 'test-url/test-assets/dummy.zip',
                    tags: [],
                    type: 'BINARY',
                },
            ]);
        });

        it('not permitted type', async () => {
            const filesToUpload = [path.join(__dirname, 'fixtures/assets/dummy.txt')];
            const { createAssets }: Codegen.CreateAssetsMutation = await adminClient.fileUploadMutation({
                mutation: CREATE_ASSETS,
                filePaths: filesToUpload,
                mapVariables: filePaths => ({
                    input: filePaths.map(p => ({ file: null })),
                }),
            });

            expect(createAssets.length).toBe(1);
            expect(createAssets[0]).toEqual({
                message: 'The MIME type "text/plain" is not permitted.',
                mimeType: 'text/plain',
                fileName: 'dummy.txt',
            });
        });

        it('create with new tags', async () => {
            const filesToUpload = [path.join(__dirname, 'fixtures/assets/pps1.jpg')];
            const { createAssets }: Codegen.CreateAssetsMutation = await adminClient.fileUploadMutation({
                mutation: CREATE_ASSETS,
                filePaths: filesToUpload,
                mapVariables: filePaths => ({
                    input: filePaths.map(p => ({ file: null, tags: ['foo', 'bar'] })),
                }),
            });
            const results = createAssets.filter(isAsset);

            expect(results.map(a => pick(a, ['id', 'name', 'tags']))).toEqual([
                {
                    id: 'T_9',
                    name: 'pps1.jpg',
                    tags: [
                        { id: 'T_1', value: 'foo' },
                        { id: 'T_2', value: 'bar' },
                    ],
                },
            ]);
        });

        it('create with existing tags', async () => {
            const filesToUpload = [path.join(__dirname, 'fixtures/assets/pps1.jpg')];
            const { createAssets }: Codegen.CreateAssetsMutation = await adminClient.fileUploadMutation({
                mutation: CREATE_ASSETS,
                filePaths: filesToUpload,
                mapVariables: filePaths => ({
                    input: filePaths.map(p => ({ file: null, tags: ['foo', 'bar'] })),
                }),
            });
            const results = createAssets.filter(isAsset);

            expect(results.map(a => pick(a, ['id', 'name', 'tags']))).toEqual([
                {
                    id: 'T_10',
                    name: 'pps1.jpg',
                    tags: [
                        { id: 'T_1', value: 'foo' },
                        { id: 'T_2', value: 'bar' },
                    ],
                },
            ]);
        });

        it('create with new and existing tags', async () => {
            const filesToUpload = [path.join(__dirname, 'fixtures/assets/pps1.jpg')];
            const { createAssets }: Codegen.CreateAssetsMutation = await adminClient.fileUploadMutation({
                mutation: CREATE_ASSETS,
                filePaths: filesToUpload,
                mapVariables: filePaths => ({
                    input: filePaths.map(p => ({ file: null, tags: ['quux', 'bar'] })),
                }),
            });
            const results = createAssets.filter(isAsset);

            expect(results.map(a => pick(a, ['id', 'name', 'tags']))).toEqual([
                {
                    id: 'T_11',
                    name: 'pps1.jpg',
                    tags: [
                        { id: 'T_3', value: 'quux' },
                        { id: 'T_2', value: 'bar' },
                    ],
                },
            ]);
        });

        // https://github.com/vendure-ecommerce/vendure/issues/990
        it('errors if the filesize is too large', async () => {
            /**
             * Based on https://stackoverflow.com/a/49433633/772859
             */
            function createEmptyFileOfSize(fileName: string, sizeInBytes: number) {
                return new Promise((resolve, reject) => {
                    const fh = fs.openSync(fileName, 'w');
                    fs.writeSync(fh, 'ok', Math.max(0, sizeInBytes - 2));
                    fs.closeSync(fh);
                    resolve(true);
                });
            }

            const twentyOneMib = 22020096;
            const filename = path.join(__dirname, 'fixtures/assets/temp_large_file.pdf');
            await createEmptyFileOfSize(filename, twentyOneMib);

            try {
                const { createAssets }: Codegen.CreateAssetsMutation = await adminClient.fileUploadMutation({
                    mutation: CREATE_ASSETS,
                    filePaths: [filename],
                    mapVariables: filePaths => ({
                        input: filePaths.map(p => ({ file: null })),
                    }),
                });
                fail('Should have thrown');
            } catch (e: any) {
                expect(e.message).toContain('File truncated as it exceeds the 20971520 byte size limit');
            } finally {
                fs.rmSync(filename);
            }
        });
    });

    describe('filter by tags', () => {
        it('and', async () => {
            const { assets } = await adminClient.query<
                Codegen.GetAssetListQuery,
                Codegen.GetAssetListQueryVariables
            >(GET_ASSET_LIST, {
                options: {
                    tags: ['foo', 'bar'],
                    tagsOperator: LogicalOperator.AND,
                },
            });

            expect(assets.items.map(i => i.id).sort()).toEqual(['T_10', 'T_9']);
        });

        it('or', async () => {
            const { assets } = await adminClient.query<
                Codegen.GetAssetListQuery,
                Codegen.GetAssetListQueryVariables
            >(GET_ASSET_LIST, {
                options: {
                    tags: ['foo', 'bar'],
                    tagsOperator: LogicalOperator.OR,
                },
            });

            expect(assets.items.map(i => i.id).sort()).toEqual(['T_10', 'T_11', 'T_9']);
        });

        it('empty array', async () => {
            const { assets } = await adminClient.query<
                Codegen.GetAssetListQuery,
                Codegen.GetAssetListQueryVariables
            >(GET_ASSET_LIST, {
                options: {
                    tags: [],
                },
            });

            expect(assets.totalItems).toBe(11);
        });
    });

    describe('updateAsset', () => {
        it('update name', async () => {
            const { updateAsset } = await adminClient.query<
                Codegen.UpdateAssetMutation,
                Codegen.UpdateAssetMutationVariables
            >(UPDATE_ASSET, {
                input: {
                    id: firstAssetId,
                    name: 'new name',
                },
            });

            expect(updateAsset.name).toEqual('new name');
        });

        it('update focalPoint', async () => {
            const { updateAsset } = await adminClient.query<
                Codegen.UpdateAssetMutation,
                Codegen.UpdateAssetMutationVariables
            >(UPDATE_ASSET, {
                input: {
                    id: firstAssetId,
                    focalPoint: {
                        x: 0.3,
                        y: 0.9,
                    },
                },
            });

            expect(updateAsset.focalPoint).toEqual({
                x: 0.3,
                y: 0.9,
            });
        });

        it('unset focalPoint', async () => {
            const { updateAsset } = await adminClient.query<
                Codegen.UpdateAssetMutation,
                Codegen.UpdateAssetMutationVariables
            >(UPDATE_ASSET, {
                input: {
                    id: firstAssetId,
                    focalPoint: null,
                },
            });

            expect(updateAsset.focalPoint).toEqual(null);
        });

        it('update tags', async () => {
            const { updateAsset } = await adminClient.query<
                Codegen.UpdateAssetMutation,
                Codegen.UpdateAssetMutationVariables
            >(UPDATE_ASSET, {
                input: {
                    id: firstAssetId,
                    tags: ['foo', 'quux'],
                },
            });

            expect(updateAsset.tags).toEqual([
                { id: 'T_1', value: 'foo' },
                { id: 'T_3', value: 'quux' },
            ]);
        });

        it('remove tags', async () => {
            const { updateAsset } = await adminClient.query<
                Codegen.UpdateAssetMutation,
                Codegen.UpdateAssetMutationVariables
            >(UPDATE_ASSET, {
                input: {
                    id: firstAssetId,
                    tags: [],
                },
            });

            expect(updateAsset.tags).toEqual([]);
        });
    });

    describe('deleteAsset', () => {
        let firstProduct: NonNullable<GetProductWithVariantsQuery['product']>;

        beforeAll(async () => {
            const { product } = await adminClient.query<
                Codegen.GetProductWithVariantsQuery,
                Codegen.GetProductWithVariantsQueryVariables
            >(GET_PRODUCT_WITH_VARIANTS, {
                id: 'T_1',
            });

            firstProduct = product!;
        });

        it('non-featured asset', async () => {
            const { deleteAsset } = await adminClient.query<
                Codegen.DeleteAssetMutation,
                Codegen.DeleteAssetMutationVariables
            >(DELETE_ASSET, {
                input: {
                    assetId: createdAssetId,
                },
            });

            expect(deleteAsset.result).toBe(DeletionResult.DELETED);

            const { asset } = await adminClient.query<Codegen.GetAssetQuery, Codegen.GetAssetQueryVariables>(
                GET_ASSET,
                {
                    id: createdAssetId,
                },
            );
            expect(asset).toBeNull();
        });

        it('featured asset not deleted', async () => {
            const { deleteAsset } = await adminClient.query<
                Codegen.DeleteAssetMutation,
                Codegen.DeleteAssetMutationVariables
            >(DELETE_ASSET, {
                input: {
                    assetId: firstProduct.featuredAsset!.id,
                },
            });

            expect(deleteAsset.result).toBe(DeletionResult.NOT_DELETED);
            expect(deleteAsset.message).toContain('The selected Asset is featured by 1 Product');

            const { asset } = await adminClient.query<Codegen.GetAssetQuery, Codegen.GetAssetQueryVariables>(
                GET_ASSET,
                {
                    id: firstAssetId,
                },
            );
            expect(asset).not.toBeNull();
        });

        it('featured asset force deleted', async () => {
            const { product: p1 } = await adminClient.query<
                Codegen.GetProductWithVariantsQuery,
                Codegen.GetProductWithVariantsQueryVariables
            >(GET_PRODUCT_WITH_VARIANTS, {
                id: firstProduct.id,
            });
            expect(p1!.assets.length).toEqual(1);

            const { deleteAsset } = await adminClient.query<
                Codegen.DeleteAssetMutation,
                Codegen.DeleteAssetMutationVariables
            >(DELETE_ASSET, {
                input: {
                    assetId: firstProduct.featuredAsset!.id,
                    force: true,
                },
            });

            expect(deleteAsset.result).toBe(DeletionResult.DELETED);

            const { asset } = await adminClient.query<Codegen.GetAssetQuery, Codegen.GetAssetQueryVariables>(
                GET_ASSET,
                {
                    id: firstAssetId,
                },
            );
            expect(asset).not.toBeNull();

            const { product } = await adminClient.query<
                Codegen.GetProductWithVariantsQuery,
                Codegen.GetProductWithVariantsQueryVariables
            >(GET_PRODUCT_WITH_VARIANTS, {
                id: firstProduct.id,
            });
            expect(product!.featuredAsset).toBeNull();
            expect(product!.assets.length).toEqual(0);
        });
    });
});
