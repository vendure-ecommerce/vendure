import express from 'express';
import fs from 'fs-extra';
import path from 'path';

import { VendureConfig } from '../../config/vendure-config';
import { InjectorFn, VendurePlugin } from '../../config/vendure-plugin/vendure-plugin';
import { createProxyHandler } from '../plugin-utils';

export interface AdminUiOptions {
    hostname?: string;
    port: number;
}

/**
 * This plugin starts a static server for the Admin UI app, and proxies it via the `/admin/` path
 * of the main Vendure server.
 */
export class AdminUiPlugin implements VendurePlugin {
    constructor(private options: AdminUiOptions) {}

    configure(config: Required<VendureConfig>): Required<VendureConfig> {
        const route = 'admin';
        config.middleware.push({
            handler: createProxyHandler({ ...this.options, route }, !config.silent),
            route,
        });
        return config;
    }

    onBootstrap(inject: InjectorFn): void | Promise<void> {
        const adminUiPath = this.getAdminUiPath();
        const assetServer = express();
        assetServer.use(express.static(adminUiPath));
        assetServer.use((req, res) => {
            res.sendFile(path.join(adminUiPath, 'index.html'));
        });
        assetServer.listen(this.options.port);
    }

    private getAdminUiPath(): string {
        // attempt to read the index.html file from the Vendure dist bundle (as when installed
        // in an end-user project)
        const prodPath = path.join(__dirname, '../../../../admin-ui');
        if (fs.existsSync(path.join(prodPath, 'index.html'))) {
            return prodPath;
        }
        // attempt to read from the built admin-ui in the /server/dist/ folder when developing
        const devPath = path.join(__dirname, '../../../dist/admin-ui');
        if (fs.existsSync(path.join(devPath, 'index.html'))) {
            return devPath;
        }
        throw new Error(`AdminUiPlugin: admin-ui app not found`);
    }
}
