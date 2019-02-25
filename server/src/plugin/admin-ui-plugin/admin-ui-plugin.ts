import express from 'express';
import fs from 'fs-extra';
import path from 'path';

import { AdminUiConfig } from '../../../../shared/shared-types';
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

    async configure(config: Required<VendureConfig>): Promise<Required<VendureConfig>> {
        const route = 'admin';
        const { hostname, port, adminApiPath } = config;
        config.middleware.push({
            handler: createProxyHandler({ ...this.options, route }, !config.silent),
            route,
        });
        await this.overwriteAdminUiConfig(hostname, port, adminApiPath);
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

    /**
     * Overwrites the parts of the admin-ui app's `vendure-ui-config.json` file relating to connecting to
     * the server admin API.
     */
    private async overwriteAdminUiConfig(host: string, port: number, adminApiPath: string) {
        const adminUiConfigPath = path.join(this.getAdminUiPath(), 'vendure-ui-config.json');
        const adminUiConfig = await fs.readFile(adminUiConfigPath, 'utf-8');
        const config: AdminUiConfig = JSON.parse(adminUiConfig);
        config.apiHost = host || 'http://localhost';
        config.apiPort = port;
        config.adminApiPath = adminApiPath;
        await fs.writeFile(adminUiConfigPath, JSON.stringify(config, null, 2));
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
