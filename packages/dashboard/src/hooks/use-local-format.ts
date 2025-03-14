import { useServerConfig } from '@/providers/server-config.js';
import { useLingui } from '@lingui/react';
import { useCallback, useMemo } from 'react';

/**
 * @description
 * This hook is used to format numbers and currencies using the configured language and
 * locale of the dashboard app.
 *
 * @example
 * ```ts
 * const {
 *          formatCurrency,
 *          formatNumber,
 *          formatDate,
 *          formatLanguageName,
 *          formatCurrencyName,
 *          toMajorUnits,
 * } = useLocalFormat();
 * ```
 */
export function useLocalFormat() {
    const { i18n } = useLingui();
    const { moneyStrategyPrecision } = useServerConfig() ?? { moneyStrategyPrecision: 2 };
    const precisionFactor = useMemo(() => Math.pow(10, moneyStrategyPrecision), [moneyStrategyPrecision]);

    const toMajorUnits = useCallback(
        (value: number): number => {
            return value / precisionFactor;
        },
        [precisionFactor],
    );

    const formatCurrency = useCallback(
        (value: number, currency: string) => {
            return i18n.number(toMajorUnits(value), {
                style: 'currency',
                currency,
                minimumFractionDigits: moneyStrategyPrecision,
                maximumFractionDigits: moneyStrategyPrecision,
            });
        },
        [i18n, moneyStrategyPrecision, toMajorUnits],
    );

    const formatNumber = (value: number) => {
        return i18n.number(value);
    };

    const formatDate = (value: string | Date) => {
        return i18n.date(value);
    };

    const formatLanguageName = (value: string): string => {
        try {
            return (
                new Intl.DisplayNames([i18n.locale], { type: 'language' }).of(value.replace('_', '-')) ??
                value
            );
        } catch (e: any) {
            return value;
        }
    };

    const formatCurrencyName = useCallback(
        (currencyCode: string, display: 'full' | 'symbol' | 'name' = 'full'): string => {
            if (!currencyCode) return '';

            try {
                const name =
                    display === 'full' || display === 'name'
                        ? (new Intl.DisplayNames([i18n.locale], { type: 'currency' }).of(currencyCode) ?? '')
                        : '';

                const symbol =
                    display === 'full' || display === 'symbol'
                        ? (new Intl.NumberFormat(i18n.locale, {
                              style: 'currency',
                              currency: currencyCode,
                              currencyDisplay: 'symbol',
                          })
                              .formatToParts()
                              .find(p => p.type === 'currency')?.value ?? currencyCode)
                        : '';

                return display === 'full' ? `${name} (${symbol})` : display === 'name' ? name : symbol;
            } catch (e) {
                return currencyCode;
            }
        },
        [i18n.locale],
    );

    return {
        formatCurrency,
        formatNumber,
        formatDate,
        formatLanguageName,
        formatCurrencyName,
        toMajorUnits,
    };
}
