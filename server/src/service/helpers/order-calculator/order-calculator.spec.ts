import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';

import { Omit } from '../../../../../shared/omit';
import { ConfigService } from '../../../config/config.service';
import { MockConfigService } from '../../../config/config.service.mock';
import { DefaultTaxCalculationStrategy } from '../../../config/tax/default-tax-calculation-strategy';
import { DefaultTaxZoneStrategy } from '../../../config/tax/default-tax-zone-strategy';
import { OrderItem } from '../../../entity/order-item/order-item.entity';
import { OrderLine } from '../../../entity/order-line/order-line.entity';
import { Order } from '../../../entity/order/order.entity';
import { TaxCategory } from '../../../entity/tax-category/tax-category.entity';
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
                { provide: ZoneService, useValue: { findAll: () => [] } },
            ],
        }).compile();

        orderCalculator = module.get(OrderCalculator);
        const mockConfigService = module.get<ConfigService, MockConfigService>(ConfigService);
        mockConfigService.taxOptions = {
            taxZoneStrategy: new DefaultTaxZoneStrategy(),
            taxCalculationStrategy: new DefaultTaxCalculationStrategy(),
        };
        await module.init();
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
});
