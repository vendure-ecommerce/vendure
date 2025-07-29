import { ConfigurableOperationDefFragment } from '@/vdb/graphql/fragments.js';
import { ConfigArgType } from '@vendure/core';
import { Plus, X } from 'lucide-react';
import { useState } from 'react';
import { Button } from '../ui/button.js';
import { Input } from '../ui/input.js';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select.js';
import { Switch } from '../ui/switch.js';
import { Textarea } from '../ui/textarea.js';
import { DateTimeInput } from './datetime-input.js';

export interface EnhancedListInputProps {
    definition: ConfigurableOperationDefFragment['args'][number];
    value: string;
    onChange: (value: string) => void;
    readOnly?: boolean;
}

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
    definition,
    value,
    onChange,
    readOnly,
}: Readonly<EnhancedListInputProps>) {
    const [newItemValue, setNewItemValue] = useState('');

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

    const handleKeyPress = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleAddItem();
        }
    };

    // Render individual item input based on the underlying type
    const renderItemInput = (itemValue: string, index: number) => {
        const argType = definition.type as ConfigArgType;
        const uiComponent = (definition.ui as any)?.component;

        const commonProps = {
            value: itemValue,
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                handleUpdateItem(index, e.target.value),
            disabled: readOnly,
        };

        switch (uiComponent) {
            case 'boolean-form-input':
                return (
                    <Switch
                        checked={itemValue === 'true'}
                        onCheckedChange={checked => handleUpdateItem(index, checked.toString())}
                        disabled={readOnly}
                    />
                );

            case 'select-form-input': {
                const options = (definition.ui as any)?.options || [];
                return (
                    <Select
                        value={itemValue}
                        onValueChange={val => handleUpdateItem(index, val)}
                        disabled={readOnly}
                    >
                        <SelectTrigger>
                            <SelectValue />
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
            case 'textarea-form-input':
                return (
                    <Textarea
                        {...commonProps}
                        placeholder="Enter text..."
                        rows={2}
                        className="bg-background"
                    />
                );

            case 'date-form-input':
                return (
                    <DateTimeInput
                        value={itemValue ? new Date(itemValue) : new Date()}
                        onChange={val => handleUpdateItem(index, val.toISOString())}
                        disabled={readOnly}
                    />
                );

            case 'number-form-input': {
                const ui = definition.ui as any;
                const isFloat = argType === 'float';
                return (
                    <Input
                        type="number"
                        value={itemValue}
                        onChange={e => handleUpdateItem(index, e.target.value)}
                        disabled={readOnly}
                        min={ui?.min}
                        max={ui?.max}
                        step={ui?.step || (isFloat ? 0.01 : 1)}
                    />
                );
            }
            case 'currency-form-input':
                return (
                    <div className="flex items-center">
                        <span className="mr-2 text-sm text-muted-foreground">$</span>
                        <Input
                            type="number"
                            value={itemValue}
                            onChange={e => handleUpdateItem(index, e.target.value)}
                            disabled={readOnly}
                            min={0}
                            step={1}
                            className="flex-1"
                        />
                    </div>
                );
        }

        // Fall back to type-based rendering
        switch (argType) {
            case 'boolean':
                return (
                    <Switch
                        checked={itemValue === 'true'}
                        onCheckedChange={checked => handleUpdateItem(index, checked.toString())}
                        disabled={readOnly}
                    />
                );

            case 'int':
            case 'float': {
                const isFloat = argType === 'float';
                return (
                    <Input
                        type="number"
                        value={itemValue}
                        onChange={e => handleUpdateItem(index, e.target.value)}
                        disabled={readOnly}
                        step={isFloat ? 0.01 : 1}
                    />
                );
            }
            case 'datetime':
                return (
                    <DateTimeInput
                        value={itemValue ? new Date(itemValue) : new Date()}
                        onChange={val => handleUpdateItem(index, val.toISOString())}
                        disabled={readOnly}
                    />
                );

            default:
                return <Input type="text" {...commonProps} placeholder="Enter value..." />;
        }
    };

    // Render new item input (similar logic but for newItemValue)
    const renderNewItemInput = () => {
        const argType = definition.type as ConfigArgType;
        const uiComponent = (definition.ui as any)?.component;

        const commonProps = {
            value: newItemValue,
            onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
                setNewItemValue(e.target.value),
            disabled: readOnly,
            onKeyPress: handleKeyPress,
        };

        switch (uiComponent) {
            case 'boolean-form-input': {
                return (
                    <Switch
                        checked={newItemValue === 'true'}
                        onCheckedChange={checked => setNewItemValue(checked.toString())}
                        disabled={readOnly}
                    />
                );
            }
            case 'select-form-input': {
                const options = (definition.ui as any)?.options || [];
                return (
                    <Select value={newItemValue} onValueChange={setNewItemValue} disabled={readOnly}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select value..." />
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
            case 'textarea-form-input': {
                return (
                    <Textarea
                        {...commonProps}
                        placeholder="Enter text..."
                        rows={2}
                        className="bg-background"
                    />
                );
            }
            case 'date-form-input': {
                return <DateTimeInput value={newItemValue} onChange={setNewItemValue} disabled={readOnly} />;
            }
            case 'number-form-input': {
                const ui = definition.ui as any;
                const isFloat = argType === 'float';
                return (
                    <Input
                        type="number"
                        value={newItemValue}
                        onChange={e => setNewItemValue(e.target.value)}
                        disabled={readOnly}
                        min={ui?.min}
                        max={ui?.max}
                        step={ui?.step || (isFloat ? 0.01 : 1)}
                        placeholder="Enter number..."
                        onKeyPress={handleKeyPress}
                        className="bg-background"
                    />
                );
            }
            case 'currency-form-input': {
                return (
                    <div className="flex items-center">
                        <span className="mr-2 text-sm text-muted-foreground">$</span>
                        <Input
                            type="number"
                            value={newItemValue}
                            onChange={e => setNewItemValue(e.target.value)}
                            disabled={readOnly}
                            min={0}
                            step={1}
                            placeholder="Enter amount..."
                            onKeyPress={handleKeyPress}
                            className="flex-1 bg-background"
                        />
                    </div>
                );
            }
        }

        // Fall back to type-based rendering
        switch (argType) {
            case 'boolean':
                return (
                    <Switch
                        checked={newItemValue === 'true'}
                        onCheckedChange={checked => setNewItemValue(checked.toString())}
                        disabled={readOnly}
                    />
                );
            case 'int':
            case 'float': {
                const isFloat = argType === 'float';
                return (
                    <Input
                        type="number"
                        value={newItemValue}
                        onChange={e => setNewItemValue(e.target.value)}
                        disabled={readOnly}
                        step={isFloat ? 0.01 : 1}
                        placeholder="Enter number..."
                        onKeyPress={handleKeyPress}
                        className="bg-background"
                    />
                );
            }
            case 'datetime': {
                return (
                    <DateTimeInput
                        value={newItemValue ? new Date(newItemValue) : new Date()}
                        onChange={val => setNewItemValue(val.toISOString())}
                        disabled={readOnly}
                    />
                );
            }
            default: {
                return (
                    <Input
                        type="text"
                        {...commonProps}
                        placeholder="Enter value..."
                        className="bg-background"
                    />
                );
            }
        }
    };

    if (readOnly) {
        return (
            <div className="space-y-2">
                {arrayValue.map((item, index) => (
                    <div key={index + item} className="flex items-center gap-2 p-2 bg-muted rounded-md">
                        <span className="flex-1">{item}</span>
                    </div>
                ))}
                {arrayValue.length === 0 && <div className="text-sm text-muted-foreground">No items</div>}
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {/* Existing items */}
            {arrayValue.map((item, index) => (
                <div key={index + item} className="flex items-center gap-2">
                    <div className="flex-1">{renderItemInput(item, index)}</div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRemoveItem(index)}
                        disabled={readOnly}
                        type="button"
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
            ))}

            {/* Add new item */}
            <div className="flex items-center gap-2 p-2 border border-dashed rounded-md">
                <div className="flex-1">{renderNewItemInput()}</div>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={handleAddItem}
                    disabled={readOnly || !newItemValue.trim()}
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
