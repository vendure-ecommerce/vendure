---
title: "ProductVariantPriceCalculationStrategy"
weight: 10
date: 2023-07-20T13:56:14.350Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ProductVariantPriceCalculationStrategy

<GenerationInfo sourceFile="packages/core/src/config/catalog/product-variant-price-calculation-strategy.ts" sourceLine="14" packageName="@vendure/core" />

Defines how ProductVariant are calculated based on the input price, tax zone and current request context.

```ts title="Signature"
interface ProductVariantPriceCalculationStrategy extends InjectableStrategy {
  calculate(args: ProductVariantPriceCalculationArgs): Promise<PriceCalculationResult>;
}
```
Extends

 * <a href='/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a>



### calculate

<MemberInfo kind="method" type="(args: <a href='/typescript-api/products-stock/product-variant-price-calculation-strategy#productvariantpricecalculationargs'>ProductVariantPriceCalculationArgs</a>) => Promise&#60;<a href='/typescript-api/common/price-calculation-result#pricecalculationresult'>PriceCalculationResult</a>&#62;"   />




## ProductVariantPriceCalculationArgs

<GenerationInfo sourceFile="packages/core/src/config/catalog/product-variant-price-calculation-strategy.ts" sourceLine="25" packageName="@vendure/core" />

The arguments passed the `calculate` method of the configured <a href='/typescript-api/products-stock/product-variant-price-calculation-strategy#productvariantpricecalculationstrategy'>ProductVariantPriceCalculationStrategy</a>.

```ts title="Signature"
interface ProductVariantPriceCalculationArgs {
  inputPrice: number;
  taxCategory: TaxCategory;
  activeTaxZone: Zone;
  ctx: RequestContext;
}
```

### inputPrice

<MemberInfo kind="property" type="number"   />


### taxCategory

<MemberInfo kind="property" type="<a href='/typescript-api/entities/tax-category#taxcategory'>TaxCategory</a>"   />


### activeTaxZone

<MemberInfo kind="property" type="<a href='/typescript-api/entities/zone#zone'>Zone</a>"   />


### ctx

<MemberInfo kind="property" type="<a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>"   />


