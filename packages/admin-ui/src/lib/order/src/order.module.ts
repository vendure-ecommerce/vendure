import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@vendure/admin-ui/core';

import { AddManualPaymentDialogComponent } from './components/add-manual-payment-dialog/add-manual-payment-dialog.component';
import { CancelOrderDialogComponent } from './components/cancel-order-dialog/cancel-order-dialog.component';
import { FulfillOrderDialogComponent } from './components/fulfill-order-dialog/fulfill-order-dialog.component';
import { FulfillmentCardComponent } from './components/fulfillment-card/fulfillment-card.component';
import { FulfillmentDetailComponent } from './components/fulfillment-detail/fulfillment-detail.component';
import { FulfillmentStateLabelComponent } from './components/fulfillment-state-label/fulfillment-state-label.component';
import { LineFulfillmentComponent } from './components/line-fulfillment/line-fulfillment.component';
import { LineRefundsComponent } from './components/line-refunds/line-refunds.component';
import { ModificationDetailComponent } from './components/modification-detail/modification-detail.component';
import { OrderCustomFieldsCardComponent } from './components/order-custom-fields-card/order-custom-fields-card.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { OrderEditorComponent } from './components/order-editor/order-editor.component';
import { OrderEditsPreviewDialogComponent } from './components/order-edits-preview-dialog/order-edits-preview-dialog.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { OrderPaymentCardComponent } from './components/order-payment-card/order-payment-card.component';
import { OrderProcessGraphDialogComponent } from './components/order-process-graph-dialog/order-process-graph-dialog.component';
import { OrderProcessEdgeComponent } from './components/order-process-graph/order-process-edge.component';
import { OrderProcessGraphComponent } from './components/order-process-graph/order-process-graph.component';
import { OrderProcessNodeComponent } from './components/order-process-graph/order-process-node.component';
import { OrderStateSelectDialogComponent } from './components/order-state-select-dialog/order-state-select-dialog.component';
import { OrderTableComponent } from './components/order-table/order-table.component';
import { PaymentDetailComponent } from './components/payment-detail/payment-detail.component';
import { PaymentStateLabelComponent } from './components/payment-state-label/payment-state-label.component';
import { RefundOrderDialogComponent } from './components/refund-order-dialog/refund-order-dialog.component';
import { RefundStateLabelComponent } from './components/refund-state-label/refund-state-label.component';
import { SettleRefundDialogComponent } from './components/settle-refund-dialog/settle-refund-dialog.component';
import { SimpleItemListComponent } from './components/simple-item-list/simple-item-list.component';
import { orderRoutes } from './order.routes';

@NgModule({
    imports: [SharedModule, RouterModule.forChild(orderRoutes)],
    declarations: [
        OrderListComponent,
        OrderDetailComponent,
        FulfillOrderDialogComponent,
        LineFulfillmentComponent,
        RefundOrderDialogComponent,
        CancelOrderDialogComponent,
        PaymentStateLabelComponent,
        LineRefundsComponent,
        OrderPaymentCardComponent,
        RefundStateLabelComponent,
        SettleRefundDialogComponent,
        OrderHistoryComponent,
        FulfillmentDetailComponent,
        PaymentDetailComponent,
        SimpleItemListComponent,
        OrderCustomFieldsCardComponent,
        OrderProcessGraphComponent,
        OrderProcessNodeComponent,
        OrderProcessEdgeComponent,
        OrderProcessGraphDialogComponent,
        FulfillmentStateLabelComponent,
        FulfillmentCardComponent,
        OrderEditorComponent,
        OrderTableComponent,
        OrderEditsPreviewDialogComponent,
        ModificationDetailComponent,
        AddManualPaymentDialogComponent,
        OrderStateSelectDialogComponent,
    ],
})
export class OrderModule {}
