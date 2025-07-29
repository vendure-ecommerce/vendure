import { InputComponent } from '@/vdb/framework/component-registry/dynamic-component.js';
import { ConfigurableOperationDefFragment } from '@/vdb/graphql/fragments.js';
import { RelationCustomFieldConfig } from '@vendure/common/lib/generated-types';
import { ConfigArgType } from '@vendure/core';
import { AffixedInput } from '../data-input/affixed-input.js';
import { ConfigurableOperationListInput } from '../data-input/configurable-operation-list-input.js';
import { DateTimeInput } from '../data-input/datetime-input.js';
import { DefaultRelationInput } from '../data-input/default-relation-input.js';
import { FacetValueInput } from '../data-input/facet-value-input.js';
import { Input } from '../ui/input.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select.js';
import { Switch } from '../ui/switch.js';
import { Textarea } from '../ui/textarea.js';

export interface ConfigurableOperationArgInputProps {
    definition: ConfigurableOperationDefFragment['args'][number];
    readOnly?: boolean;
    value: string;
    onChange: (value: any) => void;
}

/**
 * Maps Vendure UI component names to their corresponding Dashboard input component IDs
 */
const UI_COMPONENT_MAP = {
    'number-form-input': 'vendure:numberInput',
    'currency-form-input': 'vendure:currencyInput',
    'facet-value-form-input': 'facet-value-input',
    'product-selector-form-input': 'vendure:productSelectorInput',
    'customer-group-form-input': 'vendure:customerGroupInput',
    'date-form-input': 'date-input',
    'textarea-form-input': 'textarea-input',
    'password-form-input': 'vendure:passwordInput',
    'json-editor-form-input': 'vendure:jsonEditorInput',
    'html-editor-form-input': 'vendure:htmlEditorInput',
    'rich-text-form-input': 'vendure:richTextInput',
    'boolean-form-input': 'boolean-input',
    'select-form-input': 'select-input',
    'text-form-input': 'vendure:textInput',
    'product-multi-form-input': 'vendure:productMultiInput',
    'combination-mode-form-input': 'vendure:combinationModeInput',
    'relation-form-input': 'vendure:relationInput',
    'struct-form-input': 'vendure:structInput',
} as const;

export function ConfigurableOperationArgInput({
    definition,
    value,
    onChange,
    readOnly,
}: ConfigurableOperationArgInputProps) {
    const uiComponent = (definition.ui as any)?.component;
    const argType = definition.type as ConfigArgType;
    const isList = definition.list ?? false;

    // Handle specific UI components first
    if (uiComponent) {
        switch (uiComponent) {
            case 'product-selector-form-input':
                const entityType =
                    (definition.ui as any)?.selectionMode === 'variant' ? 'ProductVariant' : 'Product';
                const isMultiple = (definition.ui as any)?.multiple ?? false;
                return (
                    <DefaultRelationInput
                        fieldDef={
                            {
                                entity: entityType,
                                list: isMultiple,
                            } as RelationCustomFieldConfig
                        }
                        field={{
                            value,
                            onChange,
                            onBlur: () => {},
                            name: '',
                            ref: () => {},
                        }}
                        disabled={readOnly}
                    />
                );

            case 'customer-group-form-input':
                const isCustomerGroupMultiple = (definition.ui as any)?.multiple ?? false;
                return (
                    <DefaultRelationInput
                        fieldDef={
                            {
                                entity: 'CustomerGroup',
                                list: isCustomerGroupMultiple,
                            } as RelationCustomFieldConfig
                        }
                        field={{
                            value,
                            onChange,
                            onBlur: () => {},
                            name: '',
                            ref: () => {},
                        }}
                        disabled={readOnly}
                    />
                );

            case 'facet-value-form-input':
                return <FacetValueInput value={value} onChange={onChange} readOnly={readOnly} />;

            case 'select-form-input':
                return (
                    <SelectInput
                        definition={definition}
                        value={value}
                        onChange={onChange}
                        readOnly={readOnly}
                    />
                );

            case 'textarea-form-input':
                return (
                    <TextareaInput
                        definition={definition}
                        value={value}
                        onChange={onChange}
                        readOnly={readOnly}
                    />
                );

            case 'date-form-input':
                return <DateTimeInput value={value} onChange={onChange} disabled={readOnly} />;

            case 'boolean-form-input':
                return <BooleanInput value={value} onChange={onChange} readOnly={readOnly} />;

            case 'number-form-input':
                return (
                    <NumberInput
                        definition={definition}
                        value={value}
                        onChange={onChange}
                        readOnly={readOnly}
                    />
                );

            case 'currency-form-input':
                return (
                    <CurrencyInput
                        definition={definition}
                        value={value}
                        onChange={onChange}
                        readOnly={readOnly}
                    />
                );

            default:
                // Try to use the component registry for other UI components
                const componentId = UI_COMPONENT_MAP[uiComponent as keyof typeof UI_COMPONENT_MAP];
                if (componentId) {
                    try {
                        return (
                            <InputComponent
                                id={componentId}
                                value={value}
                                onChange={onChange}
                                readOnly={readOnly}
                                definition={definition}
                                {...(definition.ui as any)}
                            />
                        );
                    } catch (error) {
                        console.warn(
                            `Failed to load UI component ${uiComponent}, falling back to type-based input`,
                        );
                    }
                }
                break;
        }
    }

    // Handle list fields with array wrapper
    if (isList) {
        return (
            <ConfigurableOperationListInput
                definition={definition}
                value={value}
                onChange={onChange}
                readOnly={readOnly}
            />
        );
    }

    // Fall back to type-based rendering
    switch (argType) {
        case 'boolean':
            return <BooleanInput value={value} onChange={onChange} readOnly={readOnly} />;

        case 'int':
        case 'float':
            return (
                <NumberInput definition={definition} value={value} onChange={onChange} readOnly={readOnly} />
            );

        case 'datetime':
            return <DateTimeInput value={value} onChange={onChange} disabled={readOnly} />;

        case 'ID':
            // ID fields typically need specialized selectors
            return (
                <Input
                    type="text"
                    value={value || ''}
                    onChange={e => onChange(e.target.value)}
                    disabled={readOnly}
                    placeholder="Enter ID..."
                    className="bg-background"
                />
            );

        case 'string':
        default:
            return (
                <Input
                    type="text"
                    value={value || ''}
                    onChange={e => onChange(e.target.value)}
                    disabled={readOnly}
                    className="bg-background"
                />
            );
    }
}

