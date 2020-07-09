import { StateMachineConfig, Transitions } from '../../common/finite-state-machine/finite-state-machine';
import { InjectableStrategy } from '../../common/types/injectable-strategy';
import { Order } from '../../entity/order/order.entity';
import { OrderState, OrderTransitionData } from '../../service/helpers/order-state-machine/order-state';

export interface CustomOrderProcess<State extends string>
    extends InjectableStrategy,
        Omit<StateMachineConfig<State & OrderState, OrderTransitionData>, 'transitions'> {
    transitions?: Transitions<State, State | OrderState> & Partial<Transitions<OrderState | State>>;
}
