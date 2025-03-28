import { useUserSettings } from '@/hooks/use-user-settings.js';
import { useMemo, useState, useEffect } from 'react';
import { useLocalFormat } from '@/hooks/use-local-format.js';
import { AffixedInput } from './affixed-input.js';

// Original component
function MoneyInputInternal({
    value,
    currency,
    onChange,
}: {
    value: number;
    currency: string;
    onChange: (value: number) => void;
}) {
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
        if (!currency) return false;
        const locale = displayLocale || displayLanguage.replace(/_/g, '-');
        const parts = new Intl.NumberFormat(locale, {
            style: 'currency',
            currency,
            currencyDisplay: 'symbol',
        }).formatToParts();
        const NaNString = parts.find(p => p.type === 'nan')?.value ?? 'NaN';
        const localised = new Intl.NumberFormat(locale, {
            style: 'currency',
            currency,
            currencyDisplay: 'symbol',
        }).format(undefined as any);
        return localised.indexOf(NaNString) > 0;
    }, [currency, displayLocale, displayLanguage]);

    // Get the currency symbol
    const currencySymbol = useMemo(() => {
        if (!currency) return '';
        const locale = displayLocale || displayLanguage.replace(/_/g, '-');
        const parts = new Intl.NumberFormat(locale, {
            style: 'currency',
            currency,
            currencyDisplay: 'symbol',
        }).formatToParts();
        return parts.find(p => p.type === 'currency')?.value ?? currency;
    }, [currency, displayLocale, displayLanguage]);

    return (
        <AffixedInput
            type="text"
            value={displayValue}
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
            onBlur={e => {
                const inputValue = e.target.value;
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

// Wrapper that makes it compatible with DataInputComponent
export function MoneyInput(props: { value: any; onChange: (value: any) => void; [key: string]: any }) {
    const { value, onChange, ...rest } = props;
    const currency = rest.currency || 'USD'; // Default currency if none provided
    return <MoneyInputInternal value={value} currency={currency} onChange={onChange} />;
}
