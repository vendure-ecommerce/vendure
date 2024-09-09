import { PluginCommonModule } from '../plugin-common.module';
import { VendurePlugin } from '../vendure-plugin';

import { CacheItem } from './cache-item.entity';
import { PLUGIN_INIT_OPTIONS } from './constants';
import { SqlCacheStrategy } from './sql-cache-strategy';

export interface DefaultCachePluginInitOptions {
    cacheSize?: number;
}

@VendurePlugin({
    imports: [PluginCommonModule],
    entities: [CacheItem],
    providers: [{ provide: PLUGIN_INIT_OPTIONS, useFactory: () => DefaultCachePlugin.options }],
    configuration: config => {
        config.systemOptions.cacheStrategy = new SqlCacheStrategy({
            cacheSize: DefaultCachePlugin.options.cacheSize,
        });
        return config;
    },
    compatibility: '>0.0.0',
})
export class DefaultCachePlugin {
    static options: DefaultCachePluginInitOptions = {
        cacheSize: 10_000,
    };

    static init(options: DefaultCachePluginInitOptions) {
        this.options = options;
        return DefaultCachePlugin;
    }
}
