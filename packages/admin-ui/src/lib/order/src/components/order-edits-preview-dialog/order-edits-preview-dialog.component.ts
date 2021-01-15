import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CustomFieldConfig, Dialog, ModifyOrderInput, OrderDetail } from '@vendure/admin-ui/core';

export enum OrderEditResultType {
    Refund,
    Payment,
    PriceUnchanged,
    Cancel,
}

interface OrderEditsRefundResult {
    result: OrderEditResultType.Refund;
    refundPaymentId: string;
    refundNote?: string;
}
interface OrderEditsPaymentResult {
    result: OrderEditResultType.Payment;
}
interface OrderEditsPriceUnchangedResult {
    result: OrderEditResultType.PriceUnchanged;
}
interface OrderEditsCancelResult {
    result: OrderEditResultType.Cancel;
}
type OrderEditResult =
    | OrderEditsRefundResult
    | OrderEditsPaymentResult
    | OrderEditsPriceUnchangedResult
    | OrderEditsCancelResult;

@Component({
    selector: 'vdr-order-edits-preview-dialog',
    templateUrl: './order-edits-preview-dialog.component.html',
    styleUrls: ['./order-edits-preview-dialog.component.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderEditsPreviewDialogComponent implements OnInit, Dialog<OrderEditResult> {
    // Passed in via the modalService
    order: OrderDetail.Fragment;
    originalTotalWithTax: number;
    orderLineCustomFields: CustomFieldConfig[];
    modifyOrderInput: ModifyOrderInput;

    selectedPayment?: OrderDetail.Payments;
    refundNote: string;
    resolveWith: (result?: OrderEditResult) => void;

    get priceDifference(): number {
        return this.order.totalWithTax - this.originalTotalWithTax;
    }

    ngOnInit() {
        this.refundNote = this.modifyOrderInput.note || '';
    }

    cancel() {
        this.resolveWith({
            result: OrderEditResultType.Cancel,
        });
    }

    submit() {
        if (0 < this.priceDifference) {
            this.resolveWith({
                result: OrderEditResultType.Payment,
            });
        } else if (this.priceDifference < 0) {
            this.resolveWith({
                result: OrderEditResultType.Refund,
                // tslint:disable-next-line:no-non-null-assertion
                refundPaymentId: this.selectedPayment!.id,
                refundNote: this.refundNote,
            });
        } else {
            this.resolveWith({
                result: OrderEditResultType.PriceUnchanged,
            });
        }
    }
}
