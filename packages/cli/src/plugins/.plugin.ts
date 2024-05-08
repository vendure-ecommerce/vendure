import { PluginCommonModule, Type, VendurePlugin } from '@vendure/core';

import { PLUGIN_OPTIONS } from './constants';
import { PluginInitOptions } from './types';

@VendurePlugin({
    imports: [PluginCommonModule],
    providers: [{ provide: PLUGIN_OPTIONS, useFactory: () => Plugin.options }],
    configuration: config => {
        // Plugin-specific configuration
        // such as custom fields, custom permissions,
        // strategies etc. can be configured here by
        // modifying the `config` object.
        return config;
    },
    compatibility: '^2.0.0',
})
export class Plugin {
    static options: PluginInitOptions;

    static init(options: PluginInitOptions): Type<Plugin> {
        this.options = options;
        return Plugin;
    }
}
