---
title: "StockLocationStrategy"
weight: 10
date: 2023-07-14T16:57:49.508Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# StockLocationStrategy
<div class="symbol">


# StockLocationStrategy

{{< generation-info sourceFile="packages/core/src/config/catalog/stock-location-strategy.ts" sourceLine="48" packageName="@vendure/core" since="2.0.0">}}

The StockLocationStrategy is responsible for determining which <a href='/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>s
should be used to fulfill an <a href='/typescript-api/entities/order-line#orderline'>OrderLine</a> and how much stock should be allocated
from each location. It is also used to determine the available stock for a given
<a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>.

## Signature

```TypeScript
interface StockLocationStrategy extends InjectableStrategy {
  getAvailableStock(
        ctx: RequestContext,
        productVariantId: ID,
        stockLevels: StockLevel[],
    ): AvailableStock | Promise<AvailableStock>;
  forAllocation(
        ctx: RequestContext,
        stockLocations: StockLocation[],
        orderLine: OrderLine,
        quantity: number,
    ): LocationWithQuantity[] | Promise<LocationWithQuantity[]>;
  forRelease(
        ctx: RequestContext,
        stockLocations: StockLocation[],
        orderLine: OrderLine,
        quantity: number,
    ): LocationWithQuantity[] | Promise<LocationWithQuantity[]>;
  forSale(
        ctx: RequestContext,
        stockLocations: StockLocation[],
        orderLine: OrderLine,
        quantity: number,
    ): LocationWithQuantity[] | Promise<LocationWithQuantity[]>;
  forCancellation(
        ctx: RequestContext,
        stockLocations: StockLocation[],
        orderLine: OrderLine,
        quantity: number,
    ): LocationWithQuantity[] | Promise<LocationWithQuantity[]>;
}
```
## Extends

 * <a href='/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a>


## Members

### getAvailableStock

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productVariantId: <a href='/typescript-api/common/id#id'>ID</a>, stockLevels: <a href='/typescript-api/entities/stock-level#stocklevel'>StockLevel</a>[]) => <a href='/typescript-api/products-stock/stock-location-strategy#availablestock'>AvailableStock</a> | Promise&#60;<a href='/typescript-api/products-stock/stock-location-strategy#availablestock'>AvailableStock</a>&#62;"  >}}

{{< member-description >}}Returns the available stock for the given ProductVariant, taking into account
the stock levels at each StockLocation.{{< /member-description >}}

### forAllocation

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, stockLocations: <a href='/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>[], orderLine: <a href='/typescript-api/entities/order-line#orderline'>OrderLine</a>, quantity: number) => <a href='/typescript-api/products-stock/stock-location-strategy#locationwithquantity'>LocationWithQuantity</a>[] | Promise&#60;<a href='/typescript-api/products-stock/stock-location-strategy#locationwithquantity'>LocationWithQuantity</a>[]&#62;"  >}}

{{< member-description >}}Determines which StockLocations should be used to when allocating stock when
and Order is placed.{{< /member-description >}}

### forRelease

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, stockLocations: <a href='/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>[], orderLine: <a href='/typescript-api/entities/order-line#orderline'>OrderLine</a>, quantity: number) => <a href='/typescript-api/products-stock/stock-location-strategy#locationwithquantity'>LocationWithQuantity</a>[] | Promise&#60;<a href='/typescript-api/products-stock/stock-location-strategy#locationwithquantity'>LocationWithQuantity</a>[]&#62;"  >}}

{{< member-description >}}Determines which StockLocations should be used to when releasing allocated
stock when an OrderLine is cancelled before being fulfilled.{{< /member-description >}}

### forSale

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, stockLocations: <a href='/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>[], orderLine: <a href='/typescript-api/entities/order-line#orderline'>OrderLine</a>, quantity: number) => <a href='/typescript-api/products-stock/stock-location-strategy#locationwithquantity'>LocationWithQuantity</a>[] | Promise&#60;<a href='/typescript-api/products-stock/stock-location-strategy#locationwithquantity'>LocationWithQuantity</a>[]&#62;"  >}}

{{< member-description >}}Determines which StockLocations should be used to when creating a Sale
and reducing the stockOnHand upon fulfillment.{{< /member-description >}}

### forCancellation

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, stockLocations: <a href='/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>[], orderLine: <a href='/typescript-api/entities/order-line#orderline'>OrderLine</a>, quantity: number) => <a href='/typescript-api/products-stock/stock-location-strategy#locationwithquantity'>LocationWithQuantity</a>[] | Promise&#60;<a href='/typescript-api/products-stock/stock-location-strategy#locationwithquantity'>LocationWithQuantity</a>[]&#62;"  >}}

{{< member-description >}}Determines which StockLocations should be used to when creating a Cancellation
of an OrderLine which has already been fulfilled.{{< /member-description >}}


</div>
<div class="symbol">


# AvailableStock

{{< generation-info sourceFile="packages/core/src/config/catalog/stock-location-strategy.ts" sourceLine="18" packageName="@vendure/core" since="2.0.0">}}

The overall available stock for a ProductVariant as determined by the logic of the
<a href='/typescript-api/products-stock/stock-location-strategy#stocklocationstrategy'>StockLocationStrategy</a>'s `getAvailableStock` method.

## Signature

```TypeScript
interface AvailableStock {
  stockOnHand: number;
  stockAllocated: number;
}
```
## Members

### stockOnHand

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### stockAllocated

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# LocationWithQuantity

{{< generation-info sourceFile="packages/core/src/config/catalog/stock-location-strategy.ts" sourceLine="32" packageName="@vendure/core" since="2.0.0">}}

Returned by the `StockLocationStrategy` methods to indicate how much stock from each
location should be used in the allocation/sale/release/cancellation of an OrderLine.

## Signature

```TypeScript
interface LocationWithQuantity {
  location: StockLocation;
  quantity: number;
}
```
## Members

### location

{{< member-info kind="property" type="<a href='/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### quantity

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
