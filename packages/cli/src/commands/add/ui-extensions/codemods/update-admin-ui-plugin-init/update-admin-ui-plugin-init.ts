import { Node, ObjectLiteralExpression, StructureKind, SyntaxKind } from 'ts-morph';

import { addImportsToFile } from '../../../../../utilities/ast-utils';

export function updateAdminUiPluginInit(
    vendureConfig: ObjectLiteralExpression,
    options: { pluginClassName: string; pluginPath: string },
): boolean {
    const plugins = vendureConfig
        .getProperty('plugins')
        ?.getFirstChildByKind(SyntaxKind.ArrayLiteralExpression)
        ?.getFirstChildByKind(SyntaxKind.SyntaxList);

    const adminUiPlugin = plugins?.getChildrenOfKind(SyntaxKind.CallExpression).find(c => {
        return c.getExpression().getText() === 'AdminUiPlugin.init';
    });
    if (adminUiPlugin) {
        const initObject = adminUiPlugin
            .getArguments()
            .find((a): a is ObjectLiteralExpression => a.isKind(SyntaxKind.ObjectLiteralExpression));
        const appProperty = initObject?.getProperty('app');
        if (!appProperty) {
            initObject
                ?.addProperty({
                    name: 'app',
                    kind: StructureKind.PropertyAssignment,
                    initializer: `compileUiExtensions({
                        outputPath: path.join(__dirname, '../admin-ui'),
                        extensions: [
                            ${options.pluginClassName}.ui,
                        ],
                        devMode: true,
                    }),`,
                })
                .formatText();
        } else {
            const computeFnCall = appProperty.getFirstChildByKind(SyntaxKind.CallExpression);
            if (computeFnCall?.getType().getText().includes('AdminUiAppConfig')) {
                const arg = computeFnCall.getArguments()[0];
                if (arg && Node.isObjectLiteralExpression(arg)) {
                    const extensionsProp = arg.getProperty('extensions');
                    if (extensionsProp) {
                        extensionsProp
                            .getFirstChildByKind(SyntaxKind.ArrayLiteralExpression)
                            ?.addElement(`${options.pluginClassName}.ui`)
                            .formatText();
                    }
                }
            }
        }

        addImportsToFile(vendureConfig.getSourceFile(), {
            moduleSpecifier: '@vendure/ui-devkit/compiler',
            namedImports: ['compileUiExtensions'],
            order: 0,
        });

        addImportsToFile(vendureConfig.getSourceFile(), {
            moduleSpecifier: 'path',
            namespaceImport: 'path',
            order: 0,
        });

        addImportsToFile(vendureConfig.getSourceFile(), {
            moduleSpecifier: options.pluginPath,
            namedImports: [options.pluginClassName],
        });
        return true;
    }
    return false;
}
