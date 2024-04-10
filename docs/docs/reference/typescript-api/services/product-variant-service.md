---
title: "ProductVariantService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ProductVariantService

<GenerationInfo sourceFile="packages/core/src/service/services/product-variant.service.ts" sourceLine="68" packageName="@vendure/core" />

Contains methods relating to <a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a> entities.

```ts title="Signature"
class ProductVariantService {
    constructor(connection: TransactionalConnection, configService: ConfigService, taxCategoryService: TaxCategoryService, facetValueService: FacetValueService, assetService: AssetService, translatableSaver: TranslatableSaver, eventBus: EventBus, listQueryBuilder: ListQueryBuilder, globalSettingsService: GlobalSettingsService, stockMovementService: StockMovementService, stockLevelService: StockLevelService, channelService: ChannelService, roleService: RoleService, customFieldRelationService: CustomFieldRelationService, requestCache: RequestContextCacheService, productPriceApplicator: ProductPriceApplicator, translator: TranslatorService)
    findAll(ctx: RequestContext, options?: ListQueryOptions<ProductVariant>) => Promise<PaginatedList<Translated<ProductVariant>>>;
    findOne(ctx: RequestContext, productVariantId: ID, relations?: RelationPaths<ProductVariant>) => Promise<Translated<ProductVariant> | undefined>;
    findByIds(ctx: RequestContext, ids: ID[]) => Promise<Array<Translated<ProductVariant>>>;
    getVariantsByProductId(ctx: RequestContext, productId: ID, options: ListQueryOptions<ProductVariant> = {}, relations?: RelationPaths<ProductVariant>) => Promise<PaginatedList<Translated<ProductVariant>>>;
    getVariantsByCollectionId(ctx: RequestContext, collectionId: ID, options: ListQueryOptions<ProductVariant>, relations: RelationPaths<ProductVariant> = []) => Promise<PaginatedList<Translated<ProductVariant>>>;
    getProductVariantChannels(ctx: RequestContext, productVariantId: ID) => Promise<Channel[]>;
    getProductVariantPrices(ctx: RequestContext, productVariantId: ID) => Promise<ProductVariantPrice[]>;
    getVariantByOrderLineId(ctx: RequestContext, orderLineId: ID) => Promise<Translated<ProductVariant>>;
    getOptionsForVariant(ctx: RequestContext, variantId: ID) => Promise<Array<Translated<ProductOption>>>;
    getFacetValuesForVariant(ctx: RequestContext, variantId: ID) => Promise<Array<Translated<FacetValue>>>;
    getProductForVariant(ctx: RequestContext, variant: ProductVariant) => Promise<Translated<Product>>;
    getSaleableStockLevel(ctx: RequestContext, variant: ProductVariant) => Promise<number>;
    getDisplayStockLevel(ctx: RequestContext, variant: ProductVariant) => Promise<string>;
    getFulfillableStockLevel(ctx: RequestContext, variant: ProductVariant) => Promise<number>;
    create(ctx: RequestContext, input: CreateProductVariantInput[]) => Promise<Array<Translated<ProductVariant>>>;
    update(ctx: RequestContext, input: UpdateProductVariantInput[]) => Promise<Array<Translated<ProductVariant>>>;
    createOrUpdateProductVariantPrice(ctx: RequestContext, productVariantId: ID, price: number, channelId: ID, currencyCode?: CurrencyCode) => Promise<ProductVariantPrice>;
    deleteProductVariantPrice(ctx: RequestContext, variantId: ID, channelId: ID, currencyCode: CurrencyCode) => ;
    softDelete(ctx: RequestContext, id: ID | ID[]) => Promise<DeletionResponse>;
    hydratePriceFields(ctx: RequestContext, variant: ProductVariant, priceField: F) => Promise<ProductVariant[F]>;
    applyChannelPriceAndTax(variant: ProductVariant, ctx: RequestContext, order?: Order, throwIfNoPriceFound:  = false) => Promise<ProductVariant>;
    assignProductVariantsToChannel(ctx: RequestContext, input: AssignProductVariantsToChannelInput) => Promise<Array<Translated<ProductVariant>>>;
    removeProductVariantsFromChannel(ctx: RequestContext, input: RemoveProductVariantsFromChannelInput) => Promise<Array<Translated<ProductVariant>>>;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(connection: <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, configService: ConfigService, taxCategoryService: <a href='/reference/typescript-api/services/tax-category-service#taxcategoryservice'>TaxCategoryService</a>, facetValueService: <a href='/reference/typescript-api/services/facet-value-service#facetvalueservice'>FacetValueService</a>, assetService: <a href='/reference/typescript-api/services/asset-service#assetservice'>AssetService</a>, translatableSaver: <a href='/reference/typescript-api/service-helpers/translatable-saver#translatablesaver'>TranslatableSaver</a>, eventBus: <a href='/reference/typescript-api/events/event-bus#eventbus'>EventBus</a>, listQueryBuilder: <a href='/reference/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>, globalSettingsService: <a href='/reference/typescript-api/services/global-settings-service#globalsettingsservice'>GlobalSettingsService</a>, stockMovementService: <a href='/reference/typescript-api/services/stock-movement-service#stockmovementservice'>StockMovementService</a>, stockLevelService: <a href='/reference/typescript-api/services/stock-level-service#stocklevelservice'>StockLevelService</a>, channelService: <a href='/reference/typescript-api/services/channel-service#channelservice'>ChannelService</a>, roleService: <a href='/reference/typescript-api/services/role-service#roleservice'>RoleService</a>, customFieldRelationService: CustomFieldRelationService, requestCache: RequestContextCacheService, productPriceApplicator: <a href='/reference/typescript-api/service-helpers/product-price-applicator#productpriceapplicator'>ProductPriceApplicator</a>, translator: <a href='/reference/typescript-api/service-helpers/translator-service#translatorservice'>TranslatorService</a>) => ProductVariantService`}   />


