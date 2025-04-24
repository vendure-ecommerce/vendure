import { OnModuleDestroy, OnModuleInit } from '@nestjs/common';
import { ModuleRef } from '@nestjs/core';
import { Injector, PluginCommonModule, VendurePlugin } from '@vendure/core';

import { adminApiExtensions } from './api/api-extensions';
import { GlobalSearchResolver } from './api/global-search.resolver';
import { IndexResolver } from './api/index.resolver';
import { PLUGIN_INIT_OPTIONS } from './constants';
import { GlobalSearchIndexItem } from './entities/global-search-index-item';
import { IndexingService } from './service/indexing.service';
import { SearchService } from './service/search.service';
import { buildIndexTask } from './tasks/build-index.task';
import { DashboardPluginOptions } from './types';
/**
 * @description
 * This plugin adds functionality specifically required by the Vendure Admin Dashboard.
 * It is not required for Vendure to function, but is used to provide additional features
 * that are not required for the core functionality of Vendure.
 *
 * ## Installation
 *
 * ```ts
 * import { DashboardPlugin } from '@vendure/dashboard-plugin';
 *
 * const config: VendureConfig = {
 *   // Add an instance of the plugin to the plugins array
 *   plugins: [
 *     DashboardPlugin.init(),
 *   ],
 * };
 * ```
 */
@VendurePlugin({
    imports: [PluginCommonModule],
    providers: [
        {
            provide: PLUGIN_INIT_OPTIONS,
            useFactory: () => DashboardPlugin.options,
        },
        SearchService,
        IndexingService,
    ],
    adminApiExtensions: {
        schema: adminApiExtensions,
        resolvers: [GlobalSearchResolver, IndexResolver],
    },
    entities: [GlobalSearchIndexItem],
    configuration: config => {
        // Plugin configuration logic here
        config.schedulerOptions.tasks.push(buildIndexTask);
        return config;
    },
    compatibility: '^3.0.0',
})
export class DashboardPlugin implements OnModuleInit, OnModuleDestroy {
    static options: DashboardPluginOptions;

    constructor(private readonly moduleRef: ModuleRef) {}

    static init(options: DashboardPluginOptions) {
        this.options = {
            ...options,
        };
        return DashboardPlugin;
    }

    async onModuleInit() {
        const injector = new Injector(this.moduleRef);
        const indexing = DashboardPlugin.options.indexingStrategy;
        const search = DashboardPlugin.options.searchStrategy;

        if (typeof indexing.init === 'function') {
            await indexing.init(injector);
        }

        if (typeof search.init === 'function') {
            await search.init(injector);
        }
    }

    async onModuleDestroy() {
        const indexing = DashboardPlugin.options.indexingStrategy;
        const search = DashboardPlugin.options.searchStrategy;
        if (typeof indexing.destroy === 'function') {
            await indexing.destroy();
        }

        if (typeof search.destroy === 'function') {
            await search.destroy();
        }
    }
}
