import { ChangeDetectorRef, OnDestroy, Optional, Pipe, PipeTransform } from '@angular/core';
import { Subscription } from 'rxjs';

import { DataService } from '../../data/providers/data.service';

/**
 * Displays a human-readable name for a given ISO 4217 currency code.
 */
@Pipe({
    name: 'localeCurrencyName',
    pure: false,
})
export class LocaleCurrencyNamePipe implements PipeTransform, OnDestroy {
    private locale: string;
    private readonly subscription: Subscription;

    constructor(
        @Optional() private dataService?: DataService,
        @Optional() changeDetectorRef?: ChangeDetectorRef,
    ) {
        if (this.dataService && changeDetectorRef) {
            this.subscription = this.dataService.client
                .uiState()
                .mapStream(data => data.uiState.language)
                .subscribe(languageCode => {
                    this.locale = languageCode.replace(/_/g, '-');
                    changeDetectorRef.markForCheck();
                });
        }
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
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
