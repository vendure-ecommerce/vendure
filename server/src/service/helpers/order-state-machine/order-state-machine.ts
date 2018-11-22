import { Injectable } from '@nestjs/common';

import { RequestContext } from '../../../api/common/request-context';
import { IllegalOperationError } from '../../../common/error/errors';
import { FSM, StateMachineConfig, Transitions } from '../../../common/finite-state-machine';
import { ConfigService } from '../../../config/config.service';
import { Order } from '../../../entity/order/order.entity';
import { EventBus } from '../../../event-bus/event-bus';
import { OrderStateTransitionEvent } from '../../../event-bus/events/order-state-transition-event';

import { OrderState, orderStateTransitions, OrderTransitionData } from './order-state';

@Injectable()
export class OrderStateMachine {
    private readonly config: StateMachineConfig<OrderState, OrderTransitionData>;
    private readonly initialState: OrderState = 'AddingItems';

    constructor(private configService: ConfigService, private eventBus: EventBus) {
        this.config = this.initConfig();
    }

    getInitialState(): OrderState {
        return this.initialState;
    }

    getNextStates(order: Order): OrderState[] {
        const fsm = new FSM(this.config, order.state);
        return fsm.getNextStates();
    }

    async transition(ctx: RequestContext, order: Order, state: OrderState) {
        const fsm = new FSM(this.config, order.state);
        await fsm.transitionTo(state, { ctx, order });
        order.state = state;
    }

    /**
     * Specific business logic to be executed on Order state transitions.
     */
    private onTransitionStart(fromState: OrderState, toState: OrderState, data: OrderTransitionData) {
        if (toState === 'ArrangingPayment') {
            if (data.order.lines.length === 0) {
                return `error.cannot-transition-to-payment-when-order-is-empty`;
            }
            if (!data.order.customer) {
                return `error.cannot-transition-to-payment-without-customer`;
            }
        }
    }

    /**
     * Specific business logic to be executed after Order state transition completes.
     */
    private onTransitionEnd(fromState: OrderState, toState: OrderState, data: OrderTransitionData) {
        if (toState === 'PaymentAuthorized' || toState === 'PaymentSettled') {
            data.order.active = false;
            data.order.orderPlacedAt = new Date();
        }
        this.eventBus.publish(new OrderStateTransitionEvent(fromState, toState, data.ctx, data.order));
    }

    private initConfig(): StateMachineConfig<OrderState, OrderTransitionData> {
        const {
            transtitions,
            onTransitionStart,
            onTransitionEnd,
            onError,
        } = this.configService.orderProcessOptions;

        const allTransitions = this.mergeTransitionDefinitions(orderStateTransitions, transtitions);
        const initialState = 'AddingItems';

        return {
            transitions: allTransitions,
            onTransitionStart: async (fromState, toState, data) => {
                if (typeof onTransitionStart === 'function') {
                    const result = onTransitionStart(fromState, toState, data);
                    if (result === false || typeof result === 'string') {
                        return result;
                    }
                }
                return this.onTransitionStart(fromState, toState, data);
            },
            onTransitionEnd: (fromState, toState, data) => {
                if (typeof onTransitionEnd === 'function') {
                    return onTransitionEnd(fromState, toState, data);
                }
                return this.onTransitionEnd(fromState, toState, data);
            },
            onError: (fromState, toState, message) => {
                if (typeof onError === 'function') {
                    onError(fromState, toState, message);
                }
                throw new IllegalOperationError(message || 'error.cannot-transition-order-from-to', {
                    fromState,
                    toState,
                });
            },
        };
    }

    /**
     * Merge any custom transition definitions into the default transitions for the Order process.
     */
    private mergeTransitionDefinitions<T extends string>(
        defaultTranstions: Transitions<T>,
        customTranstitions?: any,
    ): Transitions<T> {
        if (!customTranstitions) {
            return defaultTranstions;
        }
        const merged = defaultTranstions;
        for (const key of Object.keys(customTranstitions)) {
            if (merged.hasOwnProperty(key)) {
                merged[key].to = merged[key].to.concat(customTranstitions[key].to);
            } else {
                merged[key] = customTranstitions[key];
            }
        }
        return merged;
    }
}
