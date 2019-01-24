import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Dialog } from '../../../shared/providers/modal/modal.service';

@Component({
    selector: 'vdr-delete-facet-value-dialog',
    templateUrl: './delete-facet-value-dialog.component.html',
    styleUrls: ['./delete-facet-value-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DeleteFacetValueDialogComponent implements Dialog<boolean> {
    resolveWith: (result?: boolean) => void;
    message: string;

    confirm() {
        this.resolveWith(true);
    }

    cancel() {
        this.resolveWith();
    }
}
