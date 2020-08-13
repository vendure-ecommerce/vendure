import {
    OnTransitionEndFn,
    OnTransitionErrorFn,
    OnTransitionStartFn,
    Transitions,
} from '../../common/finite-state-machine/types';
import { InjectableStrategy } from '../../common/types/injectable-strategy';
import {
    FulfillmentState,
    FulfillmentTransitionData,
} from '../../service/helpers/fulfillment-state-machine/fulfillment-state';

/**
 * @description
 * Used to define extensions to or modifications of the default fulfillment process.
 *
 * For detailed description of the interface members, see the {@link StateMachineConfig} docs.
 *
 * @docsCategory fulfillments
 */
export interface CustomFulfillmentProcess<State extends string> extends InjectableStrategy {
    transitions?: Transitions<State, State | FulfillmentState> &
        Partial<Transitions<FulfillmentState | State>>;
    onTransitionStart?: OnTransitionStartFn<State | FulfillmentState, FulfillmentTransitionData>;
    onTransitionEnd?: OnTransitionEndFn<State | FulfillmentState, FulfillmentTransitionData>;
    onTransitionError?: OnTransitionErrorFn<State | FulfillmentState>;
}
