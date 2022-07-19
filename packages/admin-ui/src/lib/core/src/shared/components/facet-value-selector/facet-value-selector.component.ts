import {
    ChangeDetectionStrategy,
    Component,
    EventEmitter,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { NgSelectComponent } from '@ng-select/ng-select';

import { FacetValue, FacetWithValues } from '../../../common/generated-types';
import { flattenFacetValues } from '../../../common/utilities/flatten-facet-values';
import { DataService } from '../../../data/providers/data.service';

export type FacetValueSeletorItem = {
    name: string;
    facetName: string;
    id: string;
    value: FacetValue.Fragment;
};

/**
 * @description
 * A form control for selecting facet values.
 *
 * @example
 * ```HTML
 * <vdr-facet-value-selector
 *   [facets]="facets"
 *   (selectedValuesChange)="selectedValues = $event"
 * ></vdr-facet-value-selector>
 * ```
 * The `facets` input should be provided from the parent component
 * like this:
 *
 * @example
 * ```TypeScript
 * this.facets = this.dataService
 *   .facet.getAllFacets()
 *   .mapSingle(data => data.facets.items);
 * ```
 * @docsCategory components
 */
@Component({
    selector: 'vdr-facet-value-selector',
    templateUrl: './facet-value-selector.component.html',
    styleUrls: ['./facet-value-selector.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: FacetValueSelectorComponent,
            multi: true,
        },
    ],
})
export class FacetValueSelectorComponent implements OnInit, ControlValueAccessor {
    @Output() selectedValuesChange = new EventEmitter<FacetValue.Fragment[]>();
    @Input() facets: FacetWithValues.Fragment[];
    @Input() readonly = false;
    @Input() transformControlValueAccessorValue: (value: FacetValueSeletorItem[]) => any[] = value => value;

    @ViewChild(NgSelectComponent) private ngSelect: NgSelectComponent;

    facetValues: FacetValueSeletorItem[] = [];
    onChangeFn: (val: any) => void;
    onTouchFn: () => void;
    disabled = false;
    value: Array<string | FacetValue.Fragment>;
    constructor(private dataService: DataService) {}

    ngOnInit() {
        this.facetValues = flattenFacetValues(this.facets).map(this.toSelectorItem);
    }

    onChange(selected: FacetValueSeletorItem[]) {
        if (this.readonly) {
            return;
        }
        this.selectedValuesChange.emit(selected.map(s => s.value));
        if (this.onChangeFn) {
            const transformedValue = this.transformControlValueAccessorValue(selected);
            this.onChangeFn(transformedValue);
        }
    }

    registerOnChange(fn: any) {
        this.onChangeFn = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouchFn = fn;
    }

    setDisabledState(isDisabled: boolean): void {
        this.disabled = isDisabled;
    }

    focus() {
        this.ngSelect.focus();
    }

    writeValue(obj: string | FacetValue.Fragment[] | Array<string | number> | null): void {
        if (typeof obj === 'string') {
            try {
                const facetIds = JSON.parse(obj) as string[];
                this.value = facetIds;
            } catch (err) {
                // TODO: log error
                throw err;
            }
        } else if (Array.isArray(obj)) {
            const isIdArray = (input: unknown[]): input is Array<string | number> =>
                input.every(i => typeof i === 'number' || typeof i === 'string');
            if (isIdArray(obj)) {
                this.value = obj.map(fv => fv.toString());
            } else {
                this.value = obj.map(fv => fv.id);
            }
        }
    }

    private toSelectorItem = (facetValue: FacetValue.Fragment): FacetValueSeletorItem => {
        return {
            name: facetValue.name,
            facetName: facetValue.facet.name,
            id: facetValue.id,
            value: facetValue,
        };
    };
}
