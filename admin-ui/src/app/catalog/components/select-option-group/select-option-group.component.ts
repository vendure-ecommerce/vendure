import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnDestroy,
    OnInit,
    Output,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, Subject } from 'rxjs';
import { debounceTime, map, takeUntil } from 'rxjs/operators';

import { DataService } from '../../../data/providers/data.service';
import { ProductOptionGroup } from '../select-option-group-dialog/select-option-group-dialog.component';

@Component({
    selector: 'vdr-select-option-group',
    templateUrl: './select-option-group.component.html',
    styleUrls: ['./select-option-group.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectOptionGroupComponent implements OnInit, OnDestroy {
    @Input() existingOptionGroupIds: string[];
    @Output() selectGroup = new EventEmitter<ProductOptionGroup>();
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
}
