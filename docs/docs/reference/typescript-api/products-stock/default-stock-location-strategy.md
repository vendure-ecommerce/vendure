---
title: "DefaultStockLocationStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DefaultStockLocationStrategy

<GenerationInfo sourceFile="packages/core/src/config/catalog/default-stock-location-strategy.ts" sourceLine="22" packageName="@vendure/core" since="2.0.0" />

The DefaultStockLocationStrategy is the default implementation of the <a href='/reference/typescript-api/products-stock/stock-location-strategy#stocklocationstrategy'>StockLocationStrategy</a>.
It assumes only a single StockLocation and that all stock is allocated from that location.

```ts title="Signature"
class DefaultStockLocationStrategy implements StockLocationStrategy {
    protected connection: TransactionalConnection;
    init(injector: Injector) => ;
    getAvailableStock(ctx: RequestContext, productVariantId: ID, stockLevels: StockLevel[]) => AvailableStock;
    forAllocation(ctx: RequestContext, stockLocations: StockLocation[], orderLine: OrderLine, quantity: number) => LocationWithQuantity[] | Promise<LocationWithQuantity[]>;
    forCancellation(ctx: RequestContext, stockLocations: StockLocation[], orderLine: OrderLine, quantity: number) => Promise<LocationWithQuantity[]>;
    forRelease(ctx: RequestContext, stockLocations: StockLocation[], orderLine: OrderLine, quantity: number) => Promise<LocationWithQuantity[]>;
    forSale(ctx: RequestContext, stockLocations: StockLocation[], orderLine: OrderLine, quantity: number) => Promise<LocationWithQuantity[]>;
}
```
* Implements: <code><a href='/reference/typescript-api/products-stock/stock-location-strategy#stocklocationstrategy'>StockLocationStrategy</a></code>



<div className="members-wrapper">

### connection

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>`}   />


### init

<MemberInfo kind="method" type={`(injector: <a href='/reference/typescript-api/common/injector#injector'>Injector</a>) => `}   />


### getAvailableStock

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productVariantId: <a href='/reference/typescript-api/common/id#id'>ID</a>, stockLevels: <a href='/reference/typescript-api/entities/stock-level#stocklevel'>StockLevel</a>[]) => <a href='/reference/typescript-api/products-stock/stock-location-strategy#availablestock'>AvailableStock</a>`}   />


### forAllocation

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, stockLocations: <a href='/reference/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>[], orderLine: <a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>, quantity: number) => <a href='/reference/typescript-api/products-stock/stock-location-strategy#locationwithquantity'>LocationWithQuantity</a>[] | Promise&#60;<a href='/reference/typescript-api/products-stock/stock-location-strategy#locationwithquantity'>LocationWithQuantity</a>[]&#62;`}   />


### forCancellation

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, stockLocations: <a href='/reference/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>[], orderLine: <a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>, quantity: number) => Promise&#60;<a href='/reference/typescript-api/products-stock/stock-location-strategy#locationwithquantity'>LocationWithQuantity</a>[]&#62;`}   />


### forRelease

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, stockLocations: <a href='/reference/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>[], orderLine: <a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>, quantity: number) => Promise&#60;<a href='/reference/typescript-api/products-stock/stock-location-strategy#locationwithquantity'>LocationWithQuantity</a>[]&#62;`}   />


### forSale

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, stockLocations: <a href='/reference/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>[], orderLine: <a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>, quantity: number) => Promise&#60;<a href='/reference/typescript-api/products-stock/stock-location-strategy#locationwithquantity'>LocationWithQuantity</a>[]&#62;`}   />




</div>
