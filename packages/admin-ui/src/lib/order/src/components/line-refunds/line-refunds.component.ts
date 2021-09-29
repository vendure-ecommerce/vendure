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
    @Input() payments: OrderDetail.Payments[];

    getRefundedCount(): number {
        const refunds =
            this.payments?.reduce(
                (all, payment) => [...all, ...payment.refunds],
                [] as OrderDetail.Refunds[],
            ) ?? [];
        return this.line.items.filter(i => {
            if (i.refundId === null && !i.cancelled) {
                return false;
            }
            if (i.refundId) {
                const refund = refunds.find(r => r.id === i.refundId);
                if (refund?.state === 'Failed') {
                    return false;
                } else {
                    return true;
                }
            }
            return false;
        }).length;
    }
}
