import { describe, expect, it } from 'vitest';

import { Order } from '../../../entity/order/order.entity';
import { Payment } from '../../../entity/payment/payment.entity';

import { totalCoveredByPayments } from './order-utils';

describe('totalCoveredByPayments()', () => {
    it('single payment, any state, no refunds', () => {
        const order = new Order({
            payments: [
                new Payment({
                    state: 'Settled',
                    amount: 500,
                }),
            ],
        });

        expect(totalCoveredByPayments(order)).toBe(500);
    });

    it('multiple payments, any state, no refunds', () => {
        const order = new Order({
            payments: [
                new Payment({
                    state: 'Settled',
                    amount: 500,
                }),
                new Payment({
                    state: 'Settled',
                    amount: 300,
                }),
            ],
        });

        expect(totalCoveredByPayments(order)).toBe(800);
    });

    it('multiple payments, any state, error and declined', () => {
        const order = new Order({
            payments: [
                new Payment({
                    state: 'Error',
                    amount: 500,
                }),
                new Payment({
                    state: 'Declined',
                    amount: 300,
                }),
            ],
        });

        expect(totalCoveredByPayments(order)).toBe(0);
    });

    it('multiple payments, single state', () => {
        const order = new Order({
            payments: [
                new Payment({
                    state: 'Settled',
                    amount: 500,
                }),
                new Payment({
                    state: 'Authorized',
                    amount: 300,
                }),
            ],
        });

        expect(totalCoveredByPayments(order, 'Settled')).toBe(500);
    });

    it('multiple payments, multiple states', () => {
        const order = new Order({
            payments: [
                new Payment({
                    state: 'Settled',
                    amount: 500,
                }),
                new Payment({
                    state: 'Authorized',
                    amount: 300,
                }),
            ],
        });

        expect(totalCoveredByPayments(order, ['Settled', 'Authorized'])).toBe(800);
    });
});
