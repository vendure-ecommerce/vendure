import {
    OnTransitionEndFn,
    OnTransitionErrorFn,
    OnTransitionStartFn,
    StateMachineConfig,
    Transitions,
} from '../../common/finite-state-machine/types';
import { InjectableStrategy } from '../../common/types/injectable-strategy';
import { OrderState, OrderTransitionData } from '../../service/helpers/order-state-machine/order-state';

/**
 * @description
 * Used to define extensions to or modifications of the default order process.
 *
 * For detailed description of the interface members, see the {@link StateMachineConfig} docs.
 *
 * @docsCategory orders
 */
export interface CustomOrderProcess<State extends string> extends InjectableStrategy {
    transitions?: Transitions<State, State | OrderState> & Partial<Transitions<OrderState | State>>;
    onTransitionStart?: OnTransitionStartFn<State | OrderState, OrderTransitionData>;
    onTransitionEnd?: OnTransitionEndFn<State | OrderState, OrderTransitionData>;
    onTransitionError?: OnTransitionErrorFn<State | OrderState>;
}
