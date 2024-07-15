---
title: "StockLevelService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## StockLevelService

<GenerationInfo sourceFile="packages/core/src/service/services/stock-level.service.ts" sourceLine="22" packageName="@vendure/core" since="2.0.0" />

The StockLevelService is responsible for managing the stock levels of ProductVariants.
Whenever you need to adjust the `stockOnHand` or `stockAllocated` for a ProductVariant,
you should use this service.

```ts title="Signature"
class StockLevelService {
    constructor(connection: TransactionalConnection, stockLocationService: StockLocationService, configService: ConfigService)
    getStockLevel(ctx: RequestContext, productVariantId: ID, stockLocationId: ID) => Promise<StockLevel>;
    getStockLevelsForVariant(ctx: RequestContext, productVariantId: ID) => Promise<StockLevel[]>;
    getAvailableStock(ctx: RequestContext, productVariantId: ID) => Promise<AvailableStock>;
    updateStockOnHandForLocation(ctx: RequestContext, productVariantId: ID, stockLocationId: ID, change: number) => ;
    updateStockAllocatedForLocation(ctx: RequestContext, productVariantId: ID, stockLocationId: ID, change: number) => ;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(connection: <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, stockLocationService: StockLocationService, configService: ConfigService) => StockLevelService`}   />


### getStockLevel

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productVariantId: <a href='/reference/typescript-api/common/id#id'>ID</a>, stockLocationId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/reference/typescript-api/entities/stock-level#stocklevel'>StockLevel</a>&#62;`}   />

Returns the StockLevel for the given <a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a> and <a href='/reference/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>.
### getStockLevelsForVariant

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productVariantId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/reference/typescript-api/entities/stock-level#stocklevel'>StockLevel</a>[]&#62;`}   />


### getAvailableStock

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productVariantId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/reference/typescript-api/products-stock/stock-location-strategy#availablestock'>AvailableStock</a>&#62;`}   />

Returns the available stock (on hand and allocated) for the given <a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>. This is determined
by the configured <a href='/reference/typescript-api/products-stock/stock-location-strategy#stocklocationstrategy'>StockLocationStrategy</a>.
### updateStockOnHandForLocation

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productVariantId: <a href='/reference/typescript-api/common/id#id'>ID</a>, stockLocationId: <a href='/reference/typescript-api/common/id#id'>ID</a>, change: number) => `}   />

Updates the `stockOnHand` for the given <a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a> and <a href='/reference/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>.
### updateStockAllocatedForLocation

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productVariantId: <a href='/reference/typescript-api/common/id#id'>ID</a>, stockLocationId: <a href='/reference/typescript-api/common/id#id'>ID</a>, change: number) => `}   />

Updates the `stockAllocated` for the given <a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a> and <a href='/reference/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>.


</div>
