---
title: "DefaultProductVariantPriceCalculationStrategy"
weight: 10
date: 2023-07-14T16:57:49.490Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# DefaultProductVariantPriceCalculationStrategy
<div class="symbol">


# DefaultProductVariantPriceCalculationStrategy

{{< generation-info sourceFile="packages/core/src/config/catalog/default-product-variant-price-calculation-strategy.ts" sourceLine="18" packageName="@vendure/core">}}

A default ProductVariant price calculation function.

## Signature

```TypeScript
class DefaultProductVariantPriceCalculationStrategy implements ProductVariantPriceCalculationStrategy {
  init(injector: Injector) => ;
  async calculate(args: ProductVariantPriceCalculationArgs) => Promise<PriceCalculationResult>;
}
```
## Implements

 * <a href='/typescript-api/products-stock/product-variant-price-calculation-strategy#productvariantpricecalculationstrategy'>ProductVariantPriceCalculationStrategy</a>


## Members

### init

{{< member-info kind="method" type="(injector: <a href='/typescript-api/common/injector#injector'>Injector</a>) => "  >}}

{{< member-description >}}{{< /member-description >}}

### calculate

{{< member-info kind="method" type="(args: <a href='/typescript-api/products-stock/product-variant-price-calculation-strategy#productvariantpricecalculationargs'>ProductVariantPriceCalculationArgs</a>) => Promise&#60;<a href='/typescript-api/common/price-calculation-result#pricecalculationresult'>PriceCalculationResult</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
