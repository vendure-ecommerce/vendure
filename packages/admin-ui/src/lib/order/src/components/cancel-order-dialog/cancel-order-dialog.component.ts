import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { marker as _ } from '@biesbjerg/ngx-translate-extract-marker';
import { CancelOrderInput, Dialog, I18nService, OrderDetailFragment, OrderLineInput } from '@vendure/admin-ui/core';

@Component({
    selector: 'vdr-cancel-order-dialog',
    templateUrl: './cancel-order-dialog.component.html',
    styleUrls: ['./cancel-order-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CancelOrderDialogComponent implements OnInit, Dialog<CancelOrderInput> {
    order: OrderDetailFragment;
    resolveWith: (result?: CancelOrderInput) => void;
    reason: string;
    lineQuantities: { [lineId: string]: number } = {};
    reasons: string[] = [_('order.cancel-reason-customer-request'), _('order.cancel-reason-not-available')];

    get selectionCount(): number {
        return Object.values(this.lineQuantities).reduce((sum, n) => sum + n, 0);
    }

    constructor(private i18nService: I18nService) {
        this.reasons = this.reasons.map(r => this.i18nService.translate(r));
    }

    ngOnInit() {
        this.lineQuantities = this.order.lines.reduce((result, line) => {
            return { ...result, [line.id]: 0 };
        }, {});
    }

    select() {
        this.resolveWith({
            orderId: this.order.id,
            lines: this.getLineInputs(),
            reason: this.reason,
        });
    }

    cancel() {
        this.resolveWith();
    }

    private getLineInputs(): OrderLineInput[] | undefined {
        if (this.order.active) {
            return;
        }
        return Object.entries(this.lineQuantities)
            .map(([orderLineId, quantity]) => ({
                orderLineId,
                quantity,
            }))
            .filter(l => 0 < l.quantity);
    }
}
