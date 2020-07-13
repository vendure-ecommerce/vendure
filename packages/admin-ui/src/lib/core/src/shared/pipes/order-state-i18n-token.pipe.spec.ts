import { OrderStateI18nTokenPipe } from './order-state-i18n-token.pipe';

describe('orderStateI18nTokenPipe', () => {
    const pipe = new OrderStateI18nTokenPipe();

    it('works with default states', () => {
        const result = pipe.transform('AddingItems');

        expect(result).toBe('order.state-adding-items');
    });

    it('works with unknown states', () => {
        const result = pipe.transform('ValidatingCustomer');

        expect(result).toBe('order.state-validating-customer');
    });

    it('works with unknown states with various formatting', () => {
        const result1 = pipe.transform('validating-Customer');
        expect(result1).toBe('order.state-validating-customer');

        const result2 = pipe.transform('validating-Customer');
        expect(result2).toBe('order.state-validating-customer');

        const result3 = pipe.transform('Validating Customer');
        expect(result3).toBe('order.state-validating-customer');
    });

    it('passes through non-string values', () => {
        expect(pipe.transform(null)).toBeNull();
        expect(pipe.transform(1)).toBe(1);
        expect(pipe.transform({})).toEqual({});
    });
});
