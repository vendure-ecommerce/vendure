import { Injectable } from '@nestjs/common';
import {
    CancelPaymentResult,
    ManualPaymentInput,
    RefundOrderInput,
    SettlePaymentResult,
} from '@vendure/common/lib/generated-types';
import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { summate } from '@vendure/common/lib/shared-utils';

import { RequestContext } from '../../api/common/request-context';
import { ErrorResultUnion } from '../../common/error/error-result';
import { InternalServerError } from '../../common/error/errors';
import {
    PaymentStateTransitionError,
    RefundStateTransitionError,
    SettlePaymentError,
} from '../../common/error/generated-graphql-admin-errors';
import { IneligiblePaymentMethodError } from '../../common/error/generated-graphql-shop-errors';
import { PaymentMetadata } from '../../common/types/common-types';
import { idsAreEqual } from '../../common/utils';
import { TransactionalConnection } from '../../connection/transactional-connection';
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

import { PaymentMethodService } from './payment-method.service';

/**
 * @description
 * Contains methods relating to {@link Payment} entities.
 *
 * @docsCategory services
 */
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

    /**
     * @description
     * Transitions a Payment to the given state.
     *
     * When updating a Payment in the context of an Order, it is
     * preferable to use the {@link OrderService} `transitionPaymentToState()` method, which will also handle
     * updating the Order state too.
     */
    async transitionToState(
        ctx: RequestContext,
        paymentId: ID,
        state: PaymentState,
    ): Promise<Payment | PaymentStateTransitionError> {
        if (state === 'Settled') {
            return this.settlePayment(ctx, paymentId);
        }
        if (state === 'Cancelled') {
            return this.cancelPayment(ctx, paymentId);
        }
        const payment = await this.findOneOrThrow(ctx, paymentId);
        const fromState = payment.state;
        return this.transitionStateAndSave(ctx, payment, fromState, state);
    }

    getNextStates(payment: Payment): ReadonlyArray<PaymentState> {
        return this.paymentStateMachine.getNextStates(payment);
    }

    /**
     * @description
     * Creates a new Payment.
     *
     * When creating a Payment in the context of an Order, it is
     * preferable to use the {@link OrderService} `addPaymentToOrder()` method, which will also handle
     * updating the Order state too.
     */
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
            const eligible = await checker.check(ctx, order, paymentMethod.checker.args, paymentMethod);
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
            paymentMethod,
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

    /**
     * @description
     * Settles a Payment.
     *
     * When settling a Payment in the context of an Order, it is
     * preferable to use the {@link OrderService} `settlePayment()` method, which will also handle
     * updating the Order state too.
     */
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
            paymentMethod,
        );
        const fromState = payment.state;
        let toState: PaymentState;
        payment.metadata = this.mergePaymentMetadata(payment.metadata, settlePaymentResult.metadata);
        if (settlePaymentResult.success) {
            toState = 'Settled';
        } else {
            toState = settlePaymentResult.state || 'Error';
            payment.errorMessage = settlePaymentResult.errorMessage;
        }
        return this.transitionStateAndSave(ctx, payment, fromState, toState);
    }

    async cancelPayment(ctx: RequestContext, paymentId: ID): Promise<PaymentStateTransitionError | Payment> {
        const payment = await this.connection.getEntityOrThrow(ctx, Payment, paymentId, {
            relations: ['order'],
        });
        const { paymentMethod, handler } = await this.paymentMethodService.getMethodAndOperations(
            ctx,
            payment.method,
        );
        const cancelPaymentResult = await handler.cancelPayment(
            ctx,
            payment.order,
            payment,
            paymentMethod.handler.args,
            paymentMethod,
        );
        const fromState = payment.state;
        let toState: PaymentState;
        payment.metadata = this.mergePaymentMetadata(payment.metadata, cancelPaymentResult?.metadata);
        if (cancelPaymentResult == null || cancelPaymentResult.success) {
            toState = 'Cancelled';
        } else {
            toState = cancelPaymentResult.state || 'Error';
            payment.errorMessage = cancelPaymentResult.errorMessage;
        }
        return this.transitionStateAndSave(ctx, payment, fromState, toState);
    }

    private async transitionStateAndSave(
        ctx: RequestContext,
        payment: Payment,
        fromState: PaymentState,
        toState: PaymentState,
    ) {
        if (fromState === toState) {
            // in case metadata was changed
            await this.connection.getRepository(ctx, Payment).save(payment, { reload: false });
            return payment;
        }
        try {
            await this.paymentStateMachine.transition(ctx, payment.order, payment, toState);
        } catch (e) {
            const transitionError = ctx.translate(e.message, { fromState, toState });
            return new PaymentStateTransitionError(transitionError, fromState, toState);
        }
        await this.connection.getRepository(ctx, Payment).save(payment, { reload: false });
        this.eventBus.publish(
            new PaymentStateTransitionEvent(fromState, toState, ctx, payment, payment.order),
        );
        return payment;
    }

    /**
     * @description
     * Creates a Payment from the manual payment mutation in the Admin API
     *
     * When creating a manual Payment in the context of an Order, it is
     * preferable to use the {@link OrderService} `addManualPaymentToOrder()` method, which will also handle
     * updating the Order state too.
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

    /**
     * @description
     * Creates a Refund against the specified Payment. If the amount to be refunded exceeds the value of the
     * specified Payment (in the case of multiple payments on a single Order), then the remaining outstanding
     * refund amount will be refunded against the next available Payment from the Order.
     *
     * When creating a Refund in the context of an Order, it is
     * preferable to use the {@link OrderService} `refundOrder()` method, which performs additional
     * validation.
     */
    async createRefund(
        ctx: RequestContext,
        input: RefundOrderInput,
        order: Order,
        items: OrderItem[],
        selectedPayment: Payment,
    ): Promise<Refund | RefundStateTransitionError> {
        const orderWithRefunds = await this.connection.getEntityOrThrow(ctx, Order, order.id, {
            relations: ['payments', 'payments.refunds'],
        });

        function paymentRefundTotal(payment: Payment): number {
            const nonFailedRefunds = payment.refunds?.filter(refund => refund.state !== 'Failed') ?? [];
            return summate(nonFailedRefunds, 'total');
        }

        const existingNonFailedRefunds =
            orderWithRefunds.payments
                ?.reduce((refunds, p) => [...refunds, ...p.refunds], [] as Refund[])
                .filter(refund => refund.state !== 'Failed') ?? [];
        const refundablePayments = orderWithRefunds.payments.filter(p => {
            return paymentRefundTotal(p) < p.amount;
        });
        const itemAmount = summate(items, 'proratedUnitPriceWithTax');
        let primaryRefund: Refund | undefined;
        const refundedPaymentIds: ID[] = [];
        const refundTotal = itemAmount + input.shipping + input.adjustment;
        const refundMax =
            orderWithRefunds.payments
                ?.map(p => p.amount - paymentRefundTotal(p))
                .reduce((sum, amount) => sum + amount, 0) ?? 0;
        let refundOutstanding = Math.min(refundTotal, refundMax);
        do {
            const paymentToRefund =
                (refundedPaymentIds.length === 0 &&
                    refundablePayments.find(p => idsAreEqual(p.id, selectedPayment.id))) ||
                refundablePayments.find(p => !refundedPaymentIds.includes(p.id)) ||
                refundablePayments[0];
            if (!paymentToRefund) {
                throw new InternalServerError(`Could not find a Payment to refund`);
            }
            const amountNotRefunded = paymentToRefund.amount - paymentRefundTotal(paymentToRefund);
            const total = Math.min(amountNotRefunded, refundOutstanding);
            let refund = new Refund({
                payment: paymentToRefund,
                total,
                orderItems: items,
                items: itemAmount,
                reason: input.reason,
                adjustment: input.adjustment,
                shipping: input.shipping,
                method: selectedPayment.method,
                state: 'Pending',
                metadata: {},
            });
            const { paymentMethod, handler } = await this.paymentMethodService.getMethodAndOperations(
                ctx,
                paymentToRefund.method,
            );
            const createRefundResult = await handler.createRefund(
                ctx,
                input,
                total,
                order,
                paymentToRefund,
                paymentMethod.handler.args,
                paymentMethod,
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
            if (primaryRefund == null) {
                primaryRefund = refund;
            }
            existingNonFailedRefunds.push(refund);
            refundedPaymentIds.push(paymentToRefund.id);
            refundOutstanding = refundTotal - summate(existingNonFailedRefunds, 'total');
        } while (0 < refundOutstanding);
        // tslint:disable-next-line:no-non-null-assertion
        return primaryRefund!;
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
