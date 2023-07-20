---
title: "ProductVariantPriceSelectionStrategy"
weight: 10
date: 2023-07-20T13:56:14.328Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ProductVariantPriceSelectionStrategy

<GenerationInfo sourceFile="packages/core/src/config/catalog/product-variant-price-selection-strategy.ts" sourceLine="14" packageName="@vendure/core" since="2.0.0" />

The strategy for selecting the price for a ProductVariant in a given Channel.

```ts title="Signature"
interface ProductVariantPriceSelectionStrategy extends InjectableStrategy {
  selectPrice(
        ctx: RequestContext,
        prices: ProductVariantPrice[],
    ): ProductVariantPrice | undefined | Promise<ProductVariantPrice | undefined>;
}
```
Extends

 * <a href='/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a>



### selectPrice

<MemberInfo kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, prices: <a href='/typescript-api/entities/product-variant-price#productvariantprice'>ProductVariantPrice</a>[]) => <a href='/typescript-api/entities/product-variant-price#productvariantprice'>ProductVariantPrice</a> | undefined | Promise&#60;<a href='/typescript-api/entities/product-variant-price#productvariantprice'>ProductVariantPrice</a> | undefined&#62;"   />




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
Implements

 * <a href='/typescript-api/configuration/product-variant-price-selection-strategy#productvariantpriceselectionstrategy'>ProductVariantPriceSelectionStrategy</a>



### selectPrice

<MemberInfo kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, prices: <a href='/typescript-api/entities/product-variant-price#productvariantprice'>ProductVariantPrice</a>[]) => "   />


