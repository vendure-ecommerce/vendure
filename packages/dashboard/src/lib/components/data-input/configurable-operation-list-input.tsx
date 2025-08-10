import { FormControlAdapter } from '@/vdb/framework/form-engine/form-control-adapter.js';
import { DashboardFormComponentProps } from '@/vdb/framework/form-engine/form-engine-types.js';
import { isCustomFieldConfig } from '@/vdb/framework/form-engine/utils.js';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { ControllerRenderProps } from 'react-hook-form';
import { Button } from '../ui/button.js';

/**
 * A dynamic array input component for configurable operation arguments that handle lists of values.
 *
 * This component allows users to add, edit, and remove multiple items from an array-type argument.
 * Each item in the array is rendered using the appropriate input control based on the argument's
 * type and UI configuration (e.g., text input, select dropdown, boolean switch, date picker).
 *
 * The component supports:
 * - Adding new items with appropriate input controls
 * - Editing existing items inline
 * - Removing items from the array
 * - Various data types: string, number, boolean, datetime, currency
 * - Multiple UI components: select, textarea, currency input, etc.
 * - Keyboard shortcuts (Enter to add items)
 * - Read-only mode for display purposes
 *
 * Used primarily in configurable operations (promotions, shipping methods, payment methods)
 * where an argument accepts multiple values, such as a list of product IDs, category codes,
 * or discount amounts.
 *
 * @example
 * // For a promotion condition that accepts multiple product category codes
 * <EnhancedListInput
 *   definition={argDefinition}
 *   value='["electronics", "books", "clothing"]'
 *   onChange={handleChange}
 * />
 */
export function ConfigurableOperationListInput({
    fieldDef,
    value,
    onChange,
}: Readonly<DashboardFormComponentProps>) {
    const [newItemValue, setNewItemValue] = useState('');
    if (!fieldDef || isCustomFieldConfig(fieldDef)) {
        return null;
    }

    // Parse the current array value
    const arrayValue = parseArrayValue(value);

    const handleArrayChange = (newArray: string[]) => {
        onChange(JSON.stringify(newArray));
    };

    const handleAddItem = () => {
        if (newItemValue.trim()) {
            const newArray = [...arrayValue, newItemValue.trim()];
            handleArrayChange(newArray);
            setNewItemValue('');
        }
    };

    const handleRemoveItem = (index: number) => {
        const newArray = arrayValue.filter((_, i) => i !== index);
        handleArrayChange(newArray);
    };

    const handleUpdateItem = (index: number, newValue: string) => {
        const newArray = arrayValue.map((item, i) => (i === index ? newValue : item));
        handleArrayChange(newArray);
    };

    // Unified input renderer - eliminates duplication between item and new item inputs
    // const renderInput = (currentValue: string, onValueChange: (value: string) => void) => {
    //     const uiComponent = fieldDef.ui?.component;
    //
    //     const field = {
    //         value: currentValue,
    //         onChange: onValueChange,
    //         disabled: false,
    //         onBlur: () => {},
    //         name: fieldDef.name,
    //         ref: () => {},
    //     } satisfies ControllerRenderProps<any, any>;
    //
    //     // Component-based rendering (UI overrides)
    //     switch (uiComponent) {
    //         case 'boolean-form-input':
    //             return <BooleanInput fieldDef={fieldDef} {...field} />;
    //         case 'select-form-input':
    //             return <SelectWithOptions fieldDef={fieldDef} {...field} />;
    //         case 'textarea-form-input':
    //             return <TextareaInput {...field} fieldDef={fieldDef} />;
    //         case 'date-form-input':
    //             return <DateTimeInput fieldDef={fieldDef} {...field} />;
    //         case 'number-form-input':
    //             return <NumberInput {...field} fieldDef={fieldDef} />;
    //         case 'currency-form-input':
    //             return <MoneyInput {...field} fieldDef={fieldDef} />;
    //         case 'facet-value-form-input':
    //             return <FacetValueInput {...field} fieldDef={fieldDef} />;
    //     }
    //
    //     return <DefaultInputForType fieldDef={fieldDef} {...field} />;
    // };

    return (
        <div className="space-y-2">
            {/* Existing items */}
            {arrayValue.map((item, index) => {
                const field = {
                    value: item,
                    onChange: handleUpdateItem,
                    disabled: false,
                    onBlur: () => {},
                    name: fieldDef.name,
                    ref: () => {},
                } satisfies ControllerRenderProps<any, any>;

                return (
                    <div key={index + item} className="flex items-center gap-2">
                        <div className="flex-1">
                            <FormControlAdapter field={field} fieldDef={fieldDef} valueMode="native" />
                        </div>
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveItem(index)}
                            type="button"
                        >
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                );
            })}

            {/* Add new item */}
            <div className="flex items-center gap-2 p-2 border border-dashed rounded-md">
                {/* <div className="flex-1">{renderInput(newItemValue, setNewItemValue)}</div>*/}
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddItem}
                    disabled={!newItemValue.trim()}
                    type="button"
                >
                    <Plus className="h-4 w-4" />
                </Button>
            </div>

            {arrayValue.length === 0 && (
                <div className="text-sm text-muted-foreground">
                    No items added yet. Use the input above to add items.
                </div>
            )}
        </div>
    );
}

function parseArrayValue(value: string): string[] {
    if (!value) return [];

    try {
        const parsed = JSON.parse(value);
        return Array.isArray(parsed) ? parsed.map(String) : [String(parsed)];
    } catch {
        // If not JSON, try comma-separated values
        return value.includes(',')
            ? value
                  .split(',')
                  .map(s => s.trim())
                  .filter(Boolean)
            : value
              ? [value]
              : [];
    }
}
