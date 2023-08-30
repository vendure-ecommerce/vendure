---
title: "DefaultStockLocationStrategy"
weight: 10
date: 2023-07-14T16:57:49.496Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# DefaultStockLocationStrategy
<div class="symbol">


# DefaultStockLocationStrategy

{{< generation-info sourceFile="packages/core/src/config/catalog/default-stock-location-strategy.ts" sourceLine="21" packageName="@vendure/core" since="2.0.0">}}

The DefaultStockLocationStrategy is the default implementation of the <a href='/typescript-api/products-stock/stock-location-strategy#stocklocationstrategy'>StockLocationStrategy</a>.
It assumes only a single StockLocation and that all stock is allocated from that location.

## Signature

```TypeScript
class DefaultStockLocationStrategy implements StockLocationStrategy {
  protected protected connection: TransactionalConnection;
  init(injector: Injector) => ;
  getAvailableStock(ctx: RequestContext, productVariantId: ID, stockLevels: StockLevel[]) => AvailableStock;
  forAllocation(ctx: RequestContext, stockLocations: StockLocation[], orderLine: OrderLine, quantity: number) => LocationWithQuantity[] | Promise<LocationWithQuantity[]>;
  async forCancellation(ctx: RequestContext, stockLocations: StockLocation[], orderLine: OrderLine, quantity: number) => Promise<LocationWithQuantity[]>;
  async forRelease(ctx: RequestContext, stockLocations: StockLocation[], orderLine: OrderLine, quantity: number) => Promise<LocationWithQuantity[]>;
  async forSale(ctx: RequestContext, stockLocations: StockLocation[], orderLine: OrderLine, quantity: number) => Promise<LocationWithQuantity[]>;
}
```
## Implements

 * <a href='/typescript-api/products-stock/stock-location-strategy#stocklocationstrategy'>StockLocationStrategy</a>


## Members

### connection

{{< member-info kind="property" type="<a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### init

{{< member-info kind="method" type="(injector: <a href='/typescript-api/common/injector#injector'>Injector</a>) => "  >}}

{{< member-description >}}{{< /member-description >}}

### getAvailableStock

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productVariantId: <a href='/typescript-api/common/id#id'>ID</a>, stockLevels: <a href='/typescript-api/entities/stock-level#stocklevel'>StockLevel</a>[]) => <a href='/typescript-api/products-stock/stock-location-strategy#availablestock'>AvailableStock</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### forAllocation

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, stockLocations: <a href='/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>[], orderLine: <a href='/typescript-api/entities/order-line#orderline'>OrderLine</a>, quantity: number) => <a href='/typescript-api/products-stock/stock-location-strategy#locationwithquantity'>LocationWithQuantity</a>[] | Promise&#60;<a href='/typescript-api/products-stock/stock-location-strategy#locationwithquantity'>LocationWithQuantity</a>[]&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### forCancellation

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, stockLocations: <a href='/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>[], orderLine: <a href='/typescript-api/entities/order-line#orderline'>OrderLine</a>, quantity: number) => Promise&#60;<a href='/typescript-api/products-stock/stock-location-strategy#locationwithquantity'>LocationWithQuantity</a>[]&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### forRelease

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, stockLocations: <a href='/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>[], orderLine: <a href='/typescript-api/entities/order-line#orderline'>OrderLine</a>, quantity: number) => Promise&#60;<a href='/typescript-api/products-stock/stock-location-strategy#locationwithquantity'>LocationWithQuantity</a>[]&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### forSale

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, stockLocations: <a href='/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>[], orderLine: <a href='/typescript-api/entities/order-line#orderline'>OrderLine</a>, quantity: number) => Promise&#60;<a href='/typescript-api/products-stock/stock-location-strategy#locationwithquantity'>LocationWithQuantity</a>[]&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
