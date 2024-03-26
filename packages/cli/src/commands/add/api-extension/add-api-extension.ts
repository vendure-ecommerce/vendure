import { spinner } from '@clack/prompts';
import { paramCase } from 'change-case';
import path from 'path';
import {
    ClassDeclaration,
    Node,
    Project,
    SourceFile,
    Type,
    VariableDeclaration,
    VariableDeclarationKind,
} from 'ts-morph';

import { CliCommand, CliCommandReturnVal } from '../../../shared/cli-command';
import { EntityRef } from '../../../shared/entity-ref';
import { ServiceRef } from '../../../shared/service-ref';
import { analyzeProject, selectPlugin, selectServiceRef } from '../../../shared/shared-prompts';
import { VendurePluginRef } from '../../../shared/vendure-plugin-ref';
import { addImportsToFile, createFile } from '../../../utilities/ast-utils';
import { pauseForPromptDisplay } from '../../../utilities/utils';

const cancelledMessage = 'Add API extension cancelled';

export interface AddApiExtensionOptions {
    plugin?: VendurePluginRef;
}

export const addApiExtensionCommand = new CliCommand({
    id: 'add-api-extension',
    category: 'Plugin: API',
    description: 'Adds GraphQL API extensions to a plugin',
    run: options => addApiExtension(options),
});

async function addApiExtension(
    options?: AddApiExtensionOptions,
): Promise<CliCommandReturnVal<{ serviceRef: ServiceRef }>> {
    const providedVendurePlugin = options?.plugin;
    const project = await analyzeProject({ providedVendurePlugin, cancelledMessage });
    const plugin = providedVendurePlugin ?? (await selectPlugin(project, cancelledMessage));
    const serviceRef = await selectServiceRef(project, plugin);

    const serviceEntityRef = serviceRef.crudEntityRef;
    const modifiedSourceFiles: SourceFile[] = [];
    let resolver: ClassDeclaration | undefined;
    let apiExtensions: VariableDeclaration | undefined;

    const scaffoldSpinner = spinner();

    scaffoldSpinner.start('Generating resolver file...');
    await pauseForPromptDisplay();
    if (serviceEntityRef) {
        resolver = createCrudResolver(project, plugin, serviceRef, serviceEntityRef);
        modifiedSourceFiles.push(resolver.getSourceFile());
    } else {
        resolver = createSimpleResolver(project, plugin, serviceRef);
        modifiedSourceFiles.push(resolver.getSourceFile());
    }

    scaffoldSpinner.message('Generating schema definitions...');
    await pauseForPromptDisplay();

    if (serviceEntityRef) {
        apiExtensions = createCrudApiExtension(project, plugin, serviceRef);
    } else {
        apiExtensions = createSimpleApiExtension(project, plugin, serviceRef);
    }
    if (apiExtensions) {
        modifiedSourceFiles.push(apiExtensions.getSourceFile());
    }

    scaffoldSpinner.message('Registering API extension with plugin...');
    await pauseForPromptDisplay();

    plugin.addAdminApiExtensions({
        schema: apiExtensions,
        resolvers: [resolver],
    });
    addImportsToFile(plugin.getSourceFile(), {
        namedImports: [resolver.getName() as string],
        moduleSpecifier: resolver.getSourceFile(),
    });
    if (apiExtensions) {
        addImportsToFile(plugin.getSourceFile(), {
            namedImports: [apiExtensions.getName()],
            moduleSpecifier: apiExtensions.getSourceFile(),
        });
    }

    scaffoldSpinner.stop(`API extensions added`);

    await project.save();

    return {
        project,
        modifiedSourceFiles: [serviceRef.classDeclaration.getSourceFile(), ...modifiedSourceFiles],
        serviceRef,
    };
}

function createSimpleResolver(project: Project, plugin: VendurePluginRef, serviceRef: ServiceRef) {
    const resolverSourceFile = createFile(
        project,
        path.join(__dirname, 'templates/simple-resolver.template.ts'),
    );
    resolverSourceFile.move(
        path.join(
            plugin.getPluginDir().getPath(),
            'api',
            paramCase(serviceRef.name).replace('-service', '') + '-admin.resolver.ts',
        ),
    );
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const resolverClassDeclaration = resolverSourceFile
        .getClass('SimpleAdminResolver')!
        .rename(serviceRef.name.replace(/Service$/, '') + 'AdminResolver');

    resolverClassDeclaration
        .getConstructors()[0]
        .getParameter('templateService')
        ?.rename(serviceRef.nameCamelCase)
        .setType(serviceRef.name);

    resolverSourceFile.getClass('TemplateService')?.remove();
    addImportsToFile(resolverSourceFile, {
        namedImports: [serviceRef.name],
        moduleSpecifier: serviceRef.classDeclaration.getSourceFile(),
    });

    return resolverClassDeclaration;
}

