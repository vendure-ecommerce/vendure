import { ChangeDetectorRef, OnDestroy, Optional, Pipe, PipeTransform } from '@angular/core';
import { DataService } from '@vendure/admin-ui/core';
import { Subscription } from 'rxjs';

/**
 * Used by locale-aware pipes to handle the task of getting the active languageCode
 * of the UI and cleaning up.
 */
@Pipe({
    name: 'basePipe',
})
export abstract class LocaleBasePipe implements OnDestroy, PipeTransform {
    protected locale: string;
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

    abstract transform(value: any, ...args): any;
}
