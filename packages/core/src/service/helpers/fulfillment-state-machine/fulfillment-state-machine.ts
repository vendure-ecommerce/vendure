import { Injectable } from '@nestjs/common';
import { HistoryEntryType } from '@vendure/common/lib/generated-types';

import { RequestContext } from '../../../api/common/request-context';
import { IllegalOperationError } from '../../../common/error/errors';
import { FSM, StateMachineConfig } from '../../../common/finite-state-machine/finite-state-machine';
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
    private readonly config: StateMachineConfig<FulfillmentState, FulfillmentTransitionData> = {
        transitions: fulfillmentStateTransitions,
        onTransitionStart: async (fromState, toState, data) => {
            return true;
        },
        onTransitionEnd: async (fromState, toState, data) => {
            await this.historyService.createHistoryEntryForOrder({
                ctx: data.ctx,
                orderId: data.order.id,
                type: HistoryEntryType.ORDER_FULFILLMENT_TRANSITION,
                data: {
                    fulfillmentId: data.fulfillment.id,
                    from: fromState,
                    to: toState,
                },
            });
        },
        onError: (fromState, toState, message) => {
            throw new IllegalOperationError(message || 'error.cannot-transition-fulfillment-from-to', {
                fromState,
                toState,
            });
        },
    };

    constructor(private configService: ConfigService, private historyService: HistoryService) {}

    getNextStates(fulfillment: Fulfillment): FulfillmentState[] {
        const fsm = new FSM(this.config, fulfillment.state);
        return fsm.getNextStates();
    }

    async transition(ctx: RequestContext, order: Order, fulfillment: Fulfillment, state: FulfillmentState) {
        const fsm = new FSM(this.config, fulfillment.state);
        await fsm.transitionTo(state, { ctx, order, fulfillment });
        fulfillment.state = state;
    }
}
