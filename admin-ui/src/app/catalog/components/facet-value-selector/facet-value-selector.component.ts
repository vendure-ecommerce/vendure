import { ChangeDetectionStrategy, Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FacetValue, FacetWithValues } from 'shared/generated-types';

import { flattenFacetValues } from '../../../common/utilities/flatten-facet-values';
import { DataService } from '../../../data/providers/data.service';

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
})
export class FacetValueSelectorComponent implements OnInit {
    @Output() selectedValuesChange = new EventEmitter<FacetValue.Fragment[]>();
    @Input() facets: FacetWithValues.Fragment[];

    facetValues: FacetValueSeletorItem[] = [];
    constructor(private dataService: DataService) {}

    ngOnInit() {
        this.facetValues = flattenFacetValues(this.facets).map(value => {
            return {
                name: value.name,
                facetName: value.facet.name,
                id: value.id,
                value,
            };
        });
    }

    onChange(selected: FacetValueSeletorItem[]) {
        this.selectedValuesChange.emit(selected.map(s => s.value));
    }
}
