import { OrderState } from '../../service/helpers/order-state-machine/order-state';

import { Transitions } from './finite-state-machine';
import { validateTransitionDefinition } from './validate-transition-definition';

describe('FSM validateTransitionDefinition()', () => {
    it('valid definition', () => {
        const valid: Transitions<'Start' | 'End'> = {
            Start: { to: ['End'] },
            End: { to: ['Start'] },
        };

        const result = validateTransitionDefinition(valid, 'Start');

        expect(result.valid).toBe(true);
    });

    it('valid complex definition', () => {
        const orderStateTransitions: Transitions<OrderState> = {
            AddingItems: {
                to: ['ArrangingPayment', 'Cancelled'],
            },
            ArrangingPayment: {
                to: ['PaymentAuthorized', 'PaymentSettled', 'AddingItems', 'Cancelled'],
            },
            PaymentAuthorized: {
                to: ['PaymentSettled', 'Cancelled'],
            },
            PaymentSettled: {
                to: ['PartiallyFulfilled', 'Fulfilled', 'Cancelled'],
            },
            PartiallyFulfilled: {
                to: ['Fulfilled', 'PartiallyFulfilled', 'Cancelled'],
            },
            Fulfilled: {
                to: ['Cancelled'],
            },
            Cancelled: {
                to: [],
            },
        };

        const result = validateTransitionDefinition(orderStateTransitions, 'AddingItems');

        expect(result.valid).toBe(true);
    });

    it('invalid - unreachable state', () => {
        const valid: Transitions<'Start' | 'End' | 'Unreachable'> = {
            Start: { to: ['End'] },
            End: { to: ['Start'] },
            Unreachable: { to: [] },
        };

        const result = validateTransitionDefinition(valid, 'Start');

        expect(result.valid).toBe(false);
        expect(result.error).toBe('The following states are unreachable: Unreachable');
    });
});
