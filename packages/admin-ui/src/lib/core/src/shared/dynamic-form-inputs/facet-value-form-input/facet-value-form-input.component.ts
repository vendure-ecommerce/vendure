import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DefaultFormComponentId } from '@vendure/common/lib/shared-types';
import { Observable } from 'rxjs';
import { shareReplay } from 'rxjs/operators';

import { FormInputComponent, InputComponentConfig } from '../../../common/component-registry-types';
import { FacetWithValues } from '../../../common/generated-types';
import { DataService } from '../../../data/providers/data.service';
import { FacetValueSeletorItem } from '../../components/facet-value-selector/facet-value-selector.component';

/**
 * @description
 * Allows the selection of multiple FacetValues via an autocomplete select input.
 * Should be used with `ID` type **list** fields which represent FacetValue IDs.
 *
 * @docsCategory custom-input-components
 * @docsPage default-inputs
 */
@Component({
    selector: 'vdr-facet-value-form-input',
    templateUrl: './facet-value-form-input.component.html',
    styleUrls: ['./facet-value-form-input.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FacetValueFormInputComponent implements FormInputComponent, OnInit {
    static readonly id: DefaultFormComponentId = 'facet-value-form-input';
    readonly isListInput = true;
    readonly: boolean;
    formControl: FormControl;
    facets$: Observable<FacetWithValues.Fragment[]>;
    config: InputComponentConfig;
    constructor(private dataService: DataService) {}

    ngOnInit() {
        this.facets$ = this.dataService.facet
            .getAllFacets()
            .mapSingle(data => data.facets.items)
            .pipe(shareReplay(1));
    }

    valueTransformFn = (values: FacetValueSeletorItem[]) => {
        const isUsedInConfigArg = this.config.__typename === 'ConfigArgDefinition';
        if (isUsedInConfigArg) {
            return JSON.stringify(values.map(s => s.id));
        } else {
            return values;
        }
    };
}
