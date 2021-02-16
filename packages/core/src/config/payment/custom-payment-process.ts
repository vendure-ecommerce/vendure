import {
    OnTransitionEndFn,
    OnTransitionErrorFn,
    OnTransitionStartFn,
    Transitions,
} from '../../common/finite-state-machine/types';
import { InjectableStrategy } from '../../common/types/injectable-strategy';
import {
    PaymentState,
    PaymentTransitionData,
} from '../../service/helpers/payment-state-machine/payment-state';

/**
 * @description
 * Used to define extensions to or modifications of the default payment process.
 *
 * For detailed description of the interface members, see the {@link StateMachineConfig} docs.
 *
 * @docsCategory fulfillment
 */
export interface CustomPaymentProcess<State extends string> extends InjectableStrategy {
    transitions?: Transitions<State, State | PaymentState> & Partial<Transitions<PaymentState | State>>;
    onTransitionStart?: OnTransitionStartFn<State | PaymentState, PaymentTransitionData>;
    onTransitionEnd?: OnTransitionEndFn<State | PaymentState, PaymentTransitionData>;
    onTransitionError?: OnTransitionErrorFn<State | PaymentState>;
}
