import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { _ } from 'src/app/core/providers/i18n/mark-for-extraction';

import { CancelOrderInput, OrderWithLinesFragment } from '../../../common/generated-types';
import { I18nService } from '../../../core/providers/i18n/i18n.service';
import { Dialog } from '../../../shared/providers/modal/modal.service';

@Component({
    selector: 'vdr-cancel-order-dialog',
    templateUrl: './cancel-order-dialog.component.html',
    styleUrls: ['./cancel-order-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CancelOrderDialogComponent implements OnInit, Dialog<CancelOrderInput> {
    order: OrderWithLinesFragment;
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
        const lines = Object.entries(this.lineQuantities)
            .map(([orderLineId, quantity]) => ({
                orderLineId,
                quantity,
            }))
            .filter(l => 0 < l.quantity);
        this.resolveWith({
            lines,
            reason: this.reason,
        });
    }

    cancel() {
        this.resolveWith();
    }
}
