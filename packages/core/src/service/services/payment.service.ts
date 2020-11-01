import { Injectable } from '@nestjs/common';
import { DeepPartial, ID } from '@vendure/common/lib/shared-types';

import { RequestContext } from '../../api/common/request-context';
import { Payment } from '../../entity/payment/payment.entity';
import { EventBus } from '../../event-bus/event-bus';
import { PaymentStateTransitionEvent } from '../../event-bus/events/payment-state-transition-event';
import { PaymentState } from '../helpers/payment-state-machine/payment-state';
import { PaymentStateMachine } from '../helpers/payment-state-machine/payment-state-machine';
import { TransactionalConnection } from '../transaction/transactional-connection';

@Injectable()
export class PaymentService {
    constructor(
        private connection: TransactionalConnection,
        private paymentStateMachine: PaymentStateMachine,
        private eventBus: EventBus,
    ) {}

    async create(ctx: RequestContext, input: DeepPartial<Payment>): Promise<Payment> {
        const newPayment = new Payment({
            ...input,
            state: this.paymentStateMachine.getInitialState(),
        });
        return this.connection.getRepository(ctx, Payment).save(newPayment);
    }

    async findOneOrThrow(ctx: RequestContext, id: ID, relations: string[] = ['order']): Promise<Payment> {
        return await this.connection.getEntityOrThrow(ctx, Payment, id, {
            relations,
        });
    }

    async transitionToState(ctx: RequestContext, paymentId: ID, state: PaymentState): Promise<Payment> {
        const payment = await this.findOneOrThrow(ctx, paymentId);
        const fromState = payment.state;

        await this.paymentStateMachine.transition(ctx, payment.order, payment, state);
        await this.connection.getRepository(ctx, Payment).save(payment, { reload: false });
        this.eventBus.publish(new PaymentStateTransitionEvent(fromState, state, ctx, payment, payment.order));

        return payment;
    }

    getNextStates(payment: Payment): ReadonlyArray<PaymentState> {
        return this.paymentStateMachine.getNextStates(payment);
    }
}
