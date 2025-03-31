import { useLocalFormat } from '@/hooks/use-local-format.js';
import { CurrencyCode } from '@/constants.js';
import { MultiSelect } from './multi-select.js';
import { useLingui } from '@/lib/trans.js';

export interface CurrencySelectorProps<T extends boolean> {    
    value: T extends true ? string[] : string;
    onChange: (value: T extends true ? string[] : string) => void;
    multiple?: T;
    availableCurrencyCodes?: string[];
}

export function CurrencySelector<T extends boolean>(props: CurrencySelectorProps<T>) {
    const { formatCurrencyName } = useLocalFormat();
    const { value, onChange, multiple, availableCurrencyCodes } = props;
    const { i18n } = useLingui();

    const items = (availableCurrencyCodes ?? Object.values(CurrencyCode)).map(currencyCode => ({
        value: currencyCode,
        label: formatCurrencyName(currencyCode)
    }));

    return (
        <MultiSelect
            value={value}
            onChange={onChange}
            multiple={multiple}
            items={items}
            placeholder={i18n.t('Select a currency')}
            searchPlaceholder={i18n.t('Search currencies...')}
        />
    );
}
