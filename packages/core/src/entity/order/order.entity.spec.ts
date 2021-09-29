import { AdjustmentType } from '@vendure/common/lib/generated-types';
import { summate } from '@vendure/common/lib/shared-utils';

import { createOrder, createRequestContext, taxCategoryStandard } from '../../testing/order-test-utils';
import { ShippingLine } from '../shipping-line/shipping-line.entity';

import { Order } from './order.entity';

describe('Order entity methods', () => {
    describe('taxSummary', () => {
        it('single rate across items', () => {
            const ctx = createRequestContext({ pricesIncludeTax: false });
            const order = createOrder({
                ctx,
                lines: [
                    {
                        listPrice: 300,
                        taxCategory: taxCategoryStandard,
                        quantity: 2,
                    },
                    {
                        listPrice: 1000,
                        taxCategory: taxCategoryStandard,
                        quantity: 1,
                    },
                ],
            });
            order.lines[0].items.forEach(i => (i.taxLines = [{ taxRate: 5, description: 'tax a' }]));
            order.lines[1].items.forEach(i => (i.taxLines = [{ taxRate: 5, description: 'tax a' }]));

            expect(order.taxSummary).toEqual([
                {
                    description: 'tax a',
                    taxRate: 5,
                    taxBase: 1600,
                    taxTotal: 80,
                },
            ]);
            assertOrderTaxesAddsUp(order);
        });

        it('different rate on each item', () => {
            const ctx = createRequestContext({ pricesIncludeTax: false });
            const order = createOrder({
                ctx,
                lines: [
                    {
                        listPrice: 300,
                        taxCategory: taxCategoryStandard,
                        quantity: 2,
                    },
                    {
                        listPrice: 1000,
                        taxCategory: taxCategoryStandard,
                        quantity: 1,
                    },
                ],
            });
            order.lines[0].items.forEach(i => (i.taxLines = [{ taxRate: 5, description: 'tax a' }]));
            order.lines[1].items.forEach(i => (i.taxLines = [{ taxRate: 7.5, description: 'tax b' }]));

            expect(order.taxSummary).toEqual([
                {
                    description: 'tax a',
                    taxRate: 5,
                    taxBase: 600,
                    taxTotal: 30,
                },
                {
                    description: 'tax b',
                    taxRate: 7.5,
                    taxBase: 1000,
                    taxTotal: 75,
                },
            ]);
            assertOrderTaxesAddsUp(order);
        });

        it('multiple rates on each item', () => {
            const ctx = createRequestContext({ pricesIncludeTax: false });
            const order = createOrder({
                ctx,
                lines: [
                    {
                        listPrice: 300,
                        taxCategory: taxCategoryStandard,
                        quantity: 2,
                    },
                    {
                        listPrice: 1000,
                        taxCategory: taxCategoryStandard,
                        quantity: 1,
                    },
                ],
            });
            order.lines[0].items.forEach(
                i =>
                    (i.taxLines = [
                        { taxRate: 5, description: 'tax a' },
                        { taxRate: 7.5, description: 'tax b' },
                    ]),
            );
            order.lines[1].items.forEach(
                i =>
                    (i.taxLines = [
                        { taxRate: 5, description: 'tax a' },
                        { taxRate: 7.5, description: 'tax b' },
                    ]),
            );

            expect(order.taxSummary).toEqual([
                {
                    description: 'tax a',
                    taxRate: 5,
                    taxBase: 1600,
                    taxTotal: 80,
                },
                {
                    description: 'tax b',
                    taxRate: 7.5,
                    taxBase: 1600,
                    taxTotal: 121,
                },
            ]);
            assertOrderTaxesAddsUp(order);
        });

        it('multiple rates on each item, prorated order discount', () => {
            const ctx = createRequestContext({ pricesIncludeTax: false });
            const order = createOrder({
                ctx,
                lines: [
                    {
                        listPrice: 300,
                        taxCategory: taxCategoryStandard,
                        quantity: 2,
                    },
                    {
                        listPrice: 1000,
                        taxCategory: taxCategoryStandard,
                        quantity: 1,
                    },
                ],
            });
            order.lines[0].items.forEach(i => {
                i.taxLines = [
                    { taxRate: 5, description: 'tax a' },
                    { taxRate: 7.5, description: 'tax b' },
                ];
                i.adjustments = [
                    {
                        amount: -30,
                        adjustmentSource: 'some order discount',
                        description: 'some order discount',
                        type: AdjustmentType.DISTRIBUTED_ORDER_PROMOTION,
                    },
                ];
            });
            order.lines[1].items.forEach(i => {
                i.taxLines = [
                    { taxRate: 5, description: 'tax a' },
                    { taxRate: 7.5, description: 'tax b' },
                ];
                i.adjustments = [
                    {
                        amount: -100,
                        adjustmentSource: 'some order discount',
                        description: 'some order discount',
                        type: AdjustmentType.DISTRIBUTED_ORDER_PROMOTION,
                    },
                ];
            });

            expect(order.taxSummary).toEqual([
                {
                    description: 'tax a',
                    taxRate: 5,
                    taxBase: 1440,
                    taxTotal: 72,
                },
                {
                    description: 'tax b',
                    taxRate: 7.5,
                    taxBase: 1440,
                    taxTotal: 109,
                },
            ]);
            assertOrderTaxesAddsUp(order);
        });

        it('multiple rates on each item, item discount, prorated order discount', () => {
            const ctx = createRequestContext({ pricesIncludeTax: false });
            const order = createOrder({
                ctx,
                lines: [
                    {
                        listPrice: 300,
                        taxCategory: taxCategoryStandard,
                        quantity: 2,
                    },
                    {
                        listPrice: 1000,
                        taxCategory: taxCategoryStandard,
                        quantity: 1,
                    },
                ],
            });
            order.lines[0].items.forEach(i => {
                i.taxLines = [
                    { taxRate: 5, description: 'tax a' },
                    { taxRate: 7.5, description: 'tax b' },
                ];
                i.adjustments = [
                    {
                        amount: -30,
                        adjustmentSource: 'some order discount',
                        description: 'some order discount',
                        type: AdjustmentType.DISTRIBUTED_ORDER_PROMOTION,
                    },
                    {
                        amount: -125,
                        adjustmentSource: 'some item discount',
                        description: 'some item discount',
                        type: AdjustmentType.PROMOTION,
                    },
                ];
            });
            order.lines[1].items.forEach(i => {
                i.taxLines = [
                    { taxRate: 5, description: 'tax a' },
                    { taxRate: 7.5, description: 'tax b' },
                ];
                i.adjustments = [
                    {
                        amount: -100,
                        adjustmentSource: 'some order discount',
                        description: 'some order discount',
                        type: AdjustmentType.DISTRIBUTED_ORDER_PROMOTION,
                    },
                ];
            });

            expect(order.taxSummary).toEqual([
                {
                    description: 'tax a',
                    taxRate: 5,
                    taxBase: 1190,
                    taxTotal: 59,
                },
                {
                    description: 'tax b',
                    taxRate: 7.5,
                    taxBase: 1190,
                    taxTotal: 90,
                },
            ]);
            assertOrderTaxesAddsUp(order);
        });

        it('zero rate', () => {
            const ctx = createRequestContext({ pricesIncludeTax: false });
            const order = createOrder({
                ctx,
                lines: [
                    {
                        listPrice: 300,
                        taxCategory: taxCategoryStandard,
                        quantity: 2,
                    },
                ],
            });
            order.lines[0].items.forEach(i => (i.taxLines = [{ taxRate: 0, description: 'zero-rate' }]));

            expect(order.taxSummary).toEqual([
                {
                    description: 'zero-rate',
                    taxRate: 0,
                    taxBase: 600,
                    taxTotal: 0,
                },
            ]);
            assertOrderTaxesAddsUp(order);
        });

        it('with shipping', () => {
            const ctx = createRequestContext({ pricesIncludeTax: false });
            const order = createOrder({
                ctx,
                lines: [
                    {
                        listPrice: 300,
                        taxCategory: taxCategoryStandard,
                        quantity: 2,
                    },
                    {
                        listPrice: 1000,
                        taxCategory: taxCategoryStandard,
                        quantity: 1,
                    },
                ],
            });
            order.lines[0].items.forEach(i => (i.taxLines = [{ taxRate: 5, description: 'tax a' }]));
            order.lines[1].items.forEach(i => (i.taxLines = [{ taxRate: 5, description: 'tax a' }]));
            order.shippingLines = [
                new ShippingLine({
                    listPrice: 500,
                    listPriceIncludesTax: false,
                    taxLines: [
                        {
                            taxRate: 20,
                            description: 'shipping tax',
                        },
                    ],
                }),
            ];
            order.shipping = 500;
            order.shippingWithTax = 600;

            expect(order.taxSummary).toEqual([
                {
                    description: 'tax a',
                    taxRate: 5,
                    taxBase: 1600,
                    taxTotal: 80,
                },
                {
                    description: 'shipping tax',
                    taxRate: 20,
                    taxBase: 500,
                    taxTotal: 100,
                },
            ]);
            assertOrderTaxesAddsUp(order);
        });
    });
});

function assertOrderTaxesAddsUp(order: Order) {
    const summaryTaxTotal = summate(order.taxSummary, 'taxTotal');
    const lineTotal = summate(order.lines, 'proratedLinePrice');
    const lineTotalWithTax = summate(order.lines, 'proratedLinePriceWithTax');
    const shippingTax = (order.shippingWithTax ?? 0) - (order.shipping ?? 0);
    expect(lineTotalWithTax - lineTotal + shippingTax).toBe(summaryTaxTotal);
}
