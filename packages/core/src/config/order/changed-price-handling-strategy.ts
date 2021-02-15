import { RequestContext } from '../../api/common/request-context';
import { PriceCalculationResult } from '../../common/types/common-types';
import { InjectableStrategy } from '../../common/types/injectable-strategy';
import { OrderItem } from '../../entity/order-item/order-item.entity';

/**
 * @description
 * This strategy defines how we handle the situation where an OrderItem exists in an Order, and
 * then later on another is added but in the mean time the price of the ProductVariant has changed.
 *
 * By default, the latest price will be used. Any price changes resulting from using a newer price
 * will be reflected in the GraphQL `OrderLine.unitPrice[WithTax]ChangeSinceAdded` field.
 *
 * @docsCategory orders
 */
export interface ChangedPriceHandlingStrategy extends InjectableStrategy {
    /**
     * @description
     * This method is called when adding to or adjusting OrderLines, if the latest price
     * (as determined by the ProductVariant price, potentially modified by the configured
     * {@link OrderItemPriceCalculationStrategy}) differs from the initial price at the time
     * that the OrderLine was created.
     */
    handlePriceChange(
        ctx: RequestContext,
        current: PriceCalculationResult,
        existingItems: OrderItem[],
    ): PriceCalculationResult | Promise<PriceCalculationResult>;
}