/**
 * Boolean input component
 */
function BooleanInput({
    value,
    onChange,
    readOnly,
}: {
    value: string;
    onChange: (value: string) => void;
    readOnly?: boolean;
}) {
    const boolValue = value === 'true';

    return (
        <Switch
            checked={boolValue}
            onCheckedChange={checked => onChange(checked.toString())}
            disabled={readOnly}
        />
    );
}

/**
 * Number input component with support for UI configuration
 */
function NumberInput({
    definition,
    value,
    onChange,
    readOnly,
}: {
    definition: ConfigurableOperationDefFragment['args'][number];
    value: string;
    onChange: (value: string) => void;
    readOnly?: boolean;
}) {
    const ui = definition.ui as any;
    const isFloat = (definition.type as ConfigArgType) === 'float';
    const min = ui?.min;
    const max = ui?.max;
    const step = ui?.step || (isFloat ? 0.01 : 1);
    const prefix = ui?.prefix;
    const suffix = ui?.suffix;

    const numericValue = value ? parseFloat(value) : '';

    return (
        <AffixedInput
            type="number"
            value={numericValue}
            onChange={e => {
                const val = e.target.valueAsNumber;
                onChange(isNaN(val) ? '' : val.toString());
            }}
            disabled={readOnly}
            min={min}
            max={max}
            step={step}
            prefix={prefix}
            suffix={suffix}
            className="bg-background"
        />
    );
}

/**
 * Currency input component
 */
function CurrencyInput({
    definition,
    value,
    onChange,
    readOnly,
}: {
    definition: ConfigurableOperationDefFragment['args'][number];
    value: string;
    onChange: (value: string) => void;
    readOnly?: boolean;
}) {
    const numericValue = value ? parseInt(value, 10) : '';

    return (
        <AffixedInput
            type="number"
            value={numericValue}
            onChange={e => {
                const val = e.target.valueAsNumber;
                onChange(isNaN(val) ? '0' : val.toString());
            }}
            disabled={readOnly}
            min={0}
            step={1}
            prefix="$"
            className="bg-background"
        />
    );
}

/**
 * Select input component with options
 */
function SelectInput({
    definition,
    value,
    onChange,
    readOnly,
}: {
    definition: ConfigurableOperationDefFragment['args'][number];
    value: string;
    onChange: (value: string) => void;
    readOnly?: boolean;
}) {
    const ui = definition.ui as any;
    const options = ui?.options || [];

    return (
        <Select value={value} onValueChange={onChange} disabled={readOnly}>
            <SelectTrigger className="bg-background mb-0">
                <SelectValue placeholder="Select an option..." />
            </SelectTrigger>
            <SelectContent>
                {options.map((option: any) => (
                    <SelectItem key={option.value} value={option.value}>
                        {typeof option.label === 'string'
                            ? option.label
                            : option.label?.[0]?.value || option.value}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}

/**
 * Textarea input component
 */
function TextareaInput({
    definition,
    value,
    onChange,
    readOnly,
}: {
    definition: ConfigurableOperationDefFragment['args'][number];
    value: string;
    onChange: (value: string) => void;
    readOnly?: boolean;
}) {
    const ui = definition.ui as any;
    const spellcheck = ui?.spellcheck ?? true;

    return (
        <Textarea
            value={value || ''}
            onChange={e => onChange(e.target.value)}
            disabled={readOnly}
            spellCheck={spellcheck}
            placeholder="Enter text..."
            rows={4}
            className="bg-background"
        />
    );
}
