---
title: "DefaultProductVariantPriceCalculationStrategy"
weight: 10
date: 2023-07-20T13:56:14.323Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DefaultProductVariantPriceCalculationStrategy

<GenerationInfo sourceFile="packages/core/src/config/catalog/default-product-variant-price-calculation-strategy.ts" sourceLine="18" packageName="@vendure/core" />

A default ProductVariant price calculation function.

```ts title="Signature"
class DefaultProductVariantPriceCalculationStrategy implements ProductVariantPriceCalculationStrategy {
  init(injector: Injector) => ;
  async calculate(args: ProductVariantPriceCalculationArgs) => Promise<PriceCalculationResult>;
}
```
Implements

 * <a href='/typescript-api/products-stock/product-variant-price-calculation-strategy#productvariantpricecalculationstrategy'>ProductVariantPriceCalculationStrategy</a>



### init

<MemberInfo kind="method" type="(injector: <a href='/typescript-api/common/injector#injector'>Injector</a>) => "   />


### calculate

<MemberInfo kind="method" type="(args: <a href='/typescript-api/products-stock/product-variant-price-calculation-strategy#productvariantpricecalculationargs'>ProductVariantPriceCalculationArgs</a>) => Promise&#60;<a href='/typescript-api/common/price-calculation-result#pricecalculationresult'>PriceCalculationResult</a>&#62;"   />


