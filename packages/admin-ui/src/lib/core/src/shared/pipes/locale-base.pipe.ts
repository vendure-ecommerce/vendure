import { ChangeDetectorRef, Injectable, OnDestroy, PipeTransform } from '@angular/core';
import { Subscription } from 'rxjs';

import { DataService } from '../../data/providers/data.service';

/**
 * Used by locale-aware pipes to handle the task of getting the active languageCode
 * of the UI and cleaning up.
 */
@Injectable()
export abstract class LocaleBasePipe implements OnDestroy, PipeTransform {
    protected locale: string;
    private readonly subscription: Subscription;

    protected constructor(dataService?: DataService, changeDetectorRef?: ChangeDetectorRef) {
        if (dataService && changeDetectorRef) {
            this.subscription = dataService.client
                .uiState()
                .mapStream(data => data.uiState)
                .subscribe(({ language, locale }) => {
                    this.locale = language.replace(/_/g, '-');
                    if (locale) {
                        this.locale += `-${locale}`;
                    }
                    changeDetectorRef.markForCheck();
                });
        }
    }

    ngOnDestroy() {
        if (this.subscription) {
            this.subscription.unsubscribe();
        }
    }

    abstract transform(value: any, ...args): any;
}
