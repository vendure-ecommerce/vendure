---
title: "DefaultStockDisplayStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DefaultStockDisplayStrategy

<GenerationInfo sourceFile="packages/core/src/config/catalog/default-stock-display-strategy.ts" sourceLine="14" packageName="@vendure/core" />

Displays the `ProductVariant.stockLevel` as either `'IN_STOCK'`, `'OUT_OF_STOCK'` or `'LOW_STOCK'`.
Low stock is defined as a saleable stock level less than or equal to the `lowStockLevel` as passed in
to the constructor (defaults to `2`).

```ts title="Signature"
class DefaultStockDisplayStrategy implements StockDisplayStrategy {
    constructor(lowStockLevel: number = 2)
    getStockLevel(ctx: RequestContext, productVariant: ProductVariant, saleableStockLevel: number) => string;
}
```
* Implements: <code><a href='/reference/typescript-api/products-stock/stock-display-strategy#stockdisplaystrategy'>StockDisplayStrategy</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(lowStockLevel: number = 2) => DefaultStockDisplayStrategy`}   />


### getStockLevel

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productVariant: <a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>, saleableStockLevel: number) => string`}   />




</div>
