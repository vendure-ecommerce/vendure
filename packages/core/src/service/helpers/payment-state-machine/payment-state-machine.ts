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
import { Order } from '../../../entity/order/order.entity';
import { Payment } from '../../../entity/payment/payment.entity';
import { HistoryService } from '../../services/history.service';

import { PaymentState, paymentStateTransitions, PaymentTransitionData } from './payment-state';

@Injectable()
export class PaymentStateMachine {
    private readonly config: StateMachineConfig<PaymentState, PaymentTransitionData>;
    private readonly initialState: PaymentState = 'Created';

    constructor(private configService: ConfigService, private historyService: HistoryService) {
        this.config = this.initConfig();
    }

    getInitialState(): PaymentState {
        return this.initialState;
    }

    canTransition(currentState: PaymentState, newState: PaymentState): boolean {
        return new FSM(this.config, currentState).canTransitionTo(newState);
    }

    getNextStates(payment: Payment): ReadonlyArray<PaymentState> {
        const fsm = new FSM(this.config, payment.state);
        return fsm.getNextStates();
    }

    async transition(ctx: RequestContext, order: Order, payment: Payment, state: PaymentState) {
        const fsm = new FSM(this.config, payment.state);
        await fsm.transitionTo(state, { ctx, order, payment });
        payment.state = state;
    }

    /**
     * Specific business logic to be executed on Payment state transitions.
     */
    private async onTransitionStart(
        fromState: PaymentState,
        toState: PaymentState,
        data: PaymentTransitionData,
    ) {
        /**/
    }

    private async onTransitionEnd(
        fromState: PaymentState,
        toState: PaymentState,
        data: PaymentTransitionData,
    ) {
        await this.historyService.createHistoryEntryForOrder({
            ctx: data.ctx,
            orderId: data.order.id,
            type: HistoryEntryType.ORDER_PAYMENT_TRANSITION,
            data: {
                paymentId: data.payment.id,
                from: fromState,
                to: toState,
            },
        });
    }

    private initConfig(): StateMachineConfig<PaymentState, PaymentTransitionData> {
        const { paymentMethodHandlers } = this.configService.paymentOptions;
        const customProcesses = this.configService.paymentOptions.customPaymentProcess ?? [];

        const allTransitions = customProcesses.reduce(
            (transitions, process) =>
                mergeTransitionDefinitions(transitions, process.transitions as Transitions<any>),
            paymentStateTransitions,
        );

        validateTransitionDefinition(allTransitions, this.initialState);

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
                for (const handler of paymentMethodHandlers) {
                    if (data.payment.method === handler.code) {
                        const result = await awaitPromiseOrObservable(
                            handler.onStateTransitionStart(fromState, toState, data),
                        );
                        if (result !== true) {
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
                throw new IllegalOperationError(message || 'error.cannot-transition-payment-from-to', {
                    fromState,
                    toState,
                });
            },
        };
    }
}
