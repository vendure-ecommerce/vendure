import { ChangeDetectionStrategy, Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { debounceTime, map, takeUntil } from 'rxjs/operators';

import { DataService } from '../../../data/providers/data.service';
import { GetProductOptionGroups_productOptionGroups } from '../../../data/types/gql-generated-types';
import { Dialog } from '../../../shared/providers/modal/modal.service';

export type ProductOptionGroup = GetProductOptionGroups_productOptionGroups;

@Component({
    selector: 'vdr-select-option-group-dialog',
    templateUrl: './select-option-group-dialog.component.html',
    styleUrls: ['./select-option-group-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectOptionGroupDialogComponent implements Dialog<ProductOptionGroup>, OnInit, OnDestroy {
    resolveWith: (result?: ProductOptionGroup) => void;
    existingOptionGroupIds: string[];
    optionGroups$: Observable<ProductOptionGroup[]>;
    filterInput = new FormControl();
    private destroy$ = new Subject<void>();

    constructor(private dataService: DataService) {}

    ngOnInit() {
        const optionGroupsQuery = this.dataService.product.getProductOptionGroups();
        this.optionGroups$ = optionGroupsQuery.stream$.pipe(map(data => data.productOptionGroups));

        this.filterInput.valueChanges
            .pipe(
                debounceTime(300),
                takeUntil(this.destroy$),
            )
            .subscribe(filterTerm => {
                optionGroupsQuery.ref.refetch({ filterTerm });
            });
    }

    ngOnDestroy() {
        this.destroy$.next();
        this.destroy$.complete();
    }

    isAvailable(group: ProductOptionGroup): boolean {
        return !this.existingOptionGroupIds.includes(group.id);
    }

    selectGroup(group: ProductOptionGroup) {
        this.resolveWith(group);
    }

    cancel() {
        this.resolveWith();
    }
}
