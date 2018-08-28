import { ChangeDetectionStrategy, Component } from '@angular/core';
import { GetProductOptionGroups_productOptionGroups, ProductOptionGroup } from 'shared/generated-types';

import { Dialog } from '../../../shared/providers/modal/modal.service';

@Component({
    selector: 'vdr-select-option-group-dialog',
    templateUrl: './select-option-group-dialog.component.html',
    styleUrls: ['./select-option-group-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectOptionGroupDialogComponent implements Dialog<ProductOptionGroup> {
    existingOptionGroups: Array<Partial<ProductOptionGroup>>;
    resolveWith: (result?: ProductOptionGroup) => void;

    selectGroup(group: ProductOptionGroup) {
        this.resolveWith(group);
    }

    cancel() {
        this.resolveWith();
    }
}
