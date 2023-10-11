---
title: "CatalogOptions"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## CatalogOptions

<GenerationInfo sourceFile="packages/core/src/config/vendure-config.ts" sourceLine="653" packageName="@vendure/core" />

Options related to products and collections.

```ts title="Signature"
interface CatalogOptions {
    collectionFilters?: Array<CollectionFilter<any>>;
    productVariantPriceSelectionStrategy?: ProductVariantPriceSelectionStrategy;
    productVariantPriceCalculationStrategy?: ProductVariantPriceCalculationStrategy;
    stockDisplayStrategy?: StockDisplayStrategy;
    stockLocationStrategy?: StockLocationStrategy;
}
```

<div className="members-wrapper">

### collectionFilters

<MemberInfo kind="property" type={`Array&#60;<a href='/reference/typescript-api/configuration/collection-filter#collectionfilter'>CollectionFilter</a>&#60;any&#62;&#62;`} default="defaultCollectionFilters"   />

Allows custom <a href='/reference/typescript-api/configuration/collection-filter#collectionfilter'>CollectionFilter</a>s to be defined.
### productVariantPriceSelectionStrategy

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/configuration/product-variant-price-selection-strategy#productvariantpriceselectionstrategy'>ProductVariantPriceSelectionStrategy</a>`} default="<a href='/reference/typescript-api/configuration/product-variant-price-selection-strategy#defaultproductvariantpriceselectionstrategy'>DefaultProductVariantPriceSelectionStrategy</a>"  since="2.0.0"  />

Defines the strategy used to select the price of a ProductVariant, based on factors
such as the active Channel and active CurrencyCode.
### productVariantPriceCalculationStrategy

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/products-stock/product-variant-price-calculation-strategy#productvariantpricecalculationstrategy'>ProductVariantPriceCalculationStrategy</a>`} default="DefaultTaxCalculationStrategy"   />

Defines the strategy used for calculating the price of ProductVariants based
on the Channel settings and active tax Zone.
### stockDisplayStrategy

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/products-stock/stock-display-strategy#stockdisplaystrategy'>StockDisplayStrategy</a>`} default="<a href='/reference/typescript-api/products-stock/default-stock-display-strategy#defaultstockdisplaystrategy'>DefaultStockDisplayStrategy</a>"   />

Defines how the `ProductVariant.stockLevel` value is obtained. It is usually not desirable
to directly expose stock levels over a public API, as this could be considered a leak of
sensitive information. However, the storefront will usually want to display _some_ indication
of whether a given ProductVariant is in stock. The default StockDisplayStrategy will
display "IN_STOCK", "OUT_OF_STOCK" or "LOW_STOCK" rather than exposing the actual saleable
stock level.
### stockLocationStrategy

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/products-stock/stock-location-strategy#stocklocationstrategy'>StockLocationStrategy</a>`} default="<a href='/reference/typescript-api/products-stock/default-stock-location-strategy#defaultstocklocationstrategy'>DefaultStockLocationStrategy</a>"  since="2.0.0"  />

Defines the strategy used to determine which StockLocation should be used when performing
stock operations such as allocating and releasing stock as well as determining the
amount of stock available for sale.


</div>
