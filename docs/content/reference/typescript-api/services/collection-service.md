---
title: "CollectionService"
weight: 10
date: 2023-07-14T16:57:50.311Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# CollectionService
<div class="symbol">


# CollectionService

{{< generation-info sourceFile="packages/core/src/service/services/collection.service.ts" sourceLine="66" packageName="@vendure/core">}}

Contains methods relating to <a href='/typescript-api/entities/collection#collection'>Collection</a> entities.

## Signature

```TypeScript
class CollectionService implements OnModuleInit {
  constructor(connection: TransactionalConnection, channelService: ChannelService, assetService: AssetService, facetValueService: FacetValueService, listQueryBuilder: ListQueryBuilder, translatableSaver: TranslatableSaver, eventBus: EventBus, jobQueueService: JobQueueService, configService: ConfigService, slugValidator: SlugValidator, configArgService: ConfigArgService, customFieldRelationService: CustomFieldRelationService, translator: TranslatorService, roleService: RoleService)
  async findAll(ctx: RequestContext, options?: ListQueryOptions<Collection> & { topLevelOnly?: boolean }, relations?: RelationPaths<Collection>) => Promise<PaginatedList<Translated<Collection>>>;
  async findOne(ctx: RequestContext, collectionId: ID, relations?: RelationPaths<Collection>) => Promise<Translated<Collection> | undefined>;
  async findByIds(ctx: RequestContext, ids: ID[], relations?: RelationPaths<Collection>) => Promise<Array<Translated<Collection>>>;
  async findOneBySlug(ctx: RequestContext, slug: string, relations?: RelationPaths<Collection>) => Promise<Translated<Collection> | undefined>;
  getAvailableFilters(ctx: RequestContext) => ConfigurableOperationDefinition[];
  async getParent(ctx: RequestContext, collectionId: ID) => Promise<Collection | undefined>;
  async getChildren(ctx: RequestContext, collectionId: ID) => Promise<Collection[]>;
  async getBreadcrumbs(ctx: RequestContext, collection: Collection) => Promise<Array<{ name: string; id: ID }>>;
  async getCollectionsByProductId(ctx: RequestContext, productId: ID, publicOnly: boolean) => Promise<Array<Translated<Collection>>>;
  async getDescendants(ctx: RequestContext, rootId: ID, maxDepth: number = Number.MAX_SAFE_INTEGER) => Promise<Array<Translated<Collection>>>;
  getAncestors(collectionId: ID) => Promise<Collection[]>;
  getAncestors(collectionId: ID, ctx: RequestContext) => Promise<Array<Translated<Collection>>>;
  async getAncestors(collectionId: ID, ctx?: RequestContext) => Promise<Array<Translated<Collection> | Collection>>;
  async previewCollectionVariants(ctx: RequestContext, input: PreviewCollectionVariantsInput, options?: ListQueryOptions<ProductVariant>, relations?: RelationPaths<Collection>) => Promise<PaginatedList<ProductVariant>>;
  async create(ctx: RequestContext, input: CreateCollectionInput) => Promise<Translated<Collection>>;
  async update(ctx: RequestContext, input: UpdateCollectionInput) => Promise<Translated<Collection>>;
  async delete(ctx: RequestContext, id: ID) => Promise<DeletionResponse>;
  async move(ctx: RequestContext, input: MoveCollectionInput) => Promise<Translated<Collection>>;
  async getCollectionProductVariantIds(collection: Collection, ctx?: RequestContext) => Promise<ID[]>;
  async assignCollectionsToChannel(ctx: RequestContext, input: AssignCollectionsToChannelInput) => Promise<Array<Translated<Collection>>>;
  async removeCollectionsFromChannel(ctx: RequestContext, input: RemoveCollectionsFromChannelInput) => Promise<Array<Translated<Collection>>>;
}
```
## Implements

 * OnModuleInit


## Members

### constructor

{{< member-info kind="method" type="(connection: <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, channelService: <a href='/typescript-api/services/channel-service#channelservice'>ChannelService</a>, assetService: <a href='/typescript-api/services/asset-service#assetservice'>AssetService</a>, facetValueService: <a href='/typescript-api/services/facet-value-service#facetvalueservice'>FacetValueService</a>, listQueryBuilder: <a href='/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>, translatableSaver: <a href='/typescript-api/service-helpers/translatable-saver#translatablesaver'>TranslatableSaver</a>, eventBus: <a href='/typescript-api/events/event-bus#eventbus'>EventBus</a>, jobQueueService: <a href='/typescript-api/job-queue/job-queue-service#jobqueueservice'>JobQueueService</a>, configService: ConfigService, slugValidator: <a href='/typescript-api/service-helpers/slug-validator#slugvalidator'>SlugValidator</a>, configArgService: ConfigArgService, customFieldRelationService: CustomFieldRelationService, translator: TranslatorService, roleService: <a href='/typescript-api/services/role-service#roleservice'>RoleService</a>) => CollectionService"  >}}

{{< member-description >}}{{< /member-description >}}

