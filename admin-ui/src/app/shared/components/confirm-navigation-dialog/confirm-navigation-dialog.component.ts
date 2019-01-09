import { ChangeDetectionStrategy, Component } from '@angular/core';

import { Dialog } from '../../providers/modal/modal.service';

@Component({
    selector: 'vdr-confirm-navigation-dialog',
    templateUrl: './confirm-navigation-dialog.component.html',
    styleUrls: ['./confirm-navigation-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmNavigationDialogComponent implements Dialog<boolean> {
    resolveWith: (result?: boolean) => void;

    confirm() {
        this.resolveWith(true);
    }

    cancel() {
        this.resolveWith(false);
    }
}
