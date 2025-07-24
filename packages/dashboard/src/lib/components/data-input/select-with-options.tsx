import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/vdb/components/ui/select.js';
import { useUserSettings } from '@/vdb/hooks/use-user-settings.js';
import { Trans } from '@/vdb/lib/trans.js';
import { StringFieldOption } from '@vendure/common/lib/generated-types';
import React from 'react';
import { ControllerRenderProps } from 'react-hook-form';

export interface SelectWithOptionsProps {
    field: ControllerRenderProps<any, any>;
    options: StringFieldOption[];
    disabled?: boolean;
    placeholder?: React.ReactNode;
    nullable?: boolean;
}

/**
 * @description
 * A select component that renders options from custom field configuration.
 * It automatically handles localization of option labels based on user settings.
 * For non-nullable fields, it ensures the first option is selected by default if no value is set.
 *
 * @since 3.3.0
 */
export function SelectWithOptions({
    field,
    options,
    disabled,
    placeholder,
    nullable = true,
}: SelectWithOptionsProps) {
    const {
        settings: { displayLanguage },
    } = useUserSettings();

    const getTranslation = (label: Array<{ languageCode: string; value: string }> | null) => {
        if (!label) return '';
        const translation = label.find(t => t.languageCode === displayLanguage);
        return translation?.value ?? label[0]?.value ?? '';
    };

    // For non-nullable fields, ensure we have a valid value
    // If field value is empty and field is not nullable, set the first option as default
    React.useEffect(() => {
        if (!nullable && (!field.value || field.value === '') && options.length > 0) {
            field.onChange(options[0].value);
        }
    }, [field.value, options, nullable, field.onChange]);

    // Determine the current value to display
    const currentValue = field.value || '';

    return (
        <Select value={currentValue} onValueChange={field.onChange} disabled={disabled}>
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
