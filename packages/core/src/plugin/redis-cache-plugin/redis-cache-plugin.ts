import { PluginCommonModule } from '../plugin-common.module';
import { VendurePlugin } from '../vendure-plugin';

import { PLUGIN_INIT_OPTIONS } from './constants';
import { RedisCacheStrategy } from './redis-cache-strategy';
import { RedisCachePluginInitOptions } from './types';

@VendurePlugin({
    imports: [PluginCommonModule],
    providers: [{ provide: PLUGIN_INIT_OPTIONS, useFactory: () => RedisCachePlugin.options }],
    configuration: config => {
        config.systemOptions.cacheStrategy = new RedisCacheStrategy(RedisCachePlugin.options);
        return config;
    },
    compatibility: '>0.0.0',
})
export class RedisCachePlugin {
    static options: RedisCachePluginInitOptions = {
        maxItemSizeInBytes: 128_000,
        redisOptions: {},
        namespace: 'vendure-cache',
    };

    static init(options: RedisCachePluginInitOptions) {
        this.options = options;
        return RedisCachePlugin;
    }
}
