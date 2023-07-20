---
title: "CatalogOptions"
weight: 10
date: 2023-07-14T16:57:49.754Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# CatalogOptions
<div class="symbol">


# CatalogOptions

{{< generation-info sourceFile="packages/core/src/config/vendure-config.ts" sourceLine="652" packageName="@vendure/core">}}

Options related to products and collections.

## Signature

```TypeScript
interface CatalogOptions {
  collectionFilters?: Array<CollectionFilter<any>>;
  productVariantPriceSelectionStrategy?: ProductVariantPriceSelectionStrategy;
  productVariantPriceCalculationStrategy?: ProductVariantPriceCalculationStrategy;
  stockDisplayStrategy?: StockDisplayStrategy;
  stockLocationStrategy?: StockLocationStrategy;
}
```
## Members

### collectionFilters

{{< member-info kind="property" type="Array&#60;<a href='/typescript-api/configuration/collection-filter#collectionfilter'>CollectionFilter</a>&#60;any&#62;&#62;" default="defaultCollectionFilters"  >}}

{{< member-description >}}Allows custom <a href='/typescript-api/configuration/collection-filter#collectionfilter'>CollectionFilter</a>s to be defined.{{< /member-description >}}

### productVariantPriceSelectionStrategy

{{< member-info kind="property" type="<a href='/typescript-api/configuration/product-variant-price-selection-strategy#productvariantpriceselectionstrategy'>ProductVariantPriceSelectionStrategy</a>" default="<a href='/typescript-api/configuration/product-variant-price-selection-strategy#defaultproductvariantpriceselectionstrategy'>DefaultProductVariantPriceSelectionStrategy</a>"  since="2.0.0" >}}

{{< member-description >}}Defines the strategy used to select the price of a ProductVariant, based on factors
such as the active Channel and active CurrencyCode.{{< /member-description >}}

### productVariantPriceCalculationStrategy

{{< member-info kind="property" type="<a href='/typescript-api/products-stock/product-variant-price-calculation-strategy#productvariantpricecalculationstrategy'>ProductVariantPriceCalculationStrategy</a>" default="DefaultTaxCalculationStrategy"  >}}

{{< member-description >}}Defines the strategy used for calculating the price of ProductVariants based
on the Channel settings and active tax Zone.{{< /member-description >}}

### stockDisplayStrategy

{{< member-info kind="property" type="<a href='/typescript-api/products-stock/stock-display-strategy#stockdisplaystrategy'>StockDisplayStrategy</a>" default="<a href='/typescript-api/products-stock/default-stock-display-strategy#defaultstockdisplaystrategy'>DefaultStockDisplayStrategy</a>"  >}}

{{< member-description >}}Defines how the `ProductVariant.stockLevel` value is obtained. It is usually not desirable
to directly expose stock levels over a public API, as this could be considered a leak of
sensitive information. However, the storefront will usually want to display _some_ indication
of whether a given ProductVariant is in stock. The default StockDisplayStrategy will
display "IN_STOCK", "OUT_OF_STOCK" or "LOW_STOCK" rather than exposing the actual saleable
stock level.{{< /member-description >}}

### stockLocationStrategy

{{< member-info kind="property" type="<a href='/typescript-api/products-stock/stock-location-strategy#stocklocationstrategy'>StockLocationStrategy</a>" default="<a href='/typescript-api/products-stock/default-stock-location-strategy#defaultstocklocationstrategy'>DefaultStockLocationStrategy</a>"  since="2.0.0" >}}

{{< member-description >}}Defines the strategy used to determine which StockLocation should be used when performing
stock operations such as allocating and releasing stock as well as determining the
amount of stock available for sale.{{< /member-description >}}


</div>
