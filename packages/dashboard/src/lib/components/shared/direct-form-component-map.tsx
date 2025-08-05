import { DefaultFormComponentId } from '@vendure/common/lib/shared-types';
import React from 'react';

import { AffixedInput } from '@/vdb/components/data-input/affixed-input.js';
import { CombinationModeInput } from '@/vdb/components/data-input/combination-mode-input.js';
import { DateTimeInput } from '@/vdb/components/data-input/datetime-input.js';
import { DefaultRelationInput } from '@/vdb/components/data-input/default-relation-input.js';
import { FacetValueInput } from '@/vdb/components/data-input/facet-value-input.js';
import { MoneyInput } from '@/vdb/components/data-input/money-input.js';
import { ProductMultiInput } from '@/vdb/components/data-input/product-multi-selector.js';
import { RichTextInput } from '@/vdb/components/data-input/rich-text-input.js';
import { Input } from '@/vdb/components/ui/input.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/vdb/components/ui/select.js';
import { Switch } from '@/vdb/components/ui/switch.js';
import { Textarea } from '@/vdb/components/ui/textarea.js';

import { UniversalFieldDefinition } from './universal-field-definition.js';
import { transformValue, ValueMode } from './value-transformers.js';

/**
 * Custom hook to handle value transformation between native and JSON string modes
 * Eliminates duplication across form input components
 */
function useValueTransformation(
    field: { value: any; onChange: (value: any) => void },
    fieldDef: UniversalFieldDefinition,
    valueMode: ValueMode,
) {
    const transformedValue = React.useMemo(() => {
        return valueMode === 'json-string'
            ? transformValue(field.value, fieldDef, valueMode, 'parse')
            : field.value;
    }, [field.value, fieldDef, valueMode]);

    const handleChange = React.useCallback(
        (newValue: any) => {
            const serializedValue =
                valueMode === 'json-string'
                    ? transformValue(newValue, fieldDef, valueMode, 'serialize')
                    : newValue;
            field.onChange(serializedValue);
        },
        [field.onChange, fieldDef, valueMode],
    );

    return { transformedValue, handleChange };
}

export interface DirectFormComponentProps {
    fieldDef: UniversalFieldDefinition;
    field: {
        value: any;
        onChange: (value: any) => void;
        onBlur?: () => void;
        name: string;
        ref?: any;
    };
    valueMode: ValueMode;
    disabled?: boolean;
}

/**
 * Text input wrapper for config args
 */
const TextFormInput: React.FC<DirectFormComponentProps> = ({ field, disabled, fieldDef, valueMode }) => {
    const handleChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            // For both modes, text values are stored as strings
            field.onChange(e.target.value);
        },
        [field.onChange],
    );

    const value = field.value || '';

    return (
        <Input
            type="text"
            value={value}
            onChange={handleChange}
            onBlur={field.onBlur}
            name={field.name}
            disabled={disabled}
            className={valueMode === 'json-string' ? 'bg-background' : undefined}
        />
    );
};

/**
 * Number input wrapper for config args
 */
const NumberFormInput: React.FC<DirectFormComponentProps> = ({ field, disabled, fieldDef, valueMode }) => {
    const ui = fieldDef.ui;
    const isFloat = fieldDef.type === 'float';
    const min = ui?.min;
    const max = ui?.max;
    const step = ui?.step || (isFloat ? 0.01 : 1);
    const prefix = ui?.prefix;
    const suffix = ui?.suffix;

    const handleChange = React.useCallback(
        (newValue: number | '') => {
            if (valueMode === 'json-string') {
                // For config args, store as string
                field.onChange(newValue === '' ? '' : newValue.toString());
            } else {
                // For custom fields, store as number or undefined
                field.onChange(newValue === '' ? undefined : newValue);
            }
        },
        [field.onChange, valueMode],
    );

    // Parse current value to number
    const numericValue = React.useMemo(() => {
        if (field.value === undefined || field.value === null || field.value === '') {
            return '';
        }
        const parsed = typeof field.value === 'number' ? field.value : parseFloat(field.value);
        return isNaN(parsed) ? '' : parsed;
    }, [field.value]);

    // Use AffixedInput if we have prefix/suffix or for config args mode
    if (prefix || suffix || valueMode === 'json-string') {
        return (
            <AffixedInput
                type="number"
                value={numericValue}
                onChange={e => {
                    const val = e.target.valueAsNumber;
                    handleChange(isNaN(val) ? '' : val);
                }}
                disabled={disabled}
                min={min}
                max={max}
                step={step}
                prefix={prefix}
                suffix={suffix}
                className="bg-background"
            />
        );
    }

    return (
        <Input
            type="number"
            value={numericValue}
            onChange={e => {
                const val = e.target.valueAsNumber;
                handleChange(isNaN(val) ? '' : val);
            }}
            onBlur={field.onBlur}
            name={field.name}
            disabled={disabled}
            min={min}
            max={max}
            step={step}
        />
    );
};

