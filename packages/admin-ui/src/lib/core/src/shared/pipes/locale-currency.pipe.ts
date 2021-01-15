import { ChangeDetectorRef, Optional, Pipe, PipeTransform } from '@angular/core';

import { DataService } from '../../data/providers/data.service';

import { LocaleBasePipe } from './locale-base.pipe';

@Pipe({
    name: 'localeCurrency',
    pure: false,
})
export class LocaleCurrencyPipe extends LocaleBasePipe implements PipeTransform {
    constructor(@Optional() dataService?: DataService, @Optional() changeDetectorRef?: ChangeDetectorRef) {
        super(dataService, changeDetectorRef);
    }
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
