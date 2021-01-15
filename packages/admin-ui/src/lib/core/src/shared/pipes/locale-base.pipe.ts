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

    abstract transform(value: any, ...args): any;
}
