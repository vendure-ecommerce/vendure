import { DefaultLogger, LogLevel, mergeConfig } from '@vendure/core';
import { createTestEnvironment } from '@vendure/testing';
import fs from 'fs-extra';
import gql from 'graphql-tag';
import fetch from 'node-fetch';
import path from 'path';

import { initialData } from '../../../e2e-common/e2e-initial-data';
import { TEST_SETUP_TIMEOUT_MS, testConfig } from '../../../e2e-common/test-config';
import { AssetServerPlugin } from '../src/plugin';

import { CreateAssets } from './graphql/generated-e2e-asset-server-plugin-types';

const TEST_ASSET_DIR = 'test-assets';
const IMAGE_BASENAME = 'derick-david-409858-unsplash';

describe('AssetServerPlugin', () => {
    let asset: CreateAssets.CreateAssets;
    const sourceFilePath = path.join(__dirname, TEST_ASSET_DIR, `source/b6/${IMAGE_BASENAME}.jpg`);
    const previewFilePath = path.join(__dirname, TEST_ASSET_DIR, `preview/71/${IMAGE_BASENAME}__preview.jpg`);

    const { server, adminClient, shopClient } = createTestEnvironment(
        mergeConfig(testConfig, {
            port: 5050,
            workerOptions: {
                options: {
                    port: 5055,
                },
            },
            logger: new DefaultLogger({ level: LogLevel.Info }),
            plugins: [
                AssetServerPlugin.init({
                    port: 3060,
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
        const { createAssets }: CreateAssets.Mutation = await adminClient.fileUploadMutation({
            mutation: CREATE_ASSETS,
            filePaths: filesToUpload,
            mapVariables: filePaths => ({
                input: filePaths.map(p => ({ file: null })),
            }),
        });

        expect(createAssets[0].name).toBe(`${IMAGE_BASENAME}.jpg`);
        asset = createAssets[0];
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

    describe('caching', () => {
        const cacheDir = path.join(__dirname, TEST_ASSET_DIR, 'cache');

        it('cache initially empty', async () => {
            const files = await fs.readdir(cacheDir);
            expect(files.length).toBe(0);
        });

        it('creates cached image on first request', async () => {
            const res = await fetch(`${asset.preview}?preset=thumb`);
            const responseBuffer = await res.buffer();
            const cacheFileDir = path.join(__dirname, TEST_ASSET_DIR, 'cache', 'preview', '71');

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
            const cacheFileDir = path.join(__dirname, TEST_ASSET_DIR, 'cache', 'preview', '71');
            const files = await fs.readdir(cacheFileDir);

            expect(files.length).toBe(1);
        });

        it('does not create a new cached image for an untransformed image', async () => {
            const res = await fetch(`${asset.preview}`);
            const cacheFileDir = path.join(__dirname, TEST_ASSET_DIR, 'cache', 'preview', '71');
            const files = await fs.readdir(cacheFileDir);

            expect(files.length).toBe(1);
        });

        it('does not create a new cached image for an invalid preset', async () => {
            const res = await fetch(`${asset.preview}?preset=invalid`);
            const cacheFileDir = path.join(__dirname, TEST_ASSET_DIR, 'cache', 'preview', '71');
            const files = await fs.readdir(cacheFileDir);

            expect(files.length).toBe(1);

            const previewFile = await fs.readFile(previewFilePath);
            const responseBuffer = await res.buffer();
            expect(Buffer.compare(responseBuffer, previewFile)).toBe(0);
        });
    });
});

export const CREATE_ASSETS = gql`
    mutation CreateAssets($input: [CreateAssetInput!]!) {
        createAssets(input: $input) {
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
`;
