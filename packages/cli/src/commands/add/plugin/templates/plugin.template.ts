import { PluginCommonModule, Type, VendurePlugin } from '@vendure/core';

import { TEMPLATE_PLUGIN_OPTIONS } from './constants.template';
import { PluginInitOptions } from './types.template';

@VendurePlugin({
    imports: [PluginCommonModule],
    providers: [{ provide: TEMPLATE_PLUGIN_OPTIONS, useFactory: () => TemplatePlugin.options }],
    compatibility: '^2.0.0',
})
export class TemplatePlugin {
    static options: PluginInitOptions;

    static init(options: PluginInitOptions): Type<TemplatePlugin> {
        this.options = options;
        return TemplatePlugin;
    }
}
