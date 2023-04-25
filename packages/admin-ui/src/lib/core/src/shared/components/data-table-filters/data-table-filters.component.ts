import { AfterViewInit, ChangeDetectionStrategy, Component, Input, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { DateOperators } from '@vendure/admin-ui/core';
import { assertNever } from '@vendure/common/lib/shared-utils';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { I18nService } from '../../../providers/i18n/i18n.service';
import {
    DataTableFilter,
    DataTableFilterSelectType,
} from '../../../providers/data-table-filter/data-table-filter';
import { DataTableFilterCollection } from '../../../providers/data-table-filter/data-table-filter-collection';

@Component({
    selector: 'vdr-data-table-filters',
    templateUrl: './data-table-filters.component.html',
    styleUrls: ['./data-table-filters.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableFiltersComponent implements AfterViewInit, OnInit {
    @Input() filters: DataTableFilterCollection;
    @Input() filter?: DataTableFilter;
    @ViewChild('dropdown', { static: true }) dropdown: DropdownComponent;
    protected state: 'new' | 'active' = 'new';
    protected formControl: AbstractControl;
    protected selectedFilter: DataTableFilter | undefined;

    constructor(private i18nService: I18nService) {}

    ngOnInit() {
        if (this.filter) {
            const filterConfig = this.filters.getFilter(this.filter?.id);
            if (filterConfig) {
                this.selectFilter(filterConfig);
                this.state = 'active';
            }
        }
    }

    ngAfterViewInit() {
        this.dropdown.onOpenChange(isOpen => {
            if (!isOpen && this.state === 'new') {
                this.selectedFilter = undefined;
            }
        });
    }

    selectFilter(filter: DataTableFilter) {
        this.selectedFilter = filter;
        if (filter.isText()) {
            this.formControl = new FormGroup(
                {
                    operator: new FormControl(filter.value?.operator ?? 'contains'),
                    term: new FormControl(filter.value?.term ?? ''),
                },
                control => {
                    if (!control.value.term) {
                        return { noSelection: true };
                    }
                    return null;
                },
            );
        } else if (filter.isSelect()) {
            this.formControl = new FormArray(
                filter.type.options.map(o => new FormControl(filter.value?.includes(o.value) ?? false)),
                control => (control.value.some(Boolean) ? null : { noSelection: true }),
            );
        } else if (filter.isBoolean()) {
            this.formControl = new FormControl(filter.value ?? false);
        } else if (filter.isDateRange()) {
            this.formControl = new FormGroup(
                {
                    start: new FormControl(filter.value?.start ?? null),
                    end: new FormControl(filter.value?.end ?? null),
                },
                control => {
                    const value = control.value;
                    if (value.start && value.end && value.start > value.end) {
                        return { invalidRange: true };
                    }
                    if (!value.start && !value.end) {
                        return { noSelection: true };
                    }
                    return null;
                },
            );
        }
    }

    activate() {
        if (!this.selectedFilter) {
            return;
        }
        let value = this.formControl.value;
        const type = this.selectedFilter?.type;
        if (type.kind === 'select' && Array.isArray(value)) {
            value = value.map((o, i) => (o ? type.options[i].value : undefined)).filter(v => !!v);
        }
        if (type.kind === 'dateRange') {
            let dateOperators: DateOperators;
            const start = value.start ?? undefined;
            const end = value.end ?? undefined;
            if (start && end) {
                dateOperators = {
                    between: { start, end },
                };
            } else if (start) {
                dateOperators = {
                    after: start,
                };
            } else {
                dateOperators = {
                    before: end,
                };
            }
            value = {
                start,
                end,
                dateOperators,
            };
        }
        this.selectedFilter.setValue(value);
        this.dropdown.toggleOpen();
    }

    deactivate() {
        if (this.filter) {
            this.filter.clearValue();
        }
    }
}
