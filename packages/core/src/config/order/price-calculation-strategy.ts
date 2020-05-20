import { InjectableStrategy } from '../../common/types/injectable-strategy';
import { ProductVariant } from '../../entity/product-variant/product-variant.entity';

/**
 * @description
 * The result of the price calculation from the {@link PriceCalculationStrategy}.
 *
 * @docsCategory Orders
 */
export type CalculatedPrice = {
    price: number;
    priceIncludesTax: boolean;
};

/**
 * @description
 * The PriceCalculationStrategy defines the price of an OrderItem when a ProductVariant gets added
 * to an order via the `addItemToOrder` mutation. By default the {@link DefaultPriceCalculationStrategy}
 * is used.
 *
 * ### PriceCalculationStrategy vs Promotions
 * Both the PriceCalculationStrategy and Promotions can be used to alter the price paid for a product.
 *
 * Use PriceCalculationStrategy if:
 *
 * * The price is not dependent on quantity or on the other contents of the Order.
 * * The price calculation is based on the properties of the ProductVariant and any CustomFields
 *   specified on the OrderLine, for example via a product configurator.
 * * The logic is a permanent part of your business requirements.
 *
 * Use Promotions if:
 *
 * * You want to implement "discounts" and "special offers"
 * * The calculation is not a permanent part of your business requirements.
 * * The price depends on dynamic aspects such as quantities and which other
 *   ProductVariants are in the Order.
 * * The configuration of the logic needs to be manipulated via the Admin UI.
 *
 * ### Example use-cases
 *
 * A custom PriceCalculationStrategy can be used to implement things like:
 *
 * * A gift-wrapping service, where a boolean custom field is defined on the OrderLine. If `true`,
 *   a gift-wrapping surcharge would be added to the price.
 * * A product-configurator where e.g. various finishes, colors, and materials can be selected and stored
 *   as OrderLine custom fields.
 *
 * @docsCategory Orders
 */
export interface PriceCalculationStrategy extends InjectableStrategy {
    /**
     * @description
     * Receives the ProductVariant to be added to the Order as well as any OrderLine custom fields and returns
     * the price for a single unit.
     */
    calculateUnitPrice(
        productVariant: ProductVariant,
        orderLineCustomFields: { [key: string]: any },
    ): CalculatedPrice | Promise<CalculatedPrice>;
}
