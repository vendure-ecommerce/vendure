import { ChangeDetectionStrategy, Component, EventEmitter, OnInit, Output, ViewChild } from '@angular/core';
import { NgSelectComponent } from '@ng-select/ng-select';
import { concat, merge, Observable, of, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, mapTo, switchMap, tap, throttleTime } from 'rxjs/operators';

import { ProductSelectorSearch } from '../../../common/generated-types';
import { DataService } from '../../../data/providers/data.service';

@Component({
    selector: 'vdr-product-selector',
    templateUrl: './product-selector.component.html',
    styleUrls: ['./product-selector.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProductSelectorComponent implements OnInit {
    searchInput$ = new Subject<string>();
    searchLoading = false;
    searchResults$: Observable<ProductSelectorSearch.Items[]>;
    @Output() productSelected = new EventEmitter<ProductSelectorSearch.Items>();

    @ViewChild('autoComplete', { static: true })
    private ngSelect: NgSelectComponent;
    constructor(private dataService: DataService) {}

    ngOnInit(): void {
        this.initSearchResults();
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
                return this.dataService.product
                    .productSelectorSearch(term, 10)
                    .mapSingle(result => result.search.items);
            }),
            tap(() => (this.searchLoading = false)),
        );

        const clear$ = this.productSelected.pipe(mapTo([]));
        this.searchResults$ = concat(of([]), merge(searchItems$, clear$));
    }

    selectResult(product?: ProductSelectorSearch.Items) {
        if (product) {
            this.productSelected.emit(product);
            this.ngSelect.clearModel();
        }
    }
}
