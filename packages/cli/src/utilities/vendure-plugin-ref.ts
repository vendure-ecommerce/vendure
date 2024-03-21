import { ClassDeclaration, Node, SyntaxKind } from 'ts-morph';
import { isLiteralExpression } from 'typescript';

import { AdminUiExtensionTypeName } from '../constants';

export class VendurePluginRef {
    constructor(public classDeclaration: ClassDeclaration) {}

    get name(): string {
        return this.classDeclaration.getName() as string;
    }

    getSourceFile() {
        return this.classDeclaration.getSourceFile();
    }

    getPluginDir() {
        return this.classDeclaration.getSourceFile().getDirectory();
    }

    getMetadataOptions() {
        const pluginDecorator = this.classDeclaration.getDecorator('VendurePlugin');
        if (!pluginDecorator) {
            throw new Error('Could not find VendurePlugin decorator');
        }
        const pluginOptions = pluginDecorator.getArguments()[0];
        if (!pluginOptions || !Node.isObjectLiteralExpression(pluginOptions)) {
            throw new Error('Could not find VendurePlugin options');
        }
        return pluginOptions;
    }

    addEntity(entityClassName: string) {
        const pluginOptions = this.getMetadataOptions();
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

    hasUiExtensions(): boolean {
        return !!this.classDeclaration
            .getStaticProperties()
            .find(prop => prop.getType().getSymbol()?.getName() === AdminUiExtensionTypeName);
    }
}
