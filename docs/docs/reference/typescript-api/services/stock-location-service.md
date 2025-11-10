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

<GenerationInfo sourceFile="packages/core/src/service/services/stock-location.service.ts" sourceLine="34" packageName="@vendure/core" />

Contains methods relating to <a href='/reference/typescript-api/entities/stock-location#stocklocation'>StockLocation</a> entities.

```ts title="Signature"
class StockLocationService {
    constructor(requestContextService: RequestContextService, connection: TransactionalConnection, channelService: ChannelService, roleService: RoleService, listQueryBuilder: ListQueryBuilder, configService: ConfigService, requestContextCache: RequestContextCacheService, customFieldRelationService: CustomFieldRelationService, eventBus: EventBus)
    initStockLocations() => Promise<void>;
    findOne(ctx: RequestContext, stockLocationId: ID) => Promise<StockLocation | undefined>;
    findAll(ctx: RequestContext, options?: ListQueryOptions<StockLocation>, relations?: RelationPaths<StockLocation>) => Promise<PaginatedList<StockLocation>>;
    create(ctx: RequestContext, input: CreateStockLocationInput) => Promise<StockLocation>;
    update(ctx: RequestContext, input: UpdateStockLocationInput) => Promise<StockLocation>;
    delete(ctx: RequestContext, input: DeleteStockLocationInput) => Promise<DeletionResponse>;
    assignStockLocationsToChannel(ctx: RequestContext, input: AssignStockLocationsToChannelInput) => Promise<StockLocation[]>;
    removeStockLocationsFromChannel(ctx: RequestContext, input: RemoveStockLocationsFromChannelInput) => Promise<StockLocation[]>;
    defaultStockLocation(ctx: RequestContext) => Promise<StockLocation>;
    getAllocationLocations(ctx: RequestContext, orderLine: OrderLine, quantity: number) => Promise<StockLocation[]>;
    getReleaseLocations(ctx: RequestContext, orderLine: OrderLine, quantity: number) => Promise<StockLocation[]>;
    getSaleLocations(ctx: RequestContext, orderLine: OrderLine, quantity: number) => Promise<StockLocation[]>;
    getCancellationLocations(ctx: RequestContext, orderLine: OrderLine, quantity: number) => Promise<StockLocation[]>;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(requestContextService: RequestContextService, connection: <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, channelService: <a href='/reference/typescript-api/services/channel-service#channelservice'>ChannelService</a>, roleService: <a href='/reference/typescript-api/services/role-service#roleservice'>RoleService</a>, listQueryBuilder: <a href='/reference/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>, configService: ConfigService, requestContextCache: RequestContextCacheService, customFieldRelationService: CustomFieldRelationService, eventBus: <a href='/reference/typescript-api/events/event-bus#eventbus'>EventBus</a>) => StockLocationService`}   />


### initStockLocations

<MemberInfo kind="method" type={`() => Promise&#60;void&#62;`}   />

Initializes stock locations on application startup. Ensures that a default StockLocation exists.
### findOne

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, stockLocationId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/reference/typescript-api/entities/stock-location#stocklocation'>StockLocation</a> | undefined&#62;`}   />

Finds a single StockLocation by ID.
### findAll

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, options?: ListQueryOptions&#60;<a href='/reference/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>&#62;, relations?: RelationPaths&#60;<a href='/reference/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>&#62;) => Promise&#60;<a href='/reference/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/reference/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>&#62;&#62;`}   />

Returns a paginated list of all StockLocations.
### create

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: CreateStockLocationInput) => Promise&#60;<a href='/reference/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>&#62;`}   />

Creates a new StockLocation.
### update

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateStockLocationInput) => Promise&#60;<a href='/reference/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>&#62;`}   />

Updates an existing StockLocation.
### delete

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: DeleteStockLocationInput) => Promise&#60;DeletionResponse&#62;`}   />

Deletes a StockLocation. If a `transferToLocationId` is provided in the input, all stock from the
deleted location will be transferred to the specified location. The last StockLocation cannot be deleted.
### assignStockLocationsToChannel

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: AssignStockLocationsToChannelInput) => Promise&#60;<a href='/reference/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>[]&#62;`}   />

Assigns one or more StockLocations to a Channel. Requires `UpdateStockLocation` permission on the target channel.
### removeStockLocationsFromChannel

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: RemoveStockLocationsFromChannelInput) => Promise&#60;<a href='/reference/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>[]&#62;`}   />

Removes one or more StockLocations from a Channel. StockLocations cannot be removed from the default Channel.
Requires `DeleteStockLocation` permission on the target channel.
### defaultStockLocation

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;<a href='/reference/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>&#62;`}   />

Returns the default StockLocation (the oldest created location).
### getAllocationLocations

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderLine: <a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>, quantity: number) => Promise&#60;<a href='/reference/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>[]&#62;`}   />

Returns the StockLocations to use for allocating stock for the given OrderLine, as determined by the
configured <a href='/reference/typescript-api/products-stock/stock-location-strategy#stocklocationstrategy'>StockLocationStrategy</a>.
### getReleaseLocations

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderLine: <a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>, quantity: number) => Promise&#60;<a href='/reference/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>[]&#62;`}   />

Returns the StockLocations to use for releasing stock for the given OrderLine, as determined by the
configured <a href='/reference/typescript-api/products-stock/stock-location-strategy#stocklocationstrategy'>StockLocationStrategy</a>.
### getSaleLocations

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderLine: <a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>, quantity: number) => Promise&#60;<a href='/reference/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>[]&#62;`}   />

Returns the StockLocations to use for a sale of the given OrderLine, as determined by the
configured <a href='/reference/typescript-api/products-stock/stock-location-strategy#stocklocationstrategy'>StockLocationStrategy</a>.
### getCancellationLocations

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderLine: <a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>, quantity: number) => Promise&#60;<a href='/reference/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>[]&#62;`}   />

Returns the StockLocations to use for cancelling the given OrderLine, as determined by the
configured <a href='/reference/typescript-api/products-stock/stock-location-strategy#stocklocationstrategy'>StockLocationStrategy</a>.


</div>
