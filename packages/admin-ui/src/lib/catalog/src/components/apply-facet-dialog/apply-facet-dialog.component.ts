import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FacetValue, FacetWithValues } from '@vendure/admin-ui/core';
import { Dialog } from '@vendure/admin-ui/core';

@Component({
    selector: 'vdr-apply-facet-dialog',
    templateUrl: './apply-facet-dialog.component.html',
    styleUrls: ['./apply-facet-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplyFacetDialogComponent implements Dialog<FacetValue[]> {
    resolveWith: (result?: FacetValue[]) => void;
    selectedValues: FacetValue[] = [];
    // Provided by caller
    facets: FacetWithValues.Fragment[];

    selectValues() {
        this.resolveWith(this.selectedValues);
    }

    cancel() {
        this.resolveWith();
    }
}
