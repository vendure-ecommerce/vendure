import { cancel, isCancel, select } from '@clack/prompts';
import fs from 'fs-extra';
import path from 'node:path';
import {
    ClassDeclaration,
    Node,
    ObjectLiteralExpression,
    Project,
    QuoteKind,
    SourceFile,
    VariableDeclaration,
} from 'ts-morph';
import { defaultManipulationSettings } from '../constants';

export async function selectPluginClass(project: Project, cancelledMessage: string) {
    const pluginClasses = getPluginClasses(project);
    const targetPlugin = await select({
        message: 'To which plugin would you like to add the feature?',
        options: pluginClasses.map(c => ({
            value: c,
            label: c.getName() as string,
        })),
    });
    if (isCancel(targetPlugin)) {
        cancel(cancelledMessage);
        process.exit(0);
    }
    return targetPlugin as ClassDeclaration;
}

export function getTsMorphProject() {
    const tsConfigPath = path.join(process.cwd(), 'tsconfig.json');
    if (!fs.existsSync(tsConfigPath)) {
        throw new Error('No tsconfig.json found in current directory');
    }
    return new Project({
        tsConfigFilePath: tsConfigPath,
        manipulationSettings: defaultManipulationSettings,
        compilerOptions: {
            skipLibCheck: true,
        },
    });
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

export function getVendureConfig(project: Project, options: { checkFileName?: boolean } = {}) {
    const sourceFiles = project.getSourceFiles();
    const checkFileName = options.checkFileName ?? true;
    function isVendureConfigVariableDeclaration(v: VariableDeclaration) {
        return v.getType().getText(v) === 'VendureConfig';
    }
    const vendureConfigFile = sourceFiles.find(sf => {
        return (
            (checkFileName ? sf.getFilePath().endsWith('vendure-config.ts') : true) &&
            sf.getVariableDeclarations().find(isVendureConfigVariableDeclaration)
        );
    });
    return vendureConfigFile
        ?.getVariableDeclarations()
        .find(isVendureConfigVariableDeclaration)
        ?.getChildren()
        .find(Node.isObjectLiteralExpression) as ObjectLiteralExpression;
}

export function addImportsToFile(
    sourceFile: SourceFile,
    options: { moduleSpecifier: string; namedImports?: string[]; namespaceImport?: string; order?: number },
) {
    const existingDeclaration = sourceFile.getImportDeclaration(
        declaration => declaration.getModuleSpecifier().getLiteralValue() === options.moduleSpecifier,
    );
    if (!existingDeclaration) {
        const importDeclaration = sourceFile.addImportDeclaration({
            moduleSpecifier: options.moduleSpecifier,
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

export function kebabize(str: string) {
    return str
        .split('')
        .map((letter, idx) => {
            return letter.toUpperCase() === letter
                ? `${idx !== 0 ? '-' : ''}${letter.toLowerCase()}`
                : letter;
        })
        .join('');
}
