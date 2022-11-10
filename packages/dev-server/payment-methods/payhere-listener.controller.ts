import { Controller, Get, Post } from '@nestjs/common';
import {
    Ctx,
    EventBus,
    isGraphQlErrorResult,
    Order,
    OrderService,
    Payment,
    PaymentStateTransitionEvent,
    PluginCommonModule,
    RequestContext,
    TransactionalConnection,
    VendurePlugin,
} from '@vendure/core';
import {
    OrderPaymentStateError,
    PaymentDeclinedError,
    PaymentFailedError,
} from '@vendure/core/dist/common/error/generated-graphql-shop-errors';
import { PaymentStateMachine } from '@vendure/core/dist/service/helpers/payment-state-machine/payment-state-machine';
import md5 from 'crypto-js/md5';
import { print } from 'graphql';

import { PAYHERE_SECRET } from './payhere-secret';
export class PayhereResponseDTO {
    merchant_id: string;
    order_id: string;
    payment_id: string;
    payhere_amount: string;
    custom_1: string;
    payhere_currency: string;
    status_code: string;
    md5sig: string;
    method: string;
    status_message: string;
}
@Controller('payhere')
export class PayhereController {
    constructor(
        private connection: TransactionalConnection,
        private paymentStateMachine: PaymentStateMachine,
        private orderService: OrderService,
        private eventBus: EventBus,
    ) {}
    @Get()
    async get() {
        return 'Hello World!';
    }
    @Post()
    async settlePayment(@Ctx() ctx: RequestContext) {
        const body = ctx.req?.body as PayhereResponseDTO;
        const {
            merchant_id,
            order_id,
            payment_id,
            custom_1,
            payhere_amount,
            payhere_currency,
            status_code,
            md5sig,
        } = body;
        const order = await this.orderService.getOrderOrThrow(ctx, custom_1);
        const localSig = md5(
            merchant_id +
                order_id +
                payhere_amount +
                payhere_currency +
                status_code +
                md5(PAYHERE_SECRET).toString().toUpperCase(),
        )
            .toString()
            .toUpperCase();

        if (!this.orderService.canAddPaymentToOrder(order)) {
            return new OrderPaymentStateError();
        }
        const result = {
            amount: Math.ceil(Number.parseFloat(payhere_amount) * 100),
            state: 'Created' as 'Created' | 'Cancelled' | 'Settled' | 'Authorized' | 'Declined' | 'Error',
            transactionId: payment_id,
            metadata: {
                public: {
                    payment_id,
                    currency: payhere_currency,
                },
                status_code,
                merchant_id,
            },
            method: 'payhere',
        };

        const payment = await this.connection.getRepository(ctx, Payment).save(new Payment(result as any));
        if (localSig === md5sig) {
            if (status_code === '2') {
                result.state = 'Settled';
                await this.paymentStateMachine.transition(ctx, order, payment, result.state);
            } else if (status_code === '0') {
                result.state = 'Authorized';
                await this.paymentStateMachine.transition(ctx, order, payment, result.state);
            } else if (status_code === '-1') {
                result.state = 'Cancelled';
                await this.paymentStateMachine.transition(ctx, order, payment, result.state);
            } else if (status_code === '-2') {
                result.state = 'Declined';
                await this.paymentStateMachine.transition(ctx, order, payment, result.state);
            } else {
                result.state = 'Error';
                await this.paymentStateMachine.transition(ctx, order, payment, result.state);
            }
        } else {
            result.state = 'Error';
            await this.paymentStateMachine.transition(ctx, order, payment, result.state);
        }
        await this.connection.getRepository(ctx, Payment).save(payment, { reload: false });
        this.eventBus.publish(new PaymentStateTransitionEvent('Created', result.state, ctx, payment, order));

        if (isGraphQlErrorResult(payment)) {
            return payment;
        }

        const existingPayments = await this.orderService.getOrderPayments(ctx, order.id);
        order.payments = [...existingPayments, payment];
        await this.connection.getRepository(ctx, Order).save(order, { reload: false });

        if (payment.state === 'Error') {
            return new PaymentFailedError(payment.errorMessage || '');
        }
        if (payment.state === 'Declined') {
            return new PaymentDeclinedError(payment.errorMessage || '');
        }
        if (order.state !== 'PaymentSettled') {
            return this.orderService.transitionToState(ctx, order.id, 'PaymentSettled');
        }
    }
}

@VendurePlugin({
    imports: [PluginCommonModule],
    controllers: [PayhereController],
})
export class RestPlugin {}
