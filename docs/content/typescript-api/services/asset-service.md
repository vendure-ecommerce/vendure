---
title: "AssetService"
weight: 10
date: 2023-07-14T16:57:50.278Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# AssetService
<div class="symbol">


# AssetService

{{< generation-info sourceFile="packages/core/src/service/services/asset.service.ts" sourceLine="90" packageName="@vendure/core">}}

Contains methods relating to <a href='/typescript-api/entities/asset#asset'>Asset</a> entities.

## Signature

```TypeScript
class AssetService {
  constructor(connection: TransactionalConnection, configService: ConfigService, listQueryBuilder: ListQueryBuilder, eventBus: EventBus, tagService: TagService, channelService: ChannelService, roleService: RoleService, customFieldRelationService: CustomFieldRelationService)
  findOne(ctx: RequestContext, id: ID, relations?: RelationPaths<Asset>) => Promise<Asset | undefined>;
  findAll(ctx: RequestContext, options?: AssetListOptions, relations?: RelationPaths<Asset>) => Promise<PaginatedList<Asset>>;
  async getFeaturedAsset(ctx: RequestContext, entity: T) => Promise<Asset | undefined>;
  async getEntityAssets(ctx: RequestContext, entity: T) => Promise<Asset[] | undefined>;
  async updateFeaturedAsset(ctx: RequestContext, entity: T, input: EntityAssetInput) => Promise<T>;
  async updateEntityAssets(ctx: RequestContext, entity: T, input: EntityAssetInput) => Promise<T>;
  async create(ctx: RequestContext, input: CreateAssetInput) => Promise<CreateAssetResult>;
  async update(ctx: RequestContext, input: UpdateAssetInput) => Promise<Asset>;
  async delete(ctx: RequestContext, ids: ID[], force: boolean = false, deleteFromAllChannels: boolean = false) => Promise<DeletionResponse>;
  async assignToChannel(ctx: RequestContext, input: AssignAssetsToChannelInput) => Promise<Asset[]>;
  async createFromFileStream(stream: ReadStream, ctx?: RequestContext) => Promise<CreateAssetResult>;
  async createFromFileStream(stream: Readable, filePath: string, ctx?: RequestContext) => Promise<CreateAssetResult>;
  async createFromFileStream(stream: ReadStream | Readable, maybeFilePathOrCtx?: string | RequestContext, maybeCtx?: RequestContext) => Promise<CreateAssetResult>;
}
```
## Members

### constructor

{{< member-info kind="method" type="(connection: <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, configService: ConfigService, listQueryBuilder: <a href='/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>, eventBus: <a href='/typescript-api/events/event-bus#eventbus'>EventBus</a>, tagService: <a href='/typescript-api/services/tag-service#tagservice'>TagService</a>, channelService: <a href='/typescript-api/services/channel-service#channelservice'>ChannelService</a>, roleService: <a href='/typescript-api/services/role-service#roleservice'>RoleService</a>, customFieldRelationService: CustomFieldRelationService) => AssetService"  >}}

{{< member-description >}}{{< /member-description >}}

### findOne

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/typescript-api/common/id#id'>ID</a>, relations?: RelationPaths&#60;<a href='/typescript-api/entities/asset#asset'>Asset</a>&#62;) => Promise&#60;<a href='/typescript-api/entities/asset#asset'>Asset</a> | undefined&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### findAll

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, options?: AssetListOptions, relations?: RelationPaths&#60;<a href='/typescript-api/entities/asset#asset'>Asset</a>&#62;) => Promise&#60;<a href='/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/typescript-api/entities/asset#asset'>Asset</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### getFeaturedAsset

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: T) => Promise&#60;<a href='/typescript-api/entities/asset#asset'>Asset</a> | undefined&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### getEntityAssets

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: T) => Promise&#60;<a href='/typescript-api/entities/asset#asset'>Asset</a>[] | undefined&#62;"  >}}

{{< member-description >}}Returns the Assets of an entity which has a well-ordered list of Assets, such as Product,
ProductVariant or Collection.{{< /member-description >}}

