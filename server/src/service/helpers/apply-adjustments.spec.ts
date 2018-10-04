import { AdjustmentType } from 'shared/generated-types';

import {
    AdjustmentActionDefinition,
    AdjustmentConditionDefinition,
} from '../../config/adjustment/adjustment-types';
import { AdjustmentSource } from '../../entity/adjustment-source/adjustment-source.entity';
import { OrderItem } from '../../entity/order-item/order-item.entity';
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

    const alwaysTrueCondition: AdjustmentConditionDefinition = {
        code: 'always_true',
        description: 'Always returns true',
        args: [],
        type: AdjustmentType.TAX,
        predicate: (order, args) => {
            return true;
        },
    };

    const standardTaxAction: AdjustmentActionDefinition = {
        code: 'standard_tax',
        description: 'Adds standard sales tax of { percentage }%',
        args: [{ name: 'percentage', type: 'percentage' }],
        type: AdjustmentType.TAX,
        calculate: (order, args) => {
            return order.items.map(item => ({
                orderItemId: item.id,
                amount: item.totalPrice * (args.percentage / 100),
            }));
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

    const standardTaxSource = new AdjustmentSource({
        id: 'ts1',
        name: 'Tax source',
        type: AdjustmentType.TAX,
        conditions: [
            {
                code: alwaysTrueCondition.code,
                args: [],
            },
        ],
        actions: [
            {
                code: standardTaxAction.code,
                args: [
                    {
                        type: 'percentage',
                        name: 'percentage',
                        value: '20',
                    },
                ],
            },
        ],
    });

    const conditions = [minOrderTotalCondition, alwaysTrueCondition];
    const actions = [orderDiscountAction, standardTaxAction];

    it('applies a promo source to an order', () => {
        const order = new Order({
            code: 'ABC',
            items: [
                new OrderItem({
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
        expect(order.items[0].adjustments).toEqual([]);
        expect(order.totalPrice).toBe(540);
    });

    it('applies a tax source to order items', () => {
        const order = new Order({
            code: 'ABC',
            items: [
                new OrderItem({
                    id: 'oi1',
                    unitPrice: 300,
                    quantity: 2,
                    totalPriceBeforeAdjustment: 600,
                }),
                new OrderItem({
                    id: 'oi2',
                    unitPrice: 450,
                    quantity: 1,
                    totalPriceBeforeAdjustment: 450,
                }),
            ],
            totalPriceBeforeAdjustment: 1050,
        });

        applyAdjustments(order, [standardTaxSource], conditions, actions);

        expect(order.adjustments).toEqual([]);
        expect(order.items[0].adjustments).toEqual([
            {
                adjustmentSourceId: standardTaxSource.id,
                description: standardTaxSource.name,
                amount: 120,
            },
        ]);
        expect(order.items[0].totalPrice).toBe(720);
        expect(order.items[1].adjustments).toEqual([
            {
                adjustmentSourceId: standardTaxSource.id,
                description: standardTaxSource.name,
                amount: 90,
            },
        ]);
        expect(order.items[1].totalPrice).toBe(540);

        expect(order.totalPrice).toBe(1260);
    });

    it('evaluates promo conditions on items after tax is applied', () => {
        const order = new Order({
            code: 'ABC',
            items: [
                new OrderItem({
                    id: 'oi1',
                    unitPrice: 240,
                    quantity: 2,
                    totalPriceBeforeAdjustment: 480,
                }),
            ],
            totalPriceBeforeAdjustment: 480,
        });

        applyAdjustments(order, [promoSource1, standardTaxSource], conditions, actions);

        expect(order.items[0].adjustments).toEqual([
            {
                adjustmentSourceId: standardTaxSource.id,
                description: standardTaxSource.name,
                amount: 96,
            },
        ]);
        expect(order.items[0].totalPrice).toBe(576);
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