/**
 * Boolean input wrapper
 */
const BooleanFormInput: React.FC<DirectFormComponentProps> = ({ field, disabled, fieldDef, valueMode }) => {
    // Parse the current value to boolean
    const currentValue = React.useMemo(() => {
        if (valueMode === 'json-string') {
            return field.value === 'true' || field.value === true;
        } else {
            return Boolean(field.value);
        }
    }, [field.value, valueMode]);

    // Simple change handler - directly call field.onChange
    const handleChange = React.useCallback(
        (newValue: boolean) => {
            if (valueMode === 'json-string') {
                field.onChange(newValue.toString());
            } else {
                field.onChange(newValue);
            }
        },
        [field.onChange, valueMode],
    );

    return <Switch checked={currentValue} onCheckedChange={handleChange} disabled={disabled} />;
};

/**
 * Currency input wrapper (uses MoneyInput)
 */
const CurrencyFormInput: React.FC<DirectFormComponentProps> = ({ field, disabled, fieldDef, valueMode }) => {
    const { transformedValue, handleChange } = useValueTransformation(field, fieldDef, valueMode);

    return <MoneyInput value={transformedValue} onChange={handleChange} disabled={disabled} />;
};

/**
 * Date input wrapper
 */
const DateFormInput: React.FC<DirectFormComponentProps> = ({ field, disabled, fieldDef, valueMode }) => {
    const { transformedValue, handleChange } = useValueTransformation(field, fieldDef, valueMode);

    return <DateTimeInput value={transformedValue} onChange={handleChange} disabled={disabled} />;
};

/**
 * Select input wrapper
 */
