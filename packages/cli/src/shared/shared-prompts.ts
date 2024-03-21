import { cancel, isCancel, multiselect, select, text } from '@clack/prompts';
import { pascalCase } from 'change-case';
import { ClassDeclaration, Project } from 'ts-morph';

import { getPluginClasses } from '../utilities/ast-utils';

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

export async function selectPluginClass(project: Project, cancelledMessage: string) {
    const pluginClasses = getPluginClasses(project);
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
    return targetPlugin as ClassDeclaration;
}

export async function selectMultiplePluginClasses(project: Project, cancelledMessage: string) {
    const pluginClasses = getPluginClasses(project);
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
        return pluginClasses;
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
    return targetPlugins as ClassDeclaration[];
}
