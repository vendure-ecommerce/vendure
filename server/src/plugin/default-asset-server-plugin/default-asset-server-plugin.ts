import express, { NextFunction, Request, Response } from 'express';
import { Server } from 'http';
import path from 'path';

import { AssetStorageStrategy } from '../../config/asset-storage-strategy/asset-storage-strategy';
import { VendureConfig } from '../../config/vendure-config';
import { InjectorFn, VendurePlugin } from '../../config/vendure-plugin/vendure-plugin';
import { createProxyHandler } from '../plugin-utils';

import { DefaultAssetPreviewStrategy } from './default-asset-preview-strategy';
import { DefaultAssetStorageStrategy } from './default-asset-storage-strategy';
import { transformImage } from './transform-image';

/**
 * @description
 * Specifies the way in which an asset preview image will be resized to fit in the
 * proscribed dimensions:
 *
 * * crop: crops the image to cover both provided dimensions
 * * resize: Preserving aspect ratio, resizes the image to be as large as possible
 * while ensuring its dimensions are less than or equal to both those specified.
 *
 * @docsCategory plugin
 */
export type ImageTransformMode = 'crop' | 'resize';

/**
 * @description
 * A configuration option for an image size preset for the DefaultAssetServerPlugin.
 *
 * Presets allow a shorthand way to generate a thumbnail preview of an asset. For example,
 * the built-in "tiny" preset generates a 50px x 50px cropped preview, which can be accessed
 * by appending the string `preset=tiny` to the asset url:
 *
 * `http://localhost:3000/assets/some-asset.jpg?preset=tiny`
 *
 * is equivalent to:
 *
 * `http://localhost:3000/assets/some-asset.jpg?w=50&h=50&mode=crop`
 *
 * @docsCategory plugin
 */
export interface ImageTransformPreset {
    name: string;
    width: number;
    height: number;
    mode: ImageTransformMode;
}

/**
 * @description
 * The configuration options for the DefaultAssetServerPlugin.
 *
 * @docsCategory plugin
 */
export interface DefaultAssetServerOptions {
    hostname?: string;
    /**
     * @description
     * The local port that the server will run on. Note that the DefaultAssetServerPlugin
     * includes a proxy server which allows the asset server to be accessed on the same
     * port as the main Vendure server.
     */
    port: number;
    /**
     * @description
     * The proxy route to the asset server.
     */
    route: string;
    /**
     * @description
     * The local directory to which assets will be uploaded.
     */
    assetUploadDir: string;
    /**
     * @description
     * The max width in pixels of a generated preview image.
     *
     * @default 1600
     */
    previewMaxWidth?: number;
    /**
     * @description
     * The max height in pixels of a generated preview image.
     *
     * @default 1600
     */
    previewMaxHeight?: number;
    /**
     * @description
     * An array of additional {@link ImageTransformPreset} objects.
     */
    presets?: ImageTransformPreset[];
}

/**
 * The DefaultAssetServerPlugin instantiates a static Express server which is used to
 * serve the assets. It can also perform on-the-fly image transformations and caches the
 * results for subsequent calls.
 */
export class DefaultAssetServerPlugin implements VendurePlugin {
    private server: Server;
    private assetStorage: AssetStorageStrategy;
    private readonly cacheDir = 'cache';
    private readonly presets: ImageTransformPreset[] = [
        { name: 'tiny', width: 50, height: 50, mode: 'crop' },
        { name: 'thumb', width: 150, height: 150, mode: 'crop' },
        { name: 'small', width: 300, height: 300, mode: 'resize' },
        { name: 'medium', width: 500, height: 500, mode: 'resize' },
        { name: 'large', width: 800, height: 800, mode: 'resize' },
    ];

    constructor(private options: DefaultAssetServerOptions) {
        if (options.presets) {
            for (const preset of options.presets) {
                const existingIndex = this.presets.findIndex(p => p.name === preset.name);
                if (-1 < existingIndex) {
                    this.presets.splice(existingIndex, 1, preset);
                } else {
                    this.presets.push(preset);
                }
            }
        }
    }

    configure(config: Required<VendureConfig>) {
        this.assetStorage = new DefaultAssetStorageStrategy(this.options.assetUploadDir, this.options.route);
        config.assetOptions.assetPreviewStrategy = new DefaultAssetPreviewStrategy({
            maxWidth: this.options.previewMaxWidth || 1600,
            maxHeight: this.options.previewMaxHeight || 1600,
        });
        config.assetOptions.assetStorageStrategy = this.assetStorage;
        config.middleware.push({
            handler: createProxyHandler(this.options, !config.silent),
            route: this.options.route,
        });
        return config;
    }

    onBootstrap(inject: InjectorFn): void | Promise<void> {
        this.createAssetServer();
    }

    onClose(): Promise<void> {
        return new Promise(resolve => this.server.close(resolve));
    }

    /**
     * Creates the image server instance
     */
    private createAssetServer() {
        const assetServer = express();
        assetServer.use(this.serveStaticFile(), this.generateTransformedImage());
        this.server = assetServer.listen(this.options.port);
    }

    /**
     * Sends the file requested to the broswer.
     */
    private serveStaticFile() {
        return (req: Request, res: Response) => {
            const filePath = path.join(this.options.assetUploadDir, this.getFileNameFromRequest(req));
            res.sendFile(filePath);
        };
    }

    /**
     * If an exception was thrown by the first handler, then it may be because a transformed image
     * is being requested which does not yet exist. In this case, this handler will generate the
     * transformed image, save it to cache, and serve the result as a response.
     */
    private generateTransformedImage() {
        return async (err, req: Request, res: Response, next: NextFunction) => {
            if (err && err.status === 404) {
                if (req.query) {
                    let file: Buffer;
                    try {
                        file = await this.assetStorage.readFileToBuffer(req.path);
                    } catch (err) {
                        res.status(404).send('Resource not found');
                        return;
                    }
                    const image = await transformImage(file, req.query, this.presets || []);
                    const imageBuffer = await image.toBuffer();
                    const cachedFileName = this.getFileNameFromRequest(req);
                    await this.assetStorage.writeFileFromBuffer(cachedFileName, imageBuffer);
                    res.set('Content-Type', `image/${(await image.metadata()).format}`);
                    res.send(imageBuffer);
                }
            }
            next();
        };
    }

    private getFileNameFromRequest(req: Request): string {
        if (req.query.w || req.query.h) {
            const width = req.query.w || '';
            const height = req.query.h || '';
            const mode = req.query.mode || '';
            return this.cacheDir + '/' + this.addSuffix(req.path, `_transform_w${width}_h${height}_m${mode}`);
        } else if (req.query.preset) {
            if (this.presets && !!this.presets.find(p => p.name === req.query.preset)) {
                return this.cacheDir + '/' + this.addSuffix(req.path, `_transform_pre_${req.query.preset}`);
            }
        }
        return req.path;
    }

    private addSuffix(fileName: string, suffix: string): string {
        const ext = path.extname(fileName);
        const baseName = path.basename(fileName, ext);
        return `${baseName}${suffix}${ext}`;
    }
}
