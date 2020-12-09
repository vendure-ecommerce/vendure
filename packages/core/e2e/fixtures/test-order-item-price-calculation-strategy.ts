import {
    CalculatedPrice,
    OrderItemPriceCalculationStrategy,
    ProductVariant,
    RequestContext,
} from '@vendure/core';

/**
 * Adds $5 for items with gift wrapping.
 */
export class TestOrderItemPriceCalculationStrategy implements OrderItemPriceCalculationStrategy {
    calculateUnitPrice(
        ctx: RequestContext,
        productVariant: ProductVariant,
        orderLineCustomFields: { [p: string]: any },
    ): CalculatedPrice | Promise<CalculatedPrice> {
        let price = productVariant.price;
        if (orderLineCustomFields.giftWrap) {
            price += 500;
        }
        return {
            price,
            priceIncludesTax: productVariant.priceIncludesTax,
        };
    }
}
