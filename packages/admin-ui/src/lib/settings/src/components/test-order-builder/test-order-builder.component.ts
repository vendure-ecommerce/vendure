import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';
import { CurrencyCode, DataService, LocalStorageService, SearchForTestOrder } from '@vendure/admin-ui/core';
import { concat, merge, Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, mapTo, switchMap, tap } from 'rxjs/operators';

export interface TestOrderLine {
    id: string;
    name: string;
    preview: string;
    sku: string;
    unitPriceWithTax: number;
    quantity: number;
}

@Component({
    selector: 'vdr-test-order-builder',
    templateUrl: './test-order-builder.component.html',
    styleUrls: ['./test-order-builder.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TestOrderBuilderComponent implements OnInit {
    @Output() orderLinesChange = new EventEmitter<TestOrderLine[]>();

    lines: TestOrderLine[] = [];
    currencyCode: CurrencyCode;
    searchInput$ = new Subject<string>();
    resultSelected$ = new Subject<void>();
    searchLoading = false;
    searchResults$: Observable<SearchForTestOrder.Items[]>;
    @ViewChild('autoComplete', { static: true })
    private ngSelect: NgSelectComponent;

    get subTotal(): number {
        return this.lines.reduce((sum, l) => sum + l.unitPriceWithTax * l.quantity, 0);
    }
    constructor(private dataService: DataService, private localStorageService: LocalStorageService) {}

    ngOnInit() {
        this.lines = this.loadFromLocalStorage();
        if (this.lines) {
            this.orderLinesChange.emit(this.lines);
        }
        this.initSearchResults();
        this.dataService.settings.getActiveChannel('cache-first').single$.subscribe(result => {
            this.currencyCode = result.activeChannel.currencyCode;
        });
    }

    selectResult(result: SearchForTestOrder.Items) {
        if (result) {
            this.resultSelected$.next();
            this.ngSelect.clearModel();
            this.addToLines(result);
        }
    }

    private addToLines(result: SearchForTestOrder.Items) {
        if (!this.lines.find(l => l.id === result.productVariantId)) {
            this.lines.push({
                id: result.productVariantId,
                name: result.productVariantName,
                preview: result.productPreview,
                quantity: 1,
                sku: result.sku,
                unitPriceWithTax: result.priceWithTax.value,
            });
            this.persistToLocalStorage();
            this.orderLinesChange.emit(this.lines);
        }
    }

    updateQuantity() {
        this.persistToLocalStorage();
        this.orderLinesChange.emit(this.lines);
    }

    removeLine(line: TestOrderLine) {
        this.lines = this.lines.filter(l => l.id !== line.id);
        this.persistToLocalStorage();
        this.orderLinesChange.emit(this.lines);
    }

    private initSearchResults() {
        const searchItems$ = this.searchInput$.pipe(
            debounceTime(200),
            distinctUntilChanged(),
            tap(() => (this.searchLoading = true)),
            switchMap(term => {
                if (!term) {
                    return of([]);
                }
                return this.dataService.settings
                    .searchForTestOrder(term, 10)
                    .mapSingle(result => result.search.items);
            }),
            tap(() => (this.searchLoading = false)),
        );

        const clear$ = this.resultSelected$.pipe(mapTo([]));
        this.searchResults$ = concat(of([]), merge(searchItems$, clear$));
    }

    private persistToLocalStorage() {
        this.localStorageService.setForCurrentLocation('shippingTestOrder', this.lines);
    }

    private loadFromLocalStorage(): TestOrderLine[] {
        return this.localStorageService.getForCurrentLocation('shippingTestOrder') || [];
    }
}
