import {
    AfterViewInit,
    ChangeDetectionStrategy,
    ChangeDetectorRef,
    Component,
    ComponentRef,
    HostListener,
    Input,
    ViewChild,
} from '@angular/core';
import { AbstractControl, FormArray, FormControl, FormGroup } from '@angular/forms';
import { assertNever } from '@vendure/common/lib/shared-utils';
import { FormInputComponent } from '../../../common/component-registry-types';
import { DateOperators, LanguageCode } from '../../../common/generated-types';
import { DataTableFilter, KindValueMap } from '../../../providers/data-table/data-table-filter';
import {
    DataTableFilterCollection,
    FilterWithValue,
} from '../../../providers/data-table/data-table-filter-collection';
import { I18nService } from '../../../providers/i18n/i18n.service';
import { DropdownComponent } from '../dropdown/dropdown.component';
import { CustomFilterComponentDirective } from './custom-filter-component.directive';

@Component({
    selector: 'vdr-data-table-filters',
    templateUrl: './data-table-filters.component.html',
    styleUrls: ['./data-table-filters.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DataTableFiltersComponent implements AfterViewInit {
    @Input() filters: DataTableFilterCollection;
    @Input() filterWithValue?: FilterWithValue;
    @ViewChild('dropdown', { static: true }) dropdown: DropdownComponent;
    @ViewChild('customComponentHost', { static: false, read: CustomFilterComponentDirective })
    set customComponentHost(content: CustomFilterComponentDirective) {
        this._customComponentHost = content;
    }
    _customComponentHost: CustomFilterComponentDirective;
    protected state: 'new' | 'active' = 'new';
    protected formControl: AbstractControl;
    protected selectedFilter: DataTableFilter | undefined;
    protected customComponent?: ComponentRef<FormInputComponent>;

    @HostListener('window:keydown.f', ['$event'])
    onFKeyPress(event: KeyboardEvent) {
        if (event.target instanceof HTMLElement) {
            if (event.target.tagName === 'INPUT' || event.target.tagName === 'TEXTAREA') {
                return;
            }
        }
        if (!this.dropdown.isOpen && this.state === 'new') {
            this.dropdown.toggleOpen();
        }
    }

    constructor(private i18nService: I18nService, private changeDetectorRef: ChangeDetectorRef) {}

    ngAfterViewInit() {
        this.dropdown.onOpenChange(isOpen => {
            if (!isOpen && this.state === 'new') {
                this.selectedFilter = undefined;
            }
        });
        if (this.filterWithValue) {
            const { filter, value } = this.filterWithValue;
            this.selectFilter(filter, value);
            this.state = 'active';
        }
        setTimeout(() => this.changeDetectorRef.markForCheck());
    }

    selectFilter(filter: DataTableFilter, value?: any) {
        this.selectedFilter = filter;
        if (filter.isText()) {
            this.formControl = new FormGroup(
                {
                    operator: new FormControl(value?.operator ?? 'contains'),
                    term: new FormControl(value?.term ?? ''),
                },
                control => {
                    if (!control.value.term) {
                        return { noSelection: true };
                    }
                    return null;
                },
            );
        }
        if (filter.isNumber()) {
            this.formControl = new FormGroup(
                {
                    operator: new FormControl(value?.operator ?? 'gt'),
                    amount: new FormControl(value?.amount ?? ''),
                },
                control => {
                    if (!control.value.amount) {
                        return { noSelection: true };
                    }
                    return null;
                },
            );
        } else if (filter.isSelect()) {
            this.formControl = new FormArray(
                filter.type.options.map(o => new FormControl(value?.includes(o.value) ?? false)),
                control => (control.value.some(Boolean) ? null : { noSelection: true }),
            );
        } else if (filter.isBoolean()) {
            this.formControl = new FormControl(value ?? false);
        } else if (filter.isDateRange()) {
            this.formControl = new FormGroup(
                {
                    start: new FormControl(value?.start ?? null),
                    end: new FormControl(value?.end ?? null),
                },
                control => {
                    const val = control.value;
                    if (val.start && val.end && val.start > val.end) {
                        return { invalidRange: true };
                    }
                    if (!val.start && !val.end) {
                        return { noSelection: true };
                    }
                    return null;
                },
            );
        } else if (filter.isCustom() && this._customComponentHost) {
            // this.#customComponentHost.viewContainerRef.clear();
            this.customComponent = this._customComponentHost.viewContainerRef.createComponent(
                filter.type.component,
            );
            this.formControl = new FormControl<any>(value ?? []);
            this.customComponent.instance.config = {};
            this.customComponent.instance.formControl = new FormControl<any>(value ?? []);
        }
    }

    activate() {
        if (!this.selectedFilter) {
            return;
        }
        let value: any;
        const type = this.selectedFilter?.type;
        switch (type.kind) {
            case 'boolean':
                value = !!this.formControl.value as KindValueMap[typeof type.kind]['raw'];
                break;
            case 'dateRange': {
                let dateOperators: DateOperators;
                const start = this.formControl.value.start ?? undefined;
                const end = this.formControl.value.end ?? undefined;
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
                value = { start, end } as KindValueMap[typeof type.kind]['raw'];
                break;
            }
            case 'number':
                value = {
                    amount: Number(this.formControl.value.amount),
                    operator: this.formControl.value.operator,
                } as KindValueMap[typeof type.kind]['raw'];
                break;

            case 'select':
                const options = this.formControl.value
                    .map((v, i) => (v ? type.options[i].value : undefined))
                    .filter(v => !!v);
                value = options as KindValueMap[typeof type.kind]['raw'];
                break;
            case 'text':
                value = {
                    operator: this.formControl.value.operator,
                    term: this.formControl.value.term,
                } as KindValueMap[typeof type.kind]['raw'];
                break;
            case 'custom':
                value = this.customComponent?.instance.formControl.value;
                this.formControl.setValue(value);
                if (this.state === 'new') {
                    this._customComponentHost.viewContainerRef.clear();
                }
                break;
            default:
                assertNever(type);
        }
        if (this.state === 'new') {
            this.selectedFilter.activate(value);
        } else {
            this.filterWithValue?.updateValue(value);
        }
        this.dropdown.toggleOpen();
    }

    deactivate() {
        if (this.filterWithValue) {
            const index = this.filters.activeFilters.indexOf(this.filterWithValue);
            this.filters.removeActiveFilterAtIndex(index);
        }
    }
}
