import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/vdb/components/ui/select.js';
import {
    DashboardFormComponent,
    DashboardFormComponentProps,
    StringCustomFieldConfig,
} from '@/vdb/framework/form-engine/form-engine-types.js';
import { isReadonlyField, isStringFieldWithOptions } from '@/vdb/framework/form-engine/utils.js';
import { useUserSettings } from '@/vdb/hooks/use-user-settings.js';
import { Trans } from '@/vdb/lib/trans.js';
import React from 'react';
import { MultiSelect } from '../shared/multi-select.js';

export interface SelectWithOptionsProps extends DashboardFormComponentProps {
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
    value,
    onChange,
    fieldDef,
    placeholder,
    isListField = false,
    disabled,
}: Readonly<SelectWithOptionsProps>) {
    const readOnly = disabled || isReadonlyField(fieldDef);
    const {
        settings: { displayLanguage },
    } = useUserSettings();

    const getTranslation = (label: Array<{ languageCode: string; value: string }> | null) => {
        if (!label) return '';
        const translation = label.find(t => t.languageCode === displayLanguage);
        return translation?.value ?? label[0]?.value ?? '';
    };
    if (!fieldDef || !isStringFieldWithOptions(fieldDef)) {
        return null;
    }
    const options: NonNullable<StringCustomFieldConfig['options']> =
        fieldDef.options ?? fieldDef.ui.options ?? [];

    // Convert options to MultiSelect format
    const multiSelectItems = options.map(option => ({
        value: option.value,
        label: option.label ? getTranslation(option.label) : option.value,
    }));

    // For list fields, use MultiSelect component
    if (isListField || fieldDef?.list === true) {
        return (
            <MultiSelect
                multiple={true}
                value={value || []}
                onChange={onChange}
                items={multiSelectItems}
                placeholder={placeholder ? String(placeholder) : 'Select options'}
                className={readOnly ? 'opacity-50 pointer-events-none' : ''}
            />
        );
    }

    // For single fields, use regular Select
    const currentValue = value ?? '';

    const handleValueChange = (value: string) => {
        if (value) {
            onChange(value);
        }
    };

    return (
        <Select value={currentValue ?? undefined} onValueChange={handleValueChange} disabled={readOnly}>
            <SelectTrigger className="mb-0">
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

(SelectWithOptions as DashboardFormComponent).metadata = {
    isListInput: 'dynamic',
};
