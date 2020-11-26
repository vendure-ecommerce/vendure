import { Injectable } from '@nestjs/common';
import { HistoryEntryType } from '@vendure/common/lib/generated-types';

import { RequestContext } from '../../../api/common/request-context';
import { IllegalOperationError } from '../../../common/error/errors';
import { FSM } from '../../../common/finite-state-machine/finite-state-machine';
import { mergeTransitionDefinitions } from '../../../common/finite-state-machine/merge-transition-definitions';
import { StateMachineConfig, Transitions } from '../../../common/finite-state-machine/types';
import { validateTransitionDefinition } from '../../../common/finite-state-machine/validate-transition-definition';
import { awaitPromiseOrObservable } from '../../../common/utils';
import { ConfigService } from '../../../config/config.service';
import { Fulfillment } from '../../../entity/fulfillment/fulfillment.entity';
import { Order } from '../../../entity/order/order.entity';
import { HistoryService } from '../../services/history.service';

import {
    FulfillmentState,
    fulfillmentStateTransitions,
    FulfillmentTransitionData,
} from './fulfillment-state';

@Injectable()
export class FulfillmentStateMachine {
    readonly config: StateMachineConfig<FulfillmentState, FulfillmentTransitionData>;
    private readonly initialState: FulfillmentState = 'Created';

    constructor(private configService: ConfigService, private historyService: HistoryService) {
        this.config = this.initConfig();
    }

    getInitialState(): FulfillmentState {
        return this.initialState;
    }

    canTransition(currentState: FulfillmentState, newState: FulfillmentState): boolean {
        return new FSM(this.config, currentState).canTransitionTo(newState);
    }

    getNextStates(fulfillment: Fulfillment): ReadonlyArray<FulfillmentState> {
        const fsm = new FSM(this.config, fulfillment.state);
        return fsm.getNextStates();
    }

    async transition(
        ctx: RequestContext,
        fulfillment: Fulfillment,
        orders: Order[],
        state: FulfillmentState,
    ) {
        const fsm = new FSM(this.config, fulfillment.state);
        await fsm.transitionTo(state, { ctx, orders, fulfillment });
        fulfillment.state = fsm.currentState;
    }

    /**
     * Specific business logic to be executed on Fulfillment state transitions.
     */
    private async onTransitionStart(
        fromState: FulfillmentState,
        toState: FulfillmentState,
        data: FulfillmentTransitionData,
    ) {
        const { fulfillmentHandlers } = this.configService.shippingOptions;
        const fulfillmentHandler = fulfillmentHandlers.find(h => h.code === data.fulfillment.handlerCode);
        if (fulfillmentHandler) {
            const result = await awaitPromiseOrObservable(
                fulfillmentHandler.onFulfillmentTransition(fromState, toState, data),
            );
            if (result === false || typeof result === 'string') {
                return result;
            }
        }
    }

    /**
     * Specific business logic to be executed after Fulfillment state transition completes.
     */
    private async onTransitionEnd(
        fromState: FulfillmentState,
        toState: FulfillmentState,
        data: FulfillmentTransitionData,
    ) {
        const historyEntryPromises = data.orders.map(order =>
            this.historyService.createHistoryEntryForOrder({
                orderId: order.id,
                type: HistoryEntryType.ORDER_FULFILLMENT_TRANSITION,
                ctx: data.ctx,
                data: {
                    fulfillmentId: data.fulfillment.id,
                    from: fromState,
                    to: toState,
                },
            }),
        );
        await Promise.all(historyEntryPromises);
    }

    private initConfig(): StateMachineConfig<FulfillmentState, FulfillmentTransitionData> {
        const customProcesses = this.configService.shippingOptions.customFulfillmentProcess ?? [];

        const allTransitions = customProcesses.reduce(
            (transitions, process) =>
                mergeTransitionDefinitions(transitions, process.transitions as Transitions<any>),
            fulfillmentStateTransitions,
        );

        const validationResult = validateTransitionDefinition(allTransitions, 'Pending');

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
                throw new IllegalOperationError(message || 'error.cannot-transition-fulfillment-from-to', {
                    fromState,
                    toState,
                });
            },
        };
    }
}
