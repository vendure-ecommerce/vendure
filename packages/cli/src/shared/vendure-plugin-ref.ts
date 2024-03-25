import { ClassDeclaration, Node, SyntaxKind } from 'ts-morph';

import { AdminUiExtensionTypeName } from '../constants';

import { EntityRef } from './entity-ref';

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

    addProvider(providerClassName: string) {
        const pluginOptions = this.getMetadataOptions();
        const providerProperty = pluginOptions.getProperty('providers');
        if (providerProperty) {
            const providersArray = providerProperty.getFirstChildByKind(SyntaxKind.ArrayLiteralExpression);
            if (providersArray) {
                providersArray.addElement(providerClassName);
            }
        } else {
            pluginOptions.addPropertyAssignment({
                name: 'providers',
                initializer: `[${providerClassName}]`,
            });
        }
    }

    getEntities(): EntityRef[] {
        const metadataOptions = this.getMetadataOptions();
        const entitiesProperty = metadataOptions.getProperty('entities');
        if (!entitiesProperty) {
            return [];
        }
        const entitiesArray = entitiesProperty.getFirstChildByKind(SyntaxKind.ArrayLiteralExpression);
        if (!entitiesArray) {
            return [];
        }
        const entityNames = entitiesArray
            .getElements()
            .filter(Node.isIdentifier)
            .map(e => e.getText());

        const entitySourceFiles = this.getSourceFile()
            .getImportDeclarations()
            .filter(imp => {
                for (const namedImport of imp.getNamedImports()) {
                    if (entityNames.includes(namedImport.getName())) {
                        return true;
                    }
                }
            })
            .map(imp => imp.getModuleSpecifierSourceFileOrThrow());
        return entitySourceFiles
            .map(sourceFile =>
                sourceFile.getClasses().filter(c => c.getExtends()?.getText() === 'VendureEntity'),
            )
            .flat()
            .map(classDeclaration => new EntityRef(classDeclaration));
    }

    hasUiExtensions(): boolean {
        return !!this.classDeclaration
            .getStaticProperties()
            .find(prop => prop.getType().getSymbol()?.getName() === AdminUiExtensionTypeName);
    }
}
