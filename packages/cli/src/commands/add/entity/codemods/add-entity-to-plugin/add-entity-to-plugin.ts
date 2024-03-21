import { ClassDeclaration } from 'ts-morph';

import { addImportsToFile } from '../../../../../utilities/ast-utils';
import { VendurePluginRef } from '../../../../../utilities/vendure-plugin-ref';

export function addEntityToPlugin(plugin: VendurePluginRef, entityClass: ClassDeclaration) {
    if (!entityClass) {
        throw new Error('Could not find entity class');
    }
    const entityClassName = entityClass.getName() as string;
    plugin.addEntity(entityClassName);

    addImportsToFile(plugin.classDeclaration.getSourceFile(), {
        moduleSpecifier: entityClass.getSourceFile(),
        namedImports: [entityClassName],
    });
}
