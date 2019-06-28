import { Injectable } from '@nestjs/common';

import { RequestContext } from '../../../api/common/request-context';
import { IllegalOperationError } from '../../../common/error/errors';
import { FSM, StateMachineConfig } from '../../../common/finite-state-machine';
import { ConfigService } from '../../../config/config.service';
import { Order } from '../../../entity/order/order.entity';
import { Refund } from '../../../entity/refund/refund.entity';
import { EventBus } from '../../../event-bus/event-bus';
import { RefundStateTransitionEvent } from '../../../event-bus/events/refund-state-transition-event';

import { RefundState, refundStateTransitions, RefundTransitionData } from './refund-state';

@Injectable()
export class RefundStateMachine {

    private readonly config: StateMachineConfig<RefundState, RefundTransitionData> = {
        transitions: refundStateTransitions,
        onTransitionStart: async (fromState, toState, data) => {
            return true;
        },
        onTransitionEnd: (fromState, toState, data) => {
            this.eventBus.publish(new RefundStateTransitionEvent(fromState, toState, data.ctx, data.refund, data.order));
        },
        onError: (fromState, toState, message) => {
            throw new IllegalOperationError(message || 'error.cannot-transition-refund-from-to', {
                fromState,
                toState,
            });
        },
    };

    constructor(private configService: ConfigService,
                private eventBus: EventBus) {}

    getNextStates(refund: Refund): RefundState[] {
        const fsm = new FSM(this.config, refund.state);
        return fsm.getNextStates();
    }

    async transition(ctx: RequestContext, order: Order, refund: Refund, state: RefundState) {
        const fsm = new FSM(this.config, refund.state);
        await fsm.transitionTo(state, { ctx, order, refund });
        refund.state = state;
    }
}
