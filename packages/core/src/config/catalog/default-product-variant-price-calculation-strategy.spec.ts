import {
    createRequestContext,
    MockTaxRateService,
    taxCategoryReduced,
    taxCategoryStandard,
    taxRateDefaultReduced,
    taxRateDefaultStandard,
    taxRateOtherReduced,
    taxRateOtherStandard,
    zoneDefault,
    zoneOther,
    zoneWithNoTaxRate,
} from '../../testing/order-test-utils';

import { DefaultProductVariantPriceCalculationStrategy } from './default-product-variant-price-calculation-strategy';

describe('DefaultProductVariantPriceCalculationStrategy', () => {
    let strategy: DefaultProductVariantPriceCalculationStrategy;
    const inputPrice = 6543;

    beforeEach(async () => {
        strategy = new DefaultProductVariantPriceCalculationStrategy();
        const mockInjector = {
            get: () => {
                return new MockTaxRateService();
            },
        } as any;
        strategy.init(mockInjector);
    });

    describe('with prices which do not include tax', () => {
        it('standard tax, default zone', () => {
            const ctx = createRequestContext({ pricesIncludeTax: false });
            const result = strategy.calculate({
                inputPrice,
                taxCategory: taxCategoryStandard,
                activeTaxZone: zoneDefault,
                ctx,
            });

            expect(result).toEqual({
                price: inputPrice,
                priceIncludesTax: false,
            });
        });

        it('reduced tax, default zone', () => {
            const ctx = createRequestContext({ pricesIncludeTax: false });
            const result = strategy.calculate({
                inputPrice,
                taxCategory: taxCategoryReduced,
                activeTaxZone: zoneDefault,
                ctx,
            });

            expect(result).toEqual({
                price: inputPrice,
                priceIncludesTax: false,
            });
        });

        it('standard tax, other zone', () => {
            const ctx = createRequestContext({ pricesIncludeTax: false });
            const result = strategy.calculate({
                inputPrice,
                taxCategory: taxCategoryStandard,
                activeTaxZone: zoneOther,
                ctx,
            });

            expect(result).toEqual({
                price: inputPrice,
                priceIncludesTax: false,
            });
        });

        it('reduced tax, other zone', () => {
            const ctx = createRequestContext({ pricesIncludeTax: false });
            const result = strategy.calculate({
                inputPrice,
                taxCategory: taxCategoryReduced,
                activeTaxZone: zoneOther,
                ctx,
            });

            expect(result).toEqual({
                price: inputPrice,
                priceIncludesTax: false,
            });
        });

        it('standard tax, unconfigured zone', () => {
            const ctx = createRequestContext({ pricesIncludeTax: false });
            const result = strategy.calculate({
                inputPrice,
                taxCategory: taxCategoryReduced,
                activeTaxZone: zoneWithNoTaxRate,
                ctx,
            });

            expect(result).toEqual({
                price: inputPrice,
                priceIncludesTax: false,
            });
        });
    });

    describe('with prices which include tax', () => {
        it('standard tax, default zone', () => {
            const ctx = createRequestContext({ pricesIncludeTax: true });
            const result = strategy.calculate({
                inputPrice,
                taxCategory: taxCategoryStandard,
                activeTaxZone: zoneDefault,
                ctx,
            });

            expect(result).toEqual({
                price: inputPrice,
                priceIncludesTax: true,
            });
        });

        it('reduced tax, default zone', () => {
            const ctx = createRequestContext({ pricesIncludeTax: true });
            const result = strategy.calculate({
                inputPrice,
                taxCategory: taxCategoryReduced,
                activeTaxZone: zoneDefault,
                ctx,
            });

            expect(result).toEqual({
                price: inputPrice,
                priceIncludesTax: true,
            });
        });

        it('standard tax, other zone', () => {
            const ctx = createRequestContext({ pricesIncludeTax: true });
            const result = strategy.calculate({
                inputPrice,
                taxCategory: taxCategoryStandard,
                activeTaxZone: zoneOther,
                ctx,
            });

            expect(result).toEqual({
                price: taxRateDefaultStandard.netPriceOf(inputPrice),
                priceIncludesTax: false,
            });
        });

        it('reduced tax, other zone', () => {
            const ctx = createRequestContext({ pricesIncludeTax: true });
            const result = strategy.calculate({
                inputPrice,
                taxCategory: taxCategoryReduced,
                activeTaxZone: zoneOther,
                ctx,
            });

            expect(result).toEqual({
                price: taxRateDefaultReduced.netPriceOf(inputPrice),
                priceIncludesTax: false,
            });
        });

        it('standard tax, unconfigured zone', () => {
            const ctx = createRequestContext({ pricesIncludeTax: true });
            const result = strategy.calculate({
                inputPrice,
                taxCategory: taxCategoryStandard,
                activeTaxZone: zoneWithNoTaxRate,
                ctx,
            });

            expect(result).toEqual({
                price: taxRateDefaultStandard.netPriceOf(inputPrice),
                priceIncludesTax: false,
            });
        });
    });
});
