import { Injectable } from '@nestjs/common';
import { HistoryEntryType } from '@vendure/common/lib/generated-types';

import { RequestContext } from '../../../api/common/request-context';
import { IllegalOperationError } from '../../../common/error/errors';
import { FSM, StateMachineConfig } from '../../../common/finite-state-machine';
import { ConfigService } from '../../../config/config.service';
import { Order } from '../../../entity/order/order.entity';
import { Payment } from '../../../entity/payment/payment.entity';
import { EventBus } from '../../../event-bus/event-bus';
import { PaymentStateTransitionEvent } from '../../../event-bus/events/payment-state-transition-event';
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
            this.eventBus.publish(new PaymentStateTransitionEvent(fromState, toState, data.ctx, data.payment, data.order));
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

    constructor(private configService: ConfigService,
                private historyService: HistoryService,
                private eventBus: EventBus) {}

    getNextStates(payment: Payment): PaymentState[] {
        const fsm = new FSM(this.config, payment.state);
        return fsm.getNextStates();
    }

    async transition(ctx: RequestContext, order: Order, payment: Payment, state: PaymentState) {
        const fsm = new FSM(this.config, payment.state);
        await fsm.transitionTo(state, { ctx, order, payment });
        payment.state = state;
    }
}
