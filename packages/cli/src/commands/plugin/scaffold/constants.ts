import { constantCase, pascalCase } from 'change-case';

import { TemplateContext } from '../types';

export function render(context: TemplateContext): string {
    return /* language=TypeScript */ `
export const ${context.pluginInitOptionsName} = Symbol('${context.pluginInitOptionsName}');
export const loggerCtx = '${context.pluginName}';
`;
}
