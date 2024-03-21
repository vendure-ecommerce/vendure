import { cancel, isCancel, multiselect, select, spinner, text } from '@clack/prompts';
import { pascalCase } from 'change-case';
import { ClassDeclaration, Project } from 'ts-morph';

import { Messages } from '../constants';
import { getPluginClasses, getTsMorphProject } from '../utilities/ast-utils';
import { VendurePluginRef } from '../utilities/vendure-plugin-ref';

export async function getCustomEntityName(cancelledMessage: string) {
    const entityName = await text({
        message: 'What is the name of the custom entity?',
        initialValue: '',
        validate: input => {
            if (!input) {
                return 'The custom entity name cannot be empty';
            }
            const pascalCaseRegex = /^[A-Z][a-zA-Z0-9]*$/;
            if (!pascalCaseRegex.test(input)) {
                return 'The custom entity name must be in PascalCase, e.g. "ProductReview"';
            }
        },
    });
    if (isCancel(entityName)) {
        cancel(cancelledMessage);
        process.exit(0);
    }
    return pascalCase(entityName);
}

export async function analyzeProject(options: {
    providedVendurePlugin?: VendurePluginRef;
    cancelledMessage?: string;
}) {
    const providedVendurePlugin = options.providedVendurePlugin;
    let project = providedVendurePlugin?.classDeclaration.getProject();
    if (!providedVendurePlugin) {
        const projectSpinner = spinner();
        projectSpinner.start('Analyzing project...');
        await new Promise(resolve => setTimeout(resolve, 100));
        project = getTsMorphProject();
        projectSpinner.stop('Project analyzed');
    }
    return project as Project;
}

export async function selectPlugin(project: Project, cancelledMessage: string): Promise<VendurePluginRef> {
    const pluginClasses = getPluginClasses(project);
    if (pluginClasses.length === 0) {
        cancel(Messages.NoPluginsFound);
        process.exit(0);
    }
    const targetPlugin = await select({
        message: 'To which plugin would you like to add the feature?',
        options: pluginClasses.map(c => ({
            value: c,
            label: c.getName() as string,
        })),
        maxItems: 10,
    });
    if (isCancel(targetPlugin)) {
        cancel(cancelledMessage);
        process.exit(0);
    }
    return new VendurePluginRef(targetPlugin as ClassDeclaration);
}

export async function selectMultiplePluginClasses(
    project: Project,
    cancelledMessage: string,
): Promise<VendurePluginRef[]> {
    const pluginClasses = getPluginClasses(project);
    if (pluginClasses.length === 0) {
        cancel(Messages.NoPluginsFound);
        process.exit(0);
    }
    const selectAll = await select({
        message: 'To which plugin would you like to add the feature?',
        options: [
            {
                value: 'all',
                label: 'All plugins',
            },
            {
                value: 'specific',
                label: 'Specific plugins (you will be prompted to select the plugins)',
            },
        ],
    });
    if (isCancel(selectAll)) {
        cancel(cancelledMessage);
        process.exit(0);
    }
    if (selectAll === 'all') {
        return pluginClasses.map(pc => new VendurePluginRef(pc));
    }
    const targetPlugins = await multiselect({
        message: 'Select one or more plugins (use ↑, ↓, space to select)',
        options: pluginClasses.map(c => ({
            value: c,
            label: c.getName() as string,
        })),
    });
    if (isCancel(targetPlugins)) {
        cancel(cancelledMessage);
        process.exit(0);
    }
    return (targetPlugins as ClassDeclaration[]).map(pc => new VendurePluginRef(pc));
}
