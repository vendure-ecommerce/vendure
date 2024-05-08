import { Project } from 'ts-morph';
import { z } from 'zod';

export enum InputOptionType {
    String = 'string',
    Number = 'number',
    Boolean = 'boolean',
    Select = 'select',
}

export class InputOptionSelectChoice {
    value: string;
    label: string;
    hint?: string;
}

export class InputOptionDefinition {
    name: string;
    shortFlag: string;
    longName: string;
    type: InputOptionType;
    choices?: InputOptionSelectChoice[];
    help?: string;
    description?: string;
    prompt?: string;
    defaultValue?: (currentOptions: Record<string, any>, project: Project) => any;
    required?: boolean;
    validate?: (value: any) => string | void;
    transform?: (value: any) => any;
}

export class InputDefinitions {
    options: InputOptionDefinition[];
}
