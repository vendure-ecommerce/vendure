import { Injectable } from '@nestjs/common';
import { HistoryEntryType } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { unique } from '@vendure/common/lib/unique';

import { RequestContext } from '../../../api/common/request-context';
import { IllegalOperationError } from '../../../common/error/errors';
import { FSM } from '../../../common/finite-state-machine/finite-state-machine';
import { mergeTransitionDefinitions } from '../../../common/finite-state-machine/merge-transition-definitions';
import { StateMachineConfig, Transitions } from '../../../common/finite-state-machine/types';
import { validateTransitionDefinition } from '../../../common/finite-state-machine/validate-transition-definition';
import { awaitPromiseOrObservable } from '../../../common/utils';
import { ConfigService } from '../../../config/config.service';
import { OrderModification } from '../../../entity/order-modification/order-modification.entity';
import { Order } from '../../../entity/order/order.entity';
import { Payment } from '../../../entity/payment/payment.entity';
import { ProductVariant } from '../../../entity/product-variant/product-variant.entity';
import { HistoryService } from '../../services/history.service';
import { PromotionService } from '../../services/promotion.service';
import { StockMovementService } from '../../services/stock-movement.service';
import { TransactionalConnection } from '../../transaction/transactional-connection';
import {
    orderItemsAreAllCancelled,
    orderItemsAreDelivered,
    orderItemsArePartiallyDelivered,
    orderItemsArePartiallyShipped,
    orderItemsAreShipped,
    orderTotalIsCovered,
    totalCoveredByPayments,
} from '../utils/order-utils';

import { OrderState, orderStateTransitions, OrderTransitionData } from './order-state';

@Injectable()
export class OrderStateMachine {
    readonly config: StateMachineConfig<OrderState, OrderTransitionData>;
    private readonly initialState: OrderState = 'Created';

    constructor(
        private connection: TransactionalConnection,
        private configService: ConfigService,
        private stockMovementService: StockMovementService,
        private historyService: HistoryService,
        private promotionService: PromotionService,
    ) {
        this.config = this.initConfig();
    }

    getInitialState(): OrderState {
        return this.initialState;
    }

    canTransition(currentState: OrderState, newState: OrderState): boolean {
        return new FSM(this.config, currentState).canTransitionTo(newState);
    }

    getNextStates(order: Order): ReadonlyArray<OrderState> {
        const fsm = new FSM(this.config, order.state);
        return fsm.getNextStates();
    }

    async transition(ctx: RequestContext, order: Order, state: OrderState) {
        const fsm = new FSM(this.config, order.state);
        await fsm.transitionTo(state, { ctx, order });
        order.state = fsm.currentState;
    }

    private async findOrderWithFulfillments(ctx: RequestContext, id: ID): Promise<Order> {
        return await this.connection.getEntityOrThrow(ctx, Order, id, {
            relations: ['lines', 'lines.items', 'lines.items.fulfillments'],
        });
    }

