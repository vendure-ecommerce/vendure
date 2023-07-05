import { RequestContext } from '../../api/common/request-context';
import { PriceCalculationResult } from '../../common/types/common-types';
import { InjectableStrategy } from '../../common/types/injectable-strategy';
import { TaxCategory } from '../../entity/tax-category/tax-category.entity';
import { Zone } from '../../entity/zone/zone.entity';

/**
 * @description
 * Defines how ProductVariant are calculated based on the input price, tax zone and current request context.
 *
 * @docsCategory  products & stock
 * @docsPage ProductVariantPriceCalculationStrategy
 */
export interface ProductVariantPriceCalculationStrategy extends InjectableStrategy {
    calculate(args: ProductVariantPriceCalculationArgs): Promise<PriceCalculationResult>;
}

/**
 * @description
 * The arguments passed the `calculate` method of the configured {@link ProductVariantPriceCalculationStrategy}.
 *
 * @docsCategory products & stock
 * @docsPage ProductVariantPriceCalculationStrategy
 */
export interface ProductVariantPriceCalculationArgs {
    inputPrice: number;
    taxCategory: TaxCategory;
    activeTaxZone: Zone;
    ctx: RequestContext;
}
