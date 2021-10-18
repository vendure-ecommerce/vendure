import { ChangeDetectionStrategy, Component } from '@angular/core';
import { Dialog, GetProductVariantOptions } from '@vendure/admin-ui/core';

@Component({
    selector: 'vdr-confirm-variant-deletion-dialog',
    templateUrl: './confirm-variant-deletion-dialog.component.html',
    styleUrls: ['./confirm-variant-deletion-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ConfirmVariantDeletionDialogComponent implements Dialog<boolean> {
    resolveWith: (result?: boolean) => void;
    variants: GetProductVariantOptions.Variants[] = [];

    confirm() {
        this.resolveWith(true);
    }

    cancel() {
        this.resolveWith();
    }
}
