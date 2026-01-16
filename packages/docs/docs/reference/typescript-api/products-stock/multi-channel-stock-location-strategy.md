---
title: "MultiChannelStockLocationStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## MultiChannelStockLocationStrategy

<GenerationInfo sourceFile="packages/core/src/config/catalog/multi-channel-stock-location-strategy.ts" sourceLine="32" packageName="@vendure/core" since="3.1.0" />

The MultiChannelStockLocationStrategy is an implementation of the <a href='/reference/typescript-api/products-stock/stock-location-strategy#stocklocationstrategy'>StockLocationStrategy</a>.
which is suitable for both single- and multichannel setups. It takes into account the active
channel when determining stock levels, and also ensures that allocations are made only against
stock locations which are associated with the active channel.

This strategy became the default in Vendure 3.1.0. If you want to use the previous strategy which
does not take channels into account, update your VendureConfig to use to <a href='/reference/typescript-api/products-stock/default-stock-location-strategy#defaultstocklocationstrategy'>DefaultStockLocationStrategy</a>.

```ts title="Signature"
class MultiChannelStockLocationStrategy extends BaseStockLocationStrategy {
    getAvailableStock(ctx: RequestContext, productVariantId: ID, stockLevels: StockLevel[]) => Promise<AvailableStock>;
    forAllocation(ctx: RequestContext, stockLocations: StockLocation[], orderLine: OrderLine, quantity: number) => Promise<LocationWithQuantity[]>;
}
```
* Extends: <code>BaseStockLocationStrategy</code>



<div className="members-wrapper">

### getAvailableStock

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productVariantId: <a href='/reference/typescript-api/common/id#id'>ID</a>, stockLevels: <a href='/reference/typescript-api/entities/stock-level#stocklevel'>StockLevel</a>[]) => Promise&#60;<a href='/reference/typescript-api/products-stock/stock-location-strategy#availablestock'>AvailableStock</a>&#62;`}   />

Returns the available stock for the given ProductVariant, taking into account the active Channel.
### forAllocation

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, stockLocations: <a href='/reference/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>[], orderLine: <a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>, quantity: number) => Promise&#60;<a href='/reference/typescript-api/products-stock/stock-location-strategy#locationwithquantity'>LocationWithQuantity</a>[]&#62;`}   />

This method takes into account whether the stock location is applicable to the active channel.
It furthermore respects the `trackInventory` and `outOfStockThreshold` settings of the ProductVariant,
in order to allocate stock only from locations which are relevant to the active channel and which
have sufficient stock available.


</div>
