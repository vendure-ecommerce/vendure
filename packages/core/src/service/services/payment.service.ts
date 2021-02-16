import { Injectable } from '@nestjs/common';
import {
    ManualPaymentInput,
    RefundOrderInput,
    SettlePaymentResult,
} from '@vendure/common/lib/generated-types';
import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { summate } from '@vendure/common/lib/shared-utils';

import { RequestContext } from '../../api/common/request-context';
import { ErrorResultUnion } from '../../common/error/error-result';
import {
    PaymentStateTransitionError,
    RefundStateTransitionError,
    SettlePaymentError,
} from '../../common/error/generated-graphql-admin-errors';
import { IneligiblePaymentMethodError } from '../../common/error/generated-graphql-shop-errors';
import { PaymentMetadata } from '../../common/types/common-types';
import { OrderItem } from '../../entity/order-item/order-item.entity';
import { Order } from '../../entity/order/order.entity';
import { Payment } from '../../entity/payment/payment.entity';
import { Refund } from '../../entity/refund/refund.entity';
import { EventBus } from '../../event-bus/event-bus';
import { PaymentStateTransitionEvent } from '../../event-bus/events/payment-state-transition-event';
import { RefundStateTransitionEvent } from '../../event-bus/events/refund-state-transition-event';
import { PaymentState } from '../helpers/payment-state-machine/payment-state';
import { PaymentStateMachine } from '../helpers/payment-state-machine/payment-state-machine';
import { RefundStateMachine } from '../helpers/refund-state-machine/refund-state-machine';
import { TransactionalConnection } from '../transaction/transactional-connection';

import { PaymentMethodService } from './payment-method.service';

@Injectable()
export class PaymentService {
    constructor(
        private connection: TransactionalConnection,
        private paymentStateMachine: PaymentStateMachine,
        private refundStateMachine: RefundStateMachine,
        private paymentMethodService: PaymentMethodService,
        private eventBus: EventBus,
    ) {}

    async create(ctx: RequestContext, input: DeepPartial<Payment>): Promise<Payment> {
        const newPayment = new Payment({
            ...input,
            state: this.paymentStateMachine.getInitialState(),
        });
        return this.connection.getRepository(ctx, Payment).save(newPayment);
    }

    async findOneOrThrow(ctx: RequestContext, id: ID, relations: string[] = ['order']): Promise<Payment> {
        return await this.connection.getEntityOrThrow(ctx, Payment, id, {
            relations,
        });
    }

    async transitionToState(
        ctx: RequestContext,
        paymentId: ID,
        state: PaymentState,
    ): Promise<Payment | PaymentStateTransitionError> {
        if (state === 'Settled') {
            return this.settlePayment(ctx, paymentId);
        }
        const payment = await this.findOneOrThrow(ctx, paymentId);
        const fromState = payment.state;

        try {
            await this.paymentStateMachine.transition(ctx, payment.order, payment, state);
        } catch (e) {
            const transitionError = ctx.translate(e.message, { fromState, toState: state });
            return new PaymentStateTransitionError(transitionError, fromState, state);
        }
        await this.connection.getRepository(ctx, Payment).save(payment, { reload: false });
        this.eventBus.publish(new PaymentStateTransitionEvent(fromState, state, ctx, payment, payment.order));

        return payment;
    }

    getNextStates(payment: Payment): ReadonlyArray<PaymentState> {
        return this.paymentStateMachine.getNextStates(payment);
    }

    async createPayment(
        ctx: RequestContext,
        order: Order,
        amount: number,
        method: string,
        metadata: any,
    ): Promise<Payment | IneligiblePaymentMethodError> {
        const { paymentMethod, handler, checker } = await this.paymentMethodService.getMethodAndOperations(
            ctx,
            method,
        );
        if (paymentMethod.checker && checker) {
            const eligible = await checker.check(ctx, order, paymentMethod.checker.args);
            if (eligible === false || typeof eligible === 'string') {
                return new IneligiblePaymentMethodError(typeof eligible === 'string' ? eligible : undefined);
            }
        }
        const result = await handler.createPayment(
            ctx,
            order,
            amount,
            paymentMethod.handler.args,
            metadata || {},
        );
        const initialState = 'Created';
        const payment = await this.connection
            .getRepository(ctx, Payment)
            .save(new Payment({ ...result, method, state: initialState }));
        await this.paymentStateMachine.transition(ctx, order, payment, result.state);
        await this.connection.getRepository(ctx, Payment).save(payment, { reload: false });
        this.eventBus.publish(
            new PaymentStateTransitionEvent(initialState, result.state, ctx, payment, order),
        );
        return payment;
    }

