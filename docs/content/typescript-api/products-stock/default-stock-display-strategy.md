---
title: "DefaultStockDisplayStrategy"
weight: 10
date: 2023-07-14T16:57:49.494Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# DefaultStockDisplayStrategy
<div class="symbol">


# DefaultStockDisplayStrategy

{{< generation-info sourceFile="packages/core/src/config/catalog/default-stock-display-strategy.ts" sourceLine="14" packageName="@vendure/core">}}

Displays the `ProductVariant.stockLevel` as either `'IN_STOCK'`, `'OUT_OF_STOCK'` or `'LOW_STOCK'`.
Low stock is defined as a saleable stock level less than or equal to the `lowStockLevel` as passed in
to the constructor (defaults to `2`).

## Signature

```TypeScript
class DefaultStockDisplayStrategy implements StockDisplayStrategy {
  constructor(lowStockLevel: number = 2)
  getStockLevel(ctx: RequestContext, productVariant: ProductVariant, saleableStockLevel: number) => string;
}
```
## Implements

 * <a href='/typescript-api/products-stock/stock-display-strategy#stockdisplaystrategy'>StockDisplayStrategy</a>


## Members

### constructor

{{< member-info kind="method" type="(lowStockLevel: number = 2) => DefaultStockDisplayStrategy"  >}}

{{< member-description >}}{{< /member-description >}}

### getStockLevel

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productVariant: <a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>, saleableStockLevel: number) => string"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
