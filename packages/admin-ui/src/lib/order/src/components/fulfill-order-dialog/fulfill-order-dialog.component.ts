import { ChangeDetectionStrategy, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import {
    configurableDefinitionToInstance,
    ConfigurableOperation,
    ConfigurableOperationDefinition,
    DataService,
    Dialog,
    FulfillOrderInput,
    GlobalFlag,
    OrderDetail,
    OrderDetailFragment,
    toConfigurableOperationInput,
} from '@vendure/admin-ui/core';

@Component({
    selector: 'vdr-fulfill-order-dialog',
    templateUrl: './fulfill-order-dialog.component.html',
    styleUrls: ['./fulfill-order-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FulfillOrderDialogComponent implements Dialog<FulfillOrderInput>, OnInit {
    resolveWith: (result?: FulfillOrderInput) => void;
    fulfillmentHandlerDef: ConfigurableOperationDefinition;
    fulfillmentHandler: ConfigurableOperation;
    fulfillmentHandlerControl = new FormControl();
    fulfillmentQuantities: { [lineId: string]: { fulfillCount: number; max: number } } = {};

    // Provided by modalService.fromComponent() call
    order: OrderDetailFragment;

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

        this.dataService.shippingMethod
            .getShippingMethodOperations()
            .mapSingle(data => data.fulfillmentHandlers)
            .subscribe(handlers => {
                this.fulfillmentHandlerDef =
                    handlers.find(h => h.code === this.order.shippingMethod?.fulfillmentHandlerCode) ||
                    handlers[0];
                this.fulfillmentHandler = configurableDefinitionToInstance(this.fulfillmentHandlerDef);
                this.fulfillmentHandlerControl.patchValue(this.fulfillmentHandler);
                this.changeDetector.markForCheck();
            });
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

    canSubmit(): boolean {
        const totalCount = Object.values(this.fulfillmentQuantities).reduce(
            (total, { fulfillCount }) => total + fulfillCount,
            0,
        );
        const formIsValid =
            this.fulfillmentHandlerDef?.args.length === 0 ||
            (this.fulfillmentHandlerControl.valid && this.fulfillmentHandlerControl.touched);
        return formIsValid && 0 < totalCount;
    }

    select() {
        const lines = Object.entries(this.fulfillmentQuantities).map(([orderLineId, { fulfillCount }]) => ({
            orderLineId,
            quantity: fulfillCount,
        }));
        this.resolveWith({
            lines,
            handler: toConfigurableOperationInput(
                this.fulfillmentHandler,
                this.fulfillmentHandlerControl.value,
            ),
        });
    }

    cancel() {
        this.resolveWith();
    }
}
