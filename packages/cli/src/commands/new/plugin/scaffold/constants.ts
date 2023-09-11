import { constantCase, pascalCase } from 'change-case';

import { TemplateContext } from '../types';

export function renderConstants({ pluginName, pluginInitOptionsName }: TemplateContext): string {
    return /* language=TypeScript */ `
export const ${pluginInitOptionsName} = Symbol('${pluginInitOptionsName}');
export const loggerCtx = '${pluginName}';
`;
}
