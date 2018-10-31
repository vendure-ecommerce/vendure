import { Test } from '@nestjs/testing';
import { Omit } from 'shared/omit';
import { Connection } from 'typeorm';

import { OrderItem } from '../../../entity/order-item/order-item.entity';
import { OrderLine } from '../../../entity/order-line/order-line.entity';
import { Order } from '../../../entity/order/order.entity';
import { TaxCategory } from '../../../entity/tax-category/tax-category.entity';
import { TaxRateService } from '../../services/tax-rate.service';
import { ListQueryBuilder } from '../list-query-builder/list-query-builder';
import { ShippingCalculator } from '../shipping-calculator/shipping-calculator';
import { TaxCalculator } from '../tax-calculator/tax-calculator';
import {
    createRequestContext,
    MockConnection,
    taxCategoryStandard,
    zoneDefault,
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
            ],
        }).compile();

        orderCalculator = module.get(OrderCalculator);
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

    describe('taxes only', () => {
        it('single line with taxes not included', () => {
            const ctx = createRequestContext(false, zoneDefault);
            const order = createOrder({
                lines: [{ unitPrice: 123, taxCategory: taxCategoryStandard, quantity: 1 }],
            });
            orderCalculator.applyPriceAdjustments(ctx, order, []);

            expect(order.subTotal).toBe(148);
            expect(order.subTotalBeforeTax).toBe(123);
        });

        it('single line with taxes not included, multiple items', () => {
            const ctx = createRequestContext(false, zoneDefault);
            const order = createOrder({
                lines: [{ unitPrice: 123, taxCategory: taxCategoryStandard, quantity: 3 }],
            });
            orderCalculator.applyPriceAdjustments(ctx, order, []);

            expect(order.subTotal).toBe(444);
            expect(order.subTotalBeforeTax).toBe(369);
        });

        it('single line with taxes included', () => {
            const ctx = createRequestContext(true, zoneDefault);
            const order = createOrder({
                lines: [{ unitPrice: 123, taxCategory: taxCategoryStandard, quantity: 1 }],
            });
            orderCalculator.applyPriceAdjustments(ctx, order, []);

            expect(order.subTotal).toBe(123);
            expect(order.subTotalBeforeTax).toBe(102);
        });

        it('resets totals when lines array is empty', () => {
            const ctx = createRequestContext(true, zoneDefault);
            const order = createOrder({
                lines: [],
                subTotal: 148,
                subTotalBeforeTax: 123,
            });
            orderCalculator.applyPriceAdjustments(ctx, order, []);

            expect(order.subTotal).toBe(0);
            expect(order.subTotalBeforeTax).toBe(0);
        });
    });
});
