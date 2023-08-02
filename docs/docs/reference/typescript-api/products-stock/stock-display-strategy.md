---
title: "StockDisplayStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## StockDisplayStrategy

<GenerationInfo sourceFile="packages/core/src/config/catalog/stock-display-strategy.ts" sourceLine="21" packageName="@vendure/core" />

Defines how the `ProductVariant.stockLevel` value is obtained. It is usually not desirable
to directly expose stock levels over a public API, as this could be considered a leak of
sensitive information. However, the storefront will usually want to display _some_ indication
of whether a given ProductVariant is in stock.

:::info

This is configured via the `catalogOptions.stockDisplayStrategy` property of
your VendureConfig.

:::

```ts title="Signature"
interface StockDisplayStrategy extends InjectableStrategy {
    getStockLevel(
        ctx: RequestContext,
        productVariant: ProductVariant,
        saleableStockLevel: number,
    ): string | Promise<string>;
}
```
* Extends: <code><a href='/reference/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a></code>



<div className="members-wrapper">

### getStockLevel

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productVariant: <a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>, saleableStockLevel: number) => string | Promise&#60;string&#62;`}   />

Returns a string representing the stock level, which will be used directly
in the GraphQL `ProductVariant.stockLevel` field.


</div>
