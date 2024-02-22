import { PluginCommonModule, Type, VendurePlugin, Product } from '@vendure/core';

type PluginInitOptions = any;

@VendurePlugin({
    imports: [PluginCommonModule],
    entities: [Product],
    compatibility: '^2.0.0',
})
export class TestOnePlugin {
    static options: PluginInitOptions;

    static init(options: PluginInitOptions): Type<TestOnePlugin> {
        this.options = options;
        return TestOnePlugin;
    }
}
