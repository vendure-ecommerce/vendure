import { ChangeDetectorRef, Optional, Pipe, PipeTransform } from '@angular/core';

import { DataService } from '../../data/providers/data.service';

import { LocaleBasePipe } from './locale-base.pipe';

/**
 * Displays a human-readable name for a given ISO 4217 currency code.
 */
@Pipe({
    name: 'localeCurrencyName',
    pure: false,
})
export class LocaleCurrencyNamePipe extends LocaleBasePipe implements PipeTransform {
    constructor(@Optional() dataService?: DataService, @Optional() changeDetectorRef?: ChangeDetectorRef) {
        super(dataService, changeDetectorRef);
    }
    transform(value: any, display: 'full' | 'symbol' | 'name' = 'full', locale?: unknown): any {
        if (value == null || value === '') {
            return '';
        }
        if (typeof value !== 'string') {
            return `Invalid currencyCode "${value as any}"`;
        }
        let name = '';
        let symbol = '';
        const activeLocale = typeof locale === 'string' ? locale : this.locale ?? 'en';

        if (display === 'full' || display === 'name') {
            name = new Intl.NumberFormat(activeLocale, {
                style: 'currency',
                currency: value,
                currencyDisplay: 'name',
            })
                .format(undefined as any)
                .replace(/\s*NaN\s*/, '');
        }
        if (display === 'full' || display === 'symbol') {
            symbol = new Intl.NumberFormat(activeLocale, {
                style: 'currency',
                currency: value,
                currencyDisplay: 'symbol',
            })
                .format(undefined as any)
                .replace(/\s*NaN\s*/, '');
        }
        return display === 'full' ? `${name} (${symbol})` : display === 'name' ? name : symbol;
    }
}
