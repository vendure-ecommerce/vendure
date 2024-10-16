import { Order, OrderLine } from '@vendure/core';
import { describe, expect, it } from 'vitest';

import { calculateOrderLineTotal, createAmount, createItem } from './paypal-order.helpers';
import { PayPalOrderPurchaseUnitAmount, PayPalOrderItem } from './types';

describe('PayPal Order Helpers', () => {
    describe('calculateOrderLineTotal', () => {
        it('should return 0 for an empty array', () => {
            const lines: OrderLine[] = [];
            const result = calculateOrderLineTotal(lines);
            expect(result).toBe(0);
        });

        it('should correctly calculate the total for multiple order lines', () => {
            const lines = [
                { unitPriceWithTax: 10, quantity: 2 },
                { unitPriceWithTax: 20, quantity: 1 },
            ] as OrderLine[];
            const result = calculateOrderLineTotal(lines);
            expect(result).toBe(40);
        });
    });

    describe('createAmount', () => {
        const order = {
            lines: [
                { unitPriceWithTax: 1000, quantity: 2, productVariant: { name: 'Product 1' } },
                { unitPriceWithTax: 2000, quantity: 1, productVariant: { name: 'Product 2' } },
            ],
            currencyCode: 'USD',
            totalWithTax: 5000,
            shippingWithTax: 500,
        } as Order;

        it('should create a valid PayPal order amount', () => {
            const precision = 2;
            const result: PayPalOrderPurchaseUnitAmount = createAmount(order, precision);
            expect(result.currency_code).toBe('USD');
            expect(result.value).toBe('50.00');
            expect(result.breakdown?.item_total?.value).toBe('40.00');
            expect(result.breakdown?.shipping?.value).toBe('5.00');
        });

        it('should throw an error for invalid precision', () => {
            const precision = 4;
            expect(() => createAmount(order, precision)).toThrow(
                'Precision must be 3 or less to guarantee correct rounding',
            );
        });
    });

    describe('createItem', () => {
        const order = {
            lines: [
                { unitPriceWithTax: 10, quantity: 2, productVariant: { name: 'Product 1' } },
                { unitPriceWithTax: 20, quantity: 1, productVariant: { name: 'Product 2' } },
            ],
            currencyCode: 'USD',
            totalWithTax: 50,
            shippingWithTax: 5,
        } as Order;

        const orderLine = {
            unitPriceWithTax: 1000,
            quantity: 2,
            productVariant: { name: 'Product 1' },
        } as OrderLine;

        it('should create a valid PayPal order item', () => {
            const precision = 2;
            const result: PayPalOrderItem = createItem(order, orderLine, precision);
            expect(result.name).toBe('Product 1');
            expect(result.quantity).toBe('2');
            expect(result.unit_amount.currency_code).toBe('USD');
            expect(result.unit_amount.value).toBe('10.00');
        });

        it('should throw an error for invalid precision', () => {
            const precision = 4;
            expect(() => createItem(order, orderLine, precision)).toThrow(
                'Precision must be 3 or less to guarantee correct rounding',
            );
        });
    });
});
