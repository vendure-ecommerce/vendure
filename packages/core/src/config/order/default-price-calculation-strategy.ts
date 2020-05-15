import { ProductVariant } from '../../entity/product-variant/product-variant.entity';

import { CalculatedPrice, PriceCalculationStrategy } from './price-calculation-strategy';

/**
 * @description
 * The default {@link PriceCalculationStrategy}, which simply passes through the price of
 * the ProductVariant without performing any calculations
 */
export class DefaultPriceCalculationStrategy implements PriceCalculationStrategy {
    calculateUnitPrice(productVariant: ProductVariant): CalculatedPrice | Promise<CalculatedPrice> {
        return productVariant;
    }
}
