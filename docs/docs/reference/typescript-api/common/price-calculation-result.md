---
title: "PriceCalculationResult"
weight: 10
date: 2023-07-20T13:56:14.236Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## PriceCalculationResult

<GenerationInfo sourceFile="packages/core/src/common/types/common-types.ts" sourceLine="171" packageName="@vendure/core" />

The result of the price calculation from the <a href='/typescript-api/products-stock/product-variant-price-calculation-strategy#productvariantpricecalculationstrategy'>ProductVariantPriceCalculationStrategy</a> or the
<a href='/typescript-api/orders/order-item-price-calculation-strategy#orderitempricecalculationstrategy'>OrderItemPriceCalculationStrategy</a>.

```ts title="Signature"
type PriceCalculationResult = {
  price: number;
  priceIncludesTax: boolean;
}
```
## Members


### price

<MemberInfo kind="property" type="number"   />


### priceIncludesTax

<MemberInfo kind="property" type="boolean"   />


