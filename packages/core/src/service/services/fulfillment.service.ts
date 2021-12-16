import { Injectable } from '@nestjs/common';
import { ConfigurableOperationInput } from '@vendure/common/lib/generated-types';
import { ID } from '@vendure/common/lib/shared-types';
import { isObject } from '@vendure/common/lib/shared-utils';

import { RequestContext } from '../../api/common/request-context';
import {
    CreateFulfillmentError,
    FulfillmentStateTransitionError,
    InvalidFulfillmentHandlerError,
} from '../../common/error/generated-graphql-admin-errors';
import { ConfigService } from '../../config/config.service';
import { TransactionalConnection } from '../../connection/transactional-connection';
import { Fulfillment } from '../../entity/fulfillment/fulfillment.entity';
import { OrderItem } from '../../entity/order-item/order-item.entity';
import { Order } from '../../entity/order/order.entity';
import { EventBus } from '../../event-bus/event-bus';
import { FulfillmentEvent } from '../../event-bus/events/fulfillment-event';
import { FulfillmentStateTransitionEvent } from '../../event-bus/events/fulfillment-state-transition-event';
import { CustomFieldRelationService } from '../helpers/custom-field-relation/custom-field-relation.service';
import { FulfillmentState } from '../helpers/fulfillment-state-machine/fulfillment-state';
import { FulfillmentStateMachine } from '../helpers/fulfillment-state-machine/fulfillment-state-machine';

/**
 * @description
 * Contains methods relating to {@link Fulfillment} entities.
 *
 * @docsCategory services
 */
@Injectable()
export class FulfillmentService {
    constructor(
        private connection: TransactionalConnection,
        private fulfillmentStateMachine: FulfillmentStateMachine,
        private eventBus: EventBus,
        private configService: ConfigService,
        private customFieldRelationService: CustomFieldRelationService,
    ) {}

    /**
     * @description
     * Creates a new Fulfillment for the given Orders and OrderItems, using the specified
     * {@link FulfillmentHandler}.
     */
    async create(
        ctx: RequestContext,
        orders: Order[],
        items: OrderItem[],
        handler: ConfigurableOperationInput,
    ): Promise<Fulfillment | InvalidFulfillmentHandlerError | CreateFulfillmentError> {
        const fulfillmentHandler = this.configService.shippingOptions.fulfillmentHandlers.find(
            h => h.code === handler.code,
        );
        if (!fulfillmentHandler) {
            return new InvalidFulfillmentHandlerError();
        }
        let fulfillmentPartial;
        try {
            fulfillmentPartial = await fulfillmentHandler.createFulfillment(
                ctx,
                orders,
                items,
                handler.arguments,
            );
        } catch (e: unknown) {
            let message = 'No error message';
            if (isObject(e)) {
                message = (e as any).message || e.toString();
            }
            return new CreateFulfillmentError(message);
        }

        const newFulfillment = await this.connection.getRepository(ctx, Fulfillment).save(
            new Fulfillment({
                method: '',
                trackingCode: '',
                ...fulfillmentPartial,
                orderItems: items,
                state: this.fulfillmentStateMachine.getInitialState(),
                handlerCode: fulfillmentHandler.code,
            }),
        );
        const fulfillmentWithRelations = await this.customFieldRelationService.updateRelations(
            ctx,
            Fulfillment,
            fulfillmentPartial,
            newFulfillment,
        );
        this.eventBus.publish(
            new FulfillmentEvent(ctx, fulfillmentWithRelations, {
                orders,
                items,
                handler,
            }),
        );
        return newFulfillment;
    }

    private async findOneOrThrow(
        ctx: RequestContext,
        id: ID,
        relations: string[] = ['orderItems'],
    ): Promise<Fulfillment> {
        return await this.connection.getEntityOrThrow(ctx, Fulfillment, id, {
            relations,
        });
    }

    /**
     * @description
     * Returns all OrderItems associated with the specified Fulfillment.
     */
    async getOrderItemsByFulfillmentId(ctx: RequestContext, id: ID): Promise<OrderItem[]> {
        const fulfillment = await this.findOneOrThrow(ctx, id);
        return fulfillment.orderItems;
    }

    /**
     * @description
     * Transitions the specified Fulfillment to a new state and upon successful transition
     * publishes a {@link FulfillmentStateTransitionEvent}.
     */
    async transitionToState(
        ctx: RequestContext,
        fulfillmentId: ID,
        state: FulfillmentState,
    ): Promise<
        | {
              fulfillment: Fulfillment;
              orders: Order[];
              fromState: FulfillmentState;
              toState: FulfillmentState;
          }
        | FulfillmentStateTransitionError
    > {
        const fulfillment = await this.findOneOrThrow(ctx, fulfillmentId, [
            'orderItems',
            'orderItems.line',
            'orderItems.line.order',
        ]);
        // Find orders based on order items filtering by id, removing duplicated orders
        const ordersInOrderItems = fulfillment.orderItems.map(oi => oi.line.order);
        const orders = ordersInOrderItems.filter((v, i, a) => a.findIndex(t => t.id === v.id) === i);
        const fromState = fulfillment.state;
        try {
            await this.fulfillmentStateMachine.transition(ctx, fulfillment, orders, state);
        } catch (e) {
            const transitionError = ctx.translate(e.message, { fromState, toState: state });
            return new FulfillmentStateTransitionError(transitionError, fromState, state);
        }
        await this.connection.getRepository(ctx, Fulfillment).save(fulfillment, { reload: false });
        this.eventBus.publish(new FulfillmentStateTransitionEvent(fromState, state, ctx, fulfillment));

        return { fulfillment, orders, fromState, toState: state };
    }

    /**
     * @description
     * Returns an array of the next valid states for the Fulfillment.
     */
    getNextStates(fulfillment: Fulfillment): ReadonlyArray<FulfillmentState> {
        return this.fulfillmentStateMachine.getNextStates(fulfillment);
    }
}
