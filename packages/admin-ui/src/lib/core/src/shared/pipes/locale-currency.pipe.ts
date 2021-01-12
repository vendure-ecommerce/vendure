import { ChangeDetectorRef, OnDestroy, Optional, Pipe, PipeTransform } from '@angular/core';
import { Subscription } from 'rxjs';

import { DataService } from '../../data/providers/data.service';

@Pipe({
    name: 'localeCurrency',
    pure: false,
})
export class LocaleCurrencyPipe implements PipeTransform, OnDestroy {
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
