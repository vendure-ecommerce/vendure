import React, { useEffect, useMemo, useState } from 'react';

import { AffixedInput } from '@/vdb/components/data-input/affixed-input.js';
import { Input } from '@/vdb/components/ui/input.js';

import { DashboardFormComponentProps } from '@/vdb/framework/form-engine/form-engine-types.js';
import { isReadonlyField } from '@/vdb/framework/form-engine/utils.js';
import { useDisplayLocale } from '@/vdb/hooks/use-display-locale.js';

export type NumberInputProps = DashboardFormComponentProps & {
    min?: number;
    max?: number;
    step?: number;
    prefix?: React.ReactNode;
    suffix?: React.ReactNode;
};

/**
 * @description
 * A component for displaying a numeric value.
 *
 * @docsCategory form-components
 * @docsPage NumberInput
 */
export function NumberInput({
    fieldDef,
    onChange,
    prefix: overridePrefix,
    suffix: overrideSuffix,
    ...fieldProps
}: Readonly<NumberInputProps>) {
    const readOnly = fieldProps.disabled || isReadonlyField(fieldDef);
    const isFloat = fieldDef ? fieldDef.type === 'float' : false;
    const min = fieldProps.min ?? fieldDef?.ui?.min;
    const max = fieldProps.max ?? fieldDef?.ui?.max;
    const step = fieldProps.step ?? (fieldDef?.ui?.step || (isFloat ? 0.01 : 1));
    const prefix = overridePrefix ?? fieldDef?.ui?.prefix;
    const suffix = overrideSuffix ?? fieldDef?.ui?.suffix;
    const shouldUseAffixedInput = prefix || suffix;
    const { bcp47Tag } = useDisplayLocale();
    const decimalSeparator = useMemo(() => {
        const parts = new Intl.NumberFormat(bcp47Tag).formatToParts(1.1);
        return parts.find(p => p.type === 'decimal')?.value ?? '.';
    }, [bcp47Tag]);
    const alternateSeparator = decimalSeparator === '.' ? ',' : '.';
    const separators = useMemo(
        () => Array.from(new Set([decimalSeparator, alternateSeparator])),
        [decimalSeparator, alternateSeparator],
    );
    const [displayValue, setDisplayValue] = useState(() =>
        formatDisplayValue(fieldProps.value as number | null | undefined, decimalSeparator),
    );
    const [isUserTyping, setIsUserTyping] = useState(false);

    useEffect(() => {
        if (isUserTyping) return;
        setDisplayValue(formatDisplayValue(fieldProps.value as number | null | undefined, decimalSeparator));
    }, [fieldProps.value, decimalSeparator, isUserTyping]);

    const handleTextChange = (inputValue: string) => {
        if (readOnly) return;
        setIsUserTyping(true);
        setDisplayValue(inputValue);

        if (inputValue === '') {
            onChange(null);
            return;
        }

        const escapedSeparators = separators.map(escapeRegExp).join('|');
        const decimalPattern = new RegExp(`^-?[0-9]*(?:(${escapedSeparators})[0-9]*)?$`);
        if (!decimalPattern.test(inputValue)) {
            return;
        }

        let normalized = inputValue;
        separators.forEach(sep => {
            if (sep !== '.') {
                normalized = normalized.split(sep).join('.');
            }
        });
        const numeric = parseFloat(normalized);
        if (Number.isNaN(numeric)) {
            return;
        }

        onChange(numeric);
    };

    const handleBlur = () => {
        setIsUserTyping(false);
        setDisplayValue(formatDisplayValue(fieldProps.value as number | null | undefined, decimalSeparator));
    };

    const inputProps = {
        ...fieldProps,
        type: 'text' as const,
        value: displayValue,
        onChange: (e: React.ChangeEvent<HTMLInputElement>) => handleTextChange(e.target.value),
        onBlur: () => {
            handleBlur();
            fieldProps.onBlur();
        },
        min,
        max,
        step,
    };

    if (shouldUseAffixedInput) {
        return (
            <AffixedInput
                {...inputProps}
                prefix={prefix}
                suffix={suffix}
                className="bg-background"
                disabled={readOnly}
            />
        );
    }

    return (
        <Input
            {...inputProps}
            disabled={readOnly}
        />
    );
}

function formatDisplayValue(value: number | null | undefined, decimalSeparator: string): string {
    if (value == null || Number.isNaN(value)) {
        return '';
    }
    const asString = String(value);
    return decimalSeparator === '.' ? asString : asString.replace('.', decimalSeparator);
}

function escapeRegExp(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}
