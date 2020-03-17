import { ChangeDetectionStrategy, Component } from '@angular/core';

import { OrderDetail } from '@vendure/admin-ui/core';
import { Dialog } from '@vendure/admin-ui/core';

@Component({
    selector: 'vdr-settle-refund-dialog',
    templateUrl: './settle-refund-dialog.component.html',
    styleUrls: ['./settle-refund-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SettleRefundDialogComponent implements Dialog<string> {
    resolveWith: (result?: string) => void;
    transactionId = '';
    refund: OrderDetail.Refunds;

    submit() {
        this.resolveWith(this.transactionId);
    }

    cancel() {
        this.resolveWith();
    }
}
