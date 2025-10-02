import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Type } from '@vendure/common/lib/shared-types';
import {
    createProxyHandler,
    Logger,
    PluginCommonModule,
    ProcessContext,
    registerPluginStartupMessage,
    SettingsStoreScopes,
    VendurePlugin,
} from '@vendure/core';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import * as http from 'http';

import { adminApiExtensions } from './api/api-extensions.js';
import { MetricsResolver } from './api/metrics.resolver.js';
import { loggerCtx, manageDashboardGlobalViews } from './constants.js';
import { MetricsService } from './service/metrics.service.js';

/**
 * @description
 * Configuration options for the {@link DashboardPlugin}.
 *
 * @docsCategory core plugins/DashboardPlugin
 */
export interface DashboardPluginOptions {
    /**
     * @description
     * The route to the Dashboard UI.
     *
     * @default 'dashboard'
     */
    route: string;
    /**
     * @description
     * The path to the dashboard UI app dist directory.
     */
    appDir: string;
    /**
     * @description
     * The port on which to check for a running Vite dev server.
     * If a Vite dev server is detected on this port, requests will be proxied to it
     * instead of serving static files from appDir.
     *
     * @default 5173
     */
    viteDevServerPort?: number;
}

/**
 * @description
 * This plugin serves the static files of the Vendure Dashboard and provides the
 * GraphQL extensions needed for the order metrics on the dashboard index page.
 *
 * ## Installation
 *
 * `npm install \@vendure/dashboard`
 *
 * ## Usage
 *
 * First you need to set up compilation of the Dashboard, using the Vite configuration
 * described in the [Dashboard Getting Started Guide](/guides/extending-the-dashboard/getting-started/)
 *
 * ## Development vs Production
 *
 * When developing, you can run `npx vite` (or `npm run dev`) to start the Vite development server.
 * The plugin will automatically detect if Vite is running on the default port (5173) and proxy
 * requests to it instead of serving static files. This enables hot module replacement and faster
 * development iterations.
 *
 * For production, run `npx vite build` to build the dashboard app. The built app files will be
 * output to the location specified by `build.outDir` in your Vite config file. This should then
 * be passed to the `appDir` init option, as in the example below:
 *
 * @example
 * ```ts
 * import { DashboardPlugin } from '\@vendure/dashboard/plugin';
 *
 * const config: VendureConfig = {
 *   // Add an instance of the plugin to the plugins array
 *   plugins: [
 *     DashboardPlugin.init({
 *       route: 'dashboard',
 *       appDir: './dist/dashboard',
 *       // Optional: customize Vite dev server port (defaults to 5173)
 *       viteDevServerPort: 3000,
 *     }),
 *   ],
 * };
 * ```
 *
 * ## Metrics
 *
 * This plugin defines a `metricSummary` query which is used by the Dashboard UI to
 * display the order metrics on the dashboard.
 *
 * If you are building a stand-alone version of the Dashboard UI app, and therefore
 * don't need this plugin to serve the Dashboard UI, you can still use the
 * `metricSummary` query by adding the `DashboardPlugin` to the `plugins` array,
 * but without calling the `init()` method:
 *
 * @example
 * ```ts
 * import { DashboardPlugin } from '\@vendure/dashboard-plugin';
 *
 * const config: VendureConfig = {
 *   plugins: [
 *     DashboardPlugin, // <-- no call to .init()
 *   ],
 *   // ...
 * };
 * ```
 *
 * @docsCategory core plugins/DashboardPlugin
 */
@VendurePlugin({
    imports: [PluginCommonModule],
    adminApiExtensions: {
        schema: adminApiExtensions,
        resolvers: [MetricsResolver],
    },
    providers: [MetricsService],
    configuration: config => {
        config.authOptions.customPermissions.push(manageDashboardGlobalViews);

        config.settingsStoreFields['vendure.dashboard'] = [
            {
                name: 'userSettings',
                scope: SettingsStoreScopes.user,
            },
            {
                name: 'globalSavedViews',
                scope: SettingsStoreScopes.global,
                requiresPermission: {
                    read: manageDashboardGlobalViews.Read,
                    write: manageDashboardGlobalViews.Write,
                },
            },
            {
                name: 'userSavedViews',
                scope: SettingsStoreScopes.user,
            },
        ];
        return config;
    },
    compatibility: '^3.0.0',
})
export class DashboardPlugin implements NestModule {
    private static options: DashboardPluginOptions | undefined;

    constructor(private readonly processContext: ProcessContext) {}

    /**
     * @description
     * Set the plugin options
     */
    static init(options: DashboardPluginOptions): Type<DashboardPlugin> {
        this.options = options;
        return DashboardPlugin;
    }

    async configure(consumer: MiddlewareConsumer) {
        if (this.processContext.isWorker) {
            return;
        }
        if (!DashboardPlugin.options) {
            Logger.info(
                `DashboardPlugin's init() method was not called. The Dashboard UI will not be served.`,
                loggerCtx,
            );
            return;
        }
        const { route, appDir, viteDevServerPort = 5173 } = DashboardPlugin.options;

        Logger.info('Creating dashboard middleware', loggerCtx);

        const isViteRunning = await this.checkViteDevServer(viteDevServerPort);
        if (isViteRunning) {
            Logger.info(
                `Vite dev server detected on port ${viteDevServerPort}, proxying requests`,
                loggerCtx,
            );
            const proxyHandler = createProxyHandler({
                label: 'Dashboard Vite Dev Server',
                route,
                port: viteDevServerPort,
                basePath: route,
            });
            consumer.apply(proxyHandler).forRoutes(route);
        } else {
            Logger.info(`No Vite dev server detected, serving static files from ${appDir}`, loggerCtx);
            consumer.apply(this.createStaticServer(appDir)).forRoutes(route);
        }

        registerPluginStartupMessage('Dashboard UI', route);
    }

    private createStaticServer(dashboardPath: string) {
        const limiter = rateLimit({
            windowMs: 60 * 1000,
            limit: process.env.NODE_ENV === 'production' ? 500 : 2000,
            standardHeaders: true,
            legacyHeaders: false,
        });

        const dashboardServer = express.Router();
        dashboardServer.use(limiter);
        dashboardServer.use(express.static(dashboardPath));
        dashboardServer.use((req, res) => {
            res.sendFile('index.html', { root: dashboardPath });
        });

        return dashboardServer;
    }

    private async checkViteDevServer(port: number): Promise<boolean> {
        return new Promise(resolve => {
            const req = http.request(
                {
                    hostname: 'localhost',
                    port,
                    path: '/',
                    method: 'HEAD',
                    timeout: 1000,
                },
                (res: http.IncomingMessage) => {
                    resolve(res.statusCode !== undefined && res.statusCode < 400);
                },
            );

            req.on('error', () => {
                resolve(false);
            });

            req.on('timeout', () => {
                req.destroy();
                resolve(false);
            });

            req.end();
        });
    }
}
