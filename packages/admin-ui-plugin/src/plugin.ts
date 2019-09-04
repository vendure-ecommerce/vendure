import { compileUiExtensions } from '@vendure/admin-ui/src/compile-ui-extensions';
import { DEFAULT_AUTH_TOKEN_HEADER_KEY } from '@vendure/common/lib/shared-constants';
import { AdminUiConfig, AdminUiExtension, Type } from '@vendure/common/lib/shared-types';
import {
    AuthOptions,
    ConfigService,
    createProxyHandler,
    Logger,
    OnVendureBootstrap,
    OnVendureClose,
    PluginCommonModule,
    RuntimeVendureConfig,
    VendurePlugin,
} from '@vendure/core';
import express from 'express';
import fs from 'fs-extra';
import { Server } from 'http';
import path from 'path';

/**
 * @description
 * Configuration options for the {@link AdminUiPlugin}.
 *
 * @docsCategory AdminUiPlugin
 */
export interface AdminUiOptions {
    /**
     * @description
     * The hostname of the server serving the static admin ui files.
     *
     * @default 'localhost'
     */
    hostname?: string;
    /**
     * @description
     * The port on which the server will listen.
     */
    port: number;
    /**
     * @description
     * The hostname of the Vendure server which the admin ui will be making API calls
     * to. If set to "auto", the admin ui app will determine the hostname from the
     * current location (i.e. `window.location.hostname`).
     *
     * @default 'auto'
     */
    apiHost?: string | 'auto';
    /**
     * @description
     * The port of the Vendure server which the admin ui will be making API calls
     * to. If set to "auto", the admin ui app will determine the port from the
     * current location (i.e. `window.location.port`).
     *
     * @default 'auto'
     */
    apiPort?: number | 'auto';
    /**
     * @description
     * An optional array of objects which configure extension Angular modules
     * to be compiled into and made available by the AdminUi application.
     */
    extensions?: AdminUiExtension[];
}

/**
 * @description
 * This plugin starts a static server for the Admin UI app, and proxies it via the `/admin/` path of the main Vendure server.
 *
 * The Admin UI allows you to administer all aspects of your store, from inventory management to order tracking. It is the tool used by
 * store administrators on a day-to-day basis for the management of the store.
 *
 * ## Installation
 *
 * `yarn add \@vendure/admin-ui-plugin`
 *
 * or
 *
 * `npm install \@vendure/admin-ui-plugin`
 *
 * @example
 * ```ts
 * import { AdminUiPlugin } from '\@vendure/admin-ui-plugin';
 *
 * const config: VendureConfig = {
 *   // Add an instance of the plugin to the plugins array
 *   plugins: [
 *     AdminUiPlugin.init({ port: 3002 }),
 *   ],
 * };
 * ```
 *
 * @docsCategory AdminUiPlugin
 */
@VendurePlugin({
    imports: [PluginCommonModule],
    configuration: config => AdminUiPlugin.configure(config),
})
export class AdminUiPlugin implements OnVendureBootstrap, OnVendureClose {
    private static options: AdminUiOptions;
    private server: Server;

    constructor(private configService: ConfigService) {}

    /**
     * @description
     * Set the plugin options
     */
    static init(options: AdminUiOptions): Type<AdminUiPlugin> {
        this.options = options;
        return AdminUiPlugin;
    }

    /** @internal */
    static async configure(config: RuntimeVendureConfig): Promise<RuntimeVendureConfig> {
        const route = 'admin';
        config.middleware.push({
            handler: createProxyHandler({ ...this.options, route, label: 'Admin UI' }),
            route,
        });
        return config;
    }

    /** @internal */
    async onVendureBootstrap() {
        const { adminApiPath, authOptions } = this.configService;
        const { apiHost, apiPort } = AdminUiPlugin.options;
        await this.compileAdminUiApp();
        await this.overwriteAdminUiConfig(apiHost || 'auto', apiPort || 'auto', adminApiPath, authOptions);

        const adminUiPath = this.getAdminUiPath();
        const assetServer = express();
        assetServer.use(express.static(adminUiPath));
        assetServer.use((req, res) => {
            res.sendFile(path.join(adminUiPath, 'index.html'));
        });
        this.server = assetServer.listen(AdminUiPlugin.options.port);
    }

    /** @internal */
    onVendureClose(): Promise<void> {
        return new Promise(resolve => this.server.close(() => resolve()));
    }

    private async compileAdminUiApp() {
        const extensions = this.getExtensions();
        Logger.info('Compiling Admin UI extensions...', 'AdminUiPlugin');
        await compileUiExtensions(path.join(__dirname, '../admin-ui'), extensions);
        Logger.info('Completed compilation!', 'AdminUiPlugin');
    }

    private getExtensions(): Array<Required<AdminUiExtension>> {
        return (AdminUiPlugin.options.extensions || []).map(e => {
            const id =
                e.id ||
                Math.random()
                    .toString(36)
                    .substr(4);
            return { ...e, id };
        });
    }

    /**
     * Overwrites the parts of the admin-ui app's `vendure-ui-config.json` file relating to connecting to
     * the server admin API.
     */
    private async overwriteAdminUiConfig(
        host: string | 'auto',
        port: number | 'auto',
        adminApiPath: string,
        authOptions: AuthOptions,
    ) {
        const adminUiConfigPath = path.join(this.getAdminUiPath(), 'vendure-ui-config.json');
        const adminUiConfig = await fs.readFile(adminUiConfigPath, 'utf-8');
        let config: AdminUiConfig;
        try {
            config = JSON.parse(adminUiConfig);
        } catch (e) {
            throw new Error('[AdminUiPlugin] Could not parse vendure-ui-config.json file:\n' + e.message);
        }
        config.apiHost = host || 'http://localhost';
        config.apiPort = port;
        config.adminApiPath = adminApiPath;
        config.tokenMethod = authOptions.tokenMethod || 'cookie';
        config.authTokenHeaderKey = authOptions.authTokenHeaderKey || DEFAULT_AUTH_TOKEN_HEADER_KEY;
        await fs.writeFile(adminUiConfigPath, JSON.stringify(config, null, 2));
    }

    private getAdminUiPath(): string {
        // attempt to read from the path location on a production npm install
        const prodPath = path.join(__dirname, '../admin-ui');
        if (fs.existsSync(path.join(prodPath, 'index.html'))) {
            return prodPath;
        }
        // attempt to read from the path on a development install
        const devPath = path.join(__dirname, '../lib/admin-ui');
        if (fs.existsSync(path.join(devPath, 'index.html'))) {
            return devPath;
        }
        throw new Error(`AdminUiPlugin: admin-ui app not found`);
    }
}
