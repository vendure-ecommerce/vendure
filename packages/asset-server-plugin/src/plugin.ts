import {
    MiddlewareConsumer,
    NestModule,
    OnApplicationBootstrap,
    Inject,
    OnApplicationShutdown,
} from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Type } from '@vendure/common/lib/shared-types';
import {
    AssetStorageStrategy,
    Injector,
    Logger,
    PluginCommonModule,
    ProcessContext,
    registerPluginStartupMessage,
    RuntimeVendureConfig,
    VendurePlugin,
} from '@vendure/core';
import { createHash } from 'crypto';
import express, { NextFunction, Request, Response } from 'express';
import fs from 'fs-extra';
import path from 'path';

import { getValidFormat } from './common';
import { ASSET_SERVER_PLUGIN_INIT_OPTIONS, DEFAULT_CACHE_HEADER, loggerCtx } from './constants';
import { defaultAssetStorageStrategyFactory } from './default-asset-storage-strategy-factory';
import { HashedAssetNamingStrategy } from './hashed-asset-naming-strategy';
import { ImageTransformParameters, ImageTransformStrategy } from './image-transform-strategy';
import { SharpAssetPreviewStrategy } from './sharp-asset-preview-strategy';
import { transformImage } from './transform-image';
import { AssetServerOptions, ImageTransformMode, ImageTransformPreset } from './types';

async function getFileType(buffer: Buffer) {
    const { fileTypeFromBuffer } = await import('file-type');
    return fileTypeFromBuffer(buffer);
}

/**
 * @description
 * The `AssetServerPlugin` serves assets (images and other files) from the local file system, and can also be configured to use
 * other storage strategies (e.g. {@link S3AssetStorageStrategy}. It can also perform on-the-fly image transformations
 * and caches the results for subsequent calls.
 *
 * ## Installation
 *
 * `yarn add \@vendure/asset-server-plugin`
 *
 * or
 *
 * `npm install \@vendure/asset-server-plugin`
 *
 * @example
 * ```ts
 * import { AssetServerPlugin } from '\@vendure/asset-server-plugin';
 *
 * const config: VendureConfig = {
 *   // Add an instance of the plugin to the plugins array
 *   plugins: [
 *     AssetServerPlugin.init({
 *       route: 'assets',
 *       assetUploadDir: path.join(__dirname, 'assets'),
 *     }),
 *   ],
 * };
 * ```
 *
 * The full configuration is documented at [AssetServerOptions](/reference/core-plugins/asset-server-plugin/asset-server-options)
 *
 * ## Image transformation
 *
 * Asset preview images can be transformed (resized & cropped) on the fly by appending query parameters to the url:
 *
 * `http://localhost:3000/assets/some-asset.jpg?w=500&h=300&mode=resize`
 *
 * The above URL will return `some-asset.jpg`, resized to fit in the bounds of a 500px x 300px rectangle.
 *
 * ### Preview mode
 *
 * The `mode` parameter can be either `crop` or `resize`. See the [ImageTransformMode](/reference/core-plugins/asset-server-plugin/image-transform-mode) docs for details.
 *
 * ### Focal point
 *
 * When cropping an image (`mode=crop`), Vendure will attempt to keep the most "interesting" area of the image in the cropped frame. It does this
 * by finding the area of the image with highest entropy (the busiest area of the image). However, sometimes this does not yield a satisfactory
 * result - part or all of the main subject may still be cropped out.
 *
 * This is where specifying the focal point can help. The focal point of the image may be specified by passing the `fpx` and `fpy` query parameters.
 * These are normalized coordinates (i.e. a number between 0 and 1), so the `fpx=0&fpy=0` corresponds to the top left of the image.
 *
 * For example, let's say there is a very wide landscape image which we want to crop to be square. The main subject is a house to the far left of the
 * image. The following query would crop it to a square with the house centered:
 *
 * `http://localhost:3000/assets/landscape.jpg?w=150&h=150&mode=crop&fpx=0.2&fpy=0.7`
 *
 * ### Format
 *
 * Since v1.7.0, the image format can be specified by adding the `format` query parameter:
 *
 * `http://localhost:3000/assets/some-asset.jpg?format=webp`
 *
 * This means that, no matter the format of your original asset files, you can use more modern formats in your storefront if the browser
 * supports them. Supported values for `format` are:
 *
 * * `jpeg` or `jpg`
 * * `png`
 * * `webp`
 * * `avif`
 *
 * The `format` parameter can also be combined with presets (see below).
 *
 * ### Quality
 *
 * Since v2.2.0, the image quality can be specified by adding the `q` query parameter:
 *
 * `http://localhost:3000/assets/some-asset.jpg?q=75`
 *
 * This applies to the `jpg`, `webp` and `avif` formats. The default quality value for `jpg` and `webp` is 80, and for `avif` is 50.
 *
 * The `q` parameter can also be combined with presets (see below).
 *
 * ### Transform presets
 *
 * Presets can be defined which allow a single preset name to be used instead of specifying the width, height and mode. Presets are
 * configured via the AssetServerOptions [presets property](/reference/core-plugins/asset-server-plugin/asset-server-options/#presets).
 *
 * For example, defining the following preset:
 *
 * ```ts
 * AssetServerPlugin.init({
 *   // ...
 *   presets: [
 *     { name: 'my-preset', width: 85, height: 85, mode: 'crop' },
 *   ],
 * }),
 * ```
 *
 * means that a request to:
 *
 * `http://localhost:3000/assets/some-asset.jpg?preset=my-preset`
 *
 * is equivalent to:
 *
 * `http://localhost:3000/assets/some-asset.jpg?w=85&h=85&mode=crop`
 *
 * The AssetServerPlugin comes pre-configured with the following presets:
 *
 * name | width | height | mode
 * -----|-------|--------|-----
 * tiny | 50px | 50px | crop
 * thumb | 150px | 150px | crop
 * small | 300px | 300px | resize
 * medium | 500px | 500px | resize
 * large | 800px | 800px | resize
 *
 * ### Caching
 * By default, the AssetServerPlugin will cache every transformed image, so that the transformation only needs to be performed a single time for
 * a given configuration. Caching can be disabled per-request by setting the `?cache=false` query parameter.
 *
 * @docsCategory core plugins/AssetServerPlugin
 */
