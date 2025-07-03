import { ConfigurableOperationDefFragment } from '@/vdb/graphql/fragments.js';
import { ConfigurableOperationInput as ConfigurableOperationInputType } from '@vendure/common/lib/generated-types';
import { Trash } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { Button } from '../ui/button.js';
import { Form, FormControl, FormField, FormItem, FormLabel } from '../ui/form.js';
import { ConfigurableOperationArgInput } from './configurable-operation-arg-input.js';

export interface ConfigurableOperationInputProps {
    operationDefinition: ConfigurableOperationDefFragment;
    readonly?: boolean;
    removable?: boolean;
    position?: number;
    hideDescription?: boolean;
    value: ConfigurableOperationInputType;
    onChange: (val: ConfigurableOperationInputType) => void;
    onRemove?: () => void;
}

export function ConfigurableOperationInput({
    operationDefinition,
    readonly,
    removable,
    position,
    hideDescription,
    value,
    onChange,
    onRemove,
}: ConfigurableOperationInputProps) {
    const form = useForm({
        defaultValues: {
            ...value,
        },
    });

    const handleInputChange = (name: string, inputValue: string) => {
        const argIndex = value.arguments.findIndex(arg => arg.name === name);
        const stringValue = inputValue.toString();
        let updatedArgs: ConfigurableOperationInputType['arguments'];
        if (argIndex === -1) {
            updatedArgs = [...value.arguments, { name, value: stringValue }];
        } else {
            updatedArgs = value.arguments.map(arg =>
                arg.name === name ? { ...arg, value: stringValue } : arg,
            );
        }
        const newVal: ConfigurableOperationInputType = { ...value, arguments: updatedArgs };
        onChange(newVal);
    };

    return (
        <Form {...form}>
            <div className="space-y-4">
                <div className="flex flex-row justify-between">
                    {!hideDescription && (
                        <div className="font-medium">
                            {' '}
                            {interpolateDescription(operationDefinition, value.arguments)}
                        </div>
                    )}
                    {removable !== false && (
                        <Button variant="outline" size="icon" onClick={onRemove}>
                            <Trash />
                        </Button>
                    )}
                </div>
                <div className="grid grid-cols-2 gap-4">
                    {operationDefinition.args.map(arg => {
                        const argValue = value.arguments.find(a => a.name === arg.name)?.value || '';
                        return (
                            <FormField
                                key={arg.name}
                                name={`args.${arg.name}`}
                                render={() => (
                                    <FormItem>
                                        <FormLabel>{arg.label || arg.name}</FormLabel>
                                        <FormControl>
                                            <ConfigurableOperationArgInput
                                                definition={arg}
                                                value={argValue}
                                                onChange={value => handleInputChange(arg.name, value)}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                        );
                    })}
                </div>
            </div>
        </Form>
    );
}

/**
 * Interpolates the description of an ConfigurableOperation with the given values.
 */
export function interpolateDescription(
    operation: any,
    values: Array<{ name: string; value: string }>,
    precisionFactor = 2,
): string {
    if (!operation) {
        return '';
    }
    const templateString = operation.description;
    const interpolated = templateString.replace(
        /{\s*([a-zA-Z0-9]+)\s*}/gi,
        (substring: string, argName: string) => {
            const normalizedArgName = argName.toLowerCase();
            const value = values.find(v => v.name === normalizedArgName)?.value;
            if (value == null) {
                return '_';
            }
            let formatted = value;
            const argDef = operation.args.find((arg: any) => arg.name === normalizedArgName);
            if (
                argDef &&
                argDef.type === 'int' &&
                argDef.ui &&
                argDef.ui.component === 'currency-form-input'
            ) {
                formatted = (Number(value) / Math.pow(10, precisionFactor)).toString();
            }
            if (argDef && argDef.type === 'datetime' && (value as any) instanceof Date) {
                formatted = (value as any).toLocaleDateString();
            }
            return formatted;
        },
    );
    return interpolated;
}
