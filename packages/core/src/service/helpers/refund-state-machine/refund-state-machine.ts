import { Injectable } from '@nestjs/common';
import { HistoryEntryType } from '@vendure/common/lib/generated-types';

import { RequestContext } from '../../../api/common/request-context';
import { IllegalOperationError } from '../../../common/error/errors';
import { FSM, StateMachineConfig } from '../../../common/finite-state-machine/finite-state-machine';
import { ConfigService } from '../../../config/config.service';
import { Order } from '../../../entity/order/order.entity';
import { Refund } from '../../../entity/refund/refund.entity';
import { HistoryService } from '../../services/history.service';

import { RefundState, refundStateTransitions, RefundTransitionData } from './refund-state';

@Injectable()
export class RefundStateMachine {
    private readonly config: StateMachineConfig<RefundState, RefundTransitionData> = {
        transitions: refundStateTransitions,
        onTransitionStart: async (fromState, toState, data) => {
            return true;
        },
        onTransitionEnd: async (fromState, toState, data) => {
            await this.historyService.createHistoryEntryForOrder({
                ctx: data.ctx,
                orderId: data.order.id,
                type: HistoryEntryType.ORDER_REFUND_TRANSITION,
                data: {
                    refundId: data.refund.id,
                    from: fromState,
                    to: toState,
                    reason: data.refund.reason,
                },
            });
        },
        onError: (fromState, toState, message) => {
            throw new IllegalOperationError(message || 'error.cannot-transition-refund-from-to', {
                fromState,
                toState,
            });
        },
    };

    constructor(private configService: ConfigService, private historyService: HistoryService) {}

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
