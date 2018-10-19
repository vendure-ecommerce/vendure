import { Test } from '@nestjs/testing';
import { LanguageCode } from 'shared/generated-types';
import { Connection } from 'typeorm';

import { RequestContext } from '../../api/common/request-context';
import { Channel } from '../../entity/channel/channel.entity';
import { TaxCategory } from '../../entity/tax-category/tax-category.entity';
import { TaxRate } from '../../entity/tax-rate/tax-rate.entity';
import { Zone } from '../../entity/zone/zone.entity';

import { TaxCalculatorService } from './tax-calculator.service';
import { TaxRateService } from './tax-rate.service';

describe('TaxCalculatorService', () => {
    let taxCalculatorService: TaxCalculatorService;
    const inputPrice = 6543;
    const taxCategoryStandard = new TaxCategory({
        id: 'taxCategoryStandard',
        name: 'Standard Tax',
    });
    const taxCategoryReduced = new TaxCategory({
        id: 'taxCategoryReduced',
        name: 'Reduced Tax',
    });
    const zoneDefault = new Zone({
        id: 'zoneDefault',
        name: 'Default Zone',
    });
    const zoneOther = new Zone({
        id: 'zoneOther',
        name: 'Other Zone',
    });
    const zoneWithNoTaxRate = new Zone({
        id: 'zoneWithNoTaxRate',
        name: 'Zone for which no TaxRate is configured',
    });
    const taxRateDefaultStandard = new TaxRate({
        id: 'taxRateDefaultStandard',
        value: 20,
        enabled: true,
        zone: zoneDefault,
        category: taxCategoryStandard,
    });
    const taxRateDefaultReduced = new TaxRate({
        id: 'taxRateDefaultReduced',
        value: 10,
        enabled: true,
        zone: zoneDefault,
        category: taxCategoryReduced,
    });
    const taxRateOtherStandard = new TaxRate({
        id: 'taxRateOtherStandard',
        value: 15,
        enabled: true,
        zone: zoneOther,
        category: taxCategoryStandard,
    });
    const taxRateOtherReduced = new TaxRate({
        id: 'taxRateOtherReduced',
        value: 5,
        enabled: true,
        zone: zoneOther,
        category: taxCategoryReduced,
    });

    class MockConnection {
        getRepository() {
            return {
                find() {
                    return Promise.resolve([
                        taxRateDefaultStandard,
                        taxRateDefaultReduced,
                        taxRateOtherStandard,
                        taxRateOtherReduced,
                    ]);
                },
            };
        }
    }

    function createRequestContext(pricesIncludeTax: boolean, activeTaxZone: Zone): RequestContext {
        const channel = new Channel({
            defaultTaxZone: zoneDefault,
            pricesIncludeTax,
        });
        const ctx = new RequestContext({
            channel,
            authorizedAsOwnerOnly: false,
            languageCode: LanguageCode.en,
            isAuthorized: true,
            session: {} as any,
        });
        // TODO: Hack until we implement the other ways of
        // calculating the activeTaxZone (customer billing address etc)
        delete Object.getPrototypeOf(ctx).activeTaxZone;
        (ctx as any).activeTaxZone = activeTaxZone;
        return ctx;
    }

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TaxCalculatorService,
                TaxRateService,
                { provide: Connection, useClass: MockConnection },
            ],
        }).compile();

        taxCalculatorService = module.get(TaxCalculatorService);
        const taxRateService = module.get(TaxRateService);
        await taxRateService.initTaxRates();
    });

    describe('with prices which do not include tax', () => {
        it('standard tax, default zone', () => {
            const ctx = createRequestContext(false, zoneDefault);
            const result = taxCalculatorService.calculate(inputPrice, taxCategoryStandard, ctx);

            expect(result).toEqual({
                price: inputPrice,
                priceIncludesTax: false,
                priceWithTax: taxRateDefaultStandard.grossPriceOf(inputPrice),
                priceWithoutTax: inputPrice,
            });
        });

        it('reduced tax, default zone', () => {
            const ctx = createRequestContext(false, zoneDefault);
            const result = taxCalculatorService.calculate(6543, taxCategoryReduced, ctx);

            expect(result).toEqual({
                price: inputPrice,
                priceIncludesTax: false,
                priceWithTax: taxRateDefaultReduced.grossPriceOf(inputPrice),
                priceWithoutTax: inputPrice,
            });
        });

        it('standard tax, other zone', () => {
            const ctx = createRequestContext(false, zoneOther);
            const result = taxCalculatorService.calculate(6543, taxCategoryStandard, ctx);

            expect(result).toEqual({
                price: inputPrice,
                priceIncludesTax: false,
                priceWithTax: taxRateOtherStandard.grossPriceOf(inputPrice),
                priceWithoutTax: inputPrice,
            });
        });

        it('reduced tax, other zone', () => {
            const ctx = createRequestContext(false, zoneOther);
            const result = taxCalculatorService.calculate(inputPrice, taxCategoryReduced, ctx);

            expect(result).toEqual({
                price: inputPrice,
                priceIncludesTax: false,
                priceWithTax: taxRateOtherReduced.grossPriceOf(inputPrice),
                priceWithoutTax: inputPrice,
            });
        });

        it('standard tax, unconfigured zone', () => {
            const ctx = createRequestContext(false, zoneWithNoTaxRate);
            const result = taxCalculatorService.calculate(inputPrice, taxCategoryReduced, ctx);

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
            const result = taxCalculatorService.calculate(inputPrice, taxCategoryStandard, ctx);

            expect(result).toEqual({
                price: inputPrice,
                priceIncludesTax: true,
                priceWithTax: inputPrice,
                priceWithoutTax: taxRateDefaultStandard.netPriceOf(inputPrice),
            });
        });

        it('reduced tax, default zone', () => {
            const ctx = createRequestContext(true, zoneDefault);
            const result = taxCalculatorService.calculate(inputPrice, taxCategoryReduced, ctx);

            expect(result).toEqual({
                price: inputPrice,
                priceIncludesTax: true,
                priceWithTax: inputPrice,
                priceWithoutTax: taxRateDefaultReduced.netPriceOf(inputPrice),
            });
        });

        it('standard tax, other zone', () => {
            const ctx = createRequestContext(true, zoneOther);
            const result = taxCalculatorService.calculate(inputPrice, taxCategoryStandard, ctx);

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
            const result = taxCalculatorService.calculate(inputPrice, taxCategoryReduced, ctx);

            expect(result).toEqual({
                price: taxRateDefaultReduced.netPriceOf(inputPrice),
                priceIncludesTax: false,
                priceWithTax: taxRateOtherReduced.grossPriceOf(taxRateDefaultReduced.netPriceOf(inputPrice)),
                priceWithoutTax: taxRateDefaultReduced.netPriceOf(inputPrice),
            });
        });

        it('standard tax, unconfigured zone', () => {
            const ctx = createRequestContext(true, zoneWithNoTaxRate);
            const result = taxCalculatorService.calculate(inputPrice, taxCategoryStandard, ctx);

            expect(result).toEqual({
                price: taxRateDefaultStandard.netPriceOf(inputPrice),
                priceIncludesTax: false,
                priceWithTax: taxRateDefaultStandard.netPriceOf(inputPrice),
                priceWithoutTax: taxRateDefaultStandard.netPriceOf(inputPrice),
            });
        });
    });
});
