import { log, note, outro, spinner } from '@clack/prompts';
import path from 'path';
import { ClassDeclaration, StructureKind, SyntaxKind } from 'ts-morph';

import { analyzeProject, selectMultiplePluginClasses } from '../../../shared/shared-prompts';
import { createFile, getRelativeImportPath, getTsMorphProject } from '../../../utilities/ast-utils';
import { PackageJson } from '../../../utilities/package-utils';
import { VendurePluginDeclaration } from '../../../utilities/vendure-plugin-declaration';

export async function addCodegen(providedVendurePlugin?: VendurePluginDeclaration) {
    const project = await analyzeProject({
        providedVendurePlugin,
        cancelledMessage: 'Add codegen cancelled',
    });
    const plugins = providedVendurePlugin
        ? [providedVendurePlugin]
        : await selectMultiplePluginClasses(project, 'Add codegen cancelled');

    const packageJson = new PackageJson(project);
    const installSpinner = spinner();
    installSpinner.start(`Installing dependencies...`);
    try {
        await packageJson.installPackages([
            {
                pkg: '@graphql-codegen/cli',
                isDevDependency: true,
            },
            {
                pkg: '@graphql-codegen/typescript',
                isDevDependency: true,
            },
        ]);
    } catch (e: any) {
        log.error(`Failed to install dependencies: ${e.message as string}.`);
    }
    installSpinner.stop('Dependencies installed');

    const configSpinner = spinner();
    configSpinner.start('Configuring codegen file...');
    await new Promise(resolve => setTimeout(resolve, 100));

    const tempProject = getTsMorphProject({ skipAddingFilesFromTsConfig: true });
    const codegenFile = createFile(tempProject, path.join(__dirname, 'templates/codegen.template.ts'));
    const codegenConfig = codegenFile
        .getVariableDeclaration('config')
        ?.getChildrenOfKind(SyntaxKind.ObjectLiteralExpression)[0];
    if (!codegenConfig) {
        throw new Error('Could not find the config variable in the template codegen file');
    }
    const generatesProp = codegenConfig
        .getProperty('generates')
        ?.getFirstChildByKind(SyntaxKind.ObjectLiteralExpression);
    if (!generatesProp) {
        throw new Error('Could not find the generates property in the template codegen file');
    }
    const rootDir = tempProject.getDirectory('.');
    if (!rootDir) {
        throw new Error('Could not find the root directory of the project');
    }
    for (const plugin of plugins) {
        const relativePluginPath = getRelativeImportPath({
            from: plugin.classDeclaration.getSourceFile(),
            to: rootDir,
        });
        const generatedTypesPath = `${path.dirname(relativePluginPath)}/gql/generated.ts`;
        generatesProp
            .addProperty({
                name: `'${generatedTypesPath}'`,
                kind: StructureKind.PropertyAssignment,
                initializer: `{ plugins: ['typescript'] }`,
            })
            .formatText();
    }
    codegenFile.move(path.join(rootDir.getPath(), 'codegen.ts'));

    packageJson.addScript('codegen', 'graphql-codegen --config codegen.ts');

    configSpinner.stop('Configured codegen file');

    project.saveSync();

    const nextSteps = [
        `You can run codegen by doing the following:`,
        `1. Ensure your dev server is running`,
        `2. Run "npm run codegen"`,
    ];
    note(nextSteps.join('\n'));

    if (!providedVendurePlugin) {
        outro('✅ Codegen setup complete!');
    }
}
