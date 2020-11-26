import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import {
    DataService,
    Dialog,
    FulfillOrderInput,
    GlobalFlag,
    OrderDetail,
    OrderDetailFragment,
} from '@vendure/admin-ui/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
    selector: 'vdr-fulfill-order-dialog',
    templateUrl: './fulfill-order-dialog.component.html',
    styleUrls: ['./fulfill-order-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FulfillOrderDialogComponent implements Dialog<FulfillOrderInput>, OnInit {
    order: OrderDetailFragment;
    resolveWith: (result?: FulfillOrderInput) => void;
    method = '';
    trackingCode = '';
    fulfillmentQuantities: { [lineId: string]: { fulfillCount: number; max: number } } = {};

    constructor(private dataService: DataService, private changeDetector: ChangeDetectorRef) {}

    ngOnInit(): void {
        this.dataService.settings.getGlobalSettings().single$.subscribe(({ globalSettings }) => {
            this.fulfillmentQuantities = this.order.lines.reduce((result, line) => {
                const fulfillCount = this.getFulfillableCount(line, globalSettings.trackInventory);
                return {
                    ...result,
                    [line.id]: { fulfillCount, max: fulfillCount },
                };
            }, {});
            this.changeDetector.markForCheck();
        });

        if (this.order.shippingMethod) {
            this.method = this.order.shippingMethod.name;
        }
    }

    getFulfillableCount(line: OrderDetail.Lines, globalTrackInventory: boolean): number {
        const { trackInventory, stockOnHand } = line.productVariant;
        const effectiveTracInventory =
            trackInventory === GlobalFlag.INHERIT ? globalTrackInventory : trackInventory === GlobalFlag.TRUE;

        const unfulfilledCount = this.getUnfulfilledCount(line);
        return effectiveTracInventory ? Math.min(unfulfilledCount, stockOnHand) : unfulfilledCount;
    }

    getUnfulfilledCount(line: OrderDetail.Lines): number {
        const fulfilled = line.items.reduce((sum, item) => sum + (item.fulfillment ? 1 : 0), 0);
        return line.quantity - fulfilled;
    }

    select() {
        const lines = Object.entries(this.fulfillmentQuantities).map(([orderLineId, { fulfillCount }]) => ({
            orderLineId,
            quantity: fulfillCount,
        }));
        this.resolveWith({
            lines,
            handler: {
                code: 'foo',
                arguments: [],
            },
            // trackingCode: this.trackingCode,
            // method: this.method,
        });
    }

    cancel() {
        this.resolveWith();
    }
}
