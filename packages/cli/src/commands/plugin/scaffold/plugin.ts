import { constantCase, pascalCase } from 'change-case';

import { TemplateContext } from '../types';

export function render(context: TemplateContext) {
    return /* language=TypeScript */ `
import { PluginCommonModule, Type, VendurePlugin } from '@vendure/core';
import { AdminUiExtension } from '@vendure/ui-devkit/compiler';
import path from 'path';

import { ${context.pluginInitOptionsName} } from './constants';
import { PluginInitOptions } from './types';

/**
 * An example Vendure plugin.
 */
@VendurePlugin({
    // Importing the PluginCommonModule gives all of our plugin's injectables (services, resolvers)
    // access to the Vendure core providers. See https://www.vendure.io/docs/typescript-api/plugin/plugin-common-module/
    imports: [PluginCommonModule],
    entities: [],
    providers: [
        // By definiting the \`PLUGIN_INIT_OPTIONS\` symbol as a provider, we can then inject the
        // user-defined options into other classes, such as the {@link ExampleService}.
        { provide: ${context.pluginInitOptionsName}, useFactory: () => ${context.pluginName}.options },
    ],
})
export class ${context.pluginName} {
    static options: PluginInitOptions;

    /**
     * The static \`init()\` method is a convention used by Vendure plugins which allows options
     * to be configured by the user.
     */
    static init(options: PluginInitOptions): Type<${context.pluginName}> {
        this.options = options;
        return ${context.pluginName};
    }

    static uiExtensions: AdminUiExtension = {
        extensionPath: path.join(__dirname, 'ui'),
    };
}
`;
}
