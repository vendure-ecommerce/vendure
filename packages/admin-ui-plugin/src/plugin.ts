import { DEFAULT_AUTH_TOKEN_HEADER_KEY } from '@vendure/common/lib/shared-constants';
import { AdminUiApp, AdminUiAppDevMode, AdminUiConfig, Type } from '@vendure/common/lib/shared-types';
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

import { DEFAULT_APP_PATH, loggerCtx } from './constants';

/**
 * @description
 * Configuration options for the {@link AdminUiPlugin}.
 *
 * @docsCategory AdminUiPlugin
 */
export interface AdminUiOptions {
    /**
     * @description
     * The port on which the server will listen. If not
     */
    port: number;
    /**
     * @description
     * The hostname of the server serving the static admin ui files.
     *
     * @default 'localhost'
     */
    hostname?: string;
    /**
     * @description
     * By default, the AdminUiPlugin comes bundles with a pre-built version of the
     * Admin UI. This option can be used to override this default build with a different
     * version, e.g. one pre-compiled with one or more ui extensions.
     */
    app?: AdminUiApp | AdminUiAppDevMode;
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
    providers: [],
    configuration: config => AdminUiPlugin.configure(config),
})
export class AdminUiPlugin implements OnVendureBootstrap, OnVendureClose {
    private static options: AdminUiOptions;
    private server: Server;
    private devServerClose: () => void | Promise<void> | undefined;

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
        const { app } = this.options;
        const appWatchMode = this.isDevModeApp(app);
        let port: number;
        if (this.isDevModeApp(app)) {
            port = app.port;
        } else {
            port = this.options.port;
        }
        config.middleware.push({
            handler: createProxyHandler({
                hostname: this.options.hostname,
                port,
                route: 'admin',
                label: 'Admin UI',
                basePath: appWatchMode ? 'admin' : undefined,
            }),
            route,
        });
        if (this.isDevModeApp(app)) {
            config.middleware.push({
                handler: createProxyHandler({
                    hostname: this.options.hostname,
                    port,
                    route: 'sockjs-node',
                    label: 'Admin UI live reload',
                    basePath: 'sockjs-node',
                }),
                route: 'sockjs-node',
            });
        }
        return config;
    }

    /** @internal */
    async onVendureBootstrap() {
        const { adminApiPath, authOptions } = this.configService;
        const { apiHost, apiPort, port, app } = AdminUiPlugin.options;
        const adminUiAppPath = AdminUiPlugin.isDevModeApp(app)
            ? app.sourcePath
            : (app && app.path) || DEFAULT_APP_PATH;
        const adminUiConfigPath = path.join(adminUiAppPath, 'vendure-ui-config.json');
        const overwriteConfig = () =>
            this.overwriteAdminUiConfig({
                host: apiHost || 'auto',
                port: apiPort || 'auto',
                adminApiPath,
                authOptions,
                adminUiConfigPath,
            });

        if (!AdminUiPlugin.isDevModeApp(app)) {
            // If not in dev mode, start a static server for the compiled app
            const adminUiServer = express();
            adminUiServer.use(express.static(adminUiAppPath));
            adminUiServer.use((req, res) => {
                res.sendFile(path.join(adminUiAppPath, 'index.html'));
            });
            this.server = adminUiServer.listen(AdminUiPlugin.options.port);
            if (app && typeof app.compile === 'function') {
                Logger.info(`Compiling Admin UI app in production mode`, loggerCtx);
                app.compile()
                    .then(overwriteConfig)
                    .then(() => {
                        Logger.info(`Admin UI successfully compiled`);
                    });
            } else {
                await overwriteConfig();
            }
        } else {
            Logger.info(`Compiling Admin UI app in development mode`, loggerCtx);
            app.compile()
                .then(overwriteConfig)
                .then(() => {
                    Logger.info(`Admin UI successfully compiled and watching for changes...`);
                });
        }
    }

    /** @internal */
    async onVendureClose(): Promise<void> {
        if (this.devServerClose) {
            await this.devServerClose();
        }
        if (this.server) {
            await new Promise(resolve => this.server.close(() => resolve()));
        }
    }

    /**
     * Overwrites the parts of the admin-ui app's `vendure-ui-config.json` file relating to connecting to
     * the server admin API.
     */
    private async overwriteAdminUiConfig(options: {
        host: string | 'auto';
        port: number | 'auto';
        adminApiPath: string;
        authOptions: AuthOptions;
        adminUiConfigPath: string;
    }) {
        const { host, port, adminApiPath, authOptions, adminUiConfigPath } = options;
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
        Logger.verbose(`Applying configuration to vendure-ui-config.json file`, loggerCtx);
        await fs.writeFile(adminUiConfigPath, JSON.stringify(config, null, 2));
    }

    private static isDevModeApp(app?: AdminUiApp | AdminUiAppDevMode): app is AdminUiAppDevMode {
        if (!app) {
            return false;
        }
        return typeof (app as any).close === 'function' && typeof (app as any).sourcePath === 'string';
    }
}
