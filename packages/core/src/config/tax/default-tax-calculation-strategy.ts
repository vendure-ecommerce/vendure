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
        let priceIncludesTax = false;
        const taxRate = taxRateService.getApplicableTaxRate(activeTaxZone, taxCategory);

        if (ctx.channel.pricesIncludeTax) {
            const isDefaultZone = idsAreEqual(activeTaxZone.id, ctx.channel.defaultTaxZone.id);
            const taxRateForDefaultZone = taxRateService.getApplicableTaxRate(
                ctx.channel.defaultTaxZone,
                taxCategory,
            );

            if (isDefaultZone) {
                priceIncludesTax = true;
                price = inputPrice;
            } else {
                price = taxRateForDefaultZone.netPriceOf(inputPrice);
            }
        } else {
            price = inputPrice;
        }

        return {
            price,
            priceIncludesTax,
        };
    }
}
