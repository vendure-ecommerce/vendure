import { ClassDeclaration } from 'ts-morph';

import { addImportsToFile, kebabize } from '../../../../../utilities/ast-utils';

/**
 * @description
 * Adds the static `ui` property to the plugin class, and adds the required imports.
 */
export function addUiExtensionStaticProp(pluginClass: ClassDeclaration) {
    const adminUiExtensionType = 'AdminUiExtension';
    const extensionId = kebabize(pluginClass.getName() as string).replace(/-plugin$/, '');
    pluginClass
        .addProperty({
            name: 'ui',
            isStatic: true,
            type: adminUiExtensionType,
            initializer: `{
                        id: '${extensionId}-ui',
                        extensionPath: path.join(__dirname, 'ui'),
                        routes: [{ route: '${extensionId}', filePath: 'routes.ts' }],
                        providers: ['providers.ts'],
                    }`,
        })
        .formatText();

    // Add the AdminUiExtension import if it doesn't already exist
    addImportsToFile(pluginClass.getSourceFile(), {
        moduleSpecifier: '@vendure/ui-devkit/compiler',
        namedImports: [adminUiExtensionType],
        order: 0,
    });

    // Add the path import if it doesn't already exist
    addImportsToFile(pluginClass.getSourceFile(), {
        moduleSpecifier: 'path',
        namespaceImport: 'path',
        order: 0,
    });
}
