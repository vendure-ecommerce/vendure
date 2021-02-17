import { RequestContext } from '../../api/common/request-context';
import { PriceCalculationResult } from '../../common/types/common-types';
import { InjectableStrategy } from '../../common/types/injectable-strategy';
import { TaxCategory, Zone } from '../../entity/index';
import { TaxRateService } from '../../service/services/tax-rate.service';

/**
 * @description
 * Defines how ProductVariant are calculated based on the input price, tax zone and current request context.
 *
 * @docsCategory configuration
 * @docsPage ProductVariantPriceCalculationStrategy
 */
export interface ProductVariantPriceCalculationStrategy extends InjectableStrategy {
    calculate(args: ProductVariantPriceCalculationArgs): PriceCalculationResult;
}

/**
 * @description
 * The arguments passed the the `calculate` method of the configured {@link ProductVariantPriceCalculationStrategy}.
 *
 * @docsCategory configuration
 * @docsPage ProductVariantPriceCalculationStrategy
 */
export interface ProductVariantPriceCalculationArgs {
    inputPrice: number;
    taxCategory: TaxCategory;
    activeTaxZone: Zone;
    ctx: RequestContext;
}

/**
 * @description
 * This is an alias of {@link ProductVariantPriceCalculationStrategy} to preserve compatibility when upgrading.
 *
 * @deprecated Use ProductVariantPriceCalculationStrategy
 * @docsCategory tax
 */
export interface TaxCalculationStrategy extends ProductVariantPriceCalculationStrategy {}
