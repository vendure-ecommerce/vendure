import { HistoryEntryType } from '@vendure/common/lib/generated-types';

import { awaitPromiseOrObservable, Transitions } from '../../common/index';
import { FulfillmentState } from '../../service/index';

import { FulfillmentProcess } from './fulfillment-process';

declare module '../../service/helpers/fulfillment-state-machine/fulfillment-state' {
    interface FulfillmentStates {
        Shipped: never;
        Delivered: never;
    }
}

let configService: import('../config.service').ConfigService;
let historyService: import('../../service/index').HistoryService;

/**
 * @description
 * The default {@link FulfillmentProcess}
 *
 * @docsCategory fulfillment
 */
export const defaultFulfillmentProcess: FulfillmentProcess<FulfillmentState> = {
    transitions: {
        Created: {
            to: ['Pending'],
        },
        Pending: {
            to: ['Shipped', 'Delivered', 'Cancelled'],
        },
        Shipped: {
            to: ['Delivered', 'Cancelled'],
        },
        Delivered: {
            to: ['Cancelled'],
        },
        Cancelled: {
            to: [],
        },
    },
    async init(injector) {
        // Lazily import these services to avoid a circular dependency error
        // due to this being used as part of the DefaultConfig
        const ConfigService = await import('../config.service').then(m => m.ConfigService);
        const HistoryService = await import('../../service/index').then(m => m.HistoryService);
        configService = injector.get(ConfigService);
        historyService = injector.get(HistoryService);
    },
    async onTransitionStart(fromState, toState, data) {
        const { fulfillmentHandlers } = configService.shippingOptions;
        const fulfillmentHandler = fulfillmentHandlers.find(h => h.code === data.fulfillment.handlerCode);
        if (fulfillmentHandler) {
            const result = await awaitPromiseOrObservable(
                fulfillmentHandler.onFulfillmentTransition(fromState, toState, data),
            );
            if (result === false || typeof result === 'string') {
                return result;
            }
        }
    },
    async onTransitionEnd(fromState, toState, data) {
        const historyEntryPromises = data.orders.map(order =>
            historyService.createHistoryEntryForOrder({
                orderId: order.id,
                type: HistoryEntryType.ORDER_FULFILLMENT_TRANSITION,
                ctx: data.ctx,
                data: {
                    fulfillmentId: data.fulfillment.id,
                    from: fromState,
                    to: toState,
                },
            }),
        );
        await Promise.all(historyEntryPromises);
    },
};
