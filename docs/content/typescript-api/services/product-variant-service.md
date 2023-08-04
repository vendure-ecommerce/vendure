---
title: "ProductVariantService"
weight: 10
date: 2023-07-14T16:57:50.499Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# ProductVariantService
<div class="symbol">


# ProductVariantService

{{< generation-info sourceFile="packages/core/src/service/services/product-variant.service.ts" sourceLine="67" packageName="@vendure/core">}}

Contains methods relating to <a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a> entities.

## Signature

```TypeScript
class ProductVariantService {
  constructor(connection: TransactionalConnection, configService: ConfigService, taxCategoryService: TaxCategoryService, facetValueService: FacetValueService, assetService: AssetService, translatableSaver: TranslatableSaver, eventBus: EventBus, listQueryBuilder: ListQueryBuilder, globalSettingsService: GlobalSettingsService, stockMovementService: StockMovementService, stockLevelService: StockLevelService, channelService: ChannelService, roleService: RoleService, customFieldRelationService: CustomFieldRelationService, requestCache: RequestContextCacheService, productPriceApplicator: ProductPriceApplicator, translator: TranslatorService)
  async findAll(ctx: RequestContext, options?: ListQueryOptions<ProductVariant>) => Promise<PaginatedList<Translated<ProductVariant>>>;
  findOne(ctx: RequestContext, productVariantId: ID, relations?: RelationPaths<ProductVariant>) => Promise<Translated<ProductVariant> | undefined>;
  findByIds(ctx: RequestContext, ids: ID[]) => Promise<Array<Translated<ProductVariant>>>;
  getVariantsByProductId(ctx: RequestContext, productId: ID, options: ListQueryOptions<ProductVariant> = {}, relations?: RelationPaths<ProductVariant>) => Promise<PaginatedList<Translated<ProductVariant>>>;
  getVariantsByCollectionId(ctx: RequestContext, collectionId: ID, options: ListQueryOptions<ProductVariant>, relations: RelationPaths<ProductVariant> = []) => Promise<PaginatedList<Translated<ProductVariant>>>;
  async getProductVariantChannels(ctx: RequestContext, productVariantId: ID) => Promise<Channel[]>;
  async getProductVariantPrices(ctx: RequestContext, productVariantId: ID) => Promise<ProductVariantPrice[]>;
  async getVariantByOrderLineId(ctx: RequestContext, orderLineId: ID) => Promise<Translated<ProductVariant>>;
  getOptionsForVariant(ctx: RequestContext, variantId: ID) => Promise<Array<Translated<ProductOption>>>;
  getFacetValuesForVariant(ctx: RequestContext, variantId: ID) => Promise<Array<Translated<FacetValue>>>;
  async getProductForVariant(ctx: RequestContext, variant: ProductVariant) => Promise<Translated<Product>>;
  async getSaleableStockLevel(ctx: RequestContext, variant: ProductVariant) => Promise<number>;
  async getDisplayStockLevel(ctx: RequestContext, variant: ProductVariant) => Promise<string>;
  async getFulfillableStockLevel(ctx: RequestContext, variant: ProductVariant) => Promise<number>;
  async create(ctx: RequestContext, input: CreateProductVariantInput[]) => Promise<Array<Translated<ProductVariant>>>;
  async update(ctx: RequestContext, input: UpdateProductVariantInput[]) => Promise<Array<Translated<ProductVariant>>>;
  async createOrUpdateProductVariantPrice(ctx: RequestContext, productVariantId: ID, price: number, channelId: ID, currencyCode?: CurrencyCode) => Promise<ProductVariantPrice>;
  async softDelete(ctx: RequestContext, id: ID | ID[]) => Promise<DeletionResponse>;
  async hydratePriceFields(ctx: RequestContext, variant: ProductVariant, priceField: F) => Promise<ProductVariant[F]>;
  async applyChannelPriceAndTax(variant: ProductVariant, ctx: RequestContext, order?: Order) => Promise<ProductVariant>;
  async assignProductVariantsToChannel(ctx: RequestContext, input: AssignProductVariantsToChannelInput) => Promise<Array<Translated<ProductVariant>>>;
  async removeProductVariantsFromChannel(ctx: RequestContext, input: RemoveProductVariantsFromChannelInput) => Promise<Array<Translated<ProductVariant>>>;
}
```
## Members

