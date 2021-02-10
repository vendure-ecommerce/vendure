import { Injectable } from '@nestjs/common';
import { PaymentMethodQuote } from '@vendure/common/lib/generated-shop-types';
import {
    ConfigurableOperationDefinition,
    CreatePaymentMethodInput,
    ManualPaymentInput,
    RefundOrderInput,
    UpdatePaymentMethodInput,
} from '@vendure/common/lib/generated-types';
import { omit } from '@vendure/common/lib/omit';
import { ID, PaginatedList } from '@vendure/common/lib/shared-types';
import { summate } from '@vendure/common/lib/shared-utils';

import { RequestContext } from '../../api/common/request-context';
import { UserInputError } from '../../common/error/errors';
import { RefundStateTransitionError } from '../../common/error/generated-graphql-admin-errors';
import { IneligiblePaymentMethodError } from '../../common/error/generated-graphql-shop-errors';
import { ListQueryOptions } from '../../common/types/common-types';
import { ConfigService } from '../../config/config.service';
import { PaymentMethodEligibilityChecker } from '../../config/payment-method/payment-method-eligibility-checker';
import { PaymentMethodHandler } from '../../config/payment-method/payment-method-handler';
import { OrderItem } from '../../entity/order-item/order-item.entity';
import { Order } from '../../entity/order/order.entity';
import { PaymentMethod } from '../../entity/payment-method/payment-method.entity';
import { Payment } from '../../entity/payment/payment.entity';
import { Refund } from '../../entity/refund/refund.entity';
import { EventBus } from '../../event-bus/event-bus';
import { PaymentStateTransitionEvent } from '../../event-bus/events/payment-state-transition-event';
import { RefundStateTransitionEvent } from '../../event-bus/events/refund-state-transition-event';
import { ConfigArgService } from '../helpers/config-arg/config-arg.service';
import { ListQueryBuilder } from '../helpers/list-query-builder/list-query-builder';
import { PaymentStateMachine } from '../helpers/payment-state-machine/payment-state-machine';
import { RefundStateMachine } from '../helpers/refund-state-machine/refund-state-machine';
import { patchEntity } from '../helpers/utils/patch-entity';
import { TransactionalConnection } from '../transaction/transactional-connection';

@Injectable()
export class PaymentMethodService {
    constructor(
        private connection: TransactionalConnection,
        private configService: ConfigService,
        private listQueryBuilder: ListQueryBuilder,
        private paymentStateMachine: PaymentStateMachine,
        private refundStateMachine: RefundStateMachine,
        private eventBus: EventBus,
        private configArgService: ConfigArgService,
    ) {}

    findAll(
        ctx: RequestContext,
        options?: ListQueryOptions<PaymentMethod>,
    ): Promise<PaginatedList<PaymentMethod>> {
        return this.listQueryBuilder
            .build(PaymentMethod, options, { ctx })
            .getManyAndCount()
            .then(([items, totalItems]) => ({
                items,
                totalItems,
            }));
    }

    findOne(ctx: RequestContext, paymentMethodId: ID): Promise<PaymentMethod | undefined> {
        return this.connection.getRepository(ctx, PaymentMethod).findOne(paymentMethodId);
    }

    async create(ctx: RequestContext, input: CreatePaymentMethodInput): Promise<PaymentMethod> {
        const paymentMethod = new PaymentMethod(input);
        paymentMethod.handler = this.configArgService.parseInput('PaymentMethodHandler', input.handler);
        if (input.checker) {
            paymentMethod.checker = this.configArgService.parseInput(
                'PaymentMethodEligibilityChecker',
                input.checker,
            );
        }
        return this.connection.getRepository(ctx, PaymentMethod).save(paymentMethod);
    }

    async update(ctx: RequestContext, input: UpdatePaymentMethodInput): Promise<PaymentMethod> {
        const paymentMethod = await this.connection.getEntityOrThrow(ctx, PaymentMethod, input.id);
        const updatedPaymentMethod = patchEntity(paymentMethod, omit(input, ['handler', 'checker']));
        if (input.checker) {
            paymentMethod.checker = this.configArgService.parseInput(
                'PaymentMethodEligibilityChecker',
                input.checker,
            );
        }
        if (input.checker === null) {
            paymentMethod.checker = null;
        }
        if (input.handler) {
            paymentMethod.handler = this.configArgService.parseInput('PaymentMethodHandler', input.handler);
        }
        return this.connection.getRepository(ctx, PaymentMethod).save(updatedPaymentMethod);
    }

    getPaymentMethodEligibilityCheckers(ctx: RequestContext): ConfigurableOperationDefinition[] {
        return this.configArgService
            .getDefinitions('PaymentMethodEligibilityChecker')
            .map(x => x.toGraphQlType(ctx));
    }

    getPaymentMethodHandlers(ctx: RequestContext): ConfigurableOperationDefinition[] {
        return this.configArgService.getDefinitions('PaymentMethodHandler').map(x => x.toGraphQlType(ctx));
    }

    async getEligiblePaymentMethods(ctx: RequestContext, order: Order): Promise<PaymentMethodQuote[]> {
        const paymentMethods = await this.connection
            .getRepository(ctx, PaymentMethod)
            .find({ where: { enabled: true } });
        const results: PaymentMethodQuote[] = [];
        for (const method of paymentMethods) {
            let isEligible = true;
            let eligibilityMessage: string | undefined;
            if (method.checker) {
                const checker = this.configArgService.getByCode(
                    'PaymentMethodEligibilityChecker',
                    method.checker.code,
                );
                const eligible = await checker.check(ctx, order, method.checker.args);
                if (eligible === false || typeof eligible === 'string') {
                    isEligible = false;
                    eligibilityMessage = typeof eligible === 'string' ? eligible : undefined;
                }
            }
            results.push({
                id: method.id,
                code: method.code,
                isEligible,
                eligibilityMessage,
            });
        }
        return results;
    }

    async createPayment(
        ctx: RequestContext,
        order: Order,
        amount: number,
        method: string,
        metadata: any,
    ): Promise<Payment | IneligiblePaymentMethodError> {
        const { paymentMethod, handler, checker } = await this.getMethodAndOperations(ctx, method);
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

    async settlePayment(ctx: RequestContext, payment: Payment, order: Order) {
        const { paymentMethod, handler } = await this.getMethodAndOperations(ctx, payment.method);
        return handler.settlePayment(ctx, order, payment, paymentMethod.handler.args);
    }

    async createRefund(
        ctx: RequestContext,
        input: RefundOrderInput,
        order: Order,
        items: OrderItem[],
        payment: Payment,
    ): Promise<Refund | RefundStateTransitionError> {
        const { paymentMethod, handler } = await this.getMethodAndOperations(ctx, payment.method);
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

    private async getMethodAndOperations(
        ctx: RequestContext,
        method: string,
    ): Promise<{
        paymentMethod: PaymentMethod;
        handler: PaymentMethodHandler;
        checker: PaymentMethodEligibilityChecker | null;
    }> {
        const paymentMethod = await this.connection.getRepository(ctx, PaymentMethod).findOne({
            where: {
                code: method,
                enabled: true,
            },
        });
        if (!paymentMethod) {
            throw new UserInputError(`error.payment-method-not-found`, { method });
        }
        const handler = this.configArgService.getByCode('PaymentMethodHandler', paymentMethod.handler.code);
        const checker =
            paymentMethod.checker &&
            this.configArgService.getByCode('PaymentMethodEligibilityChecker', paymentMethod.checker.code);
        return { paymentMethod, handler, checker };
    }
}
