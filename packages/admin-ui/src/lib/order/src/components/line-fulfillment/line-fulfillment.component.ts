import { ChangeDetectionStrategy, Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { OrderDetailFragment } from '@vendure/admin-ui/core';

export type FulfillmentStatus = 'full' | 'partial' | 'none';
type Fulfillment = NonNullable<OrderDetailFragment['fulfillments']>[number];

@Component({
    selector: 'vdr-line-fulfillment',
    templateUrl: './line-fulfillment.component.html',
    styleUrls: ['./line-fulfillment.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LineFulfillmentComponent implements OnChanges {
    @Input() line: OrderDetailFragment['lines'][number];
    @Input() orderState: string;
    fulfilledCount = 0;
    fulfillmentStatus: FulfillmentStatus;
    fulfillments: Array<{
        count: number;
        fulfillment: Fulfillment;
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
    private getDeliveredCount(line: OrderDetailFragment['lines'][number]): number {
        return line.items.reduce((sum, item) => sum + (item.fulfillment ? 1 : 0), 0);
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
        line: OrderDetailFragment['lines'][number],
    ): Array<{ count: number; fulfillment: Fulfillment }> {
        const counts: { [fulfillmentId: string]: number } = {};

        for (const item of line.items) {
            if (item.fulfillment) {
                if (counts[item.fulfillment.id] === undefined) {
                    counts[item.fulfillment.id] = 1;
                } else {
                    counts[item.fulfillment.id]++;
                }
            }
        }
        const all = line.items.reduce((fulfillments, item) => {
            return item.fulfillment ? [...fulfillments, item.fulfillment] : fulfillments;
        }, [] as Fulfillment[]);

        return Object.entries(counts).map(([id, count]) => {
            return {
                count,
                // tslint:disable-next-line:no-non-null-assertion
                fulfillment: all.find(f => f.id === id)!,
            };
        });
    }
}
