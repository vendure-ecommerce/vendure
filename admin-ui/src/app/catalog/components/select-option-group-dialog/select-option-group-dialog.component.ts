import { ChangeDetectionStrategy, Component } from '@angular/core';
import { ProductOptionGroup } from 'shared/generated-types';

import { Dialog } from '../../../shared/providers/modal/modal.service';

@Component({
    selector: 'vdr-select-option-group-dialog',
    templateUrl: './select-option-group-dialog.component.html',
    styleUrls: ['./select-option-group-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectOptionGroupDialogComponent implements Dialog<ProductOptionGroup.Fragment> {
    existingOptionGroups: Array<Partial<ProductOptionGroup.Fragment>>;
    resolveWith: (result?: ProductOptionGroup.Fragment) => void;

    selectGroup(group: ProductOptionGroup.Fragment) {
        this.resolveWith(group);
    }

    cancel() {
        this.resolveWith();
    }
}
