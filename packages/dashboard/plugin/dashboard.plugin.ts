import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Type } from '@vendure/common/lib/shared-types';
import {
    Logger,
    PluginCommonModule,
    ProcessContext,
    registerPluginStartupMessage,
    SettingsStoreScopes,
    VendurePlugin,
} from '@vendure/core';
import express from 'express';
import { rateLimit } from 'express-rate-limit';
import fs from 'fs-extra';
import path from 'path';

import { adminApiExtensions } from './api/api-extensions.js';
import { MetricsResolver } from './api/metrics.resolver.js';
import { DEFAULT_APP_PATH, loggerCtx } from './constants.js';
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
     * The path to the dashboard UI app dist directory. By default, the built-in dashboard UI
     * will be served. This can be overridden with a custom build of the dashboard.
     */
    appDir: string;
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
 * Once set up, you run `npx vite build` to build the production version of the dashboard app.
 *
 * The built app files will be output to the location specified by `build.outDir` in your Vite
 * config file. This should then be passed to the `appDir` init option, as in the example below:
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
        config.settingsStoreFields['vendure.dashboard'] = [
            {
                name: 'userSettings',
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

    configure(consumer: MiddlewareConsumer) {
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
        const { route, appDir } = DashboardPlugin.options;
        const dashboardPath = appDir || this.getDashboardPath();

        Logger.info('Creating dashboard middleware', loggerCtx);
        consumer.apply(this.createStaticServer(dashboardPath)).forRoutes(route);

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
        // This is a workaround for a type mismatch between express v5 (Vendure core)
        // and express v4 (several transitive dependencies). Can be removed once the
        // ecosystem has more significantly shifted to v5.
        dashboardServer.use(limiter as any);
        dashboardServer.use(express.static(dashboardPath));
        dashboardServer.use((req, res) => {
            res.sendFile('index.html', { root: dashboardPath });
        });

        return dashboardServer;
    }

    private getDashboardPath(): string {
        // First, try to find the dashboard dist directory in the @vendure/dashboard package
        try {
            const dashboardPackageJson = require.resolve('@vendure/dashboard/package.json');
            const dashboardPackageRoot = path.dirname(dashboardPackageJson);
            const dashboardDistPath = path.join(dashboardPackageRoot, 'dist');

            if (fs.existsSync(dashboardDistPath)) {
                Logger.info(`Found dashboard UI at ${dashboardDistPath}`, loggerCtx);
                return dashboardDistPath;
            }
        } catch (e) {
            // Dashboard package not found, continue to fallback
        }

        // Fallback to default path
        Logger.warn(
            `Could not find @vendure/dashboard dist directory. Falling back to default path: ${DEFAULT_APP_PATH}`,
            loggerCtx,
        );
        return DEFAULT_APP_PATH;
    }
}
