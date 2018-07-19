import { ChangeDetectionStrategy, Component } from '@angular/core';

import { GetProductOptionGroups_productOptionGroups } from '../../../data/types/gql-generated-types';
import { Dialog } from '../../../shared/providers/modal/modal.service';

export type ProductOptionGroup = GetProductOptionGroups_productOptionGroups;

@Component({
    selector: 'vdr-select-option-group-dialog',
    templateUrl: './select-option-group-dialog.component.html',
    styleUrls: ['./select-option-group-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SelectOptionGroupDialogComponent implements Dialog<ProductOptionGroup> {
    existingOptionGroupIds: string[];
    resolveWith: (result?: ProductOptionGroup) => void;

    selectGroup(group: ProductOptionGroup) {
        this.resolveWith(group);
    }

    cancel() {
        this.resolveWith();
    }
}
