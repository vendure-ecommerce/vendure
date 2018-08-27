import { ChangeDetectionStrategy, Component } from '@angular/core';

import { FacetValue, ProductOptionGroup } from '../../../data/types/gql-generated-types';
import { Dialog } from '../../../shared/providers/modal/modal.service';

@Component({
    selector: 'vdr-apply-facet-dialog',
    templateUrl: './apply-facet-dialog.component.html',
    styleUrls: ['./apply-facet-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ApplyFacetDialogComponent implements Dialog<FacetValue[]> {
    existingOptionGroups: Array<Partial<ProductOptionGroup>>;
    resolveWith: (result?: FacetValue[]) => void;
    selectedValues: FacetValue[] = [];

    selectValues() {
        this.resolveWith(this.selectedValues);
    }

    cancel() {
        this.resolveWith();
    }
}
