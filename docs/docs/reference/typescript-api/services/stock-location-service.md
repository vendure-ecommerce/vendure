---
title: "StockLocationService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## StockLocationService

<GenerationInfo sourceFile="packages/core/src/service/services/stock-location.service.ts" sourceLine="41" packageName="@vendure/core" />

Contains methods relating to <a href='/reference/typescript-api/entities/stock-location#stocklocation'>StockLocation</a> entities.

```ts title="Signature"
class StockLocationService {
    constructor(requestContextService: RequestContextService, connection: TransactionalConnection, channelService: ChannelService, roleService: RoleService, listQueryBuilder: ListQueryBuilder, configService: ConfigService, requestContextCache: RequestContextCacheService, customFieldRelationService: CustomFieldRelationService, eventBus: EventBus)
    initStockLocations() => ;
    findOne(ctx: RequestContext, stockLocationId: ID) => Promise<StockLocation | undefined>;
    findAll(ctx: RequestContext, options?: ListQueryOptions<StockLocation>, relations?: RelationPaths<StockLocation>) => Promise<PaginatedList<StockLocation>>;
    create(ctx: RequestContext, input: CreateStockLocationInput) => Promise<StockLocation>;
    update(ctx: RequestContext, input: UpdateStockLocationInput) => Promise<StockLocation>;
    delete(ctx: RequestContext, input: DeleteStockLocationInput) => Promise<DeletionResponse>;
    assignStockLocationsToChannel(ctx: RequestContext, input: AssignStockLocationsToChannelInput) => Promise<StockLocation[]>;
    removeStockLocationsFromChannel(ctx: RequestContext, input: RemoveStockLocationsFromChannelInput) => Promise<StockLocation[]>;
    defaultStockLocation(ctx: RequestContext) => ;
    getAllocationLocations(ctx: RequestContext, orderLine: OrderLine, quantity: number) => ;
    getReleaseLocations(ctx: RequestContext, orderLine: OrderLine, quantity: number) => ;
    getSaleLocations(ctx: RequestContext, orderLine: OrderLine, quantity: number) => ;
    getCancellationLocations(ctx: RequestContext, orderLine: OrderLine, quantity: number) => ;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(requestContextService: <a href='/reference/typescript-api/request/request-context-service#requestcontextservice'>RequestContextService</a>, connection: <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, channelService: <a href='/reference/typescript-api/services/channel-service#channelservice'>ChannelService</a>, roleService: <a href='/reference/typescript-api/services/role-service#roleservice'>RoleService</a>, listQueryBuilder: <a href='/reference/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>, configService: ConfigService, requestContextCache: <a href='/reference/typescript-api/cache/request-context-cache-service#requestcontextcacheservice'>RequestContextCacheService</a>, customFieldRelationService: CustomFieldRelationService, eventBus: <a href='/reference/typescript-api/events/event-bus#eventbus'>EventBus</a>) => StockLocationService`}   />


### initStockLocations

<MemberInfo kind="method" type={`() => `}   />


### findOne

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, stockLocationId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/reference/typescript-api/entities/stock-location#stocklocation'>StockLocation</a> | undefined&#62;`}   />


### findAll

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, options?: ListQueryOptions&#60;<a href='/reference/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>&#62;, relations?: RelationPaths&#60;<a href='/reference/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>&#62;) => Promise&#60;<a href='/reference/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/reference/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>&#62;&#62;`}   />


### create

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: CreateStockLocationInput) => Promise&#60;<a href='/reference/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>&#62;`}   />


### update

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateStockLocationInput) => Promise&#60;<a href='/reference/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>&#62;`}   />


### delete

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: DeleteStockLocationInput) => Promise&#60;DeletionResponse&#62;`}   />

Deletes a StockLocation. If `transferToLocationId` is specified in the input, all stock levels
from the deleted location will be transferred to the target location. The last StockLocation
cannot be deleted.
### assignStockLocationsToChannel

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: AssignStockLocationsToChannelInput) => Promise&#60;<a href='/reference/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>[]&#62;`}   />

Assigns multiple StockLocations to the specified Channel. Requires the `UpdateStockLocation`
permission on the target channel.
### removeStockLocationsFromChannel

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: RemoveStockLocationsFromChannelInput) => Promise&#60;<a href='/reference/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>[]&#62;`}   />

Removes multiple StockLocations from the specified Channel. Requires the `DeleteStockLocation`
permission on the target channel. StockLocations cannot be removed from the default channel.
### defaultStockLocation

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => `}   />


### getAllocationLocations

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderLine: <a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>, quantity: number) => `}   />

Returns the locations and quantities to use for allocating stock when an OrderLine is created.
This uses the configured <a href='/reference/typescript-api/products-stock/stock-location-strategy#stocklocationstrategy'>StockLocationStrategy</a>.
### getReleaseLocations

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderLine: <a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>, quantity: number) => `}   />

Returns the locations and quantities to use for releasing allocated stock when an OrderLine is cancelled
or modified. This uses the configured <a href='/reference/typescript-api/products-stock/stock-location-strategy#stocklocationstrategy'>StockLocationStrategy</a>.
### getSaleLocations

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderLine: <a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>, quantity: number) => `}   />

Returns the locations and quantities to use for creating sales when an Order is fulfilled.
This uses the configured <a href='/reference/typescript-api/products-stock/stock-location-strategy#stocklocationstrategy'>StockLocationStrategy</a>.
### getCancellationLocations

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderLine: <a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>, quantity: number) => `}   />

Returns the locations and quantities to use for cancelling sales when an OrderLine is cancelled
after fulfillment. This uses the configured <a href='/reference/typescript-api/products-stock/stock-location-strategy#stocklocationstrategy'>StockLocationStrategy</a>.


</div>
