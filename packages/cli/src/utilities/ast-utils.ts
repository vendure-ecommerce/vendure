import { cancel, isCancel, log, select } from '@clack/prompts';
import fs from 'fs-extra';
import path from 'node:path';
import { Directory, Node, Project, ProjectOptions, ScriptKind, SourceFile } from 'ts-morph';

import { defaultManipulationSettings } from '../constants';
import { EntityRef } from '../shared/entity-ref';

export async function selectTsConfigFile() {
    const tsConfigFiles = fs.readdirSync(process.cwd()).filter(f => /^tsconfig.*\.json$/.test(f));
    if (tsConfigFiles.length === 0) {
        throw new Error('No tsconfig files found in current directory');
    }
    if (tsConfigFiles.length === 1) {
        return tsConfigFiles[0];
    }
    const selectedConfigFile = await select({
        message: 'Multiple tsconfig files found. Select one:',
        options: tsConfigFiles.map(c => ({
            value: c,
            label: path.basename(c),
        })),
        maxItems: 10,
    });
    if (isCancel(selectedConfigFile)) {
        cancel();
        process.exit(0);
    }
    return selectedConfigFile as string;
}

export async function getTsMorphProject(options: ProjectOptions = {}, providedTsConfigPath?: string) {
    const tsConfigFile = providedTsConfigPath ?? (await selectTsConfigFile());
    const tsConfigPath = path.join(process.cwd(), tsConfigFile);
    if (!fs.existsSync(tsConfigPath)) {
        throw new Error('No tsconfig.json found in current directory');
    }
    const project = new Project({
        tsConfigFilePath: tsConfigPath,
        manipulationSettings: defaultManipulationSettings,
        compilerOptions: {
            skipLibCheck: true,
        },
        ...options,
    });
    project.enableLogging(false);
    return { project, tsConfigPath };
}

export function getPluginClasses(project: Project) {
    const sourceFiles = project.getSourceFiles();

    const pluginClasses = sourceFiles
        .flatMap(sf => {
            return sf.getClasses();
        })
        .filter(c => {
            const hasPluginDecorator = c.getModifiers().find(m => {
                return Node.isDecorator(m) && m.getName() === 'VendurePlugin';
            });
            return !!hasPluginDecorator;
        });
    return pluginClasses;
}

export function addImportsToFile(
    sourceFile: SourceFile,
    options: {
        moduleSpecifier: string | SourceFile;
        namedImports?: string[];
        namespaceImport?: string;
        order?: number;
    },
) {
    const moduleSpecifier = getModuleSpecifierString(options.moduleSpecifier, sourceFile);
    const existingDeclaration = sourceFile.getImportDeclaration(
        declaration => declaration.getModuleSpecifier().getLiteralValue() === moduleSpecifier,
    );
    if (!existingDeclaration) {
        const importDeclaration = sourceFile.addImportDeclaration({
            moduleSpecifier,
            ...(options.namespaceImport ? { namespaceImport: options.namespaceImport } : {}),
            ...(options.namedImports ? { namedImports: options.namedImports } : {}),
        });
        if (options.order != null) {
            importDeclaration.setOrder(options.order);
        }
    } else {
        if (
            options.namespaceImport &&
            !existingDeclaration.getNamespaceImport() &&
            !existingDeclaration.getDefaultImport()
        ) {
            existingDeclaration.setNamespaceImport(options.namespaceImport);
        }
        if (options.namedImports) {
            const existingNamedImports = existingDeclaration.getNamedImports();
            for (const namedImport of options.namedImports) {
                if (!existingNamedImports.find(ni => ni.getName() === namedImport)) {
                    existingDeclaration.addNamedImport(namedImport);
                }
            }
        }
    }
}

function getModuleSpecifierString(moduleSpecifier: string | SourceFile, sourceFile: SourceFile): string {
    if (typeof moduleSpecifier === 'string') {
        return moduleSpecifier;
    }
    return getRelativeImportPath({ from: sourceFile, to: moduleSpecifier });
}

export function getRelativeImportPath(locations: {
    from: SourceFile | Directory;
    to: SourceFile | Directory;
}): string {
    const fromPath =
        locations.from instanceof SourceFile ? locations.from.getFilePath() : locations.from.getPath();
    const toPath = locations.to instanceof SourceFile ? locations.to.getFilePath() : locations.to.getPath();
    const fromDir = /\.[a-z]+$/.test(fromPath) ? path.dirname(fromPath) : fromPath;
    return convertPathToRelativeImport(path.relative(fromDir, toPath));
}

export function createFile(project: Project, templatePath: string, filePath: string) {
    const template = fs.readFileSync(templatePath, 'utf-8');
    try {
        const file = project.createSourceFile(filePath, template, {
            overwrite: true,
            scriptKind: ScriptKind.TS,
        });
        project.resolveSourceFileDependencies();
        return file;
    } catch (e: any) {
        log.error(e.message);
        process.exit(1);
    }
}

function convertPathToRelativeImport(filePath: string): string {
    // Normalize the path separators
    const normalizedPath = filePath.replace(/\\/g, '/');

    // Remove the file extension
    const parsedPath = path.parse(normalizedPath);
    const prefix = parsedPath.dir.startsWith('..') ? '' : './';
    return `${prefix}${parsedPath.dir}/${parsedPath.name}`.replace(/\/\//g, '/');
}

export function customizeCreateUpdateInputInterfaces(sourceFile: SourceFile, entityRef: EntityRef) {
    const createInputInterface = sourceFile
        .getInterface('CreateEntityInput')
        ?.rename(`Create${entityRef.name}Input`);
    const updateInputInterface = sourceFile
        .getInterface('UpdateEntityInput')
        ?.rename(`Update${entityRef.name}Input`);

    let index = 0;
    for (const { name, type, nullable } of entityRef.getProps()) {
        if (
            type.isBoolean() ||
            type.isString() ||
            type.isNumber() ||
            (type.isObject() && type.getText() === 'Date')
        ) {
            createInputInterface?.insertProperty(index, {
                name,
                type: writer => writer.write(type.getText()),
                hasQuestionToken: nullable,
            });
            updateInputInterface?.insertProperty(index + 1, {
                name,
                type: writer => writer.write(type.getText()),
                hasQuestionToken: true,
            });
            index++;
        }
    }

    if (!entityRef.hasCustomFields()) {
        createInputInterface?.getProperty('customFields')?.remove();
        updateInputInterface?.getProperty('customFields')?.remove();
    }
    if (entityRef.isTranslatable()) {
        createInputInterface
            ?.getProperty('translations')
            ?.setType(`Array<TranslationInput<${entityRef.name}>>`);
        updateInputInterface
            ?.getProperty('translations')
            ?.setType(`Array<TranslationInput<${entityRef.name}>>`);
    } else {
        createInputInterface?.getProperty('translations')?.remove();
        updateInputInterface?.getProperty('translations')?.remove();
    }
}