const SelectFormInput: React.FC<DirectFormComponentProps> = ({ field, disabled, fieldDef, valueMode }) => {
    const { transformedValue, handleChange } = useValueTransformation(field, fieldDef, valueMode);
    const options = fieldDef.ui?.options || [];

    return (
        <Select value={transformedValue || ''} onValueChange={handleChange} disabled={disabled}>
            <SelectTrigger className="bg-background mb-0">
                <SelectValue placeholder="Select an option..." />
            </SelectTrigger>
            <SelectContent>
                {options.map(option => (
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
};

/**
 * Textarea input wrapper
 */
const TextareaFormInput: React.FC<DirectFormComponentProps> = ({ field, disabled, fieldDef, valueMode }) => {
    const { transformedValue, handleChange } = useValueTransformation(field, fieldDef, valueMode);

    const handleTextareaChange = React.useCallback(
        (e: React.ChangeEvent<HTMLTextAreaElement>) => {
            handleChange(e.target.value);
        },
        [handleChange],
    );

    return (
        <Textarea
            value={transformedValue || ''}
            onChange={handleTextareaChange}
            disabled={disabled}
            spellCheck={fieldDef.ui?.spellcheck ?? true}
            placeholder="Enter text..."
            rows={4}
            className="bg-background"
        />
    );
};

/**
 * Product selector wrapper (uses DefaultRelationInput)
 */
const ProductSelectorFormInput: React.FC<DirectFormComponentProps> = ({
    field,
    disabled,
    fieldDef,
    valueMode,
}) => {
    const { transformedValue, handleChange } = useValueTransformation(field, fieldDef, valueMode);
    const entityType = fieldDef.ui?.selectionMode === 'variant' ? 'ProductVariant' : 'Product';

    return (
        <DefaultRelationInput
            fieldDef={
                {
                    entity: entityType,
                    list: fieldDef.list,
                } as any
            }
            field={{
                ...field,
                value: transformedValue,
                onChange: handleChange,
            }}
            disabled={disabled}
        />
    );
};

/**
 * Customer group input wrapper
 */
const CustomerGroupFormInput: React.FC<DirectFormComponentProps> = ({
    field,
    disabled,
    fieldDef,
    valueMode,
}) => {
    const { transformedValue, handleChange } = useValueTransformation(field, fieldDef, valueMode);

    return (
        <DefaultRelationInput
            fieldDef={
                {
                    entity: 'CustomerGroup',
                    list: fieldDef.list,
                } as any
            }
            field={{
                ...field,
                value: transformedValue,
                onChange: handleChange,
            }}
            disabled={disabled}
        />
    );
};

/**
 * Password input wrapper (uses regular Input with type="password")
 */
const PasswordFormInput: React.FC<DirectFormComponentProps> = ({ field, disabled, fieldDef, valueMode }) => {
    const { transformedValue, handleChange } = useValueTransformation(field, fieldDef, valueMode);

    const handleInputChange = React.useCallback(
        (e: React.ChangeEvent<HTMLInputElement>) => {
            handleChange(e.target.value);
        },
        [handleChange],
    );

    return (
        <Input
            type="password"
            value={transformedValue || ''}
            onChange={handleInputChange}
            onBlur={field.onBlur}
            name={field.name}
            disabled={disabled}
            className={valueMode === 'json-string' ? 'bg-background' : undefined}
        />
    );
};

/**
 * Direct mapping from DefaultFormComponentId to React components
 * This eliminates the need for intermediate registry IDs
 */
export const DIRECT_FORM_COMPONENT_MAP: Record<DefaultFormComponentId, React.FC<DirectFormComponentProps>> = {
    'boolean-form-input': BooleanFormInput,
    'currency-form-input': CurrencyFormInput,
    'customer-group-form-input': CustomerGroupFormInput,
    'date-form-input': DateFormInput,
    'facet-value-form-input': ({ field, disabled }) => (
        <FacetValueInput value={field.value} onChange={field.onChange} readOnly={disabled} />
    ),
    'json-editor-form-input': TextareaFormInput, // Fallback to textarea for now
    'html-editor-form-input': ({ field, disabled }) => (
        <RichTextInput value={field.value} onChange={field.onChange} disabled={disabled} />
    ),
    'number-form-input': NumberFormInput,
    'password-form-input': PasswordFormInput,
    'product-selector-form-input': ProductSelectorFormInput,
    'relation-form-input': ProductSelectorFormInput, // Uses same relation logic
    'rich-text-form-input': ({ field, disabled }) => (
        <RichTextInput value={field.value} onChange={field.onChange} disabled={disabled} />
    ),
    'select-form-input': SelectFormInput,
    'text-form-input': TextFormInput,
    'textarea-form-input': TextareaFormInput,
    'product-multi-form-input': ({ field, disabled, fieldDef }) => (
        <ProductMultiInput
            value={field.value}
            onChange={field.onChange}
            disabled={disabled}
            selectionMode={fieldDef.ui?.selectionMode as any}
        />
    ),
    'combination-mode-form-input': ({ field, disabled }) => (
        <CombinationModeInput value={field.value} onChange={field.onChange} disabled={disabled} />
    ),
    'struct-form-input': TextareaFormInput, // Fallback for now
};

/**
 * Get a direct form component by ID
 */
export function getDirectFormComponent(
    componentId: DefaultFormComponentId,
): React.FC<DirectFormComponentProps> | undefined {
    return DIRECT_FORM_COMPONENT_MAP[componentId];
}
