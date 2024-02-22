import { NewPluginTemplateContext } from '../types';

export function renderTypes(options: NewPluginTemplateContext): string {
    return /* language=TypeScript */ `
/**
 * The plugin can be configured using the following options:
 */
export interface PluginInitOptions {
    exampleOption: string;
}
`;
}
