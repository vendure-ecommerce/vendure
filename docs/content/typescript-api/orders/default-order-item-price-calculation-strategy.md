---
title: "DefaultOrderItemPriceCalculationStrategy"
weight: 10
date: 2023-07-14T16:57:49.588Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# DefaultOrderItemPriceCalculationStrategy
<div class="symbol">


# DefaultOrderItemPriceCalculationStrategy

{{< generation-info sourceFile="packages/core/src/config/order/default-order-item-price-calculation-strategy.ts" sourceLine="14" packageName="@vendure/core">}}

The default <a href='/typescript-api/orders/order-item-price-calculation-strategy#orderitempricecalculationstrategy'>OrderItemPriceCalculationStrategy</a>, which simply passes through the price of
the ProductVariant without performing any calculations

## Signature

```TypeScript
class DefaultOrderItemPriceCalculationStrategy implements OrderItemPriceCalculationStrategy {
  calculateUnitPrice(ctx: RequestContext, productVariant: ProductVariant) => PriceCalculationResult | Promise<PriceCalculationResult>;
}
```
## Implements

 * <a href='/typescript-api/orders/order-item-price-calculation-strategy#orderitempricecalculationstrategy'>OrderItemPriceCalculationStrategy</a>


## Members

### calculateUnitPrice

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productVariant: <a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>) => <a href='/typescript-api/common/price-calculation-result#pricecalculationresult'>PriceCalculationResult</a> | Promise&#60;<a href='/typescript-api/common/price-calculation-result#pricecalculationresult'>PriceCalculationResult</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