    /**
     * Specific business logic to be executed on Order state transitions.
     */
    private async onTransitionStart(fromState: OrderState, toState: OrderState, data: OrderTransitionData) {
        if (fromState === 'Modifying') {
            const modifications = await this.connection
                .getRepository(data.ctx, OrderModification)
                .find({ where: { order: data.order }, relations: ['refund', 'payment'] });
            if (toState === 'ArrangingAdditionalPayment') {
                if (0 < modifications.length && modifications.every(modification => modification.isSettled)) {
                    return `message.cannot-transition-no-additional-payments-needed`;
                }
            } else {
                if (modifications.some(modification => !modification.isSettled)) {
                    return `message.cannot-transition-without-modification-payment`;
                }
            }
        }
        if (fromState === 'ArrangingAdditionalPayment') {
            const existingPayments = await this.connection.getRepository(data.ctx, Payment).find({
                relations: ['refunds'],
                where: {
                    order: { id: data.order.id },
                },
            });
            data.order.payments = existingPayments;
            const deficit = data.order.totalWithTax - totalCoveredByPayments(data.order);
            if (0 < deficit) {
                return `message.cannot-transition-from-arranging-additional-payment`;
            }
        }
        if (fromState === 'AddingItems') {
            const variantIds = unique(data.order.lines.map(l => l.productVariant.id));
            const qb = this.connection
                .getRepository(data.ctx, ProductVariant)
                .createQueryBuilder('variant')
                .leftJoin('variant.product', 'product')
                .where('variant.deletedAt IS NULL')
                .andWhere('product.deletedAt IS NULL')
                .andWhere('variant.id IN (:...variantIds)', { variantIds });
            const availableVariants = await qb.getMany();
            if (availableVariants.length !== variantIds.length) {
                return `message.cannot-transition-order-contains-products-which-are-unavailable`;
            }
        }
        if (toState === 'ArrangingPayment') {
            if (data.order.lines.length === 0) {
                return `message.cannot-transition-to-payment-when-order-is-empty`;
            }
            if (!data.order.customer) {
                return `message.cannot-transition-to-payment-without-customer`;
            }
        }
        if (toState === 'PaymentAuthorized') {
            const hasAnAuthorizedPayment = !!data.order.payments.find(p => p.state === 'Authorized');
            if (!orderTotalIsCovered(data.order, ['Authorized', 'Settled']) || !hasAnAuthorizedPayment) {
                return `message.cannot-transition-without-authorized-payments`;
            }
        }
        if (toState === 'PaymentSettled' && !orderTotalIsCovered(data.order, 'Settled')) {
            return `message.cannot-transition-without-settled-payments`;
        }
        if (toState === 'Cancelled' && fromState !== 'AddingItems' && fromState !== 'ArrangingPayment') {
            if (!orderItemsAreAllCancelled(data.order)) {
                return `message.cannot-transition-unless-all-cancelled`;
            }
        }
        if (toState === 'PartiallyShipped') {
            const orderWithFulfillments = await this.findOrderWithFulfillments(data.ctx, data.order.id);
            if (!orderItemsArePartiallyShipped(orderWithFulfillments)) {
                return `message.cannot-transition-unless-some-order-items-shipped`;
            }
        }
        if (toState === 'Shipped') {
            const orderWithFulfillments = await this.findOrderWithFulfillments(data.ctx, data.order.id);
            if (!orderItemsAreShipped(orderWithFulfillments)) {
                return `message.cannot-transition-unless-all-order-items-shipped`;
            }
        }
        if (toState === 'PartiallyDelivered') {
            const orderWithFulfillments = await this.findOrderWithFulfillments(data.ctx, data.order.id);
            if (!orderItemsArePartiallyDelivered(orderWithFulfillments)) {
                return `message.cannot-transition-unless-some-order-items-delivered`;
            }
        }
        if (toState === 'Delivered') {
            const orderWithFulfillments = await this.findOrderWithFulfillments(data.ctx, data.order.id);
            if (!orderItemsAreDelivered(orderWithFulfillments)) {
                return `message.cannot-transition-unless-all-order-items-delivered`;
            }
        }
    }

    /**
     * Specific business logic to be executed after Order state transition completes.
     */
    private async onTransitionEnd(fromState: OrderState, toState: OrderState, data: OrderTransitionData) {
        const { ctx, order } = data;
        const { stockAllocationStrategy, orderPlacedStrategy } = this.configService.orderOptions;
        if (order.active) {
            const shouldSetAsPlaced = orderPlacedStrategy.shouldSetAsPlaced(ctx, fromState, toState, order);
            if (shouldSetAsPlaced) {
                order.active = false;
                order.orderPlacedAt = new Date();
                await this.promotionService.addPromotionsToOrder(ctx, order);
            }
        }
        const shouldAllocateStock = await stockAllocationStrategy.shouldAllocateStock(
            ctx,
            fromState,
            toState,
            order,
        );
        if (shouldAllocateStock) {
            await this.stockMovementService.createAllocationsForOrder(ctx, order);
        }
        if (toState === 'Cancelled') {
            order.active = false;
        }
        await this.historyService.createHistoryEntryForOrder({
            orderId: order.id,
            type: HistoryEntryType.ORDER_STATE_TRANSITION,
            ctx,
            data: {
                from: fromState,
                to: toState,
            },
        });
    }

    private initConfig(): StateMachineConfig<OrderState, OrderTransitionData> {
        const customProcesses = this.configService.orderOptions.process ?? [];

        const allTransitions = customProcesses.reduce(
            (transitions, process) =>
                mergeTransitionDefinitions(transitions, process.transitions as Transitions<any>),
            orderStateTransitions,
        );

        const validationResult = validateTransitionDefinition(allTransitions, 'AddingItems');

        return {
            transitions: allTransitions,
            onTransitionStart: async (fromState, toState, data) => {
                for (const process of customProcesses) {
                    if (typeof process.onTransitionStart === 'function') {
                        const result = await awaitPromiseOrObservable(
                            process.onTransitionStart(fromState, toState, data),
                        );
                        if (result === false || typeof result === 'string') {
                            return result;
                        }
                    }
                }
                return this.onTransitionStart(fromState, toState, data);
            },
            onTransitionEnd: async (fromState, toState, data) => {
                for (const process of customProcesses) {
                    if (typeof process.onTransitionEnd === 'function') {
                        await awaitPromiseOrObservable(process.onTransitionEnd(fromState, toState, data));
                    }
                }
                await this.onTransitionEnd(fromState, toState, data);
            },
            onError: async (fromState, toState, message) => {
                for (const process of customProcesses) {
                    if (typeof process.onTransitionError === 'function') {
                        await awaitPromiseOrObservable(
                            process.onTransitionError(fromState, toState, message),
                        );
                    }
                }
                throw new IllegalOperationError(message || 'message.cannot-transition-order-from-to', {
                    fromState,
                    toState,
                });
            },
        };
    }
}
