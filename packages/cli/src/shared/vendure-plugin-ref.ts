import {
    ClassDeclaration,
    InterfaceDeclaration,
    Node,
    PropertyAssignment,
    StructureKind,
    SyntaxKind,
    Type,
    VariableDeclaration,
} from 'ts-morph';

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

    getPluginOptions():
        | { typeDeclaration: InterfaceDeclaration; constantDeclaration: VariableDeclaration }
        | undefined {
        const metadataOptions = this.getMetadataOptions();
        const staticOptions = this.classDeclaration.getStaticProperty('options');
        const typeDeclaration = staticOptions
            ?.getType()
            .getSymbolOrThrow()
            .getDeclarations()
            .find(d => Node.isInterfaceDeclaration(d));
        if (!typeDeclaration || !Node.isInterfaceDeclaration(typeDeclaration)) {
            return;
        }
        const providersArray = metadataOptions
            .getProperty('providers')
            ?.getFirstChildByKind(SyntaxKind.ArrayLiteralExpression);
        if (!providersArray) {
            return;
        }
        const elements = providersArray.getElements();
        const optionsProviders = elements
            .filter(Node.isObjectLiteralExpression)
            .filter(el => el.getProperty('useFactory')?.getText().includes(`${this.name}.options`));

        if (!optionsProviders.length) {
            return;
        }
        const optionsSymbol = optionsProviders[0].getProperty('provide') as PropertyAssignment;
        const initializer = optionsSymbol?.getInitializer();
        if (!initializer || !Node.isIdentifier(initializer)) {
            return;
        }
        const constantDeclaration = initializer.getDefinitions()[0]?.getDeclarationNode();
        if (!constantDeclaration || !Node.isVariableDeclaration(constantDeclaration)) {
            return;
        }

        return { typeDeclaration, constantDeclaration };
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

    addAdminApiExtensions(extension: {
        schema: VariableDeclaration | undefined;
        resolvers: ClassDeclaration[];
    }) {
        const pluginOptions = this.getMetadataOptions();
        const adminApiExtensionsProperty = pluginOptions
            .getProperty('adminApiExtensions')
            ?.getType()
            .getSymbolOrThrow()
            .getDeclarations()[0];
        if (
            extension.schema &&
            adminApiExtensionsProperty &&
            Node.isObjectLiteralExpression(adminApiExtensionsProperty)
        ) {
            const schemaProp = adminApiExtensionsProperty.getProperty('schema');
            if (!schemaProp) {
                adminApiExtensionsProperty.addPropertyAssignment({
                    name: 'schema',
                    initializer: extension.schema?.getName(),
                });
            }
            const resolversProp = adminApiExtensionsProperty.getProperty('resolvers');
            if (resolversProp) {
                const resolversArray = resolversProp.getFirstChildByKind(SyntaxKind.ArrayLiteralExpression);
                if (resolversArray) {
                    for (const resolver of extension.resolvers) {
                        const resolverName = resolver.getName();
                        if (resolverName) {
                            resolversArray.addElement(resolverName);
                        }
                    }
                }
            } else {
                adminApiExtensionsProperty.addPropertyAssignment({
                    name: 'resolvers',
                    initializer: `[${extension.resolvers.map(r => r.getName()).join(', ')}]`,
                });
            }
        } else if (extension.schema) {
            pluginOptions
                .addPropertyAssignment({
                    name: 'adminApiExtensions',
                    initializer: `{
                        schema: ${extension.schema.getName()},
                        resolvers: [${extension.resolvers.map(r => r.getName()).join(', ')}]
                    }`,
                })
                .formatText();
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
