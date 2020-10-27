import { RequestContext } from '../../api/common/request-context';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';

import { CalculatedPrice, PriceCalculationStrategy } from './price-calculation-strategy';

/**
 * @description
 * The default {@link PriceCalculationStrategy}, which simply passes through the price of
 * the ProductVariant without performing any calculations
 *
 * @docsCategory orders
 */
export class DefaultPriceCalculationStrategy implements PriceCalculationStrategy {
    calculateUnitPrice(
        ctx: RequestContext,
        productVariant: ProductVariant,
    ): CalculatedPrice | Promise<CalculatedPrice> {
        return productVariant;
    }
}