function createCrudResolver(
    project: Project,
    plugin: VendurePluginRef,
    serviceRef: ServiceRef,
    serviceEntityRef: EntityRef,
) {
    const resolverSourceFile = createFile(
        project,
        path.join(__dirname, 'templates/crud-resolver.template.ts'),
    );
    resolverSourceFile.move(
        path.join(
            plugin.getPluginDir().getPath(),
            'api',
            paramCase(serviceEntityRef.name) + '-admin.resolver.ts',
        ),
    );
    // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
    const resolverClassDeclaration = resolverSourceFile
        .getClass('EntityAdminResolver')!
        .rename(serviceEntityRef.name + 'AdminResolver');

    if (serviceRef.features.findOne) {
        resolverClassDeclaration.getMethod('entity')?.rename(serviceEntityRef.nameCamelCase);
    } else {
        resolverClassDeclaration.getMethod('entity')?.remove();
    }

    if (serviceRef.features.findAll) {
        resolverClassDeclaration.getMethod('entities')?.rename(serviceEntityRef.nameCamelCase + 's');
    } else {
        resolverClassDeclaration.getMethod('entities')?.remove();
    }

    if (serviceRef.features.create) {
        resolverClassDeclaration.getMethod('createEntity')?.rename('create' + serviceEntityRef.name);
    } else {
        resolverClassDeclaration.getMethod('createEntity')?.remove();
    }

    if (serviceRef.features.update) {
        resolverClassDeclaration.getMethod('updateEntity')?.rename('update' + serviceEntityRef.name);
    } else {
        resolverClassDeclaration.getMethod('updateEntity')?.remove();
    }

    if (serviceRef.features.delete) {
        resolverClassDeclaration.getMethod('deleteEntity')?.rename('delete' + serviceEntityRef.name);
    } else {
        resolverClassDeclaration.getMethod('deleteEntity')?.remove();
    }

    resolverClassDeclaration
        .getConstructors()[0]
        .getParameter('templateService')
        ?.rename(serviceRef.nameCamelCase)
        .setType(serviceRef.name);
    resolverSourceFile.getClass('TemplateEntity')?.rename(serviceEntityRef.name).remove();
    resolverSourceFile.getClass('TemplateService')?.remove();
    addImportsToFile(resolverSourceFile, {
        namedImports: [serviceRef.name],
        moduleSpecifier: serviceRef.classDeclaration.getSourceFile(),
    });
    addImportsToFile(resolverSourceFile, {
        namedImports: [serviceEntityRef.name],
        moduleSpecifier: serviceEntityRef.classDeclaration.getSourceFile(),
    });

    return resolverClassDeclaration;
}

function createSimpleApiExtension(project: Project, plugin: VendurePluginRef, serviceRef: ServiceRef) {
    const apiExtensionsFile = getOrCreateApiExtensionsFile(project, plugin);
    const adminApiExtensionDocuments = apiExtensionsFile.getVariableDeclaration('adminApiExtensionDocuments');
    const insertAtIndex = adminApiExtensionDocuments?.getParent().getParent().getChildIndex() ?? 2;
    const schemaVariableName = `${serviceRef.nameCamelCase.replace(/Service$/, '')}AdminApiExtensions`;
    apiExtensionsFile.insertVariableStatement(insertAtIndex, {
        declarationKind: VariableDeclarationKind.Const,
        declarations: [
            {
                name: schemaVariableName,
                initializer: writer => {
                    writer.writeLine(`gql\``);
                    writer.indent(() => {
                        writer.writeLine(`  extend type Query {`);
                        writer.writeLine(`    exampleQuery(id: ID!): Boolean!`);
                        writer.writeLine(`  }`);
                        writer.newLine();
                        writer.writeLine(`  extend type Mutation {`);
                        writer.writeLine(`    exampleMutation(id: ID!): Boolean!`);
                        writer.writeLine(`  }`);
                    });
                    writer.write(`\``);
                },
            },
        ],
    });

    if (adminApiExtensionDocuments) {
        const initializer = adminApiExtensionDocuments.getInitializer();
        if (Node.isArrayLiteralExpression(initializer)) {
            initializer.addElement(schemaVariableName);
        }
    }

    const adminApiExtensions = apiExtensionsFile.getVariableDeclaration('adminApiExtensions');
    return adminApiExtensions;
}

