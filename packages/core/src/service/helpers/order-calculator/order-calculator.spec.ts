import { Test } from '@nestjs/testing';
import { AdjustmentType, LanguageCode } from '@vendure/common/lib/generated-types';
import { Omit } from '@vendure/common/lib/omit';
import { summate } from '@vendure/common/lib/shared-utils';

import { RequestContext } from '../../../api/common/request-context';
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
import { ShippingMethodService } from '../../services/shipping-method.service';
import { TaxRateService } from '../../services/tax-rate.service';
import { ZoneService } from '../../services/zone.service';
import { TransactionalConnection } from '../../transaction/transactional-connection';
import { ListQueryBuilder } from '../list-query-builder/list-query-builder';
import { ShippingCalculator } from '../shipping-calculator/shipping-calculator';
import { TaxCalculator } from '../tax-calculator/tax-calculator';
import {
    createRequestContext,
    MockConnection,
    taxCategoryReduced,
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
                { provide: ShippingMethodService, useValue: { findOne: () => undefined } },
                { provide: TransactionalConnection, useClass: MockConnection },
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

    describe('taxes', () => {
        it('single line', async () => {
            const ctx = createRequestContext({ pricesIncludeTax: false });
            const order = createOrder({
                ctx,
                lines: [
                    {
                        listPrice: 123,
                        taxCategory: taxCategoryStandard,
                        quantity: 1,
                    },
                ],
            });
            await orderCalculator.applyPriceAdjustments(ctx, order, []);

            expect(order.subTotal).toBe(123);
            expect(order.subTotalWithTax).toBe(148);
        });

        it('single line, multiple items', async () => {
            const ctx = createRequestContext({ pricesIncludeTax: false });
            const order = createOrder({
                ctx,
                lines: [
                    {
                        listPrice: 123,
                        taxCategory: taxCategoryStandard,
                        quantity: 3,
                    },
                ],
            });
            await orderCalculator.applyPriceAdjustments(ctx, order, []);

            expect(order.subTotal).toBe(369);
            expect(order.subTotalWithTax).toBe(444);
        });

        it('resets totals when lines array is empty', async () => {
            const ctx = createRequestContext({ pricesIncludeTax: false });
            const order = createOrder({
                ctx,
                lines: [],
                subTotal: 148,
            });
            await orderCalculator.applyPriceAdjustments(ctx, order, []);

            expect(order.subTotal).toBe(0);
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
            check(ctx, order, args) {
                const threshold = ctx.channel.pricesIncludeTax ? order.subTotalWithTax : order.subTotal;
                return args.minimum <= threshold;
            },
        });

        const fixedPriceItemAction = new PromotionItemAction({
            code: 'fixed_price_item_action',
            description: [{ languageCode: LanguageCode.en, value: '' }],
            args: {},
            execute(ctx, item) {
                return -item.unitPrice + 42;
            },
        });

        const fixedPriceOrderAction = new PromotionOrderAction({
            code: 'fixed_price_order_action',
            description: [{ languageCode: LanguageCode.en, value: '' }],
            args: {},
            execute(ctx, order) {
                return (ctx.channel.pricesIncludeTax ? -order.subTotalWithTax : -order.subTotal) + 420;
            },
        });

        const fixedDiscountOrderAction = new PromotionOrderAction({
            code: 'fixed_discount_order_action',
            description: [{ languageCode: LanguageCode.en, value: '' }],
            args: {},
            execute(ctx, order) {
                const discount = -500;
                return discount;
            },
        });

        const percentageItemAction = new PromotionItemAction({
            code: 'percentage_item_action',
            description: [{ languageCode: LanguageCode.en, value: '' }],
            args: { discount: { type: 'int' } },
            async execute(ctx, orderItem, orderLine, args) {
                const unitPrice = ctx.channel.pricesIncludeTax
                    ? orderLine.unitPriceWithTax
                    : orderLine.unitPrice;
                return -unitPrice * (args.discount / 100);
            },
        });

        const percentageOrderAction = new PromotionOrderAction({
            code: 'percentage_order_action',
            description: [{ languageCode: LanguageCode.en, value: '' }],
            args: { discount: { type: 'int' } },
            execute(ctx, order, args) {
                const orderTotal = ctx.channel.pricesIncludeTax ? order.subTotalWithTax : order.subTotal;
                return -orderTotal * (args.discount / 100);
            },
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

            const ctx = createRequestContext({ pricesIncludeTax: false });
            const order = createOrder({
                ctx,
                lines: [
                    {
                        listPrice: 100,
                        taxCategory: taxCategoryStandard,
                        quantity: 1,
                    },
                ],
            });
            await orderCalculator.applyPriceAdjustments(ctx, order, [hasEmptyStringCouponCode]);

            expect(order.discounts.length).toBe(1);
            expect(order.discounts[0].description).toBe(hasEmptyStringCouponCode.name);
        });

        describe('OrderItem-level promotions', () => {
            describe('percentage items discount', () => {
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

                it('prices exclude tax', async () => {
                    const ctx = createRequestContext({ pricesIncludeTax: false });
                    const order = createOrder({
                        ctx,
                        lines: [
                            {
                                listPrice: 8333,
                                taxCategory: taxCategoryStandard,
                                quantity: 1,
                            },
                        ],
                    });
                    await orderCalculator.applyPriceAdjustments(ctx, order, [promotion], order.lines[0]);

                    expect(order.subTotal).toBe(4167);
                    expect(order.subTotalWithTax).toBe(5000);
                    expect(order.lines[0].adjustments.length).toBe(1);
                    expect(order.lines[0].adjustments[0].description).toBe('50% off each item');
                    expect(order.totalWithTax).toBe(5000);
                    assertOrderTotalsAddUp(order);
                });

                it('prices include tax', async () => {
                    const ctx = createRequestContext({ pricesIncludeTax: true });
                    const order = createOrder({
                        ctx,
                        lines: [
                            {
                                listPrice: 1400,
                                taxCategory: taxCategoryStandard,
                                quantity: 1,
                            },
                            {
                                listPrice: 650,
                                taxCategory: taxCategoryReduced,
                                quantity: 2,
                            },
                        ],
                    });
                    await orderCalculator.applyPriceAdjustments(ctx, order, [promotion], order.lines[0]);

                    expect(order.subTotal).toBe(1173);
                    expect(order.subTotalWithTax).toBe(1350);
                    expect(order.lines[0].adjustments.length).toBe(1);
                    expect(order.lines[0].adjustments[0].description).toBe('50% off each item');
                    expect(order.totalWithTax).toBe(1350);
                    assertOrderTotalsAddUp(order);
                });
            });
        });

        describe('Order-level discounts', () => {
            describe('single line with order fixed price action', () => {
                const promotion = new Promotion({
                    id: 1,
                    conditions: [{ code: alwaysTrueCondition.code, args: [] }],
                    promotionConditions: [alwaysTrueCondition],
                    actions: [{ code: fixedPriceOrderAction.code, args: [] }],
                    promotionActions: [fixedPriceOrderAction],
                });

                it('prices exclude tax', async () => {
                    const ctx = createRequestContext({ pricesIncludeTax: false });
                    const order = createOrder({
                        ctx,
                        lines: [
                            {
                                listPrice: 1230,
                                taxCategory: taxCategoryStandard,
                                quantity: 1,
                            },
                        ],
                    });
                    await orderCalculator.applyPriceAdjustments(ctx, order, [promotion]);

                    expect(order.subTotal).toBe(420);
                    expect(order.totalWithTax).toBe(504);
                    assertOrderTotalsAddUp(order);
                });

                it('prices include tax', async () => {
                    const ctx = createRequestContext({ pricesIncludeTax: true });
                    const order = createOrder({
                        ctx,
                        lines: [
                            {
                                listPrice: 1230,
                                taxCategory: taxCategoryStandard,
                                quantity: 1,
                            },
                        ],
                    });
                    await orderCalculator.applyPriceAdjustments(ctx, order, [promotion]);

                    expect(order.subTotal).toBe(350);
                    expect(order.totalWithTax).toBe(420);
                    assertOrderTotalsAddUp(order);
                });
            });

            describe('single line with order fixed discount action', () => {
                const promotion = new Promotion({
                    id: 1,
                    conditions: [{ code: alwaysTrueCondition.code, args: [] }],
                    promotionConditions: [alwaysTrueCondition],
                    actions: [{ code: fixedDiscountOrderAction.code, args: [] }],
                    promotionActions: [fixedDiscountOrderAction],
                });

                it('prices exclude tax', async () => {
                    const ctx = createRequestContext({ pricesIncludeTax: false });
                    const order = createOrder({
                        ctx,
                        lines: [
                            {
                                listPrice: 1230,
                                taxCategory: taxCategoryStandard,
                                quantity: 1,
                            },
                        ],
                    });
                    await orderCalculator.applyPriceAdjustments(ctx, order, [promotion]);

                    expect(order.subTotal).toBe(730);
                    expect(order.totalWithTax).toBe(876);
                    assertOrderTotalsAddUp(order);
                });

                it('prices include tax', async () => {
                    const ctx = createRequestContext({ pricesIncludeTax: true });
                    const order = createOrder({
                        ctx,
                        lines: [
                            {
                                listPrice: 2000,
                                taxCategory: taxCategoryStandard,
                                quantity: 1,
                            },
                            {
                                listPrice: 1000,
                                taxCategory: taxCategoryReduced,
                                quantity: 2,
                            },
                        ],
                    });
                    await orderCalculator.applyPriceAdjustments(ctx, order, [promotion]);

                    expect(order.totalWithTax).toBe(3500);
                    assertOrderTotalsAddUp(order);
                });
            });

            describe('condition based on order total', () => {
                const promotion = new Promotion({
                    id: 1,
                    name: 'Test Promotion 1',
                    conditions: [
                        {
                            code: orderTotalCondition.code,
                            args: [{ name: 'minimum', value: '1000' }],
                        },
                    ],
                    promotionConditions: [orderTotalCondition],
                    actions: [{ code: fixedPriceOrderAction.code, args: [] }],
                    promotionActions: [fixedPriceOrderAction],
                });

                it('prices exclude tax', async () => {
                    const ctx = createRequestContext({ pricesIncludeTax: false });
                    const order = createOrder({
                        ctx,
                        lines: [
                            {
                                listPrice: 500,
                                taxCategory: taxCategoryStandard,
                                quantity: 1,
                            },
                        ],
                    });
                    await orderCalculator.applyPriceAdjustments(ctx, order, [promotion]);

                    expect(order.subTotal).toBe(500);
                    expect(order.subTotalWithTax).toBe(600);
                    expect(order.discounts.length).toBe(0);

                    // increase the quantity to 2, which will take the total over the minimum set by the
                    // condition.
                    order.lines[0].items.push(
                        new OrderItem({
                            listPrice: 500,
                            taxLines: [],
                            adjustments: [],
                        }),
                    );

                    await orderCalculator.applyPriceAdjustments(ctx, order, [promotion], order.lines[0]);

                    expect(order.subTotalWithTax).toBe(504);
                    // Now the fixedPriceOrderAction should be in effect
                    expect(order.discounts.length).toBe(1);
                    expect(order.total).toBe(420);
                    expect(order.totalWithTax).toBe(504);
                    assertOrderTotalsAddUp(order);
                });

                it('prices include tax', async () => {
                    const ctx = createRequestContext({ pricesIncludeTax: true });
                    const order = createOrder({
                        ctx,
                        lines: [
                            {
                                listPrice: 500,
                                taxCategory: taxCategoryStandard,
                                quantity: 1,
                            },
                        ],
                    });
                    await orderCalculator.applyPriceAdjustments(ctx, order, [promotion]);

                    expect(order.subTotal).toBe(417);
                    expect(order.subTotalWithTax).toBe(500);
                    expect(order.discounts.length).toBe(0);

                    // increase the quantity to 2, which will take the total over the minimum set by the
                    // condition.
                    order.lines[0].items.push(
                        new OrderItem({
                            listPrice: 500,
                            listPriceIncludesTax: true,
                            taxLines: [],
                            adjustments: [],
                        }),
                    );

                    await orderCalculator.applyPriceAdjustments(ctx, order, [promotion], order.lines[0]);

                    expect(order.subTotalWithTax).toBe(420);
                    // Now the fixedPriceOrderAction should be in effect
                    expect(order.discounts.length).toBe(1);
                    expect(order.total).toBe(350);
                    expect(order.totalWithTax).toBe(420);
                    assertOrderTotalsAddUp(order);
                });
            });

            it('percentage order discount', async () => {
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

                const ctx = createRequestContext({ pricesIncludeTax: false });
                const order = createOrder({
                    ctx,
                    lines: [
                        {
                            listPrice: 100,
                            taxCategory: taxCategoryStandard,
                            quantity: 1,
                        },
                    ],
                });
                await orderCalculator.applyPriceAdjustments(ctx, order, [promotion]);

                expect(order.subTotal).toBe(50);
                expect(order.discounts.length).toBe(1);
                expect(order.discounts[0].description).toBe('50% off order');
                expect(order.totalWithTax).toBe(60);
                assertOrderTotalsAddUp(order);
            });
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
                check(ctx, _order, args) {
                    for (const line of _order.lines) {
                        if (args.minimum <= line.quantity) {
                            return true;
                        }
                    }
                    return false;
                },
            });

            const buy3Get50pcOffOrder = new Promotion({
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

            const spend1000Get10pcOffOrder = new Promotion({
                id: 2,
                name: 'Spend $10 Get 10% off order',
                conditions: [
                    {
                        code: orderTotalCondition.code,
                        args: [{ name: 'minimum', value: '1000' }],
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

            it('two order-level percentage discounts, one invalidates the other', async () => {
                const ctx = createRequestContext({ pricesIncludeTax: false });
                const order = createOrder({
                    ctx,
                    lines: [
                        {
                            listPrice: 500,
                            taxCategory: taxCategoryStandard,
                            quantity: 2,
                        },
                    ],
                });

                // initially the order is $100, so the second promotion applies
                await orderCalculator.applyPriceAdjustments(ctx, order, [
                    buy3Get50pcOffOrder,
                    spend1000Get10pcOffOrder,
                ]);

                expect(order.subTotal).toBe(900);
                expect(order.discounts.length).toBe(1);
                expect(order.discounts[0].description).toBe(spend1000Get10pcOffOrder.name);
                expect(order.totalWithTax).toBe(1080);
                assertOrderTotalsAddUp(order);

                // increase the quantity to 3, which will trigger the first promotion and thus
                // bring the order total below the threshold for the second promotion.
                order.lines[0].items.push(new OrderItem({ listPrice: 500, taxLines: [], adjustments: [] }));

                await orderCalculator.applyPriceAdjustments(
                    ctx,
                    order,
                    [buy3Get50pcOffOrder, spend1000Get10pcOffOrder],
                    order.lines[0],
                );

                expect(order.discounts.length).toBe(1);
                expect(order.subTotal).toBe(750);
                expect(order.discounts[0].description).toBe(buy3Get50pcOffOrder.name);
                expect(order.totalWithTax).toBe(900);
                assertOrderTotalsAddUp(order);
            });

            describe('two order-level percentage discounts at the same time', () => {
                it('prices exclude tax', async () => {
                    const ctx = createRequestContext({ pricesIncludeTax: false });
                    const order = createOrder({
                        ctx,
                        lines: [
                            {
                                listPrice: 800,
                                taxCategory: taxCategoryStandard,
                                quantity: 2,
                            },
                        ],
                    });

                    // initially the order is over $10, so the second promotion applies
                    await orderCalculator.applyPriceAdjustments(ctx, order, [
                        buy3Get50pcOffOrder,
                        spend1000Get10pcOffOrder,
                    ]);

                    expect(order.subTotal).toBe(1440);
                    expect(order.discounts.length).toBe(1);
                    expect(order.discounts[0].description).toBe(spend1000Get10pcOffOrder.name);
                    expect(order.totalWithTax).toBe(1728);
                    assertOrderTotalsAddUp(order);

                    // increase the quantity to 3, which will trigger both promotions
                    order.lines[0].items.push(
                        new OrderItem({
                            listPrice: 800,
                            listPriceIncludesTax: false,
                            taxLines: [],
                            adjustments: [],
                        }),
                    );

                    await orderCalculator.applyPriceAdjustments(
                        ctx,
                        order,
                        [buy3Get50pcOffOrder, spend1000Get10pcOffOrder],
                        order.lines[0],
                    );

                    expect(order.subTotal).toBe(1080);
                    expect(order.discounts.length).toBe(2);
                    expect(order.totalWithTax).toBe(1296);
                    assertOrderTotalsAddUp(order);
                });

                it('prices include tax', async () => {
                    const ctx = createRequestContext({ pricesIncludeTax: true });
                    const order = createOrder({
                        ctx,
                        lines: [
                            {
                                listPrice: 800,
                                taxCategory: taxCategoryStandard,
                                quantity: 3,
                            },
                        ],
                    });

                    await orderCalculator.applyPriceAdjustments(
                        ctx,
                        order,
                        [buy3Get50pcOffOrder, spend1000Get10pcOffOrder],
                        order.lines[0],
                    );

                    expect(order.subTotal).toBe(900);
                    expect(order.discounts.length).toBe(2);
                    expect(order.totalWithTax).toBe(1080);
                    assertOrderTotalsAddUp(order);
                });
            });

            describe('item-level & order-level percentage discounts', () => {
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

                it('prices exclude tax', async () => {
                    const ctx = createRequestContext({ pricesIncludeTax: false });
                    const order = createOrder({
                        ctx,
                        lines: [
                            {
                                listPrice: 155880,
                                taxCategory: taxCategoryStandard,
                                quantity: 1,
                            },
                        ],
                    });
                    await orderCalculator.applyPriceAdjustments(ctx, order, [orderPromo, itemPromo]);

                    // Apply the item-level discount
                    order.couponCodes.push('ITEM10');
                    await orderCalculator.applyPriceAdjustments(ctx, order, [orderPromo, itemPromo]);
                    expect(order.subTotal).toBe(140292);
                    expect(order.subTotalWithTax).toBe(168350);
                    assertOrderTotalsAddUp(order);

                    // Apply the order-level discount
                    order.couponCodes.push('ORDER10');
                    await orderCalculator.applyPriceAdjustments(ctx, order, [orderPromo, itemPromo]);
                    expect(order.subTotal).toBe(126263);
                    expect(order.subTotalWithTax).toBe(151516);
                    assertOrderTotalsAddUp(order);
                });

                it('prices include tax', async () => {
                    const ctx = createRequestContext({ pricesIncludeTax: true });
                    const order = createOrder({
                        ctx,
                        lines: [
                            {
                                listPrice: 155880,
                                taxCategory: taxCategoryStandard,
                                quantity: 1,
                            },
                        ],
                    });
                    await orderCalculator.applyPriceAdjustments(ctx, order, [orderPromo, itemPromo]);

                    // Apply the item-level discount
                    order.couponCodes.push('ITEM10');
                    await orderCalculator.applyPriceAdjustments(ctx, order, [orderPromo, itemPromo]);
                    expect(order.subTotal).toBe(116910);
                    expect(order.subTotalWithTax).toBe(140292);
                    assertOrderTotalsAddUp(order);

                    // Apply the order-level discount
                    order.couponCodes.push('ORDER10');
                    await orderCalculator.applyPriceAdjustments(ctx, order, [orderPromo, itemPromo]);
                    expect(order.subTotal).toBe(105219);
                    expect(order.subTotalWithTax).toBe(126263);
                    assertOrderTotalsAddUp(order);
                });
            });

            // This is the "final boss" of the tests :D
            describe('item-level & order-level mixed discounts with multiple tax rates', () => {
                const fifteenPcOff$10ItemsAction = new PromotionItemAction({
                    code: 'percentage_item_action',
                    description: [{ languageCode: LanguageCode.en, value: '' }],
                    args: { discount: { type: 'int' } },
                    async execute(ctx, orderItem, orderLine, args) {
                        if (orderItem.listPrice === 1000) {
                            const unitPrice = ctx.channel.pricesIncludeTax
                                ? orderLine.unitPriceWithTax
                                : orderLine.unitPrice;
                            return -unitPrice * (15 / 100);
                        }
                        return 0;
                    },
                });

                const $5OffOrderPromo = new Promotion({
                    id: 2,
                    name: '$5 off order',
                    couponCode: 'PROMO1',
                    conditions: [],
                    promotionConditions: [],
                    actions: [
                        {
                            code: fixedDiscountOrderAction.code,
                            args: [],
                        },
                    ],
                    promotionActions: [fixedDiscountOrderAction],
                });

                const fifteenPcOff$10Items = new Promotion({
                    id: 3,
                    name: '15% off item',
                    couponCode: 'PROMO2',
                    conditions: [],
                    promotionConditions: [],
                    actions: [
                        {
                            code: fifteenPcOff$10ItemsAction.code,
                            args: [],
                        },
                    ],
                    promotionActions: [fifteenPcOff$10ItemsAction],
                });

                it('prices exclude tax', async () => {
                    const ctx = createRequestContext({ pricesIncludeTax: false });
                    const order = createOrder({
                        ctx,
                        lines: [
                            {
                                listPrice: 1000,
                                taxCategory: taxCategoryStandard,
                                quantity: 2,
                            },
                            {
                                listPrice: 3499,
                                taxCategory: taxCategoryReduced,
                                quantity: 1,
                            },
                            {
                                listPrice: 255,
                                taxCategory: taxCategoryReduced,
                                quantity: 4,
                            },
                        ],
                    });
                    order.couponCodes.push('PROMO1', 'PROMO2');
                    await orderCalculator.applyPriceAdjustments(ctx, order, [
                        fifteenPcOff$10Items,
                        $5OffOrderPromo,
                    ]);

                    expect(order.subTotal).toBe(5719);
                    expect(order.subTotalWithTax).toBe(6440);
                    assertOrderTotalsAddUp(order);
                });

                it('prices include tax', async () => {
                    const ctx = createRequestContext({ pricesIncludeTax: true });
                    const order = createOrder({
                        ctx,
                        lines: [
                            {
                                listPrice: 1000,
                                taxCategory: taxCategoryStandard,
                                quantity: 2,
                            },
                            {
                                listPrice: 3499,
                                taxCategory: taxCategoryReduced,
                                quantity: 1,
                            },
                            {
                                listPrice: 255,
                                taxCategory: taxCategoryReduced,
                                quantity: 4,
                            },
                        ],
                    });
                    order.couponCodes.push('PROMO1', 'PROMO2');
                    await orderCalculator.applyPriceAdjustments(ctx, order, [
                        fifteenPcOff$10Items,
                        $5OffOrderPromo,
                    ]);

                    expect(order.subTotal).toBe(5084);
                    expect(order.subTotalWithTax).toBe(5719);
                    assertOrderTotalsAddUp(order);
                });
            });
        });
    });

    function createOrder(
        orderConfig: Partial<Omit<Order, 'lines'>> & {
            ctx: RequestContext;
            lines: Array<{
                listPrice: number;
                taxCategory: TaxCategory;
                quantity: number;
            }>;
        },
    ): Order {
        const lines = orderConfig.lines.map(
            ({ listPrice, taxCategory, quantity }) =>
                new OrderLine({
                    taxCategory,
                    items: Array.from({ length: quantity }).map(
                        () =>
                            new OrderItem({
                                listPrice,
                                listPriceIncludesTax: orderConfig.ctx.channel.pricesIncludeTax,
                                taxLines: [],
                                adjustments: [],
                            }),
                    ),
                }),
        );

        return new Order({
            couponCodes: [],
            lines,
        });
    }

    /**
     * Make sure that the properties which will be displayed to the customer add up in a consistent way.
     */
    function assertOrderTotalsAddUp(order: Order) {
        for (const line of order.lines) {
            const itemUnitPriceSum = summate(line.items, 'unitPrice');
            expect(line.linePrice).toBe(itemUnitPriceSum);
            const itemUnitPriceWithTaxSum = summate(line.items, 'unitPriceWithTax');
            expect(line.linePriceWithTax).toBe(itemUnitPriceWithTaxSum);
        }
        const taxableLinePriceSum = summate(order.lines, 'proratedLinePrice');
        expect(order.subTotal).toBe(taxableLinePriceSum);

        // Make sure the customer-facing totals also add up
        const displayPriceWithTaxSum = summate(order.lines, 'discountedLinePriceWithTax');
        const orderDiscountsSum = order.discounts
            .filter(d => d.type === AdjustmentType.DISTRIBUTED_ORDER_PROMOTION)
            .reduce((sum, d) => sum + d.amount, 0);

        // The sum of the display prices + order discounts should in theory exactly
        // equal the subTotalWithTax. In practice, there are occasionally 1cent differences
        // cause by rounding errors. This should be tolerable.
        const differenceBetweenSumAndActual = Math.abs(
            displayPriceWithTaxSum + orderDiscountsSum - order.subTotalWithTax,
        );
        expect(differenceBetweenSumAndActual).toBeLessThanOrEqual(1);
    }
});
