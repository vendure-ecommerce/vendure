import { ClassDeclaration, Node, SourceFile, SyntaxKind } from 'ts-morph';

import { addImportsToFile } from '../../../../../utilities/ast-utils';
import { AddEntityTemplateContext } from '../../add-entity';

export function addEntityToPlugin(pluginClass: ClassDeclaration, entitySourceFile: SourceFile) {
    const pluginDecorator = pluginClass.getDecorator('VendurePlugin');
    if (!pluginDecorator) {
        throw new Error('Could not find VendurePlugin decorator');
    }
    const pluginOptions = pluginDecorator.getArguments()[0];
    if (!pluginOptions) {
        throw new Error('Could not find VendurePlugin options');
    }
    const entityClass = entitySourceFile.getClasses().find(c => !c.getName()?.includes('CustomFields'));
    if (!entityClass) {
        throw new Error('Could not find entity class');
    }
    const entityClassName = entityClass.getName() as string;
    if (Node.isObjectLiteralExpression(pluginOptions)) {
        const entityProperty = pluginOptions.getProperty('entities');
        if (entityProperty) {
            const entitiesArray = entityProperty.getFirstChildByKind(SyntaxKind.ArrayLiteralExpression);
            if (entitiesArray) {
                entitiesArray.addElement(entityClassName);
            }
        } else {
            pluginOptions.addPropertyAssignment({
                name: 'entities',
                initializer: `[${entityClassName}]`,
            });
        }
    }

    addImportsToFile(pluginClass.getSourceFile(), {
        moduleSpecifier: entityClass.getSourceFile(),
        namedImports: [entityClassName],
    });
}
