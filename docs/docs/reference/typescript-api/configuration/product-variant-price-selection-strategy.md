---
title: "ProductVariantPriceSelectionStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ProductVariantPriceSelectionStrategy

<GenerationInfo sourceFile="packages/core/src/config/catalog/product-variant-price-selection-strategy.ts" sourceLine="21" packageName="@vendure/core" since="2.0.0" />

The strategy for selecting the price for a ProductVariant in a given Channel.

:::info

This is configured via the `catalogOptions.productVariantPriceSelectionStrategy` property of
your VendureConfig.

:::

```ts title="Signature"
interface ProductVariantPriceSelectionStrategy extends InjectableStrategy {
    selectPrice(
        ctx: RequestContext,
        prices: ProductVariantPrice[],
    ): ProductVariantPrice | undefined | Promise<ProductVariantPrice | undefined>;
}
```
* Extends: <code><a href='/reference/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a></code>



<div className="members-wrapper">

### selectPrice

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, prices: <a href='/reference/typescript-api/entities/product-variant-price#productvariantprice'>ProductVariantPrice</a>[]) => <a href='/reference/typescript-api/entities/product-variant-price#productvariantprice'>ProductVariantPrice</a> | undefined | Promise&#60;<a href='/reference/typescript-api/entities/product-variant-price#productvariantprice'>ProductVariantPrice</a> | undefined&#62;`}   />




</div>


## DefaultProductVariantPriceSelectionStrategy

<GenerationInfo sourceFile="packages/core/src/config/catalog/default-product-variant-price-selection-strategy.ts" sourceLine="17" packageName="@vendure/core" since="2.0.0" />

The default strategy for selecting the price for a ProductVariant in a given Channel. It
first filters all available prices to those which are in the current Channel, and then
selects the first price which matches the current currency.

```ts title="Signature"
class DefaultProductVariantPriceSelectionStrategy implements ProductVariantPriceSelectionStrategy {
    selectPrice(ctx: RequestContext, prices: ProductVariantPrice[]) => ;
}
```
* Implements: <code><a href='/reference/typescript-api/configuration/product-variant-price-selection-strategy#productvariantpriceselectionstrategy'>ProductVariantPriceSelectionStrategy</a></code>



<div className="members-wrapper">

### selectPrice

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, prices: <a href='/reference/typescript-api/entities/product-variant-price#productvariantprice'>ProductVariantPrice</a>[]) => `}   />




</div>