function createCrudApiExtension(project: Project, plugin: VendurePluginRef, serviceRef: ServiceRef) {
    const apiExtensionsFile = getOrCreateApiExtensionsFile(project, plugin);
    const adminApiExtensionDocuments = apiExtensionsFile.getVariableDeclaration('adminApiExtensionDocuments');
    const insertAtIndex = adminApiExtensionDocuments?.getParent().getParent().getChildIndex() ?? 2;
    const schemaVariableName = `${serviceRef.nameCamelCase.replace(/Service$/, '')}AdminApiExtensions`;
    apiExtensionsFile.insertVariableStatement(insertAtIndex, {
        declarationKind: VariableDeclarationKind.Const,
        declarations: [
            {
                name: schemaVariableName,
                initializer: writer => {
                    writer.writeLine(`gql\``);
                    const entityRef = serviceRef.crudEntityRef;
                    if (entityRef) {
                        writer.indent(() => {
                            writer.writeLine(`  type ${entityRef.name} implements Node {`);
                            writer.writeLine(`    id: ID!`);
                            writer.writeLine(`    createdAt: DateTime!`);
                            writer.writeLine(`    updatedAt: DateTime!`);
                            for (const { name, type, nullable } of entityRef.getProps()) {
                                const graphQlType = getGraphQLType(type);
                                if (graphQlType) {
                                    writer.writeLine(`  ${name}: ${graphQlType}${nullable ? '' : '!'}`);
                                }
                            }
                            writer.writeLine(`  }`);
                            writer.newLine();

                            writer.writeLine(`  type ${entityRef.name}List implements PaginatedList {`);
                            writer.writeLine(`    items: [${entityRef.name}!]!`);
                            writer.writeLine(`    totalItems: Int!`);
                            writer.writeLine(`  }`);
                            writer.newLine();

                            writer.writeLine(`  # Generated at run-time by Vendure`);
                            writer.writeLine(`  input ${entityRef.name}ListOptions`);
                            writer.newLine();

                            writer.writeLine(`  extend type Query {`);

                            if (serviceRef.features.findOne) {
                                writer.writeLine(
                                    `    ${entityRef.nameCamelCase}(id: ID!): ${entityRef.name}`,
                                );
                            }
                            if (serviceRef.features.findAll) {
                                writer.writeLine(
                                    `    ${entityRef.nameCamelCase}s(options: ${entityRef.name}ListOptions): ${entityRef.name}List!`,
                                );
                            }
                            writer.writeLine(`  }`);
                            writer.newLine();

                            if (serviceRef.features.create) {
                                writer.writeLine(`  input Create${entityRef.name}Input {`);
                                for (const { name, type, nullable } of entityRef.getProps()) {
                                    const graphQlType = getGraphQLType(type);
                                    if (graphQlType) {
                                        writer.writeLine(`    ${name}: ${graphQlType}${nullable ? '' : '!'}`);
                                    }
                                }
                                writer.writeLine(`  }`);
                                writer.newLine();
                            }

                            if (serviceRef.features.update) {
                                writer.writeLine(`  input Update${entityRef.name}Input {`);
                                writer.writeLine(`    id: ID!`);
                                for (const { name, type } of entityRef.getProps()) {
                                    const graphQlType = getGraphQLType(type);
                                    if (graphQlType) {
                                        writer.writeLine(`    ${name}: ${graphQlType}`);
                                    }
                                }
                                writer.writeLine(`  }`);
                                writer.newLine();
                            }

                            if (
                                serviceRef.features.create ||
                                serviceRef.features.update ||
                                serviceRef.features.delete
                            ) {
                                writer.writeLine(`  extend type Mutation {`);
                                if (serviceRef.features.create) {
                                    writer.writeLine(
                                        `    create${entityRef.name}(input: Create${entityRef.name}Input!): ${entityRef.name}!`,
                                    );
                                }
                                if (serviceRef.features.update) {
                                    writer.writeLine(
                                        `    update${entityRef.name}(input: Update${entityRef.name}Input!): ${entityRef.name}!`,
                                    );
                                }
                                if (serviceRef.features.delete) {
                                    writer.writeLine(
                                        `    delete${entityRef.name}(id: ID!): DeletionResponse!`,
                                    );
                                }
                                writer.writeLine(`  }`);
                            }
                        });
                    }
                    writer.write(`\``);
                },
            },
        ],
    });

    if (adminApiExtensionDocuments) {
        const initializer = adminApiExtensionDocuments.getInitializer();
        if (Node.isArrayLiteralExpression(initializer)) {
            initializer.addElement(schemaVariableName);
        }
    }

    const adminApiExtensions = apiExtensionsFile.getVariableDeclaration('adminApiExtensions');
    return adminApiExtensions;
}

function getGraphQLType(type: Type): string | undefined {
    if (type.isString()) {
        return 'String';
    }
    if (type.isBoolean()) {
        return 'Boolean';
    }
    if (type.isNumber()) {
        return 'Int';
    }
    if (type.isClass() && type.getText() === 'Date') {
        return 'DateTime';
    }
    return;
}

function getOrCreateApiExtensionsFile(project: Project, plugin: VendurePluginRef): SourceFile {
    const existingApiExtensionsFile = project.getSourceFiles().find(sf => {
        return sf.getBaseName() === 'api-extensions.ts' && sf.getDirectory().getPath().endsWith('/api');
    });
    if (existingApiExtensionsFile) {
        return existingApiExtensionsFile;
    }
    return createFile(project, path.join(__dirname, 'templates/api-extensions.template.ts')).move(
        path.join(plugin.getPluginDir().getPath(), 'api', 'api-extensions.ts'),
    );
}