### findAll

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, options?: ListQueryOptions&#60;<a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62;) => Promise&#60;<a href='/reference/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;Translated&#60;<a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62;&#62;&#62;`}   />


### findOne

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productVariantId: <a href='/reference/typescript-api/common/id#id'>ID</a>, relations?: RelationPaths&#60;<a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62;) => Promise&#60;Translated&#60;<a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62; | undefined&#62;`}   />


### findByIds

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, ids: <a href='/reference/typescript-api/common/id#id'>ID</a>[]) => Promise&#60;Array&#60;Translated&#60;<a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62;&#62;&#62;`}   />


### getVariantsByProductId

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productId: <a href='/reference/typescript-api/common/id#id'>ID</a>, options: ListQueryOptions&#60;<a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62; = {}, relations?: RelationPaths&#60;<a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62;) => Promise&#60;<a href='/reference/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;Translated&#60;<a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62;&#62;&#62;`}   />


### getVariantsByCollectionId

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, collectionId: <a href='/reference/typescript-api/common/id#id'>ID</a>, options: ListQueryOptions&#60;<a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62;, relations: RelationPaths&#60;<a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62; = []) => Promise&#60;<a href='/reference/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;Translated&#60;<a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62;&#62;&#62;`}   />

Returns a <a href='/reference/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a> of all ProductVariants associated with the given Collection.
### getProductVariantChannels

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productVariantId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/reference/typescript-api/entities/channel#channel'>Channel</a>[]&#62;`}   />

Returns all Channels to which the ProductVariant is assigned.
### getProductVariantPrices

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productVariantId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/reference/typescript-api/entities/product-variant-price#productvariantprice'>ProductVariantPrice</a>[]&#62;`}   />


### getVariantByOrderLineId

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderLineId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;Translated&#60;<a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62;&#62;`}   />

Returns the ProductVariant associated with the given <a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>.
### getOptionsForVariant

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, variantId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;Array&#60;Translated&#60;<a href='/reference/typescript-api/entities/product-option#productoption'>ProductOption</a>&#62;&#62;&#62;`}   />

Returns the <a href='/reference/typescript-api/entities/product-option#productoption'>ProductOption</a>s for the given ProductVariant.
### getFacetValuesForVariant

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, variantId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;Array&#60;Translated&#60;<a href='/reference/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>&#62;&#62;&#62;`}   />


