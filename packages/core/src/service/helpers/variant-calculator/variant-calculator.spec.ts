import { Test } from '@nestjs/testing';
import { LanguageCode } from '@vendure/common/lib/generated-types';

import { TestOrderItemPriceCalculationStrategy } from '../../../../e2e/fixtures/test-order-item-price-calculation-strategy';
import { RequestContext } from '../../../api';
import { RequestContextCacheService } from '../../../cache';
import {
    ConfigService,
    DefaultTaxLineCalculationStrategy,
    DefaultTaxZoneStrategy,
    PromotionCondition,
    PromotionItemAction,
    ShippingCalculator,
} from '../../../config';
import { DefaultProductVariantPriceCalculationStrategy } from '../../../config/catalog/default-product-variant-price-calculation-strategy';
import { MockConfigService } from '../../../config/config.service.mock';
import { Order, ProductVariant, Promotion } from '../../../entity';
import { EventBus } from '../../../event-bus';
import { createRequestContext, MockTaxRateService } from '../../../testing/order-test-utils';
import { CustomerService } from '../../services/customer.service';
import { OrderService } from '../../services/order.service';
import { ShippingMethodService } from '../../services/shipping-method.service';
import { TaxRateService } from '../../services/tax-rate.service';
import { ZoneService } from '../../services/zone.service';
import { ListQueryBuilder } from '../list-query-builder/list-query-builder';
import { OrderCalculator } from '../order-calculator/order-calculator';
import { ProductPriceApplicator } from '../product-price-applicator/product-price-applicator';

import { VariantCalculator } from './variant-calculator';

describe('OrderCalculator', () => {
    let variantCalculator: VariantCalculator;

    beforeAll(async () => {
        const module = await createTestModule();
        variantCalculator = module.get(VariantCalculator);
        const mockConfigService = module.get<ConfigService, MockConfigService>(ConfigService);
        mockConfigService.taxOptions = {
            taxZoneStrategy: new DefaultTaxZoneStrategy(),
            taxLineCalculationStrategy: new DefaultTaxLineCalculationStrategy(),
        };
        mockConfigService.orderOptions = {
            orderItemPriceCalculationStrategy: new TestOrderItemPriceCalculationStrategy(),
        };
        mockConfigService.catalogOptions = {
            productVariantPriceCalculationStrategy: new DefaultProductVariantPriceCalculationStrategy(),
        };
    });

    describe('variant price calculator', () => {
        it('calculates the correct price for provided order', async () => {
            const ctx = createRequestContext({ pricesIncludeTax: false });
            const order = new Order({ active: true, shippingAddress: {}, customer: { id: 1 } });
            const variant = new ProductVariant({
                listPrice: 50,
                productVariantPrices: [{ channelId: 1, price: 50 }],
                taxCategory: { id: 1 },
            });

            const alwaysTrueCondition = new PromotionCondition({
                args: {},
                code: 'always_true_condition',
                description: [{ languageCode: LanguageCode.en, value: '' }],
                check() {
                    return true;
                },
            });

            const fixedPriceItemAction = new PromotionItemAction({
                code: 'fixed_price_item_action',
                description: [{ languageCode: LanguageCode.en, value: '' }],
                args: {},
                execute(context, item) {
                    return -8;
                },
            });

            const promotion = new Promotion({
                conditions: [{ code: alwaysTrueCondition.code, args: [] }],
                promotionConditions: [alwaysTrueCondition],
                actions: [
                    {
                        code: fixedPriceItemAction.code,
                        args: [],
                    },
                ],
                promotionActions: [fixedPriceItemAction],
            });

            const calculated = await variantCalculator.applyVariantPromotions(
                ctx,
                variant,
                [promotion],
                1,
                order,
            );
            expect(calculated).toBe(50 - 8);
        });
    });
});

function createTestModule() {
    return Test.createTestingModule({
        providers: [
            VariantCalculator,
            ProductPriceApplicator,
            RequestContextCacheService,
            { provide: TaxRateService, useClass: MockTaxRateService },
            { provide: ShippingCalculator, useValue: { getEligibleShippingMethods: () => [] } },
            {
                provide: ShippingMethodService,
                useValue: {
                    findOne: (ctx: RequestContext) => ({
                        id: 'T_2',
                        test: () => true,
                        apply() {
                            return {
                                price: 500,
                                priceIncludesTax: ctx.channel.pricesIncludeTax,
                                taxRate: 20,
                            };
                        },
                    }),
                },
            },
            { provide: ListQueryBuilder, useValue: {} },
            { provide: ConfigService, useClass: MockConfigService },
            { provide: EventBus, useValue: { publish: () => ({}) } },
            { provide: ZoneService, useValue: { findAll: () => [] } },
            { provide: CustomerService, useValue: {} },
            { provide: OrderService, useValue: {} },
            OrderCalculator,
        ],
    }).compile();
}
