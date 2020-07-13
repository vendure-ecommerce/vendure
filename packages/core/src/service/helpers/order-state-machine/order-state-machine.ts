import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { HistoryEntryType } from '@vendure/common/lib/generated-types';
import { Observable } from 'rxjs';
import { Connection } from 'typeorm';

import { RequestContext } from '../../../api/common/request-context';
import { IllegalOperationError } from '../../../common/error/errors';
import {
    FSM,
    StateMachineConfig,
    Transitions,
} from '../../../common/finite-state-machine/finite-state-machine';
import { mergeTransitionDefinitions } from '../../../common/finite-state-machine/merge-transition-definitions';
import { validateTransitionDefinition } from '../../../common/finite-state-machine/validate-transition-definition';
import { awaitPromiseOrObservable } from '../../../common/utils';
import { ConfigService } from '../../../config/config.service';
import { Order } from '../../../entity/order/order.entity';
import { HistoryService } from '../../services/history.service';
import { PromotionService } from '../../services/promotion.service';
import { StockMovementService } from '../../services/stock-movement.service';
import { getEntityOrThrow } from '../utils/get-entity-or-throw';
import {
    orderItemsAreAllCancelled,
    orderItemsAreFulfilled,
    orderItemsArePartiallyFulfilled,
    orderTotalIsCovered,
} from '../utils/order-utils';

import { OrderState, orderStateTransitions, OrderTransitionData } from './order-state';

@Injectable()
export class OrderStateMachine {
    readonly config: StateMachineConfig<OrderState, OrderTransitionData>;
    private readonly initialState: OrderState = 'AddingItems';

    constructor(
        @InjectConnection() private connection: Connection,
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

    getNextStates(order: Order): OrderState[] {
        const fsm = new FSM(this.config, order.state);
        return fsm.getNextStates();
    }

    async transition(ctx: RequestContext, order: Order, state: OrderState) {
        const fsm = new FSM(this.config, order.state);
        await fsm.transitionTo(state, { ctx, order });
        order.state = fsm.currentState;
    }

    /**
     * Specific business logic to be executed on Order state transitions.
     */
    private async onTransitionStart(fromState: OrderState, toState: OrderState, data: OrderTransitionData) {
        if (toState === 'ArrangingPayment') {
            if (data.order.lines.length === 0) {
                return `error.cannot-transition-to-payment-when-order-is-empty`;
            }
            if (!data.order.customer) {
                return `error.cannot-transition-to-payment-without-customer`;
            }
        }
        if (toState === 'PaymentAuthorized' && !orderTotalIsCovered(data.order, 'Authorized')) {
            return `error.cannot-transition-without-authorized-payments`;
        }
        if (toState === 'PaymentSettled' && !orderTotalIsCovered(data.order, 'Settled')) {
            return `error.cannot-transition-without-settled-payments`;
        }
        if (toState === 'Cancelled' && fromState !== 'AddingItems' && fromState !== 'ArrangingPayment') {
            if (!orderItemsAreAllCancelled(data.order)) {
                return `error.cannot-transition-unless-all-cancelled`;
            }
        }
        if (toState === 'PartiallyFulfilled') {
            const orderWithFulfillments = await getEntityOrThrow(this.connection, Order, data.order.id, {
                relations: ['lines', 'lines.items', 'lines.items.fulfillment'],
            });
            if (!orderItemsArePartiallyFulfilled(orderWithFulfillments)) {
                return `error.cannot-transition-unless-some-order-items-fulfilled`;
            }
        }
        if (toState === 'Fulfilled') {
            const orderWithFulfillments = await getEntityOrThrow(this.connection, Order, data.order.id, {
                relations: ['lines', 'lines.items', 'lines.items.fulfillment'],
            });
            if (!orderItemsAreFulfilled(orderWithFulfillments)) {
                return `error.cannot-transition-unless-all-order-items-fulfilled`;
            }
        }
    }

    /**
     * Specific business logic to be executed after Order state transition completes.
     */
    private async onTransitionEnd(fromState: OrderState, toState: OrderState, data: OrderTransitionData) {
        if (toState === 'PaymentAuthorized' || toState === 'PaymentSettled') {
            data.order.active = false;
            data.order.orderPlacedAt = new Date();
            await this.stockMovementService.createSalesForOrder(data.order);
            await this.promotionService.addPromotionsToOrder(data.order);
        }
        if (toState === 'Cancelled') {
            data.order.active = false;
        }
        await this.historyService.createHistoryEntryForOrder({
            orderId: data.order.id,
            type: HistoryEntryType.ORDER_STATE_TRANSITION,
            ctx: data.ctx,
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
                    if (typeof process.onError === 'function') {
                        await awaitPromiseOrObservable(process.onError(fromState, toState, message));
                    }
                }
                throw new IllegalOperationError(message || 'error.cannot-transition-order-from-to', {
                    fromState,
                    toState,
                });
            },
        };
    }
}
