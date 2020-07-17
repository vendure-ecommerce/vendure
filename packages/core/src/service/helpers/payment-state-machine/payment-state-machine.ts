import { Injectable } from '@nestjs/common';
import { HistoryEntryType } from '@vendure/common/lib/generated-types';

import { RequestContext } from '../../../api/common/request-context';
import { IllegalOperationError } from '../../../common/error/errors';
import { FSM } from '../../../common/finite-state-machine/finite-state-machine';
import { StateMachineConfig } from '../../../common/finite-state-machine/types';
import { ConfigService } from '../../../config/config.service';
import { Order } from '../../../entity/order/order.entity';
import { Payment } from '../../../entity/payment/payment.entity';
import { HistoryService } from '../../services/history.service';

import { PaymentState, paymentStateTransitions, PaymentTransitionData } from './payment-state';

@Injectable()
export class PaymentStateMachine {
    private readonly config: StateMachineConfig<PaymentState, PaymentTransitionData> = {
        transitions: paymentStateTransitions,
        onTransitionStart: async (fromState, toState, data) => {
            return true;
        },
        onTransitionEnd: async (fromState, toState, data) => {
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
        },
        onError: (fromState, toState, message) => {
            throw new IllegalOperationError(message || 'error.cannot-transition-payment-from-to', {
                fromState,
                toState,
            });
        },
    };

    constructor(private configService: ConfigService, private historyService: HistoryService) {}

    getNextStates(payment: Payment): ReadonlyArray<PaymentState> {
        const fsm = new FSM(this.config, payment.state);
        return fsm.getNextStates();
    }

    async transition(ctx: RequestContext, order: Order, payment: Payment, state: PaymentState) {
        const fsm = new FSM(this.config, payment.state);
        await fsm.transitionTo(state, { ctx, order, payment });
        payment.state = state;
    }
}
