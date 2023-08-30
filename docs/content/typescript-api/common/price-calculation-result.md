---
title: "PriceCalculationResult"
weight: 10
date: 2023-07-14T16:57:49.454Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# PriceCalculationResult
<div class="symbol">


# PriceCalculationResult

{{< generation-info sourceFile="packages/core/src/common/types/common-types.ts" sourceLine="171" packageName="@vendure/core">}}

The result of the price calculation from the <a href='/typescript-api/products-stock/product-variant-price-calculation-strategy#productvariantpricecalculationstrategy'>ProductVariantPriceCalculationStrategy</a> or the
<a href='/typescript-api/orders/order-item-price-calculation-strategy#orderitempricecalculationstrategy'>OrderItemPriceCalculationStrategy</a>.

## Signature

```TypeScript
type PriceCalculationResult = {
  price: number;
  priceIncludesTax: boolean;
}
```
## Members

### price

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### priceIncludesTax

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