@VendurePlugin({
    imports: [PluginCommonModule],
    configuration: config => AssetServerPlugin.configure(config),
    providers: [{ provide: ASSET_SERVER_PLUGIN_INIT_OPTIONS, useFactory: () => AssetServerPlugin.options }],
    compatibility: '^3.0.0',
})
export class AssetServerPlugin implements NestModule, OnApplicationBootstrap, OnApplicationShutdown {
    private static assetStorage: AssetStorageStrategy;
    private readonly cacheDir = 'cache';
    private presets: ImageTransformPreset[] = [
        { name: 'tiny', width: 50, height: 50, mode: 'crop' },
        { name: 'thumb', width: 150, height: 150, mode: 'crop' },
        { name: 'small', width: 300, height: 300, mode: 'resize' },
        { name: 'medium', width: 500, height: 500, mode: 'resize' },
        { name: 'large', width: 800, height: 800, mode: 'resize' },
    ];
    private static options: AssetServerOptions;
    private cacheHeader: string;

    /**
     * @description
     * Set the plugin options.
     */
    static init(options: AssetServerOptions): Type<AssetServerPlugin> {
        AssetServerPlugin.options = options;
        return this;
    }

    /** @internal */
    static async configure(config: RuntimeVendureConfig) {
        const storageStrategyFactory =
            this.options.storageStrategyFactory || defaultAssetStorageStrategyFactory;
        this.assetStorage = await storageStrategyFactory(this.options);
        config.assetOptions.assetPreviewStrategy =
            this.options.previewStrategy ??
            new SharpAssetPreviewStrategy({
                maxWidth: this.options.previewMaxWidth,
                maxHeight: this.options.previewMaxHeight,
            });
        config.assetOptions.assetStorageStrategy = this.assetStorage;
        config.assetOptions.assetNamingStrategy =
            this.options.namingStrategy || new HashedAssetNamingStrategy();
        return config;
    }

    constructor(
        @Inject(ASSET_SERVER_PLUGIN_INIT_OPTIONS) private options: AssetServerOptions,
        private processContext: ProcessContext,
        private moduleRef: ModuleRef,
    ) {}

    /** @internal */
    async onApplicationBootstrap() {
        if (this.processContext.isWorker) {
            return;
        }
        if (this.options.presets) {
            for (const preset of this.options.presets) {
                const existingIndex = this.presets.findIndex(p => p.name === preset.name);
                if (-1 < existingIndex) {
                    this.presets.splice(existingIndex, 1, preset);
                } else {
                    this.presets.push(preset);
                }
            }
        }

        if (this.options.imageTransformStrategy != null) {
            const strategyArray = Array.isArray(this.options.imageTransformStrategy)
                ? this.options.imageTransformStrategy
                : [this.options.imageTransformStrategy];
            const injector = new Injector(this.moduleRef);
            for (const strategy of strategyArray) {
                if (typeof strategy.init === 'function') {
                    await strategy.init(injector);
                }
            }
        }

        // Configure Cache-Control header
        const { cacheHeader } = this.options;
        if (!cacheHeader) {
            this.cacheHeader = DEFAULT_CACHE_HEADER;
        } else {
            if (typeof cacheHeader === 'string') {
                this.cacheHeader = cacheHeader;
            } else {
                this.cacheHeader = [cacheHeader.restriction, `max-age: ${cacheHeader.maxAge}`]
                    .filter(value => !!value)
                    .join(', ');
            }
        }

        const cachePath = path.join(this.options.assetUploadDir, this.cacheDir);
        fs.ensureDirSync(cachePath);
    }

