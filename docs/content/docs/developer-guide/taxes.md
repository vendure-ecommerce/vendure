---
title: "Taxes"
showtoc: true
---
# Taxes

Most e-commerce applications need to correctly handle taxes such as sales tax or value added tax (VAT). In Vendure, tax handling consists of:

* **Tax categories** Each ProductVariant is assigned to a specific TaxCategory. In some tax systems, the tax rate differs depending on the type of good. For example, VAT in the UK has 3 rates, "standard" (most goods), "reduced" (e.g. child car seats) and "zero" (e.g. books).
* **Tax rates** This is the tax rate applied to a specific tax category for a specific [Zone]({{< relref "zone" >}}). E.g., the tax rate for "standard" goods in the UK Zone is 20%.
* **Channel tax settings** Each Channel can specify whether the prices of produce variants are inclusive of tax or not, and also specify the default Zone to use for tax calculations.
* **TaxZoneStrategy** Determines the active tax Zone used when calculating what TaxRate to apply. By default, it uses the default tax Zone from the Channel settings.
* **TaxLineCalculationStrategy** This determines the taxes applied when adding an item to an Order. If you want to integrate a 3rd-party tax API or other async lookup, this is where it would be done.

## API conventions

In the GraphQL API, any type which has a taxable price will split that price into two fields: `price` and `priceWithTax`. This pattern also holds for other price fields, e.g.

```graphql
query {
  activeOrder {
    ...on Order {
      lines {
        linePrice
        linePriceWithTax
      }
      subTotal
      subTotalWithTax
      shipping
      shippingWithTax
      total
      totalWithTax
    }
  }
}
```

In your storefront you can therefore choose whether to display the prices with or without tax, according to the laws and conventions of the area in which your business operates.

## Calculating taxes on OrderItems

When a customer adds an item to the Order, the following logic takes place:

1. The price of the OrderItem, and whether or not that price is inclusive of tax, is determined according to the configured [OrderItemPriceCalculationStrategy]({{< relref "order-item-price-calculation-strategy" >}}).
2. The active tax Zone is determined based on the configured [TaxZoneStrategy]({{< relref "tax-zone-strategy" >}}).
3. The applicable TaxRate is fetched based on the ProductVariant's TaxCategory and the active tax Zone determined in step 1.
4. The `TaxLineCalculationStrategy.calculate()` of the configured [TaxLineCalculationStrategy]({{< relref "tax-line-calculation-strategy" >}}) is called, which will return one or more [TaxLines]({{< relref "/docs/graphql-api/shop/object-types" >}}#taxline).
5. The final `priceWithTax` of the OrderItem is calculated based on all the above.

## Calculating taxes on shipping

The taxes on shipping is calculated by the [ShippingCalculator]({{< relref "shipping-calculator" >}}) of the Order's selected [ShippingMethod]({{< relref "shipping-method" >}}).

## Configuration

This example shows the configuration properties related to taxes:

```TypeScript
export const config: VendureConfig = {
  taxOptions: {
    taxZoneStrategy: new DefaultTaxZoneStrategy(),
    taxLineCalculationStrategy: new DefaultTaxLineCalculationStrategy(),
  },
  orderOptions: {
    orderItemPriceCalculationStrategy: new DefaultOrderItemPriceCalculationStrategy()
  }
}

```
