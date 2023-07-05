---
title: "OrderItemPriceCalculationStrategy"
weight: 10
date: 2023-07-04T11:02:11.954Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# OrderItemPriceCalculationStrategy
<div class="symbol">


# OrderItemPriceCalculationStrategy

{{< generation-info sourceFile="packages/core/src/config/order/order-item-price-calculation-strategy.ts" sourceLine="53" packageName="@vendure/core">}}

The OrderItemPriceCalculationStrategy defines the listPrice of an OrderLine when adding an item to an Order. By default the
<a href='/typescript-api/orders/default-order-item-price-calculation-strategy#defaultorderitempricecalculationstrategy'>DefaultOrderItemPriceCalculationStrategy</a> is used.

### When is the strategy invoked ?
* addItemToOrder (only on the new order line)
* adjustOrderLine  (only on the adjusted order line)
* setOrderShippingAddress (on all order lines)
* setOrderBillingAddress (on all order lines)

### OrderItemPriceCalculationStrategy vs Promotions
Both the OrderItemPriceCalculationStrategy and Promotions can be used to alter the price paid for a product.

The main difference is when a Promotion is applied, it adds a `discount` line to the Order, and the regular
price is used for the value of `OrderLine.listPrice` property, whereas
the OrderItemPriceCalculationStrategy actually alters the value of `OrderLine.listPrice` itself, and does not
add any discounts to the Order.

Use OrderItemPriceCalculationStrategy if:

* The price calculation is based on the properties of the ProductVariant and any CustomFields
  specified on the OrderLine, for example via a product configurator.
* The logic is a permanent part of your business requirements.

Use Promotions if:

* You want to implement "discounts" and "special offers"
* The calculation is not a permanent part of your business requirements.
* The price depends on dynamic aspects such as quantities and which other
  ProductVariants are in the Order.
* The configuration of the logic needs to be manipulated via the Admin UI.

### Example use-cases

A custom OrderItemPriceCalculationStrategy can be used to implement things like:

* A gift-wrapping service, where a boolean custom field is defined on the OrderLine. If `true`,
  a gift-wrapping surcharge would be added to the price.
* A product-configurator where e.g. various finishes, colors, and materials can be selected and stored
  as OrderLine custom fields (see [Customizing models](/docs/developer-guide/customizing-models/#configurable-order-products).
* Price lists or bulk pricing, where different price bands are stored e.g. in a customField on the ProductVariant, and this
  is used to calculate the price based on the current quantity.

## Signature

```TypeScript
interface OrderItemPriceCalculationStrategy extends InjectableStrategy {
  calculateUnitPrice(
        ctx: RequestContext,
        productVariant: ProductVariant,
        orderLineCustomFields: { [key: string]: any },
        order: Order,
        quantity: number,
    ): PriceCalculationResult | Promise<PriceCalculationResult>;
}
```
## Extends

 * <a href='/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a>


## Members

### calculateUnitPrice

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productVariant: <a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>, orderLineCustomFields: { [key: string]: any }, order: <a href='/typescript-api/entities/order#order'>Order</a>, quantity: number) => <a href='/typescript-api/common/price-calculation-result#pricecalculationresult'>PriceCalculationResult</a> | Promise&#60;<a href='/typescript-api/common/price-calculation-result#pricecalculationresult'>PriceCalculationResult</a>&#62;"  >}}

{{< member-description >}}Receives the ProductVariant to be added to the Order as well as any OrderLine custom fields and returns
the price for a single unit.

Note: if you have any `relation` type custom fields defined on the OrderLine entity, they will only be
passed in to this method if they are set to `eager: true`. Otherwise, you can use the <a href='/typescript-api/data-access/entity-hydrator#entityhydrator'>EntityHydrator</a>
to join the missing relations.

Note: the `quantity` argument was added in v2.0.0{{< /member-description >}}


</div>
