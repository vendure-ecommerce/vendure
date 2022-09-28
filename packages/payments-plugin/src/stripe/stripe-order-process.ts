import { CustomOrderProcess, OrderState } from '@vendure/core';

const stripeOrderProcess: CustomOrderProcess<never> = {
    async onTransitionEnd(fromState, toState, data) {
        if (fromState === 'ArrangingPayment' && toState === 'AddingItems') {
            data.order;
        }
    },
};
