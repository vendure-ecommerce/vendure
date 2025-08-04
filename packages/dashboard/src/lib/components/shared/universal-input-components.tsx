import React from 'react';
import { ControllerRenderProps } from 'react-hook-form';

import { AffixedInput } from '../data-input/affixed-input.js';
import { DateTimeInput } from '../data-input/datetime-input.js';
import { DefaultRelationInput } from '../data-input/default-relation-input.js';
import { SelectWithOptions } from '../data-input/select-with-options.js';
import { Input } from '../ui/input.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select.js';
import { Switch } from '../ui/switch.js';
import { Textarea } from '../ui/textarea.js';
import { UniversalFieldDefinition } from './universal-field-definition.js';
import { ValueMode, transformValue } from './value-transformers.js';

export interface UniversalInputComponentProps {
    fieldDef: UniversalFieldDefinition;
    field: ControllerRenderProps<any, any>;
    valueMode: ValueMode;
    disabled?: boolean;
}

/**
 * Consolidated input component for rendering form inputs based on field type
 * This replaces the duplicate implementations in custom fields and config args
 */
export function UniversalInputComponent({
    fieldDef,
    field,
    valueMode,
    disabled = false,
}: Readonly<UniversalInputComponentProps>) {
    const isReadonly = disabled || fieldDef.readonly;

    // Transform the field value for the component
    const transformedValue = React.useMemo(() => {
        return valueMode === 'json-string' 
            ? transformValue(field.value, fieldDef, valueMode, 'parse')
            : field.value;
    }, [field.value, fieldDef, valueMode]);

    // Transform onChange handler for the component
    const handleChange = React.useCallback((newValue: any) => {
        const serializedValue = valueMode === 'json-string'
            ? transformValue(newValue, fieldDef, valueMode, 'serialize')
            : newValue;
        field.onChange(serializedValue);
    }, [field.onChange, fieldDef, valueMode]);

    // Handle relation fields
    if (fieldDef.type === 'relation' && fieldDef.entity) {
        return (
            <DefaultRelationInput
                fieldDef={{
                    entity: fieldDef.entity,
                    list: fieldDef.list,
                } as any}
                field={{
                    ...field,
                    value: transformedValue,
                    onChange: handleChange,
                }}
                disabled={isReadonly}
            />
        );
    }

    // Handle string fields with options (dropdown)
    if (fieldDef.type === 'string' && fieldDef.ui?.options) {
        // For config args mode, use simple Select component
        if (valueMode === 'json-string') {
            return (
                <Select 
                    value={transformedValue || ''} 
                    onValueChange={handleChange} 
                    disabled={isReadonly}
                >
                    <SelectTrigger className="bg-background mb-0">
                        <SelectValue placeholder="Select an option..." />
                    </SelectTrigger>
                    <SelectContent>
                        {fieldDef.ui.options.map((option) => (
                            <SelectItem key={option.value} value={option.value}>
                                {typeof option.label === 'string'
                                    ? option.label
                                    : Array.isArray(option.label)
                                    ? option.label[0]?.value || option.value
                                    : option.value}
                            </SelectItem>
                        ))}
                    </SelectContent>
                </Select>
            );
        }

        // For custom fields mode, use SelectWithOptions which handles list case
        return (
            <SelectWithOptions
                field={{
                    ...field,
                    value: transformedValue,
                    onChange: handleChange,
                }}
                options={fieldDef.ui.options as any}
                disabled={isReadonly}
                isListField={fieldDef.list}
            />
        );
    }

    // Handle numeric fields
    if (fieldDef.type === 'int' || fieldDef.type === 'float') {
        const isFloat = fieldDef.type === 'float';
        const min = fieldDef.ui?.min;
        const max = fieldDef.ui?.max;
        const step = fieldDef.ui?.step || (isFloat ? 0.01 : 1);
        const prefix = fieldDef.ui?.prefix;
        const suffix = fieldDef.ui?.suffix;

        // Use AffixedInput if we have prefix/suffix or are in config args mode
        if (prefix || suffix || valueMode === 'json-string') {
            const numericValue = transformedValue !== undefined && transformedValue !== '' 
                ? (typeof transformedValue === 'number' ? transformedValue : parseFloat(transformedValue) || '') 
                : '';

            const handleNumericChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
                const val = e.target.valueAsNumber;
                handleChange(isNaN(val) ? (valueMode === 'json-string' ? '' : undefined) : val);
            }, [handleChange, valueMode]);

            return (
                <AffixedInput
                    type="number"
                    value={numericValue}
                    onChange={handleNumericChange}
                    disabled={isReadonly}
                    min={min}
                    max={max}
                    step={step}
                    prefix={prefix}
                    suffix={suffix}
                    className="bg-background"
                />
            );
        }

        // Use regular Input for custom fields mode
        const handleRegularNumericChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
            const val = e.target.valueAsNumber;
            handleChange(isNaN(val) ? undefined : val);
        }, [handleChange]);

        return (
            <Input
                type="number"
                value={transformedValue ?? ''}
                onChange={handleRegularNumericChange}
                onBlur={field.onBlur}
                name={field.name}
                disabled={isReadonly}
                min={min}
                max={max}
                step={step}
            />
        );
    }

    // Handle boolean fields
    if (fieldDef.type === 'boolean') {
        const boolValue = valueMode === 'json-string' 
            ? (transformedValue === true || transformedValue === 'true')
            : transformedValue;

        return (
            <Switch
                checked={boolValue}
                onCheckedChange={handleChange}
                disabled={isReadonly}
            />
        );
    }

    // Handle datetime fields
    if (fieldDef.type === 'datetime') {
        return (
            <DateTimeInput
                value={transformedValue}
                onChange={handleChange}
                disabled={isReadonly}
            />
        );
    }

    // Handle textarea for config args with specific UI component
    if (valueMode === 'json-string' && fieldDef.ui?.component === 'textarea-form-input') {
        const handleTextareaChange = React.useCallback((e: React.ChangeEvent<HTMLTextAreaElement>) => {
            handleChange(e.target.value);
        }, [handleChange]);

        return (
            <Textarea
                value={transformedValue || ''}
                onChange={handleTextareaChange}
                disabled={isReadonly}
                spellCheck={fieldDef.ui?.spellcheck ?? true}
                placeholder="Enter text..."
                rows={4}
                className="bg-background"
            />
        );
    }

    // Handle string fields (default case)
    const handleTextChange = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        handleChange(e.target.value);
    }, [handleChange]);

    return (
        <Input
            type="text"
            value={transformedValue ?? ''}
            onChange={handleTextChange}
            onBlur={field.onBlur}
            name={field.name}
            disabled={isReadonly}
            placeholder={valueMode === 'json-string' ? "Enter value..." : undefined}
            className={valueMode === 'json-string' ? "bg-background" : undefined}
        />
    );
}