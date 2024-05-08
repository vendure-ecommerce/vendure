import { cancel, confirm, isCancel, select, text } from '@clack/prompts';
import { Project } from 'ts-morph';

import { InputDefinitions, InputOptionSelectChoice, InputOptionType } from './input-option-definitions';

export const runPromptsForInputDefinitions = async (
    inputDefinitions: InputDefinitions,
    project: Project,
    cancelledMessage: string,
    options: Record<string, any> = {},
) => {
    for (const inputOptionDef of inputDefinitions.options) {
        if (inputOptionDef.type === InputOptionType.String) {
            if (!inputOptionDef.prompt) {
                throw new Error(`InputOptionDefinition of type 'string' must have a 'prompt' property`);
            }

            let val = await text({
                message: inputOptionDef.prompt,
                initialValue: inputOptionDef.defaultValue?.(options, project),
                validate: inputOptionDef.validate,
            });

            if (isCancel(val)) {
                cancel(cancelledMessage);
                process.exit(0);
            }

            if (inputOptionDef.transform) {
                val = inputOptionDef.transform(val);
            }

            options[inputOptionDef.name] = val;
        } else if (inputOptionDef.type === InputOptionType.Select) {
            if (!inputOptionDef.prompt) {
                throw new Error(`InputOptionDefinition of type 'select' must have a 'prompt' property`);
            }
            if (!inputOptionDef.choices) {
                throw new Error(`InputOptionDefinition of type 'select' must have a 'choices' property`);
            }

            let val = await select<InputOptionSelectChoice[], string>({
                message: inputOptionDef.prompt,
                options: inputOptionDef.choices,
                initialValue: inputOptionDef.defaultValue?.(options, project),
            });

            if (isCancel(val)) {
                cancel(cancelledMessage);
                process.exit(0);
            }

            if (inputOptionDef.transform) {
                val = inputOptionDef.transform(val);
            }

            options[inputOptionDef.name] = val;
        } else if (inputOptionDef.type === InputOptionType.Boolean) {
            if (!inputOptionDef.prompt) {
                throw new Error(`InputOptionDefinition of type 'string' must have a 'prompt' property`);
            }

            let val = await confirm({
                message: inputOptionDef.prompt,
                initialValue: inputOptionDef.defaultValue?.(options, project),
            });

            if (inputOptionDef.transform) {
                val = inputOptionDef.transform(val);
            }

            if (isCancel(val)) {
                cancel(cancelledMessage);
                process.exit(0);
            }

            options[inputOptionDef.name] = val;
        }
    }

    return options;
};
