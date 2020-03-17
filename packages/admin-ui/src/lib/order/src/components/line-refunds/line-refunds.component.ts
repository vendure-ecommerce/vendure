import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

import { OrderDetail } from '@vendure/admin-ui/core';

@Component({
    selector: 'vdr-line-refunds',
    templateUrl: './line-refunds.component.html',
    styleUrls: ['./line-refunds.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineRefundsComponent {
    @Input() line: OrderDetail.Lines;

    getRefundedCount(): number {
        return this.line.items.filter(i => i.refundId != null && !i.cancelled).length;
    }
}
