import { Test } from '@nestjs/testing';
import { Connection } from 'typeorm';

import { TaxRateService } from '../../services/tax-rate.service';
import { ListQueryBuilder } from '../list-query-builder/list-query-builder';

import { TaxCalculator } from './tax-calculator';
import {
    createRequestContext,
    MockConnection,
    taxCategoryReduced,
    taxCategoryStandard,
    taxRateDefaultReduced,
    taxRateDefaultStandard,
    taxRateOtherReduced,
    taxRateOtherStandard,
    zoneDefault,
    zoneOther,
    zoneWithNoTaxRate,
} from './tax-calculator-test-fixtures';

describe('TaxCalculator', () => {
    let taxCalculator: TaxCalculator;
    const inputPrice = 6543;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TaxCalculator,
                TaxRateService,
                { provide: Connection, useClass: MockConnection },
                { provide: ListQueryBuilder, useValue: {} },
            ],
        }).compile();

        taxCalculator = module.get(TaxCalculator);
        const taxRateService = module.get(TaxRateService);
        await taxRateService.initTaxRates();
    });

    describe('with prices which do not include tax', () => {
        it('standard tax, default zone', () => {
            const ctx = createRequestContext(false, zoneDefault);
            const result = taxCalculator.calculate(inputPrice, taxCategoryStandard, ctx);

            expect(result).toEqual({
                price: inputPrice,
                priceIncludesTax: false,
                priceWithTax: taxRateDefaultStandard.grossPriceOf(inputPrice),
                priceWithoutTax: inputPrice,
            });
        });

        it('reduced tax, default zone', () => {
            const ctx = createRequestContext(false, zoneDefault);
            const result = taxCalculator.calculate(6543, taxCategoryReduced, ctx);

            expect(result).toEqual({
                price: inputPrice,
                priceIncludesTax: false,
                priceWithTax: taxRateDefaultReduced.grossPriceOf(inputPrice),
                priceWithoutTax: inputPrice,
            });
        });

        it('standard tax, other zone', () => {
            const ctx = createRequestContext(false, zoneOther);
            const result = taxCalculator.calculate(6543, taxCategoryStandard, ctx);

            expect(result).toEqual({
                price: inputPrice,
                priceIncludesTax: false,
                priceWithTax: taxRateOtherStandard.grossPriceOf(inputPrice),
                priceWithoutTax: inputPrice,
            });
        });

        it('reduced tax, other zone', () => {
            const ctx = createRequestContext(false, zoneOther);
            const result = taxCalculator.calculate(inputPrice, taxCategoryReduced, ctx);

            expect(result).toEqual({
                price: inputPrice,
                priceIncludesTax: false,
                priceWithTax: taxRateOtherReduced.grossPriceOf(inputPrice),
                priceWithoutTax: inputPrice,
            });
        });

        it('standard tax, unconfigured zone', () => {
            const ctx = createRequestContext(false, zoneWithNoTaxRate);
            const result = taxCalculator.calculate(inputPrice, taxCategoryReduced, ctx);

            expect(result).toEqual({
                price: inputPrice,
                priceIncludesTax: false,
                priceWithTax: inputPrice,
                priceWithoutTax: inputPrice,
            });
        });
    });

    describe('with prices which include tax', () => {
        it('standard tax, default zone', () => {
            const ctx = createRequestContext(true, zoneDefault);
            const result = taxCalculator.calculate(inputPrice, taxCategoryStandard, ctx);

            expect(result).toEqual({
                price: inputPrice,
                priceIncludesTax: true,
                priceWithTax: inputPrice,
                priceWithoutTax: taxRateDefaultStandard.netPriceOf(inputPrice),
            });
        });

        it('reduced tax, default zone', () => {
            const ctx = createRequestContext(true, zoneDefault);
            const result = taxCalculator.calculate(inputPrice, taxCategoryReduced, ctx);

            expect(result).toEqual({
                price: inputPrice,
                priceIncludesTax: true,
                priceWithTax: inputPrice,
                priceWithoutTax: taxRateDefaultReduced.netPriceOf(inputPrice),
            });
        });

        it('standard tax, other zone', () => {
            const ctx = createRequestContext(true, zoneOther);
            const result = taxCalculator.calculate(inputPrice, taxCategoryStandard, ctx);

            expect(result).toEqual({
                price: taxRateDefaultStandard.netPriceOf(inputPrice),
                priceIncludesTax: false,
                priceWithTax: taxRateOtherStandard.grossPriceOf(
                    taxRateDefaultStandard.netPriceOf(inputPrice),
                ),
                priceWithoutTax: taxRateDefaultStandard.netPriceOf(inputPrice),
            });
        });

        it('reduced tax, other zone', () => {
            const ctx = createRequestContext(true, zoneOther);
            const result = taxCalculator.calculate(inputPrice, taxCategoryReduced, ctx);

            expect(result).toEqual({
                price: taxRateDefaultReduced.netPriceOf(inputPrice),
                priceIncludesTax: false,
                priceWithTax: taxRateOtherReduced.grossPriceOf(taxRateDefaultReduced.netPriceOf(inputPrice)),
                priceWithoutTax: taxRateDefaultReduced.netPriceOf(inputPrice),
            });
        });

        it('standard tax, unconfigured zone', () => {
            const ctx = createRequestContext(true, zoneWithNoTaxRate);
            const result = taxCalculator.calculate(inputPrice, taxCategoryStandard, ctx);

            expect(result).toEqual({
                price: taxRateDefaultStandard.netPriceOf(inputPrice),
                priceIncludesTax: false,
                priceWithTax: taxRateDefaultStandard.netPriceOf(inputPrice),
                priceWithoutTax: taxRateDefaultStandard.netPriceOf(inputPrice),
            });
        });
    });
});
