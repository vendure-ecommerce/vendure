import { Injectable } from '@nestjs/common';

import { FSM, StateMachineConfig, Transitions } from '../../../common/finite-state-machine';
import { ConfigService } from '../../../config/config.service';
import { Order } from '../../../entity/order/order.entity';
import { I18nError } from '../../../i18n/i18n-error';

import { OrderState, orderStateTransitions, OrderTransitionData } from './order-state';

@Injectable()
export class OrderStateMachine {
    private readonly config: StateMachineConfig<OrderState, OrderTransitionData>;
    private readonly initialState: OrderState = 'AddingItems';

    constructor(private configService: ConfigService) {
        this.config = this.initConfig();
    }

    getInitialState(): OrderState {
        return this.initialState;
    }

    getNextStates(order: Order): OrderState[] {
        const fsm = new FSM(this.config, order.state);
        return fsm.getNextStates();
    }

    async transition(order: Order, state: OrderState) {
        const fsm = new FSM(this.config, order.state);
        await fsm.transitionTo(state, { order });
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
        }
    }

    /**
     * Specific business logic to be executed after Order state transition completes.
     */
    private onTransitionEnd(fromState: OrderState, toState: OrderState, data: OrderTransitionData) {
        if (toState === 'PaymentAuthorized' || toState === 'PaymentSettled') {
            data.order.active = false;
        }
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
                if (!message) {
                    throw new I18nError(`error.cannot-transition-order-from-to`, { fromState, toState });
                } else {
                    throw new I18nError(message);
                }
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
