import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/vdb/components/ui/select.js';
import { useUserSettings } from '@/vdb/hooks/use-user-settings.js';
import { Trans } from '@/vdb/lib/trans.js';
import { StringFieldOption } from '@vendure/common/lib/generated-types';
import React from 'react';
import { ControllerRenderProps } from 'react-hook-form';
import { MultiSelect } from '../shared/multi-select.js';

export interface SelectWithOptionsProps {
    field: ControllerRenderProps<any, any>;
    options: StringFieldOption[];
    disabled?: boolean;
    placeholder?: React.ReactNode;
    isListField?: boolean;
}

/**
 * @description
 * A select component that renders options from custom field configuration.
 * It automatically handles localization of option labels based on user settings.
 *
 * @since 3.3.0
 */
export function SelectWithOptions({
    field,
    options,
    disabled,
    placeholder,
    isListField = false,
}: Readonly<SelectWithOptionsProps>) {
    const {
        settings: { displayLanguage },
    } = useUserSettings();

    const getTranslation = (label: Array<{ languageCode: string; value: string }> | null) => {
        if (!label) return '';
        const translation = label.find(t => t.languageCode === displayLanguage);
        return translation?.value ?? label[0]?.value ?? '';
    };

    // Convert options to MultiSelect format
    const multiSelectItems = options.map(option => ({
        value: option.value,
        label: option.label ? getTranslation(option.label) : option.value,
    }));

    // For list fields, use MultiSelect component
    if (isListField) {
        return (
            <MultiSelect
                multiple={true}
                value={field.value || []}
                onChange={field.onChange}
                items={multiSelectItems}
                placeholder={placeholder ? String(placeholder) : 'Select options'}
                className={disabled ? 'opacity-50 pointer-events-none' : ''}
            />
        );
    }

    // For single fields, use regular Select
    const currentValue = field.value ?? '';

    const handleValueChange = (value: string) => {
        if (value) {
            field.onChange(value);
        }
    };

    return (
        <Select value={currentValue ?? undefined} onValueChange={handleValueChange} disabled={disabled}>
            <SelectTrigger>
                <SelectValue placeholder={placeholder || <Trans>Select an option</Trans>} />
            </SelectTrigger>
            <SelectContent>
                {options.map(option => (
                    <SelectItem key={option.value} value={option.value}>
                        {option.label ? getTranslation(option.label) : option.value}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
