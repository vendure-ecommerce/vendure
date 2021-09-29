import { RequestContext } from '../../api/common/request-context';
import { PriceCalculationResult } from '../../common/types/common-types';
import { InjectableStrategy } from '../../common/types/injectable-strategy';
import { TaxCategory, Zone } from '../../entity/index';

/**
 * @description
 * Defines how ProductVariant are calculated based on the input price, tax zone and current request context.
 *
 * @docsCategory configuration
 * @docsPage ProductVariantPriceCalculationStrategy
 */
export interface ProductVariantPriceCalculationStrategy extends InjectableStrategy {
    calculate(args: ProductVariantPriceCalculationArgs): Promise<PriceCalculationResult>;
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
