import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { OrderDetail, OrderDetailFragment } from '@vendure/admin-ui/core';
import { unique } from '@vendure/common/lib/unique';

export type FulfillmentStatus = 'full' | 'partial' | 'none';

@Component({
    selector: 'vdr-line-fulfillment',
    templateUrl: './line-fulfillment.component.html',
    styleUrls: ['./line-fulfillment.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineFulfillmentComponent implements OnChanges {
    @Input() line: OrderDetail.Lines;
    @Input() orderState: string;
    fulfilledCount = 0;
    fulfillmentStatus: FulfillmentStatus;
    fulfillments: Array<{
        count: number;
        fulfillment: NonNullable<OrderDetailFragment['fulfillments']>[number];
    }> = [];

    ngOnChanges(changes: SimpleChanges): void {
        if (this.line) {
            this.fulfilledCount = this.getDeliveredCount(this.line);
            this.fulfillmentStatus = this.getFulfillmentStatus(this.fulfilledCount, this.line.items.length);
            this.fulfillments = this.getFulfillments(this.line);
        }
    }

    /**
     * Returns the number of items in an OrderLine which are fulfilled.
     */
    private getDeliveredCount(line: OrderDetail.Lines): number {
        return (
            line.fulfillments?.reduce(
                (sum, fulfillment) =>
                    sum + (fulfillment.summary.find(s => s.orderLine.id === line.id)?.quantity ?? 0),
                0,
            ) ?? 0
        );
    }

    private getFulfillmentStatus(fulfilledCount: number, lineQuantity: number): FulfillmentStatus {
        if (fulfilledCount === lineQuantity) {
            return 'full';
        }
        if (0 < fulfilledCount && fulfilledCount < lineQuantity) {
            return 'partial';
        }
        return 'none';
    }

    private getFulfillments(
        line: OrderDetail.Lines,
    ): Array<{ count: number; fulfillment: NonNullable<OrderDetailFragment['fulfillments']>[number] }> {
        return (
            line.fulfillments?.map(fulfillment => {
                const summaryLine = fulfillment.summary.find(s => s.orderLine.id === line.id);
                return {
                    count: summaryLine?.quantity ?? 0,
                    fulfillment,
                };
            }) ?? []
        );
    }
}
