import { AdjustmentType } from 'shared/generated-types';

import {
    AdjustmentActionDefinition,
    AdjustmentConditionDefinition,
} from '../../config/adjustment/adjustment-types';
import { taxAction } from '../../config/adjustment/required-adjustment-actions';
import { taxCondition } from '../../config/adjustment/required-adjustment-conditions';
import { AdjustmentSource } from '../../entity/adjustment-source/adjustment-source.entity';
import { OrderLine } from '../../entity/order-line/order-line.entity';
import { Order } from '../../entity/order/order.entity';

import { applyAdjustments, orderAdjustmentSources } from './apply-adjustments';

describe('orderAdjustmentSources()', () => {
    it('orders sources correctly', () => {
        const result = orderAdjustmentSources([
            { id: 1, type: AdjustmentType.PROMOTION } as any,
            { id: 2, type: AdjustmentType.SHIPPING } as any,
            { id: 3, type: AdjustmentType.TAX } as any,
            { id: 4, type: AdjustmentType.PROMOTION } as any,
            { id: 5, type: AdjustmentType.PROMOTION } as any,
            { id: 6, type: AdjustmentType.TAX } as any,
            { id: 7, type: AdjustmentType.SHIPPING } as any,
        ]);

        expect(result.map(s => s.id)).toEqual([3, 6, 1, 4, 5, 2, 7]);
    });
});

describe('applyAdjustments()', () => {
    const minOrderTotalCondition: AdjustmentConditionDefinition = {
        code: 'min_order_total',
        description: 'Order total is at least { minimum }',
        args: [{ name: 'minimum', type: 'money' }],
        type: AdjustmentType.PROMOTION,
        predicate: (order, args) => {
            return order.totalPrice >= args.minimum;
        },
    };

    const orderDiscountAction: AdjustmentActionDefinition = {
        code: 'order_discount',
        description: 'Discount order total by { percentage }%',
        args: [{ name: 'percentage', type: 'percentage' }],
        type: AdjustmentType.PROMOTION,
        calculate: (order, args) => {
            return [
                {
                    amount: -((order.totalPrice * args.percentage) / 100),
                },
            ];
        },
    };

    const promoSource1 = new AdjustmentSource({
        id: 'ps1',
        name: 'Promo source 1',
        type: AdjustmentType.PROMOTION,
        conditions: [
            {
                code: minOrderTotalCondition.code,
                args: [
                    {
                        type: 'money',
                        name: 'minimum',
                        value: '500',
                    },
                ],
            },
        ],
        actions: [
            {
                code: orderDiscountAction.code,
                args: [
                    {
                        type: 'percentage',
                        name: 'percentage',
                        value: '10',
                    },
                ],
            },
        ],
    });

    const standardTaxSource = AdjustmentSource.createTaxCategory(20, 'Standard Tax', 'ts1');
    const zeroTaxSource = AdjustmentSource.createTaxCategory(0, 'Zero Tax 2', 'ts2');

    const conditions = [minOrderTotalCondition, taxCondition];
    const actions = [orderDiscountAction, taxAction];

    it('applies a promo source to an order', () => {
        const order = new Order({
            code: 'ABC',
            lines: [
                new OrderLine({
                    id: 'oi1',
                    unitPrice: 300,
                    quantity: 2,
                    totalPriceBeforeAdjustment: 600,
                }),
            ],
            totalPriceBeforeAdjustment: 600,
        });

        applyAdjustments(order, [promoSource1], conditions, actions);

        expect(order.adjustments).toEqual([
            {
                adjustmentSourceId: promoSource1.id,
                description: promoSource1.name,
                amount: -60,
            },
        ]);
        expect(order.lines[0].adjustments).toEqual([]);
        expect(order.totalPrice).toBe(540);
    });

    it('applies a tax source to order lines', () => {
        const order = new Order({
            code: 'ABC',
            lines: [
                new OrderLine({
                    id: 'oi1',
                    unitPrice: 300,
                    quantity: 2,
                    totalPriceBeforeAdjustment: 600,
                    taxCategoryId: standardTaxSource.id,
                }),
                new OrderLine({
                    id: 'oi2',
                    unitPrice: 450,
                    quantity: 1,
                    totalPriceBeforeAdjustment: 450,
                    taxCategoryId: zeroTaxSource.id,
                }),
            ],
            totalPriceBeforeAdjustment: 1050,
        });

        applyAdjustments(order, [standardTaxSource, zeroTaxSource], conditions, actions);

        expect(order.adjustments).toEqual([]);
        expect(order.lines[0].adjustments).toEqual([
            {
                adjustmentSourceId: standardTaxSource.id,
                description: standardTaxSource.name,
                amount: 120,
            },
        ]);
        expect(order.lines[0].totalPrice).toBe(720);
        expect(order.lines[1].adjustments).toEqual([
            {
                adjustmentSourceId: zeroTaxSource.id,
                description: zeroTaxSource.name,
                amount: 0,
            },
        ]);
        expect(order.lines[1].totalPrice).toBe(450);

        expect(order.totalPrice).toBe(1170);
    });

    it('evaluates promo conditions on lines after tax is applied', () => {
        const order = new Order({
            code: 'ABC',
            lines: [
                new OrderLine({
                    id: 'oi1',
                    unitPrice: 240,
                    quantity: 2,
                    totalPriceBeforeAdjustment: 480,
                    taxCategoryId: standardTaxSource.id,
                }),
            ],
            totalPriceBeforeAdjustment: 480,
        });

        applyAdjustments(order, [promoSource1, standardTaxSource, zeroTaxSource], conditions, actions);

        expect(order.lines[0].adjustments).toEqual([
            {
                adjustmentSourceId: standardTaxSource.id,
                description: standardTaxSource.name,
                amount: 96,
            },
        ]);
        expect(order.lines[0].totalPrice).toBe(576);
        expect(order.adjustments).toEqual([
            {
                adjustmentSourceId: promoSource1.id,
                description: promoSource1.name,
                amount: -58,
            },
        ]);
        expect(order.totalPrice).toBe(518);
    });
});
