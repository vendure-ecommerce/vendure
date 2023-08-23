---
title: "AssetService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## AssetService

<GenerationInfo sourceFile="packages/core/src/service/services/asset.service.ts" sourceLine="90" packageName="@vendure/core" />

Contains methods relating to <a href='/reference/typescript-api/entities/asset#asset'>Asset</a> entities.

```ts title="Signature"
class AssetService {
    constructor(connection: TransactionalConnection, configService: ConfigService, listQueryBuilder: ListQueryBuilder, eventBus: EventBus, tagService: TagService, channelService: ChannelService, roleService: RoleService, customFieldRelationService: CustomFieldRelationService)
    findOne(ctx: RequestContext, id: ID, relations?: RelationPaths<Asset>) => Promise<Asset | undefined>;
    findAll(ctx: RequestContext, options?: AssetListOptions, relations?: RelationPaths<Asset>) => Promise<PaginatedList<Asset>>;
    getFeaturedAsset(ctx: RequestContext, entity: T) => Promise<Asset | undefined>;
    getEntityAssets(ctx: RequestContext, entity: T) => Promise<Asset[] | undefined>;
    updateFeaturedAsset(ctx: RequestContext, entity: T, input: EntityAssetInput) => Promise<T>;
    updateEntityAssets(ctx: RequestContext, entity: T, input: EntityAssetInput) => Promise<T>;
    create(ctx: RequestContext, input: CreateAssetInput) => Promise<CreateAssetResult>;
    update(ctx: RequestContext, input: UpdateAssetInput) => Promise<Asset>;
    delete(ctx: RequestContext, ids: ID[], force: boolean = false, deleteFromAllChannels: boolean = false) => Promise<DeletionResponse>;
    assignToChannel(ctx: RequestContext, input: AssignAssetsToChannelInput) => Promise<Asset[]>;
    createFromFileStream(stream: ReadStream, ctx?: RequestContext) => Promise<CreateAssetResult>;
    createFromFileStream(stream: Readable, filePath: string, ctx?: RequestContext) => Promise<CreateAssetResult>;
    createFromFileStream(stream: ReadStream | Readable, maybeFilePathOrCtx?: string | RequestContext, maybeCtx?: RequestContext) => Promise<CreateAssetResult>;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(connection: <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, configService: ConfigService, listQueryBuilder: <a href='/reference/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>, eventBus: <a href='/reference/typescript-api/events/event-bus#eventbus'>EventBus</a>, tagService: <a href='/reference/typescript-api/services/tag-service#tagservice'>TagService</a>, channelService: <a href='/reference/typescript-api/services/channel-service#channelservice'>ChannelService</a>, roleService: <a href='/reference/typescript-api/services/role-service#roleservice'>RoleService</a>, customFieldRelationService: CustomFieldRelationService) => AssetService`}   />


### findOne

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/reference/typescript-api/common/id#id'>ID</a>, relations?: RelationPaths&#60;<a href='/reference/typescript-api/entities/asset#asset'>Asset</a>&#62;) => Promise&#60;<a href='/reference/typescript-api/entities/asset#asset'>Asset</a> | undefined&#62;`}   />


### findAll

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, options?: AssetListOptions, relations?: RelationPaths&#60;<a href='/reference/typescript-api/entities/asset#asset'>Asset</a>&#62;) => Promise&#60;<a href='/reference/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/reference/typescript-api/entities/asset#asset'>Asset</a>&#62;&#62;`}   />


### getFeaturedAsset

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: T) => Promise&#60;<a href='/reference/typescript-api/entities/asset#asset'>Asset</a> | undefined&#62;`}   />


### getEntityAssets

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: T) => Promise&#60;<a href='/reference/typescript-api/entities/asset#asset'>Asset</a>[] | undefined&#62;`}   />

Returns the Assets of an entity which has a well-ordered list of Assets, such as Product,
ProductVariant or Collection.
### updateFeaturedAsset

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: T, input: <a href='/reference/typescript-api/services/asset-service#entityassetinput'>EntityAssetInput</a>) => Promise&#60;T&#62;`}   />


### updateEntityAssets

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: T, input: <a href='/reference/typescript-api/services/asset-service#entityassetinput'>EntityAssetInput</a>) => Promise&#60;T&#62;`}   />

Updates the assets / featuredAsset of an entity, ensuring that only valid assetIds are used.
### create

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: CreateAssetInput) => Promise&#60;CreateAssetResult&#62;`}   />

Create an Asset based on a file uploaded via the GraphQL API. The file should be uploaded
using the [GraphQL multipart request specification](https://github.com/jaydenseric/graphql-multipart-request-spec),
e.g. using the [apollo-upload-client](https://github.com/jaydenseric/apollo-upload-client) npm package.

See the [Uploading Files docs](/guides/developer-guide/uploading-files) for an example of usage.
### update

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateAssetInput) => Promise&#60;<a href='/reference/typescript-api/entities/asset#asset'>Asset</a>&#62;`}   />

Updates the name, focalPoint, tags & custom fields of an Asset.
### delete

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, ids: <a href='/reference/typescript-api/common/id#id'>ID</a>[], force: boolean = false, deleteFromAllChannels: boolean = false) => Promise&#60;DeletionResponse&#62;`}   />

Deletes an Asset after performing checks to ensure that the Asset is not currently in use
by a Product, ProductVariant or Collection.
### assignToChannel

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: AssignAssetsToChannelInput) => Promise&#60;<a href='/reference/typescript-api/entities/asset#asset'>Asset</a>[]&#62;`}   />


### createFromFileStream

<MemberInfo kind="method" type={`(stream: ReadStream, ctx?: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;CreateAssetResult&#62;`}   />

Create an Asset from a file stream, for example to create an Asset during data import.
### createFromFileStream

<MemberInfo kind="method" type={`(stream: Readable, filePath: string, ctx?: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;CreateAssetResult&#62;`}   />


### createFromFileStream

<MemberInfo kind="method" type={`(stream: ReadStream | Readable, maybeFilePathOrCtx?: string | <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, maybeCtx?: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;CreateAssetResult&#62;`}   />




</div>


## EntityWithAssets

<GenerationInfo sourceFile="packages/core/src/service/services/asset.service.ts" sourceLine="66" packageName="@vendure/core" />

Certain entities (Product, ProductVariant, Collection) use this interface
to model a featured asset and then a list of assets with a defined order.

```ts title="Signature"
interface EntityWithAssets extends VendureEntity {
    featuredAsset: Asset | null;
    assets: OrderableAsset[];
}
```
* Extends: <code><a href='/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a></code>



<div className="members-wrapper">

### featuredAsset

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/asset#asset'>Asset</a> | null`}   />


### assets

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/orderable-asset#orderableasset'>OrderableAsset</a>[]`}   />




</div>


## EntityAssetInput

<GenerationInfo sourceFile="packages/core/src/service/services/asset.service.ts" sourceLine="78" packageName="@vendure/core" />

Used when updating entities which implement <a href='/reference/typescript-api/services/asset-service#entitywithassets'>EntityWithAssets</a>.

```ts title="Signature"
interface EntityAssetInput {
    assetIds?: ID[] | null;
    featuredAssetId?: ID | null;
}
```

<div className="members-wrapper">

### assetIds

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/id#id'>ID</a>[] | null`}   />


### featuredAssetId

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/id#id'>ID</a> | null`}   />




</div>
