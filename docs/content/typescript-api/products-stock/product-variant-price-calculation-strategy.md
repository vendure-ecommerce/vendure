---
title: "ProductVariantPriceCalculationStrategy"
weight: 10
date: 2023-07-14T16:57:49.503Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# ProductVariantPriceCalculationStrategy
<div class="symbol">


# ProductVariantPriceCalculationStrategy

{{< generation-info sourceFile="packages/core/src/config/catalog/product-variant-price-calculation-strategy.ts" sourceLine="14" packageName="@vendure/core">}}

Defines how ProductVariant are calculated based on the input price, tax zone and current request context.

## Signature

```TypeScript
interface ProductVariantPriceCalculationStrategy extends InjectableStrategy {
  calculate(args: ProductVariantPriceCalculationArgs): Promise<PriceCalculationResult>;
}
```
## Extends

 * <a href='/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a>


## Members

### calculate

{{< member-info kind="method" type="(args: <a href='/typescript-api/products-stock/product-variant-price-calculation-strategy#productvariantpricecalculationargs'>ProductVariantPriceCalculationArgs</a>) => Promise&#60;<a href='/typescript-api/common/price-calculation-result#pricecalculationresult'>PriceCalculationResult</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# ProductVariantPriceCalculationArgs

{{< generation-info sourceFile="packages/core/src/config/catalog/product-variant-price-calculation-strategy.ts" sourceLine="25" packageName="@vendure/core">}}

The arguments passed the `calculate` method of the configured <a href='/typescript-api/products-stock/product-variant-price-calculation-strategy#productvariantpricecalculationstrategy'>ProductVariantPriceCalculationStrategy</a>.

## Signature

```TypeScript
interface ProductVariantPriceCalculationArgs {
  inputPrice: number;
  taxCategory: TaxCategory;
  activeTaxZone: Zone;
  ctx: RequestContext;
}
```
## Members

### inputPrice

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### taxCategory

{{< member-info kind="property" type="<a href='/typescript-api/entities/tax-category#taxcategory'>TaxCategory</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### activeTaxZone

{{< member-info kind="property" type="<a href='/typescript-api/entities/zone#zone'>Zone</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### ctx

{{< member-info kind="property" type="<a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