    async settlePayment(ctx: RequestContext, paymentId: ID): Promise<PaymentStateTransitionError | Payment> {
        const payment = await this.connection.getEntityOrThrow(ctx, Payment, paymentId, {
            relations: ['order'],
        });
        const { paymentMethod, handler } = await this.paymentMethodService.getMethodAndOperations(
            ctx,
            payment.method,
        );
        const settlePaymentResult = await handler.settlePayment(
            ctx,
            payment.order,
            payment,
            paymentMethod.handler.args,
        );
        if (settlePaymentResult.success) {
            const fromState = payment.state;
            const toState = 'Settled';
            try {
                await this.paymentStateMachine.transition(ctx, payment.order, payment, toState);
            } catch (e) {
                const transitionError = ctx.translate(e.message, { fromState, toState });
                return new PaymentStateTransitionError(transitionError, fromState, toState);
            }
            payment.metadata = this.mergePaymentMetadata(payment.metadata, settlePaymentResult.metadata);
            await this.connection.getRepository(ctx, Payment).save(payment, { reload: false });
            this.eventBus.publish(
                new PaymentStateTransitionEvent(fromState, toState, ctx, payment, payment.order),
            );
        } else {
            payment.errorMessage = settlePaymentResult.errorMessage;
            payment.metadata = this.mergePaymentMetadata(payment.metadata, settlePaymentResult.metadata);
            await this.connection.getRepository(ctx, Payment).save(payment, { reload: false });
        }
        return payment;
    }
    /**
     * Creates a Payment from the manual payment mutation in the Admin API
     */
    async createManualPayment(ctx: RequestContext, order: Order, amount: number, input: ManualPaymentInput) {
        const initialState = 'Created';
        const endState = 'Settled';
        const payment = await this.connection.getRepository(ctx, Payment).save(
            new Payment({
                amount,
                order,
                transactionId: input.transactionId,
                metadata: input.metadata,
                method: input.method,
                state: initialState,
            }),
        );
        await this.paymentStateMachine.transition(ctx, order, payment, endState);
        await this.connection.getRepository(ctx, Payment).save(payment, { reload: false });
        this.eventBus.publish(new PaymentStateTransitionEvent(initialState, endState, ctx, payment, order));
        return payment;
    }

    async createRefund(
        ctx: RequestContext,
        input: RefundOrderInput,
        order: Order,
        items: OrderItem[],
        payment: Payment,
    ): Promise<Refund | RefundStateTransitionError> {
        const { paymentMethod, handler } = await this.paymentMethodService.getMethodAndOperations(
            ctx,
            payment.method,
        );
        const itemAmount = summate(items, 'proratedUnitPriceWithTax');
        const refundAmount = itemAmount + input.shipping + input.adjustment;
        let refund = new Refund({
            payment,
            orderItems: items,
            items: itemAmount,
            reason: input.reason,
            adjustment: input.adjustment,
            shipping: input.shipping,
            total: refundAmount,
            method: payment.method,
            state: 'Pending',
            metadata: {},
        });
        const createRefundResult = await handler.createRefund(
            ctx,
            input,
            refundAmount,
            order,
            payment,
            paymentMethod.handler.args,
        );
        if (createRefundResult) {
            refund.transactionId = createRefundResult.transactionId || '';
            refund.metadata = createRefundResult.metadata || {};
        }
        refund = await this.connection.getRepository(ctx, Refund).save(refund);
        if (createRefundResult) {
            const fromState = refund.state;
            try {
                await this.refundStateMachine.transition(ctx, order, refund, createRefundResult.state);
            } catch (e) {
                return new RefundStateTransitionError(e.message, fromState, createRefundResult.state);
            }
            await this.connection.getRepository(ctx, Refund).save(refund, { reload: false });
            this.eventBus.publish(
                new RefundStateTransitionEvent(fromState, createRefundResult.state, ctx, refund, order),
            );
        }
        return refund;
    }

    private mergePaymentMetadata(m1: PaymentMetadata, m2?: PaymentMetadata): PaymentMetadata {
        if (!m2) {
            return m1;
        }
        const merged = { ...m1, ...m2 };
        if (m1.public && m1.public) {
            merged.public = { ...m1.public, ...m2.public };
        }
        return merged;
    }
}
