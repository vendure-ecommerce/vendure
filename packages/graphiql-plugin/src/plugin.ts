import { MiddlewareConsumer, NestModule } from '@nestjs/common';
import { Type } from '@vendure/common/lib/shared-types';
import {
    ConfigService,
    Logger,
    PluginCommonModule,
    ProcessContext,
    registerPluginStartupMessage,
    VendurePlugin,
} from '@vendure/core';
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
        return config;
    },
    compatibility: '^3.0.0',
})
export class GraphiQLPlugin implements NestModule {
    private static options: GraphiQLPluginOptions;

    constructor(
        private readonly configService: ConfigService,
        private readonly processContext: ProcessContext,
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

        registerPluginStartupMessage('GraphiQL Admin', `graphiql/admin`);
        registerPluginStartupMessage('GraphiQL Shop', `graphiql/shop`);
    }
}
