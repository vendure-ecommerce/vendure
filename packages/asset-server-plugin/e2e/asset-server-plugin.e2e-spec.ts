/* eslint-disable @typescript-eslint/no-non-null-assertion */
import { ConfigService, mergeConfig } from '@vendure/core';
import { AssetFragment } from '@vendure/core/e2e/graphql/generated-e2e-admin-types';
import { createTestEnvironment } from '@vendure/testing';
import { exec } from 'child_process';
import fs from 'fs-extra';
import gql from 'graphql-tag';
import fetch from 'node-fetch';
import path from 'path';
import { afterAll, beforeAll, describe, expect, it } from 'vitest';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { testConfig, TEST_SETUP_TIMEOUT_MS } from '../../../e2e-common/test-config';
import { AssetServerPlugin } from '../src/plugin';

import {
    CreateAssetsMutation,
    DeleteAssetMutation,
    DeleteAssetMutationVariables,
    DeletionResult,
} from './graphql/generated-e2e-asset-server-plugin-types';

const TEST_ASSET_DIR = 'test-assets';
const IMAGE_BASENAME = 'derick-david-409858-unsplash';

describe('AssetServerPlugin', () => {
    let asset: AssetFragment;
    const sourceFilePath = path.join(__dirname, TEST_ASSET_DIR, `source/b6/${IMAGE_BASENAME}.jpg`);
    const previewFilePath = path.join(__dirname, TEST_ASSET_DIR, `preview/71/${IMAGE_BASENAME}__preview.jpg`);

    const { server, adminClient, shopClient } = createTestEnvironment(
        mergeConfig(testConfig(), {
            // logger: new DefaultLogger({ level: LogLevel.Info }),
            plugins: [
                AssetServerPlugin.init({
                    assetUploadDir: path.join(__dirname, TEST_ASSET_DIR),
                    route: 'assets',
                }),
            ],
        }),
    );

    beforeAll(async () => {
        await fs.emptyDir(path.join(__dirname, TEST_ASSET_DIR, 'source'));
        await fs.emptyDir(path.join(__dirname, TEST_ASSET_DIR, 'preview'));
        await fs.emptyDir(path.join(__dirname, TEST_ASSET_DIR, 'cache'));

        await server.init({
            initialData,
            productsCsvPath: path.join(__dirname, 'fixtures/e2e-products-empty.csv'),
            customerCount: 1,
        });
        await adminClient.asSuperAdmin();
    }, TEST_SETUP_TIMEOUT_MS);

    afterAll(async () => {
        await server.destroy();
    });

    it('names the Asset correctly', async () => {
        const filesToUpload = [path.join(__dirname, `fixtures/assets/${IMAGE_BASENAME}.jpg`)];
        const { createAssets }: CreateAssetsMutation = await adminClient.fileUploadMutation({
            mutation: CREATE_ASSETS,
            filePaths: filesToUpload,
            mapVariables: filePaths => ({
                input: filePaths.map(p => ({ file: null })),
            }),
        });

        asset = createAssets[0] as AssetFragment;
        expect(asset.name).toBe(`${IMAGE_BASENAME}.jpg`);
    });

    it('creates the expected asset files', async () => {
        expect(fs.existsSync(sourceFilePath)).toBe(true);
        expect(fs.existsSync(previewFilePath)).toBe(true);
    });

    it('serves the source file', async () => {
        const res = await fetch(`${asset.source}`);
        const responseBuffer = await res.buffer();
        const sourceFile = await fs.readFile(sourceFilePath);

        expect(Buffer.compare(responseBuffer, sourceFile)).toBe(0);
    });

    it('serves the untransformed preview file', async () => {
        const res = await fetch(`${asset.preview}`);
        const responseBuffer = await res.buffer();
        const previewFile = await fs.readFile(previewFilePath);

        expect(Buffer.compare(responseBuffer, previewFile)).toBe(0);
    });

    it('can handle non-latin filenames', async () => {
        const FILE_NAME_ZH = '白飯';
        const filesToUpload = [path.join(__dirname, `fixtures/assets/${FILE_NAME_ZH}.jpg`)];
        const { createAssets }: { createAssets: AssetFragment[] } = await adminClient.fileUploadMutation({
            mutation: CREATE_ASSETS,
            filePaths: filesToUpload,
            mapVariables: filePaths => ({
                input: filePaths.map(p => ({ file: null })),
            }),
        });
        expect(createAssets[0].name).toBe(`${FILE_NAME_ZH}.jpg`);
        expect(createAssets[0].source).toContain(`${FILE_NAME_ZH}.jpg`);

        const previewUrl = encodeURI(`${createAssets[0].preview}`);
        const res = await fetch(previewUrl);

        expect(res.status).toBe(200);

        const previewFilePathZH = path.join(
            __dirname,
            TEST_ASSET_DIR,
            `preview/3f/${FILE_NAME_ZH}__preview.jpg`,
        );

        const responseBuffer = await res.buffer();
        const previewFile = await fs.readFile(previewFilePathZH);

        expect(Buffer.compare(responseBuffer, previewFile)).toBe(0);
    });

    describe('caching', () => {
        const cacheDir = path.join(__dirname, TEST_ASSET_DIR, 'cache');
        const cacheFileDir = path.join(__dirname, TEST_ASSET_DIR, 'cache', 'preview', '71');

        it('cache initially empty', async () => {
            const files = await fs.readdir(cacheDir);
            expect(files.length).toBe(0);
        });

        it('creates cached image on first request', async () => {
            const res = await fetch(`${asset.preview}?preset=thumb`);
            const responseBuffer = await res.buffer();
            expect(fs.existsSync(cacheFileDir)).toBe(true);

            const files = await fs.readdir(cacheFileDir);
            expect(files.length).toBe(1);
            expect(files[0]).toContain(`${IMAGE_BASENAME}__preview`);

            const cachedFile = await fs.readFile(path.join(cacheFileDir, files[0]));

            // was the file returned the exact same file as is stored in the cache dir?
            expect(Buffer.compare(responseBuffer, cachedFile)).toBe(0);
        });

        it('does not create a new cached image on a second request', async () => {
            const res = await fetch(`${asset.preview}?preset=thumb`);
            const files = await fs.readdir(cacheFileDir);

            expect(files.length).toBe(1);
        });

        it('does not create a new cached image for an untransformed image', async () => {
            const res = await fetch(`${asset.preview}`);
            const files = await fs.readdir(cacheFileDir);

            expect(files.length).toBe(1);
        });

        it('does not create a new cached image for an invalid preset', async () => {
            const res = await fetch(`${asset.preview}?preset=invalid`);
            const files = await fs.readdir(cacheFileDir);

            expect(files.length).toBe(1);

            const previewFile = await fs.readFile(previewFilePath);
            const responseBuffer = await res.buffer();
            expect(Buffer.compare(responseBuffer, previewFile)).toBe(0);
        });

        it('does not create a new cached image if cache=false', async () => {
            const res = await fetch(`${asset.preview}?preset=tiny&cache=false`);
            const files = await fs.readdir(cacheFileDir);

            expect(files.length).toBe(1);
        });

        it('creates a new cached image if cache=true', async () => {
            const res = await fetch(`${asset.preview}?preset=tiny&cache=true`);
            const files = await fs.readdir(cacheFileDir);

            expect(files.length).toBe(2);
        });
    });

    describe('unexpected input', () => {
        it('does not error on non-integer width', async () => {
            return fetch(`${asset.preview}?w=10.5`);
        });

        it('does not error on non-integer height', async () => {
            return fetch(`${asset.preview}?h=10.5`);
        });

        // https://github.com/vendure-ecommerce/vendure/security/advisories/GHSA-r9mq-3c9r-fmjq
        describe('path traversal', () => {
            function curlWithPathAsIs(url: string) {
                return new Promise<string>((resolve, reject) => {
                    // We use curl here rather than node-fetch or any other fetch-type function because
                    // those will automatically perform path normalization which will mask the path traversal
                    return exec(`curl --path-as-is ${url}`, (err, stdout, stderr) => {
                        if (err) {
                            reject(err);
                        }
                        resolve(stdout);
                    });
                });
            }

            function testPathTraversalOnUrl(urlPath: string) {
                return async () => {
                    const port = server.app.get(ConfigService).apiOptions.port;
                    const result = await curlWithPathAsIs(`http://localhost:${port}/assets${urlPath}`);
                    expect(result).not.toContain('@vendure/asset-server-plugin');
                    expect(result.toLowerCase()).toContain('resource not found');
                };
            }

            it('blocks path traversal 1', testPathTraversalOnUrl(`/../../package.json`));
            it('blocks path traversal 2', testPathTraversalOnUrl(`/foo/../../../package.json`));
            it('blocks path traversal 3', testPathTraversalOnUrl(`/foo/../../../foo/../package.json`));
            it('blocks path traversal 4', testPathTraversalOnUrl(`/%2F..%2F..%2Fpackage.json`));
            it('blocks path traversal 5', testPathTraversalOnUrl(`/%2E%2E/%2E%2E/package.json`));
            it('blocks path traversal 6', testPathTraversalOnUrl(`/..//..//package.json`));
            it('blocks path traversal 7', testPathTraversalOnUrl(`/.%2F.%2F.%2Fpackage.json`));
            it('blocks path traversal 8', testPathTraversalOnUrl(`/..\\\\..\\\\package.json`));
            it('blocks path traversal 9', testPathTraversalOnUrl(`/\\\\\\..\\\\\\..\\\\\\package.json`));
        });
    });

    describe('deletion', () => {
        it('deleting Asset deletes binary file', async () => {
            const { deleteAsset } = await adminClient.query<
                DeleteAssetMutation,
                DeleteAssetMutationVariables
            >(DELETE_ASSET, {
                input: {
                    assetId: asset.id,
                    force: true,
                },
            });

            expect(deleteAsset.result).toBe(DeletionResult.DELETED);

            expect(fs.existsSync(sourceFilePath)).toBe(false);
            expect(fs.existsSync(previewFilePath)).toBe(false);
        });
    });

    describe('MIME type detection', () => {
        let testImages: AssetFragment[] = [];

        async function testMimeTypeOfAssetWithExt(ext: string, expectedMimeType: string) {
            const testImage = testImages.find(i => i.source.endsWith(ext))!;
            const result = await fetch(testImage.source);
            const contentType = result.headers.get('Content-Type');

            expect(contentType).toBe(expectedMimeType);
        }

        beforeAll(async () => {
            const formats = ['gif', 'jpg', 'png', 'svg', 'tiff', 'webp'];

            const filesToUpload = formats.map(ext => path.join(__dirname, `fixtures/assets/test.${ext}`));
            const { createAssets }: CreateAssetsMutation = await adminClient.fileUploadMutation({
                mutation: CREATE_ASSETS,
                filePaths: filesToUpload,
                mapVariables: filePaths => ({
                    input: filePaths.map(p => ({ file: null })),
                }),
            });

            testImages = createAssets as AssetFragment[];
        });

        it('gif', async () => {
            await testMimeTypeOfAssetWithExt('gif', 'image/gif');
        });

        it('jpg', async () => {
            await testMimeTypeOfAssetWithExt('jpg', 'image/jpeg');
        });

        it('png', async () => {
            await testMimeTypeOfAssetWithExt('png', 'image/png');
        });

        it('svg', async () => {
            await testMimeTypeOfAssetWithExt('svg', 'image/svg+xml');
        });

        it('tiff', async () => {
            await testMimeTypeOfAssetWithExt('tiff', 'image/tiff');
        });

        it('webp', async () => {
            await testMimeTypeOfAssetWithExt('webp', 'image/webp');
        });
    });

    // https://github.com/vendure-ecommerce/vendure/issues/1563
    it('falls back to binary preview if image file cannot be processed', async () => {
        const filesToUpload = [path.join(__dirname, 'fixtures/assets/bad-image.jpg')];
        const { createAssets }: CreateAssetsMutation = await adminClient.fileUploadMutation({
            mutation: CREATE_ASSETS,
            filePaths: filesToUpload,
            mapVariables: filePaths => ({
                input: filePaths.map(p => ({ file: null })),
            }),
        });

        expect(createAssets.length).toBe(1);
        expect(createAssets[0].name).toBe('bad-image.jpg');
    });
});

export const CREATE_ASSETS = gql`
    mutation CreateAssets($input: [CreateAssetInput!]!) {
        createAssets(input: $input) {
            ... on Asset {
                id
                name
                source
                preview
                focalPoint {
                    x
                    y
                }
            }
        }
    }
`;

export const DELETE_ASSET = gql`
    mutation DeleteAsset($input: DeleteAssetInput!) {
        deleteAsset(input: $input) {
            result
        }
    }
`;
