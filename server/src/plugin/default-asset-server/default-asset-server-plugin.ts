import * as express from 'express';
import * as proxy from 'http-proxy-middleware';

import { VendureConfig } from '../../config/vendure-config';
import { VendurePlugin } from '../../config/vendure-plugin/vendure-plugin';

import { DefaultAssetPreviewStrategy } from './default-asset-preview-strategy';
import { DefaultAssetStorageStrategy } from './default-asset-storage-strategy';

export interface DefaultAssetServerOptions {
    hostname: string;
    port: number;
    route: string;
    assetUploadDir: string;
    previewMaxWidth: number;
    previewMaxHeight: number;
}

/**
 * The DefaultAssetServerPlugin instantiates a static Express server which is used to
 * serve the assets.
 */
export class DefaultAssetServerPlugin implements VendurePlugin {
    constructor(private options: DefaultAssetServerOptions) {}

    init(config: Required<VendureConfig>) {
        this.createAssetServer();
        config.assetPreviewStrategy = new DefaultAssetPreviewStrategy({
            maxWidth: this.options.previewMaxWidth,
            maxHeight: this.options.previewMaxHeight,
        });
        config.assetStorageStrategy = new DefaultAssetStorageStrategy(this.options.assetUploadDir);
        config.middleware.push({
            handler: this.createProxyHandler(),
            route: this.options.route,
        });
        return config;
    }

    /**
     * Creates the image server instance
     */
    private createAssetServer() {
        const assetServer = express();
        assetServer.use(express.static(this.options.assetUploadDir));
        assetServer.listen(this.options.port);
    }

    /**
     * Configures the proxy middleware which will be passed to the main Vendure server.
     */
    private createProxyHandler() {
        const route = this.options.route.charAt(0) === '/' ? this.options.route : '/' + this.options.route;
        return proxy({
            target: `${this.options.hostname}:${this.options.port}`,
            pathRewrite: {
                [`^${route}`]: '/',
            },
        });
    }
}
