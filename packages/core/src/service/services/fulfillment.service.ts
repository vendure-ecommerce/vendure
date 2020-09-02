import { Injectable } from '@nestjs/common';
import { InjectConnection } from '@nestjs/typeorm';
import { DeepPartial, ID } from '@vendure/common/lib/shared-types';
import { Connection } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { Fulfillment } from '../../entity/fulfillment/fulfillment.entity';
import { OrderItem } from '../../entity/order-item/order-item.entity';
import { Order } from '../../entity/order/order.entity';
import { EventBus } from '../../event-bus/event-bus';
import { FulfillmentStateTransitionEvent } from '../../event-bus/events/fulfillment-state-transition-event';
import { FulfillmentState } from '../helpers/fulfillment-state-machine/fulfillment-state';
import { FulfillmentStateMachine } from '../helpers/fulfillment-state-machine/fulfillment-state-machine';
import { getEntityOrThrow } from '../helpers/utils/get-entity-or-throw';

@Injectable()
export class FulfillmentService {
    constructor(
        @InjectConnection() private connection: Connection,
        private fulfillmentStateMachine: FulfillmentStateMachine,
        private eventBus: EventBus,
    ) {}
    async create(input: DeepPartial<Fulfillment>): Promise<Fulfillment> {
        const newFulfillment = new Fulfillment({
            ...input,
            state: this.fulfillmentStateMachine.getInitialState(),
        });
        return this.connection.getRepository(Fulfillment).save(newFulfillment);
    }
    async findOneOrThrow(id: ID): Promise<Fulfillment> {
        return await getEntityOrThrow(this.connection, Fulfillment, id, {
            relations: ['orderItems'],
        });
    }
    async findOrderByFulfillment(fulfillment: Fulfillment, channelId: ID): Promise<Order> {
        return this.connection.getRepository(Order).findOneOrFail({
            where: {
                fulfillment,
                channelId,
            },
        });
    }
    async getOrderItemsByFulfillmentId(id: ID): Promise<OrderItem[]> {
        const fulfillment = await this.findOneOrThrow(id);
        return fulfillment.orderItems;
    }
    async transitionToState(
        ctx: RequestContext,
        fulfillmentId: ID,
        state: FulfillmentState,
    ): Promise<{
        fulfillment: Fulfillment;
        order: Order;
        fromState: FulfillmentState;
        toState: FulfillmentState;
    }> {
        const fulfillment = await this.findOneOrThrow(fulfillmentId);
        const order = await this.findOrderByFulfillment(fulfillment, ctx.channelId);
        const fromState = fulfillment.state;
        await this.fulfillmentStateMachine.transition(ctx, fulfillment, order, state);
        await this.connection.getRepository(Fulfillment).save(fulfillment, { reload: false });
        this.eventBus.publish(new FulfillmentStateTransitionEvent(fromState, state, ctx, fulfillment));

        return { fulfillment, order, fromState, toState: state };
    }
    getNextStates(fulfillment: Fulfillment): ReadonlyArray<FulfillmentState> {
        return this.fulfillmentStateMachine.getNextStates(fulfillment);
    }
}
