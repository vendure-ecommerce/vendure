import { Test } from '@nestjs/testing';
import { Omit } from '@vendure/common/lib/omit';
import { Connection } from 'typeorm';

import { PromotionItemAction, PromotionOrderAction } from '../../../config';
import { ConfigService } from '../../../config/config.service';
import { MockConfigService } from '../../../config/config.service.mock';
import { PromotionCondition } from '../../../config/promotion/promotion-condition';
import { DefaultTaxCalculationStrategy } from '../../../config/tax/default-tax-calculation-strategy';
import { DefaultTaxZoneStrategy } from '../../../config/tax/default-tax-zone-strategy';
import { Promotion } from '../../../entity';
import { OrderItem } from '../../../entity/order-item/order-item.entity';
import { OrderLine } from '../../../entity/order-line/order-line.entity';
import { Order } from '../../../entity/order/order.entity';
import { TaxCategory } from '../../../entity/tax-category/tax-category.entity';
import { EventBus } from '../../../event-bus/event-bus';
import { TaxRateService } from '../../services/tax-rate.service';
import { ZoneService } from '../../services/zone.service';
import { ListQueryBuilder } from '../list-query-builder/list-query-builder';
import { ShippingCalculator } from '../shipping-calculator/shipping-calculator';
import { TaxCalculator } from '../tax-calculator/tax-calculator';
import {
    createRequestContext,
    MockConnection,
    taxCategoryStandard,
} from '../tax-calculator/tax-calculator-test-fixtures';

import { OrderCalculator } from './order-calculator';

