import { RequestContext } from '../../api/common/request-context';
import { idsAreEqual } from '../../common/utils';
import { TaxCategory } from '../../entity';
import { TaxCalculationResult } from '../../service/helpers/tax-calculator/tax-calculator';
import { TaxRateService } from '../../service/services/tax-rate.service';

import { TaxCalculationArgs, TaxCalculationStrategy } from './tax-calculation-strategy';

/**
 * @description
 * A default tax calculation function.
 *
 * @docsCategory tax
 */
export class DefaultTaxCalculationStrategy implements TaxCalculationStrategy {
    calculate(args: TaxCalculationArgs): TaxCalculationResult {
        const { inputPrice, activeTaxZone, ctx, taxCategory, taxRateService } = args;
        let price = 0;
        let priceWithTax = 0;
        let priceWithoutTax = 0;
        let priceIncludesTax = false;
        const taxRate = taxRateService.getApplicableTaxRate(activeTaxZone, taxCategory);

        if (ctx.channel.pricesIncludeTax) {
            const isDefaultZone = idsAreEqual(activeTaxZone.id, ctx.channel.defaultTaxZone.id);
            const taxRateForDefaultZone = taxRateService.getApplicableTaxRate(
                ctx.channel.defaultTaxZone,
                taxCategory,
            );
            priceWithoutTax = taxRateForDefaultZone.netPriceOf(inputPrice);

            if (isDefaultZone) {
                priceIncludesTax = true;
                price = inputPrice;
                priceWithTax = inputPrice;
            } else {
                price = priceWithoutTax;
                priceWithTax = taxRate.grossPriceOf(priceWithoutTax);
            }
        } else {
            const netPrice = inputPrice;
            price = netPrice;
            priceWithTax = netPrice + taxRate.taxPayableOn(netPrice);
            priceWithoutTax = netPrice;
        }

        return {
            price,
            priceIncludesTax,
            priceWithTax,
            priceWithoutTax,
        };
    }
}
