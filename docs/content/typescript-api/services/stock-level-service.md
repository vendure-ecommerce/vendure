---
title: "StockLevelService"
weight: 10
date: 2023-07-14T16:57:50.594Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# StockLevelService
<div class="symbol">


# StockLevelService

{{< generation-info sourceFile="packages/core/src/service/services/stock-level.service.ts" sourceLine="20" packageName="@vendure/core" since="2.0.0">}}

The StockLevelService is responsible for managing the stock levels of ProductVariants.
Whenever you need to adjust the `stockOnHand` or `stockAllocated` for a ProductVariant,
you should use this service.

## Signature

```TypeScript
class StockLevelService {
  constructor(connection: TransactionalConnection, stockLocationService: StockLocationService, configService: ConfigService)
  async getStockLevel(ctx: RequestContext, productVariantId: ID, stockLocationId: ID) => Promise<StockLevel>;
  async getStockLevelsForVariant(ctx: RequestContext, productVariantId: ID) => Promise<StockLevel[]>;
  async getAvailableStock(ctx: RequestContext, productVariantId: ID) => Promise<AvailableStock>;
  async updateStockOnHandForLocation(ctx: RequestContext, productVariantId: ID, stockLocationId: ID, change: number) => ;
  async updateStockAllocatedForLocation(ctx: RequestContext, productVariantId: ID, stockLocationId: ID, change: number) => ;
}
```
## Members

### constructor

{{< member-info kind="method" type="(connection: <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, stockLocationService: StockLocationService, configService: ConfigService) => StockLevelService"  >}}

{{< member-description >}}{{< /member-description >}}

### getStockLevel

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productVariantId: <a href='/typescript-api/common/id#id'>ID</a>, stockLocationId: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/typescript-api/entities/stock-level#stocklevel'>StockLevel</a>&#62;"  >}}

{{< member-description >}}Returns the StockLevel for the given <a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a> and <a href='/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>.{{< /member-description >}}

### getStockLevelsForVariant

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productVariantId: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/typescript-api/entities/stock-level#stocklevel'>StockLevel</a>[]&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### getAvailableStock

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productVariantId: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/typescript-api/products-stock/stock-location-strategy#availablestock'>AvailableStock</a>&#62;"  >}}

{{< member-description >}}Returns the available stock (on hand and allocated) for the given <a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>. This is determined
by the configured <a href='/typescript-api/products-stock/stock-location-strategy#stocklocationstrategy'>StockLocationStrategy</a>.{{< /member-description >}}

### updateStockOnHandForLocation

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productVariantId: <a href='/typescript-api/common/id#id'>ID</a>, stockLocationId: <a href='/typescript-api/common/id#id'>ID</a>, change: number) => "  >}}

{{< member-description >}}Updates the `stockOnHand` for the given <a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a> and <a href='/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>.{{< /member-description >}}

### updateStockAllocatedForLocation

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productVariantId: <a href='/typescript-api/common/id#id'>ID</a>, stockLocationId: <a href='/typescript-api/common/id#id'>ID</a>, change: number) => "  >}}

{{< member-description >}}Updates the `stockAllocated` for the given <a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a> and <a href='/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>.{{< /member-description >}}


</div>