    /** @internal */
    async onApplicationShutdown() {
        if (this.processContext.isWorker) {
            return;
        }
        if (this.options.imageTransformStrategy != null) {
            const strategyArray = Array.isArray(this.options.imageTransformStrategy)
                ? this.options.imageTransformStrategy
                : [this.options.imageTransformStrategy];
            for (const strategy of strategyArray) {
                if (typeof strategy.destroy === 'function') {
                    await strategy.destroy();
                }
            }
        }
    }

    configure(consumer: MiddlewareConsumer) {
        if (this.processContext.isWorker) {
            return;
        }
        Logger.info('Creating asset server middleware', loggerCtx);
        consumer.apply(this.createAssetServer()).forRoutes(this.options.route);
        registerPluginStartupMessage('Asset server', this.options.route);
    }

    /**
     * Creates the image server instance
     */
    private createAssetServer() {
        const assetServer = express.Router();
        assetServer.use(this.sendAsset(), this.generateTransformedImage());
        return assetServer;
    }

    /**
     * Reads the file requested and send the response to the browser.
     */
    private sendAsset() {
        return async (req: Request, res: Response, next: NextFunction) => {
            let params: ImageTransformParameters;
            try {
                params = await this.getImageTransformParameters(req);
            } catch (e: any) {
                Logger.error(e.message, loggerCtx);
                res.status(400).send('Invalid parameters');
                return;
            }
            const key = this.getFileNameFromParameters(req.path, params);
            try {
                const file = await AssetServerPlugin.assetStorage.readFileToBuffer(key);
                let mimeType = this.getMimeType(key);
                if (!mimeType) {
                    mimeType = (await getFileType(file))?.mime || 'application/octet-stream';
                }
                res.contentType(mimeType);
                res.setHeader('content-security-policy', "default-src 'self'");
                res.setHeader('Cache-Control', this.cacheHeader);
                res.send(file);
            } catch (e: any) {
                const err = new Error('File not found');
                (err as any).status = 404;
                return next(err);
            }
        };
    }

    /**
     * If an exception was thrown by the first handler, then it may be because a transformed image
     * is being requested which does not yet exist. In this case, this handler will generate the
     * transformed image, save it to cache, and serve the result as a response.
     */
    private generateTransformedImage() {
        return async (err: any, req: Request, res: Response, next: NextFunction) => {
            if (err && (err.status === 404 || err.statusCode === 404)) {
                if (req.query) {
                    const decodedReqPath = this.sanitizeFilePath(req.path);
                    Logger.debug(`Pre-cached Asset not found: ${decodedReqPath}`, loggerCtx);
                    let file: Buffer;
                    try {
                        file = await AssetServerPlugin.assetStorage.readFileToBuffer(decodedReqPath);
                    } catch (_err: any) {
                        res.status(404).send('Resource not found');
                        return;
                    }
                    try {
                        const parameters = await this.getImageTransformParameters(req);
                        const image = await transformImage(file, parameters);
                        const imageBuffer = await image.toBuffer();
                        const cachedFileName = this.getFileNameFromParameters(req.path, parameters);
                        if (!req.query.cache || req.query.cache === 'true') {
                            await AssetServerPlugin.assetStorage.writeFileFromBuffer(
                                cachedFileName,
                                imageBuffer,
                            );
                            Logger.debug(`Saved cached asset: ${cachedFileName}`, loggerCtx);
                        }
                        let mimeType = this.getMimeType(cachedFileName);
                        if (!mimeType) {
                            mimeType = (await getFileType(imageBuffer))?.mime || 'image/jpeg';
                        }
                        res.set('Content-Type', mimeType);
                        res.setHeader('content-security-policy', "default-src 'self'");
                        res.send(imageBuffer);
                        return;
                    } catch (e: any) {
                        Logger.error(e.message, loggerCtx, e.stack);
                        res.status(500).send('An error occurred when generating the image');
                        return;
                    }
                }
            }
            next();
        };
    }

