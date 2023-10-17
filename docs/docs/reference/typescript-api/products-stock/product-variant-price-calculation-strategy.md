---
title: "ProductVariantPriceCalculationStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ProductVariantPriceCalculationStrategy

<GenerationInfo sourceFile="packages/core/src/config/catalog/product-variant-price-calculation-strategy.ts" sourceLine="22" packageName="@vendure/core" />

Defines how ProductVariant are calculated based on the input price, tax zone and current request context.

:::info

This is configured via the `catalogOptions.productVariantPriceCalculationStrategy` property of
your VendureConfig.

:::

```ts title="Signature"
interface ProductVariantPriceCalculationStrategy extends InjectableStrategy {
    calculate(args: ProductVariantPriceCalculationArgs): Promise<PriceCalculationResult>;
}
```
* Extends: <code><a href='/reference/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a></code>



<div className="members-wrapper">

### calculate

<MemberInfo kind="method" type={`(args: <a href='/reference/typescript-api/products-stock/product-variant-price-calculation-strategy#productvariantpricecalculationargs'>ProductVariantPriceCalculationArgs</a>) => Promise&#60;<a href='/reference/typescript-api/common/price-calculation-result#pricecalculationresult'>PriceCalculationResult</a>&#62;`}   />




</div>


## ProductVariantPriceCalculationArgs

<GenerationInfo sourceFile="packages/core/src/config/catalog/product-variant-price-calculation-strategy.ts" sourceLine="35" packageName="@vendure/core" />

The arguments passed the `calculate` method of the configured <a href='/reference/typescript-api/products-stock/product-variant-price-calculation-strategy#productvariantpricecalculationstrategy'>ProductVariantPriceCalculationStrategy</a>.

The `productVariant` argument was added in v2.1.0.

```ts title="Signature"
interface ProductVariantPriceCalculationArgs {
    inputPrice: number;
    productVariant: ProductVariant;
    taxCategory: TaxCategory;
    activeTaxZone: Zone;
    ctx: RequestContext;
}
```

<div className="members-wrapper">

### inputPrice

<MemberInfo kind="property" type={`number`}   />


### productVariant

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>`}   />


### taxCategory

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/tax-category#taxcategory'>TaxCategory</a>`}   />


### activeTaxZone

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/zone#zone'>Zone</a>`}   />


### ctx

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>`}   />




</div>
