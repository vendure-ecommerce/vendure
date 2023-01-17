import { HistoryEntryType } from '@vendure/common/lib/generated-types';

import { awaitPromiseOrObservable, Transitions } from '../../common/index';
import { FulfillmentState, PaymentState } from '../../service/index';

import { PaymentProcess } from './payment-process';

declare module '../../service/helpers/payment-state-machine/payment-state' {
    interface PaymentStates {
        Authorized: never;
        Settled: never;
        Declined: never;
    }
}

let configService: import('../config.service').ConfigService;
let historyService: import('../../service/index').HistoryService;

/**
 * @description
 * The default {@link PaymentProcess}
 *
 * @docsCategory payment
 */
export const defaultPaymentProcess: PaymentProcess<PaymentState> = {
    transitions: {
        Created: {
            to: ['Authorized', 'Settled', 'Declined', 'Error', 'Cancelled'],
        },
        Authorized: {
            to: ['Settled', 'Error', 'Cancelled'],
        },
        Settled: {
            to: ['Cancelled'],
        },
        Declined: {
            to: ['Cancelled'],
        },
        Error: {
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
        // nothing here by default
    },
    async onTransitionEnd(fromState, toState, data) {
        await historyService.createHistoryEntryForOrder({
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
};
