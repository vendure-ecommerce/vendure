import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { DataService } from '../../../data/providers/data.service';

import { FacetValue, FacetWithValues } from '../../../common/generated-types';
import { flattenFacetValues } from '../../../common/utilities/flatten-facet-values';

export type FacetValueSeletorItem = {
    name: string;
    facetName: string;
    id: string;
    value: FacetValue.Fragment;
};

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

    facetValues: FacetValueSeletorItem[] = [];
    onChangeFn: (val: any) => void;
    onTouchFn: () => void;
    disabled = false;
    value: string[];
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
            this.onChangeFn(JSON.stringify(selected.map(s => s.id)));
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

    writeValue(obj: string | FacetValue.Fragment[] | null): void {
        if (typeof obj === 'string') {
            try {
                const facetIds = JSON.parse(obj) as string[];
                this.value = facetIds;
            } catch (err) {
                // TODO: log error
                throw err;
            }
        } else if (obj) {
            this.value = obj.map(fv => fv.id);
        }
    }

    private toSelectorItem = (facetValue: FacetValue.Fragment): FacetValueSeletorItem => {
        return {
            name: facetValue.name,
            facetName: facetValue.facet.name,
            id: facetValue.id,
            value: facetValue,
        };
    }
}
