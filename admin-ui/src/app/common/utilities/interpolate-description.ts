import { ConfigurableOperationDefinition } from '../generated-types';

/**
 * Interpolates the description of an ConfigurableOperation with the given values.
 */
export function interpolateDescription(
    operation: ConfigurableOperationDefinition,
    values: { [name: string]: any },
): string {
    if (!operation) {
        return '';
    }
    const templateString = operation.description;
    const interpolated = templateString.replace(/{\s*([a-zA-Z0-9]+)\s*}/gi, (substring, argName: string) => {
        const normalizedArgName = argName.toLowerCase();
        const value = values[normalizedArgName];
        if (value == null) {
            return '_';
        }
        let formatted = value;
        const argDef = operation.args.find(arg => arg.name === normalizedArgName);
        if (argDef && argDef.type === 'int' && argDef.config && argDef.config.inputType === 'money') {
            formatted = value / 100;
        }
        if (argDef && argDef.type === 'datetime' && value instanceof Date) {
            formatted = value.toLocaleDateString();
        }
        return formatted;
    });
    return interpolated;
}
