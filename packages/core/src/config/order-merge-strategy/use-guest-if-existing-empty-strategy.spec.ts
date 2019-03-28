import { Order } from '../../entity/order/order.entity';
import { createOrderFromLines, parseLines } from '../../testing/order-test-utils';

import { UseGuestIfExistingEmptyStrategy } from './use-guest-if-existing-empty-strategy';

describe('UseGuestIfExistingEmptyStrategy', () => {
    const strategy = new UseGuestIfExistingEmptyStrategy();

    it('both orders empty', () => {
        const guestOrder = new Order({ lines: [] });
        const existingOrder = new Order({ lines: [] });

        const result = strategy.merge(guestOrder, existingOrder);

        expect(result).toEqual([]);
    });

    it('existingOrder empty', () => {
        const guestLines = [{ lineId: 1, quantity: 2, productVariantId: 100 }];
        const guestOrder = createOrderFromLines(guestLines);
        const existingOrder = new Order({ lines: [] });

        const result = strategy.merge(guestOrder, existingOrder);

        expect(parseLines(result)).toEqual(guestLines);
    });

    it('guestOrder empty', () => {
        const existingLines = [{ lineId: 1, quantity: 2, productVariantId: 100 }];
        const guestOrder = new Order({ lines: [] });
        const existingOrder = createOrderFromLines(existingLines);

        const result = strategy.merge(guestOrder, existingOrder);

        expect(parseLines(result)).toEqual(existingLines);
    });

    it('both orders have non-conflicting lines', () => {
        const guestLines = [
            { lineId: 21, quantity: 2, productVariantId: 201 },
            { lineId: 22, quantity: 1, productVariantId: 202 },
        ];
        const existingLines = [
            { lineId: 1, quantity: 1, productVariantId: 101 },
            { lineId: 2, quantity: 1, productVariantId: 102 },
            { lineId: 3, quantity: 1, productVariantId: 103 },
        ];
        const guestOrder = createOrderFromLines(guestLines);
        const existingOrder = createOrderFromLines(existingLines);

        const result = strategy.merge(guestOrder, existingOrder);

        expect(parseLines(result)).toEqual(existingLines);
    });

    it('both orders have conflicting lines, some of which conflict', () => {
        const guestLines = [
            { lineId: 21, quantity: 2, productVariantId: 102 },
            { lineId: 22, quantity: 1, productVariantId: 202 },
        ];
        const existingLines = [
            { lineId: 1, quantity: 1, productVariantId: 101 },
            { lineId: 2, quantity: 1, productVariantId: 102 },
            { lineId: 3, quantity: 1, productVariantId: 103 },
        ];
        const guestOrder = createOrderFromLines(guestLines);
        const existingOrder = createOrderFromLines(existingLines);

        const result = strategy.merge(guestOrder, existingOrder);

        expect(parseLines(result)).toEqual(existingLines);
    });

    it('returns a new array', () => {
        const guestLines = [{ lineId: 21, quantity: 2, productVariantId: 102 }];
        const existingLines = [{ lineId: 1, quantity: 1, productVariantId: 101 }];
        const guestOrder = createOrderFromLines(guestLines);
        const existingOrder = createOrderFromLines(existingLines);

        const result = strategy.merge(guestOrder, existingOrder);

        expect(result).not.toBe(guestOrder.lines);
        expect(result).not.toBe(existingOrder.lines);
    });
});
