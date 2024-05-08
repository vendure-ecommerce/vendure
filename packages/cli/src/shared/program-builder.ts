import { Command } from 'commander';

import { InputDefinitions } from './input-option-definitions';

export const enrichProgramWithInputOptions = (program: Command, inputDefinitions: InputDefinitions) => {
    for (const inputOptionDef of inputDefinitions.options) {
        program.option(
            `-${inputOptionDef.shortFlag}, --${inputOptionDef.longName} <${inputOptionDef.name}>`,
            inputOptionDef.description,
        );
    }
};
