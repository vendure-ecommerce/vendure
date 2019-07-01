import { ChangeDetectionStrategy, Component } from '@angular/core';

import { OrderWithLines } from '../../../common/generated-types';
import { Dialog } from '../../../shared/providers/modal/modal.service';

@Component({
    selector: 'vdr-settle-refund-dialog',
    templateUrl: './settle-refund-dialog.component.html',
    styleUrls: ['./settle-refund-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettleRefundDialogComponent implements Dialog<string> {
    resolveWith: (result?: string) => void;
    transactionId = '';
    refund: OrderWithLines.Refunds;

    submit() {
        this.resolveWith(this.transactionId);
    }

    cancel() {
        this.resolveWith();
    }
}