describe('OrderCalculator', () => {
    let orderCalculator: OrderCalculator;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                OrderCalculator,
                TaxCalculator,
                TaxRateService,
                { provide: ShippingCalculator, useValue: { getEligibleShippingMethods: () => [] } },
                { provide: Connection, useClass: MockConnection },
                { provide: ListQueryBuilder, useValue: {} },
                { provide: ConfigService, useClass: MockConfigService },
                { provide: EventBus, useValue: { publish: () => ({}) } },
                { provide: ZoneService, useValue: { findAll: () => [] } },
            ],
        }).compile();

        orderCalculator = module.get(OrderCalculator);
        const mockConfigService = module.get<ConfigService, MockConfigService>(ConfigService);
        mockConfigService.taxOptions = {
            taxZoneStrategy: new DefaultTaxZoneStrategy(),
            taxCalculationStrategy: new DefaultTaxCalculationStrategy(),
        };
        const taxRateService = module.get(TaxRateService);
        await taxRateService.initTaxRates();
    });

    function createOrder(
        orderConfig: Partial<Omit<Order, 'lines'>> & {
            lines: Array<{ unitPrice: number; taxCategory: TaxCategory; quantity: number }>;
        },
    ): Order {
        const lines = orderConfig.lines.map(
            ({ unitPrice, taxCategory, quantity }) =>
                new OrderLine({
                    taxCategory,
                    items: Array.from({ length: quantity }).map(
                        () =>
                            new OrderItem({
                                unitPrice,
                            }),
                    ),
                }),
        );

        return new Order({
            lines,
        });
    }

    describe('taxes', () => {
        it('single line with taxes not included', async () => {
            const ctx = createRequestContext(false);
            const order = createOrder({
                lines: [{ unitPrice: 123, taxCategory: taxCategoryStandard, quantity: 1 }],
            });
            await orderCalculator.applyPriceAdjustments(ctx, order, []);

            expect(order.subTotal).toBe(148);
            expect(order.subTotalBeforeTax).toBe(123);
        });

        it('single line with taxes not included, multiple items', async () => {
            const ctx = createRequestContext(false);
            const order = createOrder({
                lines: [{ unitPrice: 123, taxCategory: taxCategoryStandard, quantity: 3 }],
            });
            await orderCalculator.applyPriceAdjustments(ctx, order, []);

            expect(order.subTotal).toBe(444);
            expect(order.subTotalBeforeTax).toBe(369);
        });

        it('single line with taxes included', async () => {
            const ctx = createRequestContext(true);
            const order = createOrder({
                lines: [{ unitPrice: 123, taxCategory: taxCategoryStandard, quantity: 1 }],
            });
            await orderCalculator.applyPriceAdjustments(ctx, order, []);

            expect(order.subTotal).toBe(123);
            expect(order.subTotalBeforeTax).toBe(102);
        });

        it('resets totals when lines array is empty', async () => {
            const ctx = createRequestContext(true);
            const order = createOrder({
                lines: [],
                subTotal: 148,
                subTotalBeforeTax: 123,
            });
            await orderCalculator.applyPriceAdjustments(ctx, order, []);

            expect(order.subTotal).toBe(0);
            expect(order.subTotalBeforeTax).toBe(0);
        });
    });

    describe('promotions', () => {
        const alwaysTrueCondition = new PromotionCondition({
            args: {},
            code: 'always_true_condition',
            description: '',
            check() {
                return true;
            },
        });

        const orderTotalCondition = new PromotionCondition({
            args: { minimum: { type: 'int' } },
            code: 'order_total_condition',
            description: '',
            check(order, args) {
                return args.minimum <= order.total;
            },
        });

        const fixedPriceItemAction = new PromotionItemAction({
            code: 'fixed_price_item_action',
            description: '',
            args: {},
            execute(item) {
                return -item.unitPrice + 42;
            },
        });

        const fixedPriceOrderAction = new PromotionOrderAction({
            code: 'fixed_price_item_action',
            description: '',
            args: {},
            execute(order) {
                return -order.total + 42;
            },
        });

        it('single line with single applicable promotion', async () => {
            const promotion = new Promotion({
                id: 1,
                conditions: [{ code: alwaysTrueCondition.code, args: [] }],
                promotionConditions: [alwaysTrueCondition],
                actions: [{ code: fixedPriceOrderAction.code, args: [] }],
                promotionActions: [fixedPriceOrderAction],
            });

            const ctx = createRequestContext(true);
            const order = createOrder({
                lines: [{ unitPrice: 123, taxCategory: taxCategoryStandard, quantity: 1 }],
            });
            await orderCalculator.applyPriceAdjustments(ctx, order, [promotion]);

            expect(order.subTotal).toBe(123);
            expect(order.total).toBe(42);
        });

        it('condition based on order total', async () => {
            const promotion = new Promotion({
                id: 1,
                name: 'Test Promotion 1',
                conditions: [
                    {
                        code: orderTotalCondition.code,
                        args: [{ name: 'minimum', type: 'int', value: '100' }],
                    },
                ],
                promotionConditions: [orderTotalCondition],
                actions: [{ code: fixedPriceOrderAction.code, args: [] }],
                promotionActions: [fixedPriceOrderAction],
            });

            const ctx = createRequestContext(true);
            const order = createOrder({
                lines: [{ unitPrice: 50, taxCategory: taxCategoryStandard, quantity: 1 }],
            });
            await orderCalculator.applyPriceAdjustments(ctx, order, [promotion]);

            expect(order.subTotal).toBe(50);
            expect(order.adjustments.length).toBe(0);
            expect(order.total).toBe(50);

            // increase the quantity to 2, which will take the total over the minimum set by the
            // condition.
            order.lines[0].items.push(new OrderItem({ unitPrice: 50 }));

            await orderCalculator.applyPriceAdjustments(ctx, order, [promotion]);

            expect(order.subTotal).toBe(100);
            // Now the fixedPriceOrderAction should be in effect
            expect(order.adjustments.length).toBe(1);
            expect(order.total).toBe(42);
        });

        it('interaction between promotions', async () => {
            const orderQuantityCondition = new PromotionCondition({
                args: { minimum: { type: 'int' } },
                code: 'order_quantity_condition',
                description: 'Passes if any order line has at least the minimum quantity',
                check(_order, args) {
                    for (const line of _order.lines) {
                        if (args.minimum <= line.quantity) {
                            return true;
                        }
                    }
                    return false;
                },
            });

            const orderPercentageDiscount = new PromotionOrderAction({
                code: 'order_percentage_discount',
                args: { discount: { type: 'int' } },
                execute(_order, args) {
                    return -_order.subTotal * (args.discount / 100);
                },
                description: 'Discount order by { discount }%',
            });

            const promotion1 = new Promotion({
                id: 1,
                name: 'Buy 3 Get 50% off order',
                conditions: [
                    {
                        code: orderQuantityCondition.code,
                        args: [{ name: 'minimum', type: 'int', value: '3' }],
                    },
                ],
                promotionConditions: [orderQuantityCondition],
                actions: [
                    {
                        code: orderPercentageDiscount.code,
                        args: [{ name: 'discount', type: 'int', value: '50' }],
                    },
                ],
                promotionActions: [orderPercentageDiscount],
            });

            const promotion2 = new Promotion({
                id: 1,
                name: 'Spend $100 Get 10% off order',
                conditions: [
                    {
                        code: orderTotalCondition.code,
                        args: [{ name: 'minimum', type: 'int', value: '100' }],
                    },
                ],
                promotionConditions: [orderTotalCondition],
                actions: [
                    {
                        code: orderPercentageDiscount.code,
                        args: [{ name: 'discount', type: 'int', value: '10' }],
                    },
                ],
                promotionActions: [orderPercentageDiscount],
            });

            const ctx = createRequestContext(true);
            const order = createOrder({
                lines: [{ unitPrice: 50, taxCategory: taxCategoryStandard, quantity: 2 }],
            });

            // initially the order is $100, so the second promotion applies
            await orderCalculator.applyPriceAdjustments(ctx, order, [promotion1, promotion2]);

            expect(order.subTotal).toBe(100);
            expect(order.adjustments.length).toBe(1);
            expect(order.adjustments[0].description).toBe(promotion2.name);
            expect(order.total).toBe(90);

            // increase the quantity to 3, which will trigger the first promotion and thus
            // bring the order total below the threshold for the second promotion.
            order.lines[0].items.push(new OrderItem({ unitPrice: 50 }));

            await orderCalculator.applyPriceAdjustments(ctx, order, [promotion1, promotion2]);

            expect(order.subTotal).toBe(150);
            expect(order.adjustments.length).toBe(1);
            // expect(order.adjustments[0].description).toBe(promotion1.name);
            expect(order.total).toBe(75);
        });
    });
});
