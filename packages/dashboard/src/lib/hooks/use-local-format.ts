import { useLingui } from '@lingui/react';
import { useCallback, useMemo } from 'react';

import { useServerConfig } from './use-server-config.js';

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
    const { moneyStrategyPrecision } = useServerConfig() ?? { moneyStrategyPrecision: 2 };
    const precisionFactor = useMemo(() => Math.pow(10, moneyStrategyPrecision), [moneyStrategyPrecision]);
    const locale = 'en';

    const toMajorUnits = useCallback(
        (value: number): number => {
            return value / precisionFactor;
        },
        [precisionFactor],
    );

    const toMinorUnits = useCallback(
        (value: number): number => {
            return Math.round(value * precisionFactor);
        },
        [precisionFactor],
    );

    const formatCurrency = useCallback(
        (value: number, currency: string, precision?: number) => {
            return new Intl.NumberFormat(locale, {
                style: 'currency',
                currency,
                minimumFractionDigits: precision ?? moneyStrategyPrecision,
                maximumFractionDigits: precision ?? moneyStrategyPrecision,
            }).format(toMajorUnits(value));
        },
        [locale, moneyStrategyPrecision, toMajorUnits],
    );

    const formatNumber = useCallback(
        (value: number) => {
            return new Intl.NumberFormat(locale).format(value);
        },
        [locale],
    );

    const formatDate = useCallback(
        (value: string | Date, options?: Intl.DateTimeFormatOptions) => {
            return new Intl.DateTimeFormat(locale, options).format(new Date(value));
        },
        [locale],
    );

    const formatLanguageName = useCallback(
        (value: string): string => {
            try {
                return (
                    new Intl.DisplayNames([locale], { type: 'language' }).of(value.replace('_', '-')) ?? value
                );
            } catch (e: any) {
                return value;
            }
        },
        [locale],
    );

    const formatCurrencyName = useCallback(
        (currencyCode: string, display: 'full' | 'symbol' | 'name' = 'full'): string => {
            if (!currencyCode) return '';

            try {
                const name =
                    display === 'full' || display === 'name'
                        ? (new Intl.DisplayNames([locale], { type: 'currency' }).of(currencyCode) ?? '')
                        : '';

                const symbol =
                    display === 'full' || display === 'symbol'
                        ? (new Intl.NumberFormat(locale, {
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
        [locale],
    );

    return {
        formatCurrency,
        formatNumber,
        formatDate,
        formatLanguageName,
        formatCurrencyName,
        toMajorUnits,
        toMinorUnits,
    };
}
