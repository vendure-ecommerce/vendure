import { PluginCommonModule, VendurePlugin } from '@vendure/core';

import { adminApiExtensions } from './api/api-extensions';
import { GlobalSearchResolver } from './api/global-search.resolver';
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
        resolvers: [GlobalSearchResolver],
    },
    entities: [GlobalSearchIndexItem],
    configuration: config => {
        // Plugin configuration logic here
        config.schedulerOptions.tasks.push(buildIndexTask);
        return config;
    },
    compatibility: '^3.0.0',
})
export class DashboardPlugin {
    static options: DashboardPluginOptions;

    static init(options: DashboardPluginOptions) {
        this.options = {
            ...options,
        };
        return DashboardPlugin;
    }
}
