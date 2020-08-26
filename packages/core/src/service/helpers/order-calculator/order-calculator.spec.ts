import { Test } from '@nestjs/testing';
import { LanguageCode } from '@vendure/common/lib/generated-types';
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
import { WorkerService } from '../../../worker/worker.service';
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
                { provide: WorkerService, useValue: { send: () => ({}) } },
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
            couponCodes: [],
            pendingAdjustments: [],
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
            description: [{ languageCode: LanguageCode.en, value: '' }],
            check() {
                return true;
            },
        });

        const orderTotalCondition = new PromotionCondition({
            args: { minimum: { type: 'int' } },
            code: 'order_total_condition',
            description: [{ languageCode: LanguageCode.en, value: '' }],
            check(order, args) {
                return args.minimum <= order.total;
            },
        });

        const fixedPriceItemAction = new PromotionItemAction({
            code: 'fixed_price_item_action',
            description: [{ languageCode: LanguageCode.en, value: '' }],
            args: {},
            execute(item) {
                return -item.unitPrice + 42;
            },
        });

        const fixedPriceOrderAction = new PromotionOrderAction({
            code: 'fixed_price_order_action',
            description: [{ languageCode: LanguageCode.en, value: '' }],
            args: {},
            execute(order) {
                return -order.total + 42;
            },
        });

        const percentageItemAction = new PromotionItemAction({
            code: 'percentage_item_action',
            description: [{ languageCode: LanguageCode.en, value: '' }],
            args: { discount: { type: 'int' } },
            async execute(orderItem, orderLine, args) {
                return -orderLine.unitPrice * (args.discount / 100);
            },
        });

        const percentageOrderAction = new PromotionOrderAction({
            code: 'percentage_order_action',
            description: [{ languageCode: LanguageCode.en, value: '' }],
            args: { discount: { type: 'int' } },
            execute(order, args) {
                return -order.subTotal * (args.discount / 100);
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
                        args: [{ name: 'minimum', value: '100' }],
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

        it('percentage order discount (price includes tax)', async () => {
            const promotion = new Promotion({
                id: 1,
                name: '50% off order',
                conditions: [{ code: alwaysTrueCondition.code, args: [] }],
                promotionConditions: [alwaysTrueCondition],
                actions: [
                    {
                        code: percentageOrderAction.code,
                        args: [{ name: 'discount', value: '50' }],
                    },
                ],
                promotionActions: [percentageOrderAction],
            });

            const ctx = createRequestContext(true);
            const order = createOrder({
                lines: [{ unitPrice: 100, taxCategory: taxCategoryStandard, quantity: 1 }],
            });
            await orderCalculator.applyPriceAdjustments(ctx, order, [promotion]);

            expect(order.subTotal).toBe(100);
            expect(order.adjustments.length).toBe(1);
            expect(order.adjustments[0].description).toBe('50% off order');
            expect(order.total).toBe(50);
        });

        it('percentage order discount (price excludes tax)', async () => {
            const promotion = new Promotion({
                id: 1,
                name: '50% off order',
                conditions: [{ code: alwaysTrueCondition.code, args: [] }],
                promotionConditions: [alwaysTrueCondition],
                actions: [
                    {
                        code: percentageOrderAction.code,
                        args: [{ name: 'discount', value: '50' }],
                    },
                ],
                promotionActions: [percentageOrderAction],
            });

            const ctx = createRequestContext(false);
            const order = createOrder({
                lines: [{ unitPrice: 83, taxCategory: taxCategoryStandard, quantity: 1 }],
            });
            await orderCalculator.applyPriceAdjustments(ctx, order, [promotion]);

            expect(order.subTotal).toBe(100);
            expect(order.adjustments.length).toBe(1);
            expect(order.adjustments[0].description).toBe('50% off order');
            expect(order.total).toBe(50);
        });

        it('percentage items discount (price includes tax)', async () => {
            const promotion = new Promotion({
                id: 1,
                name: '50% off each item',
                conditions: [{ code: alwaysTrueCondition.code, args: [] }],
                promotionConditions: [alwaysTrueCondition],
                actions: [
                    {
                        code: percentageItemAction.code,
                        args: [{ name: 'discount', value: '50' }],
                    },
                ],
                promotionActions: [percentageItemAction],
            });

            const ctx = createRequestContext(true);
            const order = createOrder({
                lines: [{ unitPrice: 100, taxCategory: taxCategoryStandard, quantity: 1 }],
            });
            await orderCalculator.applyPriceAdjustments(ctx, order, [promotion]);

            expect(order.subTotal).toBe(50);
            expect(order.lines[0].adjustments.length).toBe(1);
            expect(order.lines[0].adjustments[0].description).toBe('50% off each item');
            expect(order.total).toBe(50);
        });

        it('percentage items discount (price excludes tax)', async () => {
            const promotion = new Promotion({
                id: 1,
                name: '50% off each item',
                conditions: [{ code: alwaysTrueCondition.code, args: [] }],
                promotionConditions: [alwaysTrueCondition],
                actions: [
                    {
                        code: percentageItemAction.code,
                        args: [{ name: 'discount', value: '50' }],
                    },
                ],
                promotionActions: [percentageItemAction],
            });

            const ctx = createRequestContext(false);
            const order = createOrder({
                lines: [{ unitPrice: 83, taxCategory: taxCategoryStandard, quantity: 1 }],
            });
            await orderCalculator.applyPriceAdjustments(ctx, order, [promotion]);

            expect(order.subTotal).toBe(50);
            expect(order.total).toBe(50);
        });

        describe('interaction amongst promotion actions', () => {
            const orderQuantityCondition = new PromotionCondition({
                args: { minimum: { type: 'int' } },
                code: 'order_quantity_condition',
                description: [
                    {
                        languageCode: LanguageCode.en,
                        value: 'Passes if any order line has at least the minimum quantity',
                    },
                ],
                check(_order, args) {
                    for (const line of _order.lines) {
                        if (args.minimum <= line.quantity) {
                            return true;
                        }
                    }
                    return false;
                },
            });

            const buy3Get10pcOffOrder = new Promotion({
                id: 1,
                name: 'Buy 3 Get 50% off order',
                conditions: [
                    {
                        code: orderQuantityCondition.code,
                        args: [{ name: 'minimum', value: '3' }],
                    },
                ],
                promotionConditions: [orderQuantityCondition],
                actions: [
                    {
                        code: percentageOrderAction.code,
                        args: [{ name: 'discount', value: '50' }],
                    },
                ],
                promotionActions: [percentageOrderAction],
            });

            const spend100Get10pcOffOrder = new Promotion({
                id: 2,
                name: 'Spend $100 Get 10% off order',
                conditions: [
                    {
                        code: orderTotalCondition.code,
                        args: [{ name: 'minimum', value: '100' }],
                    },
                ],
                promotionConditions: [orderTotalCondition],
                actions: [
                    {
                        code: percentageOrderAction.code,
                        args: [{ name: 'discount', value: '10' }],
                    },
                ],
                promotionActions: [percentageOrderAction],
            });

            it('two order-level percentage discounts (tax included in prices)', async () => {
                const ctx = createRequestContext(true);
                const order = createOrder({
                    lines: [{ unitPrice: 50, taxCategory: taxCategoryStandard, quantity: 2 }],
                });

                // initially the order is $100, so the second promotion applies
                await orderCalculator.applyPriceAdjustments(ctx, order, [
                    buy3Get10pcOffOrder,
                    spend100Get10pcOffOrder,
                ]);

                expect(order.subTotal).toBe(100);
                expect(order.adjustments.length).toBe(1);
                expect(order.adjustments[0].description).toBe(spend100Get10pcOffOrder.name);
                expect(order.total).toBe(90);

                // increase the quantity to 3, which will trigger the first promotion and thus
                // bring the order total below the threshold for the second promotion.
                order.lines[0].items.push(new OrderItem({ unitPrice: 50 }));

                await orderCalculator.applyPriceAdjustments(ctx, order, [
                    buy3Get10pcOffOrder,
                    spend100Get10pcOffOrder,
                ]);

                expect(order.subTotal).toBe(150);
                expect(order.adjustments.length).toBe(1);
                expect(order.total).toBe(75);
            });

            it('two order-level percentage discounts (tax excluded from prices)', async () => {
                const ctx = createRequestContext(false);
                const order = createOrder({
                    lines: [{ unitPrice: 42, taxCategory: taxCategoryStandard, quantity: 2 }],
                });

                // initially the order is $100, so the second promotion applies
                await orderCalculator.applyPriceAdjustments(ctx, order, [
                    buy3Get10pcOffOrder,
                    spend100Get10pcOffOrder,
                ]);

                expect(order.subTotal).toBe(100);
                expect(order.adjustments.length).toBe(1);
                expect(order.adjustments[0].description).toBe(spend100Get10pcOffOrder.name);
                expect(order.total).toBe(90);

                // increase the quantity to 3, which will trigger the first promotion and thus
                // bring the order total below the threshold for the second promotion.
                order.lines[0].items.push(new OrderItem({ unitPrice: 42 }));

                await orderCalculator.applyPriceAdjustments(
                    ctx,
                    order,
                    [buy3Get10pcOffOrder, spend100Get10pcOffOrder],
                    order.lines[0],
                );

                expect(order.subTotal).toBe(150);
                expect(order.adjustments.length).toBe(1);
                expect(order.total).toBe(75);
            });

            const orderPromo = new Promotion({
                id: 1,
                name: '10% off order',
                couponCode: 'ORDER10',
                conditions: [],
                promotionConditions: [],
                actions: [
                    {
                        code: percentageOrderAction.code,
                        args: [{ name: 'discount', value: '10' }],
                    },
                ],
                promotionActions: [percentageOrderAction],
            });

            const itemPromo = new Promotion({
                id: 2,
                name: '10% off item',
                couponCode: 'ITEM10',
                conditions: [],
                promotionConditions: [],
                actions: [
                    {
                        code: percentageItemAction.code,
                        args: [{ name: 'discount', value: '10' }],
                    },
                ],
                promotionActions: [percentageItemAction],
            });

            it('item-level & order-level percentage discounts', async () => {
                const ctx = createRequestContext(true);
                const order = createOrder({
                    lines: [{ unitPrice: 155880, taxCategory: taxCategoryStandard, quantity: 1 }],
                });
                await orderCalculator.applyPriceAdjustments(ctx, order, [orderPromo, itemPromo]);

                expect(order.total).toBe(155880);

                // Apply the item-level discount
                order.couponCodes.push('ITEM10');
                await orderCalculator.applyPriceAdjustments(ctx, order, [orderPromo, itemPromo]);
                expect(order.total).toBe(140292);

                // Apply the order-level discount
                order.couponCodes.push('ORDER10');
                await orderCalculator.applyPriceAdjustments(ctx, order, [orderPromo, itemPromo]);
                expect(order.total).toBe(126263);
            });

            it('item-level & order-level percentage (tax not included)', async () => {
                const ctx = createRequestContext(false);
                const order = createOrder({
                    lines: [{ unitPrice: 129900, taxCategory: taxCategoryStandard, quantity: 1 }],
                });
                await orderCalculator.applyPriceAdjustments(ctx, order, [orderPromo, itemPromo]);

                expect(order.total).toBe(155880);

                // Apply the item-level discount
                order.couponCodes.push('ITEM10');
                await orderCalculator.applyPriceAdjustments(ctx, order, [orderPromo, itemPromo]);
                expect(order.total).toBe(140292);
                expect(order.adjustments.length).toBe(0);

                // Apply the order-level discount
                order.couponCodes.push('ORDER10');
                await orderCalculator.applyPriceAdjustments(ctx, order, [orderPromo, itemPromo]);
                expect(order.total).toBe(126263);
                expect(order.adjustments.length).toBe(1);
            });

            it('empty string couponCode does not prevent promotion being applied', async () => {
                const hasEmptyStringCouponCode = new Promotion({
                    id: 2,
                    name: 'Has empty string couponCode',
                    couponCode: '',
                    conditions: [
                        {
                            code: orderTotalCondition.code,
                            args: [{ name: 'minimum', value: '10' }],
                        },
                    ],
                    promotionConditions: [orderTotalCondition],
                    actions: [
                        {
                            code: percentageOrderAction.code,
                            args: [{ name: 'discount', value: '10' }],
                        },
                    ],
                    promotionActions: [percentageOrderAction],
                });

                const ctx = createRequestContext(false);
                const order = createOrder({
                    lines: [{ unitPrice: 100, taxCategory: taxCategoryStandard, quantity: 1 }],
                });
                await orderCalculator.applyPriceAdjustments(ctx, order, [hasEmptyStringCouponCode]);

                expect(order.adjustments.length).toBe(1);
                expect(order.adjustments[0].description).toBe(hasEmptyStringCouponCode.name);
            });
        });
    });
});