### constructor

{{< member-info kind="method" type="(connection: <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, configService: ConfigService, taxCategoryService: <a href='/typescript-api/services/tax-category-service#taxcategoryservice'>TaxCategoryService</a>, facetValueService: <a href='/typescript-api/services/facet-value-service#facetvalueservice'>FacetValueService</a>, assetService: <a href='/typescript-api/services/asset-service#assetservice'>AssetService</a>, translatableSaver: <a href='/typescript-api/service-helpers/translatable-saver#translatablesaver'>TranslatableSaver</a>, eventBus: <a href='/typescript-api/events/event-bus#eventbus'>EventBus</a>, listQueryBuilder: <a href='/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>, globalSettingsService: <a href='/typescript-api/services/global-settings-service#globalsettingsservice'>GlobalSettingsService</a>, stockMovementService: <a href='/typescript-api/services/stock-movement-service#stockmovementservice'>StockMovementService</a>, stockLevelService: <a href='/typescript-api/services/stock-level-service#stocklevelservice'>StockLevelService</a>, channelService: <a href='/typescript-api/services/channel-service#channelservice'>ChannelService</a>, roleService: <a href='/typescript-api/services/role-service#roleservice'>RoleService</a>, customFieldRelationService: CustomFieldRelationService, requestCache: RequestContextCacheService, productPriceApplicator: <a href='/typescript-api/service-helpers/product-price-applicator#productpriceapplicator'>ProductPriceApplicator</a>, translator: TranslatorService) => ProductVariantService"  >}}

{{< member-description >}}{{< /member-description >}}

### findAll

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, options?: ListQueryOptions&#60;<a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62;) => Promise&#60;<a href='/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;Translated&#60;<a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62;&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### findOne

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productVariantId: <a href='/typescript-api/common/id#id'>ID</a>, relations?: RelationPaths&#60;<a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62;) => Promise&#60;Translated&#60;<a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62; | undefined&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### findByIds

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, ids: <a href='/typescript-api/common/id#id'>ID</a>[]) => Promise&#60;Array&#60;Translated&#60;<a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62;&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### getVariantsByProductId

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productId: <a href='/typescript-api/common/id#id'>ID</a>, options: ListQueryOptions&#60;<a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62; = {}, relations?: RelationPaths&#60;<a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62;) => Promise&#60;<a href='/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;Translated&#60;<a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62;&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### getVariantsByCollectionId

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, collectionId: <a href='/typescript-api/common/id#id'>ID</a>, options: ListQueryOptions&#60;<a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62;, relations: RelationPaths&#60;<a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62; = []) => Promise&#60;<a href='/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;Translated&#60;<a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62;&#62;&#62;"  >}}

{{< member-description >}}Returns a <a href='/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a> of all ProductVariants associated with the given Collection.{{< /member-description >}}

### getProductVariantChannels

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productVariantId: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/typescript-api/entities/channel#channel'>Channel</a>[]&#62;"  >}}

{{< member-description >}}Returns all Channels to which the ProductVariant is assigned.{{< /member-description >}}

### getProductVariantPrices

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productVariantId: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/typescript-api/entities/product-variant-price#productvariantprice'>ProductVariantPrice</a>[]&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### getVariantByOrderLineId

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderLineId: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;Translated&#60;<a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62;&#62;"  >}}

{{< member-description >}}Returns the ProductVariant associated with the given <a href='/typescript-api/entities/order-line#orderline'>OrderLine</a>.{{< /member-description >}}

### getOptionsForVariant

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, variantId: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;Array&#60;Translated&#60;<a href='/typescript-api/entities/product-option#productoption'>ProductOption</a>&#62;&#62;&#62;"  >}}

{{< member-description >}}Returns the <a href='/typescript-api/entities/product-option#productoption'>ProductOption</a>s for the given ProductVariant.{{< /member-description >}}

