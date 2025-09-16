import { useLocalFormat } from '@/vdb/hooks/use-local-format.js';
import { useUserSettings } from '@/vdb/hooks/use-user-settings.js';
import { useEffect, useMemo, useState } from 'react';
import { AffixedInput } from './affixed-input.js';

import { DashboardFormComponentProps } from '@/vdb/framework/form-engine/form-engine-types.js';
import { isReadonlyField } from '@/vdb/framework/form-engine/utils.js';
import { useChannel } from '@/vdb/hooks/use-channel.js';

export interface MoneyInputProps extends DashboardFormComponentProps {
    currency?: string;
}

/**
 * @description
 * A component for displaying a money value. The `currency` can be specified, but otherwise
 * will be taken from the active channel's default currency.
 *
 * @docsCategory form-components
 * @docsPage MoneyInput
 */
export function MoneyInput(props: Readonly<MoneyInputProps>) {
    const { value, onChange, currency, ...rest } = props;
    const { activeChannel } = useChannel();
    const activeCurrency = currency ?? activeChannel?.defaultCurrencyCode;
    const readOnly = isReadonlyField(props.fieldDef);
    const {
        settings: { displayLanguage, displayLocale },
    } = useUserSettings();
    const { toMajorUnits, toMinorUnits } = useLocalFormat();
    const [displayValue, setDisplayValue] = useState(toMajorUnits(value).toFixed(2));

    // Update display value when prop value changes
    useEffect(() => {
        setDisplayValue(toMajorUnits(value).toFixed(2));
    }, [value, toMajorUnits]);

    // Determine if the currency symbol should be a prefix based on locale
    const shouldPrefix = useMemo(() => {
        if (!activeCurrency) {
            return false;
        }
        const locale = displayLocale || displayLanguage.replace(/_/g, '-');
        const parts = new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: activeCurrency,
            currencyDisplay: 'symbol',
        }).formatToParts();
        const NaNString = parts.find(p => p.type === 'nan')?.value ?? 'NaN';
        const localised = new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: activeCurrency,
            currencyDisplay: 'symbol',
        }).format(undefined as any);
        return localised.indexOf(NaNString) > 0;
    }, [activeCurrency, displayLocale, displayLanguage]);

    // Get the currency symbol
    const currencySymbol = useMemo(() => {
        if (!activeCurrency) return '';
        const locale = displayLocale || displayLanguage.replace(/_/g, '-');
        const parts = new Intl.NumberFormat(locale, {
            style: 'currency',
            currency: activeCurrency,
            currencyDisplay: 'symbol',
        }).formatToParts();
        return parts.find(p => p.type === 'currency')?.value ?? activeCurrency;
    }, [activeCurrency, displayLocale, displayLanguage]);

    return (
        <AffixedInput
            type="text"
            className="bg-background"
            value={displayValue}
            disabled={readOnly}
            {...rest}
            onChange={e => {
                const inputValue = e.target.value;
                // Allow empty input
                if (inputValue === '') {
                    setDisplayValue('');
                    return;
                }
                // Only allow numbers and one decimal point
                if (!/^[0-9.]*$/.test(inputValue)) {
                    return;
                }
                setDisplayValue(inputValue);
            }}
            onKeyDown={e => {
                if (e.key === 'ArrowUp' || e.key === 'ArrowDown') {
                    e.preventDefault();
                    const currentValue = parseFloat(displayValue) || 0;
                    const step = e.key === 'ArrowUp' ? 0.01 : -0.01;
                    const newValue = currentValue + step;
                    if (newValue >= 0) {
                        onChange(toMinorUnits(newValue));
                        setDisplayValue(newValue.toString());
                    }
                }
            }}
            onBlur={() => {
                const inputValue = displayValue;
                if (inputValue === '') {
                    onChange(0);
                    setDisplayValue('0');
                    return;
                }
                const newValue = parseFloat(inputValue);
                if (!isNaN(newValue)) {
                    onChange(toMinorUnits(newValue));
                    setDisplayValue(newValue.toFixed(2));
                }
            }}
            step="0.01"
            min="0"
            prefix={shouldPrefix ? currencySymbol : undefined}
            suffix={!shouldPrefix ? currencySymbol : undefined}
        />
    );
}
