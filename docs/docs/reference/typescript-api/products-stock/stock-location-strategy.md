---
title: "StockLocationStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## StockLocationStrategy

<GenerationInfo sourceFile="packages/core/src/config/catalog/stock-location-strategy.ts" sourceLine="55" packageName="@vendure/core" since="2.0.0" />

The StockLocationStrategy is responsible for determining which <a href='/reference/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>s
should be used to fulfill an <a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a> and how much stock should be allocated
from each location. It is also used to determine the available stock for a given
<a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>.

:::info

This is configured via the `catalogOptions.stockLocationStrategy` property of
your VendureConfig.

:::

```ts title="Signature"
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
* Extends: <code><a href='/reference/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a></code>



<div className="members-wrapper">

### getAvailableStock

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productVariantId: <a href='/reference/typescript-api/common/id#id'>ID</a>, stockLevels: <a href='/reference/typescript-api/entities/stock-level#stocklevel'>StockLevel</a>[]) => <a href='/reference/typescript-api/products-stock/stock-location-strategy#availablestock'>AvailableStock</a> | Promise&#60;<a href='/reference/typescript-api/products-stock/stock-location-strategy#availablestock'>AvailableStock</a>&#62;`}   />

Returns the available stock for the given ProductVariant, taking into account
the stock levels at each StockLocation.
### forAllocation

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, stockLocations: <a href='/reference/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>[], orderLine: <a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>, quantity: number) => <a href='/reference/typescript-api/products-stock/stock-location-strategy#locationwithquantity'>LocationWithQuantity</a>[] | Promise&#60;<a href='/reference/typescript-api/products-stock/stock-location-strategy#locationwithquantity'>LocationWithQuantity</a>[]&#62;`}   />

Determines which StockLocations should be used to when allocating stock when
and Order is placed.
### forRelease

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, stockLocations: <a href='/reference/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>[], orderLine: <a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>, quantity: number) => <a href='/reference/typescript-api/products-stock/stock-location-strategy#locationwithquantity'>LocationWithQuantity</a>[] | Promise&#60;<a href='/reference/typescript-api/products-stock/stock-location-strategy#locationwithquantity'>LocationWithQuantity</a>[]&#62;`}   />

Determines which StockLocations should be used to when releasing allocated
stock when an OrderLine is cancelled before being fulfilled.
### forSale

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, stockLocations: <a href='/reference/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>[], orderLine: <a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>, quantity: number) => <a href='/reference/typescript-api/products-stock/stock-location-strategy#locationwithquantity'>LocationWithQuantity</a>[] | Promise&#60;<a href='/reference/typescript-api/products-stock/stock-location-strategy#locationwithquantity'>LocationWithQuantity</a>[]&#62;`}   />

Determines which StockLocations should be used to when creating a Sale
and reducing the stockOnHand upon fulfillment.
### forCancellation

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, stockLocations: <a href='/reference/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>[], orderLine: <a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>, quantity: number) => <a href='/reference/typescript-api/products-stock/stock-location-strategy#locationwithquantity'>LocationWithQuantity</a>[] | Promise&#60;<a href='/reference/typescript-api/products-stock/stock-location-strategy#locationwithquantity'>LocationWithQuantity</a>[]&#62;`}   />

Determines which StockLocations should be used to when creating a Cancellation
of an OrderLine which has already been fulfilled.


</div>


## AvailableStock

<GenerationInfo sourceFile="packages/core/src/config/catalog/stock-location-strategy.ts" sourceLine="18" packageName="@vendure/core" since="2.0.0" />

The overall available stock for a ProductVariant as determined by the logic of the
<a href='/reference/typescript-api/products-stock/stock-location-strategy#stocklocationstrategy'>StockLocationStrategy</a>'s `getAvailableStock` method.

```ts title="Signature"
interface AvailableStock {
    stockOnHand: number;
    stockAllocated: number;
}
```

<div className="members-wrapper">

### stockOnHand

<MemberInfo kind="property" type={`number`}   />


### stockAllocated

<MemberInfo kind="property" type={`number`}   />




</div>


## LocationWithQuantity

<GenerationInfo sourceFile="packages/core/src/config/catalog/stock-location-strategy.ts" sourceLine="32" packageName="@vendure/core" since="2.0.0" />

Returned by the `StockLocationStrategy` methods to indicate how much stock from each
location should be used in the allocation/sale/release/cancellation of an OrderLine.

```ts title="Signature"
interface LocationWithQuantity {
    location: StockLocation;
    quantity: number;
}
```

<div className="members-wrapper">

### location

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>`}   />


### quantity

<MemberInfo kind="property" type={`number`}   />




</div>