### getFacetValuesForVariant

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, variantId: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;Array&#60;Translated&#60;<a href='/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>&#62;&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### getProductForVariant

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, variant: <a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>) => Promise&#60;Translated&#60;<a href='/typescript-api/entities/product#product'>Product</a>&#62;&#62;"  >}}

{{< member-description >}}Returns the Product associated with the ProductVariant. Whereas the `ProductService.findOne()`
method performs a large multi-table join with all the typical data needed for a "product detail"
page, this method returns only the Product itself.{{< /member-description >}}

### getSaleableStockLevel

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, variant: <a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>) => Promise&#60;number&#62;"  >}}

{{< member-description >}}Returns the number of saleable units of the ProductVariant, i.e. how many are available
for purchase by Customers. This is determined by the ProductVariant's `stockOnHand` value,
as well as the local and global `outOfStockThreshold` settings.{{< /member-description >}}

### getDisplayStockLevel

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, variant: <a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>) => Promise&#60;string&#62;"  >}}

{{< member-description >}}Returns the stockLevel to display to the customer, as specified by the configured
<a href='/typescript-api/products-stock/stock-display-strategy#stockdisplaystrategy'>StockDisplayStrategy</a>.{{< /member-description >}}

### getFulfillableStockLevel

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, variant: <a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>) => Promise&#60;number&#62;"  >}}

{{< member-description >}}Returns the number of fulfillable units of the ProductVariant, equivalent to stockOnHand
for those variants which are tracking inventory.{{< /member-description >}}

### create

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: CreateProductVariantInput[]) => Promise&#60;Array&#60;Translated&#60;<a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62;&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### update

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateProductVariantInput[]) => Promise&#60;Array&#60;Translated&#60;<a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62;&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### createOrUpdateProductVariantPrice

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productVariantId: <a href='/typescript-api/common/id#id'>ID</a>, price: number, channelId: <a href='/typescript-api/common/id#id'>ID</a>, currencyCode?: <a href='/typescript-api/common/currency-code#currencycode'>CurrencyCode</a>) => Promise&#60;<a href='/typescript-api/entities/product-variant-price#productvariantprice'>ProductVariantPrice</a>&#62;"  >}}

{{< member-description >}}Creates a <a href='/typescript-api/entities/product-variant-price#productvariantprice'>ProductVariantPrice</a> for the given ProductVariant/Channel combination.
If the `currencyCode` is not specified, the default currency of the Channel will be used.{{< /member-description >}}

### softDelete

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/typescript-api/common/id#id'>ID</a> | <a href='/typescript-api/common/id#id'>ID</a>[]) => Promise&#60;DeletionResponse&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### hydratePriceFields

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, variant: <a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>, priceField: F) => Promise&#60;<a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>[F]&#62;"  >}}

{{< member-description >}}This method is intended to be used by the ProductVariant GraphQL entity resolver to resolve the
price-related fields which need to be populated at run-time using the `applyChannelPriceAndTax`
method.

Is optimized to make as few DB calls as possible using caching based on the open request.{{< /member-description >}}

### applyChannelPriceAndTax

{{< member-info kind="method" type="(variant: <a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>, ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order?: <a href='/typescript-api/entities/order#order'>Order</a>) => Promise&#60;<a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62;"  >}}

{{< member-description >}}Populates the `price` field with the price for the specified channel.{{< /member-description >}}

### assignProductVariantsToChannel

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: AssignProductVariantsToChannelInput) => Promise&#60;Array&#60;Translated&#60;<a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62;&#62;&#62;"  >}}

{{< member-description >}}Assigns the specified ProductVariants to the specified Channel. In doing so, it will create a new
<a href='/typescript-api/entities/product-variant-price#productvariantprice'>ProductVariantPrice</a> and also assign the associated Product and any Assets to the Channel too.{{< /member-description >}}

### removeProductVariantsFromChannel

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: RemoveProductVariantsFromChannelInput) => Promise&#60;Array&#60;Translated&#60;<a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62;&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
