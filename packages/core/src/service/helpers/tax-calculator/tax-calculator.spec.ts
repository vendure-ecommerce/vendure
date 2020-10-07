import { Test } from '@nestjs/testing';

import { ConfigService } from '../../../config/config.service';
import { MockConfigService } from '../../../config/config.service.mock';
import { DefaultTaxCalculationStrategy } from '../../../config/tax/default-tax-calculation-strategy';
import { EventBus } from '../../../event-bus/event-bus';
import { WorkerService } from '../../../worker/worker.service';
import { TaxRateService } from '../../services/tax-rate.service';
import { TransactionalConnection } from '../../transaction/transactional-connection';
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
                { provide: ConfigService, useClass: MockConfigService },
                { provide: TransactionalConnection, useClass: MockConnection },
                { provide: ListQueryBuilder, useValue: {} },
                { provide: EventBus, useValue: { publish: () => ({}) } },
                { provide: WorkerService, useValue: { send: () => ({}) } },
            ],
        }).compile();

        taxCalculator = module.get(TaxCalculator);
        const taxRateService = module.get(TaxRateService);
        const mockConfigService = module.get<ConfigService, MockConfigService>(ConfigService);
        mockConfigService.taxOptions = {
            taxCalculationStrategy: new DefaultTaxCalculationStrategy(),
        };
        await taxRateService.initTaxRates();
    });

    describe('with prices which do not include tax', () => {
        it('standard tax, default zone', () => {
            const ctx = createRequestContext(false);
            const result = taxCalculator.calculate(inputPrice, taxCategoryStandard, zoneDefault, ctx);

            expect(result).toEqual({
                price: inputPrice,
                priceIncludesTax: false,
                priceWithTax: taxRateDefaultStandard.grossPriceOf(inputPrice),
                priceWithoutTax: inputPrice,
            });
        });

        it('reduced tax, default zone', () => {
            const ctx = createRequestContext(false);
            const result = taxCalculator.calculate(6543, taxCategoryReduced, zoneDefault, ctx);

            expect(result).toEqual({
                price: inputPrice,
                priceIncludesTax: false,
                priceWithTax: taxRateDefaultReduced.grossPriceOf(inputPrice),
                priceWithoutTax: inputPrice,
            });
        });

        it('standard tax, other zone', () => {
            const ctx = createRequestContext(false);
            const result = taxCalculator.calculate(6543, taxCategoryStandard, zoneOther, ctx);

            expect(result).toEqual({
                price: inputPrice,
                priceIncludesTax: false,
                priceWithTax: taxRateOtherStandard.grossPriceOf(inputPrice),
                priceWithoutTax: inputPrice,
            });
        });

        it('reduced tax, other zone', () => {
            const ctx = createRequestContext(false);
            const result = taxCalculator.calculate(inputPrice, taxCategoryReduced, zoneOther, ctx);

            expect(result).toEqual({
                price: inputPrice,
                priceIncludesTax: false,
                priceWithTax: taxRateOtherReduced.grossPriceOf(inputPrice),
                priceWithoutTax: inputPrice,
            });
        });

        it('standard tax, unconfigured zone', () => {
            const ctx = createRequestContext(false);
            const result = taxCalculator.calculate(inputPrice, taxCategoryReduced, zoneWithNoTaxRate, ctx);

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
            const ctx = createRequestContext(true);
            const result = taxCalculator.calculate(inputPrice, taxCategoryStandard, zoneDefault, ctx);

            expect(result).toEqual({
                price: inputPrice,
                priceIncludesTax: true,
                priceWithTax: inputPrice,
                priceWithoutTax: taxRateDefaultStandard.netPriceOf(inputPrice),
            });
        });

        it('reduced tax, default zone', () => {
            const ctx = createRequestContext(true);
            const result = taxCalculator.calculate(inputPrice, taxCategoryReduced, zoneDefault, ctx);

            expect(result).toEqual({
                price: inputPrice,
                priceIncludesTax: true,
                priceWithTax: inputPrice,
                priceWithoutTax: taxRateDefaultReduced.netPriceOf(inputPrice),
            });
        });

        it('standard tax, other zone', () => {
            const ctx = createRequestContext(true);
            const result = taxCalculator.calculate(inputPrice, taxCategoryStandard, zoneOther, ctx);

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
            const ctx = createRequestContext(true);
            const result = taxCalculator.calculate(inputPrice, taxCategoryReduced, zoneOther, ctx);

            expect(result).toEqual({
                price: taxRateDefaultReduced.netPriceOf(inputPrice),
                priceIncludesTax: false,
                priceWithTax: taxRateOtherReduced.grossPriceOf(taxRateDefaultReduced.netPriceOf(inputPrice)),
                priceWithoutTax: taxRateDefaultReduced.netPriceOf(inputPrice),
            });
        });

        it('standard tax, unconfigured zone', () => {
            const ctx = createRequestContext(true);
            const result = taxCalculator.calculate(inputPrice, taxCategoryStandard, zoneWithNoTaxRate, ctx);

            expect(result).toEqual({
                price: taxRateDefaultStandard.netPriceOf(inputPrice),
                priceIncludesTax: false,
                priceWithTax: taxRateDefaultStandard.netPriceOf(inputPrice),
                priceWithoutTax: taxRateDefaultStandard.netPriceOf(inputPrice),
            });
        });
    });
});