### updateFeaturedAsset

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: T, input: <a href='/typescript-api/services/asset-service#entityassetinput'>EntityAssetInput</a>) => Promise&#60;T&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### updateEntityAssets

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: T, input: <a href='/typescript-api/services/asset-service#entityassetinput'>EntityAssetInput</a>) => Promise&#60;T&#62;"  >}}

{{< member-description >}}Updates the assets / featuredAsset of an entity, ensuring that only valid assetIds are used.{{< /member-description >}}

### create

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: CreateAssetInput) => Promise&#60;CreateAssetResult&#62;"  >}}

{{< member-description >}}Create an Asset based on a file uploaded via the GraphQL API. The file should be uploaded
using the [GraphQL multipart request specification](https://github.com/jaydenseric/graphql-multipart-request-spec),
e.g. using the [apollo-upload-client](https://github.com/jaydenseric/apollo-upload-client) npm package.

See the [Uploading Files docs](/docs/developer-guide/uploading-files) for an example of usage.{{< /member-description >}}

### update

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateAssetInput) => Promise&#60;<a href='/typescript-api/entities/asset#asset'>Asset</a>&#62;"  >}}

{{< member-description >}}Updates the name, focalPoint, tags & custom fields of an Asset.{{< /member-description >}}

### delete

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, ids: <a href='/typescript-api/common/id#id'>ID</a>[], force: boolean = false, deleteFromAllChannels: boolean = false) => Promise&#60;DeletionResponse&#62;"  >}}

{{< member-description >}}Deletes an Asset after performing checks to ensure that the Asset is not currently in use
by a Product, ProductVariant or Collection.{{< /member-description >}}

### assignToChannel

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: AssignAssetsToChannelInput) => Promise&#60;<a href='/typescript-api/entities/asset#asset'>Asset</a>[]&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### createFromFileStream

{{< member-info kind="method" type="(stream: ReadStream, ctx?: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;CreateAssetResult&#62;"  >}}

{{< member-description >}}Create an Asset from a file stream, for example to create an Asset during data import.{{< /member-description >}}

### createFromFileStream

{{< member-info kind="method" type="(stream: Readable, filePath: string, ctx?: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;CreateAssetResult&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### createFromFileStream

{{< member-info kind="method" type="(stream: ReadStream | Readable, maybeFilePathOrCtx?: string | <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, maybeCtx?: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;CreateAssetResult&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# EntityWithAssets

{{< generation-info sourceFile="packages/core/src/service/services/asset.service.ts" sourceLine="66" packageName="@vendure/core">}}

Certain entities (Product, ProductVariant, Collection) use this interface
to model a featured asset and then a list of assets with a defined order.

## Signature

```TypeScript
interface EntityWithAssets extends VendureEntity {
  featuredAsset: Asset | null;
  assets: OrderableAsset[];
}
```
## Extends

 * <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>


## Members

### featuredAsset

{{< member-info kind="property" type="<a href='/typescript-api/entities/asset#asset'>Asset</a> | null"  >}}

{{< member-description >}}{{< /member-description >}}

### assets

{{< member-info kind="property" type="<a href='/typescript-api/entities/orderable-asset#orderableasset'>OrderableAsset</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# EntityAssetInput

{{< generation-info sourceFile="packages/core/src/service/services/asset.service.ts" sourceLine="78" packageName="@vendure/core">}}

Used when updating entities which implement <a href='/typescript-api/services/asset-service#entitywithassets'>EntityWithAssets</a>.

## Signature

```TypeScript
interface EntityAssetInput {
  assetIds?: ID[] | null;
  featuredAssetId?: ID | null;
}
```
## Members

### assetIds

{{< member-info kind="property" type="<a href='/typescript-api/common/id#id'>ID</a>[] | null"  >}}

{{< member-description >}}{{< /member-description >}}

### featuredAssetId

{{< member-info kind="property" type="<a href='/typescript-api/common/id#id'>ID</a> | null"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
