import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@vendure/admin-ui/core';

import { CancelOrderDialogComponent } from './components/cancel-order-dialog/cancel-order-dialog.component';
import { FulfillOrderDialogComponent } from './components/fulfill-order-dialog/fulfill-order-dialog.component';
import { FulfillmentDetailComponent } from './components/fulfillment-detail/fulfillment-detail.component';
import { HistoryEntryDetailComponent } from './components/history-entry-detail/history-entry-detail.component';
import { LineFulfillmentComponent } from './components/line-fulfillment/line-fulfillment.component';
import { LineRefundsComponent } from './components/line-refunds/line-refunds.component';
import { OrderCustomFieldsCardComponent } from './components/order-custom-fields-card/order-custom-fields-card.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { OrderHistoryComponent } from './components/order-history/order-history.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { OrderPaymentCardComponent } from './components/order-payment-card/order-payment-card.component';
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
        HistoryEntryDetailComponent,
        SimpleItemListComponent,
        OrderCustomFieldsCardComponent,
    ],
})
export class OrderModule {}
