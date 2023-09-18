import { constantCase, pascalCase } from 'change-case';

import { TemplateContext } from '../types';

export function renderConstants(context: TemplateContext): string {
    const { pluginName, pluginInitOptionsName } = context;
    const optionalImports: string[] = [];
    const optionalStatements: string[] = [];
    if (context.withCustomEntity) {
        optionalImports.push(`import { CrudPermissionDefinition } from '@vendure/core';`);
        optionalStatements.push(
            `export const ${context.entity.instanceName}Permission = new CrudPermissionDefinition('${context.entity.className}');`,
        );
    }
    return /* language=TypeScript */ `
${optionalImports.join('\n')}

export const ${pluginInitOptionsName} = Symbol('${pluginInitOptionsName}');
export const loggerCtx = '${pluginName}';
${optionalStatements.join('\n')}
`;
}
