import { Injector } from '../../common/injector';
import { PriceCalculationResult } from '../../common/types/common-types';
import { idsAreEqual } from '../../common/utils';
import { TaxRateService } from '../../service/services/tax-rate.service';

import {
    ProductVariantPriceCalculationArgs,
    ProductVariantPriceCalculationStrategy,
} from './product-variant-price-calculation-strategy';

/**
 * @description
 * A default ProductVariant price calculation function.
 *
 * @docsCategory tax
 */
export class DefaultProductVariantPriceCalculationStrategy implements ProductVariantPriceCalculationStrategy {
    private taxRateService: TaxRateService;

    init(injector: Injector) {
        this.taxRateService = injector.get(TaxRateService);
    }

    calculate(args: ProductVariantPriceCalculationArgs): PriceCalculationResult {
        const { inputPrice, activeTaxZone, ctx, taxCategory } = args;
        let price = inputPrice;
        let priceIncludesTax = false;
        const taxRate = this.taxRateService.getApplicableTaxRate(activeTaxZone, taxCategory);

        if (ctx.channel.pricesIncludeTax) {
            const isDefaultZone = idsAreEqual(activeTaxZone.id, ctx.channel.defaultTaxZone.id);
            if (isDefaultZone) {
                priceIncludesTax = true;
            } else {
                const taxRateForDefaultZone = this.taxRateService.getApplicableTaxRate(
                    ctx.channel.defaultTaxZone,
                    taxCategory,
                );
                price = taxRateForDefaultZone.netPriceOf(inputPrice);
            }
        }

        return {
            price,
            priceIncludesTax,
        };
    }
}
