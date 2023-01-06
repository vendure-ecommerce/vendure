import { CustomOrderProcess } from '@vendure/core';

export const multivendorOrderProcess: CustomOrderProcess<any> = {
    onTransitionStart(fromState, toState, data) {
        if (fromState === 'AddingItems' && toState === 'ArrangingPayment') {
            for (const line of data.order.lines) {
                if (!line.shippingLineId) {
                    return 'not all lines have shipping';
                }
            }
        }
    },
};
