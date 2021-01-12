import { Pipe, PipeTransform } from '@angular/core';

import { LocaleBasePipe } from './locale-base.pipe';

@Pipe({
    name: 'localeCurrency',
    pure: false,
})
export class LocaleCurrencyPipe extends LocaleBasePipe implements PipeTransform {
    transform(value: unknown, ...args: unknown[]): string | unknown {
        const [currencyCode, locale] = args;
        if (typeof value === 'number' && typeof currencyCode === 'string') {
            const activeLocale = typeof locale === 'string' ? locale : this.locale;
            const majorUnits = value / 100;
            return new Intl.NumberFormat(activeLocale, { style: 'currency', currency: currencyCode }).format(
                majorUnits,
            );
        }
        return value;
    }
}
