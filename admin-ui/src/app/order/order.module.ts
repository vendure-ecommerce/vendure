import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

import { SharedModule } from '../shared/shared.module';

import { CancelOrderDialogComponent } from './components/cancel-order-dialog/cancel-order-dialog.component';
import { FulfillOrderDialogComponent } from './components/fulfill-order-dialog/fulfill-order-dialog.component';
import { LineFulfillmentComponent } from './components/line-fulfillment/line-fulfillment.component';
import { LineRefundsComponent } from './components/line-refunds/line-refunds.component';
import { OrderDetailComponent } from './components/order-detail/order-detail.component';
import { OrderListComponent } from './components/order-list/order-list.component';
import { OrderPaymentDetailComponent } from './components/order-payment-detail/order-payment-detail.component';
import { PaymentStateLabelComponent } from './components/payment-state-label/payment-state-label.component';
import { RefundOrderDialogComponent } from './components/refund-order-dialog/refund-order-dialog.component';
import { RefundStateLabelComponent } from './components/refund-state-label/refund-state-label.component';
import { SettleRefundDialogComponent } from './components/settle-refund-dialog/settle-refund-dialog.component';
import { orderRoutes } from './order.routes';
import { OrderResolver } from './providers/routing/order-resolver';

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
        OrderPaymentDetailComponent,
        RefundStateLabelComponent,
        SettleRefundDialogComponent,
    ],
    entryComponents: [
        FulfillOrderDialogComponent,
        RefundOrderDialogComponent,
        CancelOrderDialogComponent,
        SettleRefundDialogComponent,
    ],
    providers: [OrderResolver],
})
export class OrderModule {}