    private async getImageTransformParameters(req: Request): Promise<ImageTransformParameters> {
        let parameters = this.getInitialImageTransformParameters(req.query as any);
        const transformStrategies = this.getImageTransformStrategyArray();
        for (const strategy of transformStrategies) {
            try {
                parameters = await strategy.getImageTransformParameters({
                    req,
                    input: { ...parameters },
                    availablePresets: this.presets,
                });
            } catch (e: any) {
                Logger.error(`Error applying ImageTransformStrategy: ` + (e.message as string), loggerCtx);
                throw e;
            }
        }

        let targetWidth: number | undefined = parameters.width;
        let targetHeight: number | undefined = parameters.height;
        let targetMode: ImageTransformMode | undefined = parameters.mode;

        if (parameters.preset) {
            const matchingPreset = this.presets.find(p => p.name === parameters.preset);
            if (matchingPreset) {
                targetWidth = matchingPreset.width;
                targetHeight = matchingPreset.height;
                targetMode = matchingPreset.mode;
            }
        }
        return {
            ...parameters,
            width: targetWidth,
            height: targetHeight,
            mode: targetMode,
        };
    }

    private getImageTransformStrategyArray(): ImageTransformStrategy[] {
        return this.options.imageTransformStrategy
            ? Array.isArray(this.options.imageTransformStrategy)
                ? this.options.imageTransformStrategy
                : [this.options.imageTransformStrategy]
            : [];
    }

    private getInitialImageTransformParameters(
        queryParams: Record<string, string>,
    ): ImageTransformParameters {
        const width = Math.round(+queryParams.w) || undefined;
        const height = Math.round(+queryParams.h) || undefined;
        const quality =
            queryParams.q != null ? Math.round(Math.max(Math.min(+queryParams.q, 100), 1)) : undefined;
        const mode: ImageTransformMode = queryParams.mode === 'resize' ? 'resize' : 'crop';
        const fpx = +queryParams.fpx || undefined;
        const fpy = +queryParams.fpy || undefined;
        const format = getValidFormat(queryParams.format);

        return {
            width,
            height,
            quality,
            format,
            mode,
            fpx,
            fpy,
            preset: queryParams.preset,
        };
    }

    private getFileNameFromParameters(filePath: string, params: ImageTransformParameters): string {
        const { width: w, height: h, mode, preset, fpx, fpy, format, quality: q } = params;
        /* eslint-disable @typescript-eslint/restrict-template-expressions */
        const focalPoint = fpx && fpy ? `_fpx${fpx}_fpy${fpy}` : '';
        const quality = q ? `_q${q}` : '';
        const imageFormat = getValidFormat(format);
        let imageParamsString = '';
        if (w || h) {
            const width = w || '';
            const height = h || '';
            imageParamsString = `_transform_w${width}_h${height}_m${mode}`;
        } else if (preset) {
            if (this.presets && !!this.presets.find(p => p.name === preset)) {
                imageParamsString = `_transform_pre_${preset}`;
            }
        }

        if (focalPoint) {
            imageParamsString += focalPoint;
        }
        if (imageFormat) {
            imageParamsString += imageFormat;
        }
        if (quality) {
            imageParamsString += quality;
        }

        const decodedReqPath = this.sanitizeFilePath(filePath);
        if (imageParamsString !== '') {
            const imageParamHash = this.md5(imageParamsString);
            return path.join(this.cacheDir, this.addSuffix(decodedReqPath, imageParamHash, imageFormat));
        } else {
            return decodedReqPath;
        }
    }

    /**
     * Sanitize the file path to prevent directory traversal attacks.
     */
    private sanitizeFilePath(filePath: string): string {
        let decodedPath: string;
        try {
            decodedPath = decodeURIComponent(filePath);
        } catch (e: any) {
            Logger.error((e.message as string) + ': ' + filePath, loggerCtx);
            return '';
        }
        return path.normalize(decodedPath).replace(/(\.\.[\/\\])+/, '');
    }

    private md5(input: string): string {
        return createHash('md5').update(input).digest('hex');
    }

    private addSuffix(fileName: string, suffix: string, ext?: string): string {
        const originalExt = path.extname(fileName);
        const effectiveExt = ext ? `.${ext}` : originalExt;
        const baseName = path.basename(fileName, originalExt);
        const dirName = path.dirname(fileName);
        return path.join(dirName, `${baseName}${suffix}${effectiveExt}`);
    }

    /**
     * Attempt to get the mime type from the file name.
     */
    private getMimeType(fileName: string): string | undefined {
        const ext = path.extname(fileName);
        switch (ext) {
            case '.jpg':
            case '.jpeg':
                return 'image/jpeg';
            case '.png':
                return 'image/png';
            case '.gif':
                return 'image/gif';
            case '.svg':
                return 'image/svg+xml';
            case '.tiff':
                return 'image/tiff';
            case '.webp':
                return 'image/webp';
        }
    }
}
