import { ChangeDetectionStrategy, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { BehaviorSubject, combineLatest, Observable, Subject } from 'rxjs';
import { map } from 'rxjs/operators';

import { DataService } from '@vendure/admin-ui/core';

@Component({
    selector: 'vdr-variant-price-detail',
    templateUrl: './variant-price-detail.component.html',
    styleUrls: ['./variant-price-detail.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class VariantPriceDetailComponent implements OnInit, OnChanges {
    @Input() priceIncludesTax: boolean;
    @Input() price: number;
    @Input() currencyCode: string;
    @Input() taxCategoryId: string;

    grossPrice$: Observable<number>;
    taxRate$: Observable<number>;

    private priceChange$ = new BehaviorSubject<number>(0);
    private taxCategoryIdChange$ = new BehaviorSubject<string>('');

    constructor(private dataService: DataService) {}

    ngOnInit() {
        const taxRates$ = this.dataService.settings
            .getTaxRates(99999, 0, 'cache-first')
            .mapStream(data => data.taxRates.items);
        const activeChannel$ = this.dataService.settings
            .getActiveChannel('cache-first')
            .mapStream(data => data.activeChannel);

        this.taxRate$ = combineLatest(activeChannel$, taxRates$, this.taxCategoryIdChange$).pipe(
            map(([channel, taxRates, taxCategoryId]) => {
                const defaultTaxZone = channel.defaultTaxZone;
                if (!defaultTaxZone) {
                    return 0;
                }
                const applicableRate = taxRates.find(
                    taxRate => taxRate.zone.id === defaultTaxZone.id && taxRate.category.id === taxCategoryId,
                );

                if (!applicableRate) {
                    return 0;
                }
                return applicableRate.value;
            }),
        );

        this.grossPrice$ = combineLatest(this.taxRate$, this.priceChange$).pipe(
            map(([taxRate, price]) => {
                return Math.round(price * ((100 + taxRate) / 100)) / 100;
            }),
        );
    }

    ngOnChanges(changes: SimpleChanges): void {
        if ('price' in changes) {
            this.priceChange$.next(changes.price.currentValue);
        }
        if ('taxCategoryId' in changes) {
            this.taxCategoryIdChange$.next(changes.taxCategoryId.currentValue);
        }
    }
}
