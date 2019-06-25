import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';

import { CreateFulfillmentInput, OrderWithLinesFragment } from '../../../common/generated-types';
import { Dialog } from '../../../shared/providers/modal/modal.service';

@Component({
    selector: 'vdr-fulfill-order-dialog',
    templateUrl: './fulfill-order-dialog.component.html',
    styleUrls: ['./fulfill-order-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FulfillOrderDialogComponent implements Dialog<CreateFulfillmentInput>, OnInit {
    order: OrderWithLinesFragment;
    resolveWith: (result?: CreateFulfillmentInput) => void;
    method = '';
    trackingCode = '';
    fulfillmentQuantities: { [lineId: string]: number } = {};

    ngOnInit(): void {
        this.fulfillmentQuantities = this.order.lines.reduce((result, line) => {
            return {
                ...result,
                [line.id]: line.quantity,
            };
        }, {});
        if (this.order.shippingMethod) {
            this.method = this.order.shippingMethod.description;
        }
    }

    select() {
        const lines = Object.entries(this.fulfillmentQuantities).map(([orderLineId, quantity]) => ({
            orderLineId,
            quantity,
        }));
        this.resolveWith({
            lines,
            trackingCode: this.trackingCode,
            method: this.method,
        });
    }

    cancel() {
        this.resolveWith();
    }
}