### getProductForVariant

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, variant: <a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>) => Promise&#60;Translated&#60;<a href='/reference/typescript-api/entities/product#product'>Product</a>&#62;&#62;`}   />

Returns the Product associated with the ProductVariant. Whereas the `ProductService.findOne()`
method performs a large multi-table join with all the typical data needed for a "product detail"
page, this method returns only the Product itself.
### getSaleableStockLevel

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, variant: <a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>) => Promise&#60;number&#62;`}   />

Returns the number of saleable units of the ProductVariant, i.e. how many are available
for purchase by Customers. This is determined by the ProductVariant's `stockOnHand` value,
as well as the local and global `outOfStockThreshold` settings.
### getDisplayStockLevel

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, variant: <a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>) => Promise&#60;string&#62;`}   />

Returns the stockLevel to display to the customer, as specified by the configured
<a href='/reference/typescript-api/products-stock/stock-display-strategy#stockdisplaystrategy'>StockDisplayStrategy</a>.
### getFulfillableStockLevel

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, variant: <a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>) => Promise&#60;number&#62;`}   />

Returns the number of fulfillable units of the ProductVariant, equivalent to stockOnHand
for those variants which are tracking inventory.
### create

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: CreateProductVariantInput[]) => Promise&#60;Array&#60;Translated&#60;<a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62;&#62;&#62;`}   />


### update

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateProductVariantInput[]) => Promise&#60;Array&#60;Translated&#60;<a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62;&#62;&#62;`}   />


### createOrUpdateProductVariantPrice

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productVariantId: <a href='/reference/typescript-api/common/id#id'>ID</a>, price: number, channelId: <a href='/reference/typescript-api/common/id#id'>ID</a>, currencyCode?: <a href='/reference/typescript-api/common/currency-code#currencycode'>CurrencyCode</a>) => Promise&#60;<a href='/reference/typescript-api/entities/product-variant-price#productvariantprice'>ProductVariantPrice</a>&#62;`}   />

Creates a <a href='/reference/typescript-api/entities/product-variant-price#productvariantprice'>ProductVariantPrice</a> for the given ProductVariant/Channel combination.
If the `currencyCode` is not specified, the default currency of the Channel will be used.
### deleteProductVariantPrice

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, variantId: <a href='/reference/typescript-api/common/id#id'>ID</a>, channelId: <a href='/reference/typescript-api/common/id#id'>ID</a>, currencyCode: <a href='/reference/typescript-api/common/currency-code#currencycode'>CurrencyCode</a>) => `}   />


### softDelete

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/reference/typescript-api/common/id#id'>ID</a> | <a href='/reference/typescript-api/common/id#id'>ID</a>[]) => Promise&#60;DeletionResponse&#62;`}   />


### hydratePriceFields

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, variant: <a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>, priceField: F) => Promise&#60;<a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>[F]&#62;`}   />

This method is intended to be used by the ProductVariant GraphQL entity resolver to resolve the
price-related fields which need to be populated at run-time using the `applyChannelPriceAndTax`
method.

Is optimized to make as few DB calls as possible using caching based on the open request.
### applyChannelPriceAndTax

<MemberInfo kind="method" type={`(variant: <a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>, ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order?: <a href='/reference/typescript-api/entities/order#order'>Order</a>, throwIfNoPriceFound:  = false) => Promise&#60;<a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62;`}   />

Populates the `price` field with the price for the specified channel.
### assignProductVariantsToChannel

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: AssignProductVariantsToChannelInput) => Promise&#60;Array&#60;Translated&#60;<a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62;&#62;&#62;`}   />

Assigns the specified ProductVariants to the specified Channel. In doing so, it will create a new
<a href='/reference/typescript-api/entities/product-variant-price#productvariantprice'>ProductVariantPrice</a> and also assign the associated Product and any Assets to the Channel too.
### removeProductVariantsFromChannel

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: RemoveProductVariantsFromChannelInput) => Promise&#60;Array&#60;Translated&#60;<a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>&#62;&#62;&#62;`}   />




</div>
