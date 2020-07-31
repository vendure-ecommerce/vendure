import { RequestContext } from '../../../api/common/request-context';
import { Transitions } from '../../../common/finite-state-machine/finite-state-machine';
import { Fulfillment } from '../../../entity/fulfillment/fulfillment.entity';
import { Order } from '../../../entity/order/order.entity';

/**
 * @description
 * These are the default states of the fulfillment process.
 *
 * @docsCategory fulfillment
 */
export type FulfillmentState = 'Pending' | 'Shipped' | 'Delivered' | 'Refunded';

export const fulfillmentStateTransitions: Transitions<FulfillmentState> = {
    Pending: {
        to: ['Shipped', 'Delivered'],
    },
    Shipped: {
        to: ['Pending', 'Refunded'],
    },
    Delivered: {
        to: ['Refunded'],
    },
    Refunded: {
        to: ['Pending'],
    },
};

/**
 * @description
 * The data which is passed to the state transition handlers of the FulfillmentStateMachine.
 *
 * @docsCategory fulfillment
 */
export interface FulfillmentTransitionData {
    ctx: RequestContext;
    order: Order;
    fulfillment: Fulfillment;
}