### findAll

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, options?: ListQueryOptions&#60;<a href='/typescript-api/entities/collection#collection'>Collection</a>&#62; &#38; { topLevelOnly?: boolean }, relations?: RelationPaths&#60;<a href='/typescript-api/entities/collection#collection'>Collection</a>&#62;) => Promise&#60;<a href='/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;Translated&#60;<a href='/typescript-api/entities/collection#collection'>Collection</a>&#62;&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### findOne

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, collectionId: <a href='/typescript-api/common/id#id'>ID</a>, relations?: RelationPaths&#60;<a href='/typescript-api/entities/collection#collection'>Collection</a>&#62;) => Promise&#60;Translated&#60;<a href='/typescript-api/entities/collection#collection'>Collection</a>&#62; | undefined&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### findByIds

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, ids: <a href='/typescript-api/common/id#id'>ID</a>[], relations?: RelationPaths&#60;<a href='/typescript-api/entities/collection#collection'>Collection</a>&#62;) => Promise&#60;Array&#60;Translated&#60;<a href='/typescript-api/entities/collection#collection'>Collection</a>&#62;&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### findOneBySlug

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, slug: string, relations?: RelationPaths&#60;<a href='/typescript-api/entities/collection#collection'>Collection</a>&#62;) => Promise&#60;Translated&#60;<a href='/typescript-api/entities/collection#collection'>Collection</a>&#62; | undefined&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### getAvailableFilters

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => ConfigurableOperationDefinition[]"  >}}

{{< member-description >}}Returns all configured CollectionFilters, as specified by the <a href='/typescript-api/products-stock/catalog-options#catalogoptions'>CatalogOptions</a>.{{< /member-description >}}

### getParent

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, collectionId: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/typescript-api/entities/collection#collection'>Collection</a> | undefined&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### getChildren

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, collectionId: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/typescript-api/entities/collection#collection'>Collection</a>[]&#62;"  >}}

{{< member-description >}}Returns all child Collections of the Collection with the given id.{{< /member-description >}}

### getBreadcrumbs

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, collection: <a href='/typescript-api/entities/collection#collection'>Collection</a>) => Promise&#60;Array&#60;{ name: string; id: <a href='/typescript-api/common/id#id'>ID</a> }&#62;&#62;"  >}}

{{< member-description >}}Returns an array of name/id pairs representing all ancestor Collections up
to the Root Collection.{{< /member-description >}}

### getCollectionsByProductId

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productId: <a href='/typescript-api/common/id#id'>ID</a>, publicOnly: boolean) => Promise&#60;Array&#60;Translated&#60;<a href='/typescript-api/entities/collection#collection'>Collection</a>&#62;&#62;&#62;"  >}}

{{< member-description >}}Returns all Collections which are associated with the given Product ID.{{< /member-description >}}

### getDescendants

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, rootId: <a href='/typescript-api/common/id#id'>ID</a>, maxDepth: number = Number.MAX_SAFE_INTEGER) => Promise&#60;Array&#60;Translated&#60;<a href='/typescript-api/entities/collection#collection'>Collection</a>&#62;&#62;&#62;"  >}}

{{< member-description >}}Returns the descendants of a Collection as a flat array. The depth of the traversal can be limited
with the maxDepth argument. So to get only the immediate children, set maxDepth = 1.{{< /member-description >}}

### getAncestors

{{< member-info kind="method" type="(collectionId: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/typescript-api/entities/collection#collection'>Collection</a>[]&#62;"  >}}

{{< member-description >}}Gets the ancestors of a given collection. Note that since ProductCategories are implemented as an adjacency list, this method
will produce more queries the deeper the collection is in the tree.{{< /member-description >}}

### getAncestors

{{< member-info kind="method" type="(collectionId: <a href='/typescript-api/common/id#id'>ID</a>, ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;Array&#60;Translated&#60;<a href='/typescript-api/entities/collection#collection'>Collection</a>&#62;&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### getAncestors

{{< member-info kind="method" type="(collectionId: <a href='/typescript-api/common/id#id'>ID</a>, ctx?: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;Array&#60;Translated&#60;<a href='/typescript-api/entities/collection#collection'>Collection</a>&#62; | <a href='/typescript-api/entities/collection#collection'>Collection</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### previewCollectionVariants

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: PreviewCollectionVariantsInput, options?: ListQueryOptions&#60;<a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62;, relations?: RelationPaths&#60;<a href='/typescript-api/entities/collection#collection'>Collection</a>&#62;) => Promise&#60;<a href='/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### create

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: CreateCollectionInput) => Promise&#60;Translated&#60;<a href='/typescript-api/entities/collection#collection'>Collection</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### update

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateCollectionInput) => Promise&#60;Translated&#60;<a href='/typescript-api/entities/collection#collection'>Collection</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### delete

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;DeletionResponse&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### move

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: MoveCollectionInput) => Promise&#60;Translated&#60;<a href='/typescript-api/entities/collection#collection'>Collection</a>&#62;&#62;"  >}}

{{< member-description >}}Moves a Collection by specifying the parent Collection ID, and an index representing the order amongst
its siblings.{{< /member-description >}}

### getCollectionProductVariantIds

{{< member-info kind="method" type="(collection: <a href='/typescript-api/entities/collection#collection'>Collection</a>, ctx?: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;<a href='/typescript-api/common/id#id'>ID</a>[]&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### assignCollectionsToChannel

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: AssignCollectionsToChannelInput) => Promise&#60;Array&#60;Translated&#60;<a href='/typescript-api/entities/collection#collection'>Collection</a>&#62;&#62;&#62;"  >}}

{{< member-description >}}Assigns Collections to the specified Channel{{< /member-description >}}

### removeCollectionsFromChannel

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: RemoveCollectionsFromChannelInput) => Promise&#60;Array&#60;Translated&#60;<a href='/typescript-api/entities/collection#collection'>Collection</a>&#62;&#62;&#62;"  >}}

{{< member-description >}}Remove Collections from the specified Channel{{< /member-description >}}


</div>
