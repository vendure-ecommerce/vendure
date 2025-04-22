import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Type } from '@vendure/common/lib/shared-types';
import {
    ConfigService,
    createProxyHandler,
    Logger,
    PluginCommonModule,
    ProcessContext,
    registerPluginStartupMessage,
    VendurePlugin,
} from '@vendure/core';
import express from 'express';
import fs from 'fs';
import path from 'path';

import { PLUGIN_INIT_OPTIONS, loggerCtx } from './constants';
import { GraphiQLController } from './graphiql.controller';
import { GraphiQLService } from './graphiql.service';
import { GraphiQLPluginOptions } from './types';

/**
 * @description
 * This plugin provides a GraphQL playground UI for exploring and testing the Vendure GraphQL APIs.
 *
 * It adds routes `/graphiql/admin` and `/graphiql/shop` which serve the GraphiQL interface
 * for the respective APIs.
 *
 * ## Installation
 *
 * ```ts
 * import { GraphiQLPlugin } from '@vendure/graphiql-plugin';
 *
 * const config: VendureConfig = {
 *   // Add an instance of the plugin to the plugins array
 *   plugins: [
 *     GraphiQLPlugin.init({
 *       route: 'graphiql', // Optional, defaults to 'graphiql'
 *     }),
 *   ],
 * };
 * ```
 *
 * @docsCategory GraphiQLPlugin
 */
@VendurePlugin({
    imports: [PluginCommonModule],
    controllers: [GraphiQLController],
    providers: [
        GraphiQLService,
        {
            provide: PLUGIN_INIT_OPTIONS,
            useFactory: () => GraphiQLPlugin.options,
        },
    ],
    configuration: config => {
        // disable GraphQL playground in config
        config.apiOptions.adminApiPlayground = false;
        config.apiOptions.shopApiPlayground = false;
        return config;
    },
    compatibility: '^3.0.0',
})
export class GraphiQLPlugin implements NestModule {
    private static options: Required<GraphiQLPluginOptions>;

    constructor(
        private readonly processContext: ProcessContext,
        private readonly configService: ConfigService,
        private readonly graphiQLService: GraphiQLService,
    ) {}

    /**
     * Initialize the plugin with the given options.
     */
    static init(options: GraphiQLPluginOptions = {}): Type<GraphiQLPlugin> {
        this.options = {
            ...options,
            route: options.route || 'graphiql',
        };
        return this;
    }

    configure(consumer: MiddlewareConsumer) {
        if (!this.processContext.isServer) {
            return;
        }

        consumer
            .apply(this.createStaticServer(GraphiQLPlugin.options.route, 'admin'))
            .forRoutes(GraphiQLPlugin.options.route + '/admin');
        consumer
            .apply(this.createStaticServer(GraphiQLPlugin.options.route, 'shop'))
            .forRoutes(GraphiQLPlugin.options.route + '/shop');

        registerPluginStartupMessage('GraphiQL Admin', `graphiql/admin`);
        registerPluginStartupMessage('GraphiQL Shop', `graphiql/shop`);
    }

    private createStaticServer(basePath: string, subPath: string) {
        const distDir = path.join(__dirname, '../dist/graphiql');

        const adminApiUrl = this.graphiQLService.getAdminApiUrl();
        const shopApiUrl = this.graphiQLService.getShopApiUrl();

        const graphiqlServer = express.Router();
        graphiqlServer.use(express.static(`${basePath}/${subPath}`));
        graphiqlServer.use((req, res) => {
            try {
                const indexHtmlPath = path.join(distDir, 'index.html');

                if (fs.existsSync(indexHtmlPath)) {
                    // Read the HTML file
                    let html = fs.readFileSync(indexHtmlPath, 'utf-8');

                    // Inject API URLs
                    html = html.replace(
                        '</head>',
                        `<script>
                            window.GRAPHIQL_SETTINGS = {
                                adminApiUrl: "${adminApiUrl}",
                                shopApiUrl: "${shopApiUrl}"
                            };
                        </script>
                        </head>`,
                    );

                    return res.send(html);
                }

                throw new Error(`GraphiQL UI not found: ${indexHtmlPath}`);
            } catch (e) {
                const errorMessage = e instanceof Error ? e.message : 'Unknown error';
                Logger.error(`Error serving GraphiQL: ${errorMessage}`, 'GraphiQLPlugin');
                return res.status(500).send('An error occurred while rendering GraphiQL');
            }
        });

        return graphiqlServer;
    }
}
