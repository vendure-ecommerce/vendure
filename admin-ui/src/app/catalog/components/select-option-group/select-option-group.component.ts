import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnChanges,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { debounceTime, map, takeUntil } from 'rxjs/operators';
import { GetProductOptionGroups, ProductOptionGroup } from 'shared/generated-types';
import { DeepPartial } from 'shared/shared-types';

import { DataService } from '../../../data/providers/data.service';
import { QueryResult } from '../../../data/query-result';

@Component({
    selector: 'vdr-select-option-group',
    templateUrl: './select-option-group.component.html',
    styleUrls: ['./select-option-group.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectOptionGroupComponent implements OnInit, OnChanges, OnDestroy {
    @Input() selectedGroups: ProductOptionGroup[];
    @Output() selectGroup = new EventEmitter<ProductOptionGroup>();
    optionGroups$: Observable<Array<DeepPartial<ProductOptionGroup>>>;
    filterInput = new FormControl();
    optionGroupsQuery: QueryResult<GetProductOptionGroups.Query, GetProductOptionGroups.Variables>;
    truncateOptionsTo = 4;
    private inputChange$ = new Subject<ProductOptionGroup[]>();
    private destroy$ = new Subject<void>();

    constructor(private dataService: DataService) {}

    ngOnInit() {
        this.optionGroupsQuery = this.dataService.product.getProductOptionGroups();
        this.optionGroups$ = this.optionGroupsQuery.stream$.pipe(map(data => data.productOptionGroups));

        this.filterInput.valueChanges
            .pipe(
                debounceTime(300),
                takeUntil(this.destroy$),
            )
            .subscribe(filterTerm => {
                this.optionGroupsQuery.ref.refetch({ filterTerm });
            });
    }

    ngOnChanges() {
        this.inputChange$.next(this.selectedGroups);
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    refresh() {
        this.optionGroupsQuery.ref.refetch();
    }

    isSelected(group: ProductOptionGroup): boolean {
        return this.selectedGroups && !!this.selectedGroups.find(g => g.id === group.id);
    }

    optionsTruncated(group: ProductOptionGroup): boolean {
        return 0 < this.optionsTrucatedCount(group);
    }

    optionsTrucatedCount(group: ProductOptionGroup): number {
        return Math.max(group.options.length - this.truncateOptionsTo, 0);
    }
}
