---
title: "ProductService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ProductService

<GenerationInfo sourceFile="packages/core/src/service/services/product.service.ts" sourceLine="54" packageName="@vendure/core" />

Contains methods relating to <a href='/reference/typescript-api/entities/product#product'>Product</a> entities.

```ts title="Signature"
class ProductService {
    constructor(connection: TransactionalConnection, channelService: ChannelService, assetService: AssetService, productVariantService: ProductVariantService, facetValueService: FacetValueService, listQueryBuilder: ListQueryBuilder, translatableSaver: TranslatableSaver, eventBus: EventBus, slugValidator: SlugValidator, customFieldRelationService: CustomFieldRelationService, translator: TranslatorService, productOptionGroupService: ProductOptionGroupService)
    findAll(ctx: RequestContext, options?: ListQueryOptions<Product>, relations?: RelationPaths<Product>) => Promise<PaginatedList<Translated<Product>>>;
    findOne(ctx: RequestContext, productId: ID, relations?: RelationPaths<Product>) => Promise<Translated<Product> | undefined>;
    findByIds(ctx: RequestContext, productIds: ID[], relations?: RelationPaths<Product>) => Promise<Array<Translated<Product>>>;
    getProductChannels(ctx: RequestContext, productId: ID) => Promise<Channel[]>;
    getFacetValuesForProduct(ctx: RequestContext, productId: ID) => Promise<Array<Translated<FacetValue>>>;
    findOneBySlug(ctx: RequestContext, slug: string, relations?: RelationPaths<Product>) => Promise<Translated<Product> | undefined>;
    create(ctx: RequestContext, input: CreateProductInput) => Promise<Translated<Product>>;
    update(ctx: RequestContext, input: UpdateProductInput) => Promise<Translated<Product>>;
    softDelete(ctx: RequestContext, productId: ID) => Promise<DeletionResponse>;
    assignProductsToChannel(ctx: RequestContext, input: AssignProductsToChannelInput) => Promise<Array<Translated<Product>>>;
    removeProductsFromChannel(ctx: RequestContext, input: RemoveProductsFromChannelInput) => Promise<Array<Translated<Product>>>;
    addOptionGroupToProduct(ctx: RequestContext, productId: ID, optionGroupId: ID) => Promise<Translated<Product>>;
    removeOptionGroupFromProduct(ctx: RequestContext, productId: ID, optionGroupId: ID, force?: boolean) => Promise<ErrorResultUnion<RemoveOptionGroupFromProductResult, Translated<Product>>>;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(connection: <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, channelService: <a href='/reference/typescript-api/services/channel-service#channelservice'>ChannelService</a>, assetService: <a href='/reference/typescript-api/services/asset-service#assetservice'>AssetService</a>, productVariantService: <a href='/reference/typescript-api/services/product-variant-service#productvariantservice'>ProductVariantService</a>, facetValueService: <a href='/reference/typescript-api/services/facet-value-service#facetvalueservice'>FacetValueService</a>, listQueryBuilder: <a href='/reference/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>, translatableSaver: <a href='/reference/typescript-api/service-helpers/translatable-saver#translatablesaver'>TranslatableSaver</a>, eventBus: <a href='/reference/typescript-api/events/event-bus#eventbus'>EventBus</a>, slugValidator: <a href='/reference/typescript-api/service-helpers/slug-validator#slugvalidator'>SlugValidator</a>, customFieldRelationService: CustomFieldRelationService, translator: <a href='/reference/typescript-api/service-helpers/translator-service#translatorservice'>TranslatorService</a>, productOptionGroupService: <a href='/reference/typescript-api/services/product-option-group-service#productoptiongroupservice'>ProductOptionGroupService</a>) => ProductService`}   />


### findAll

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, options?: ListQueryOptions&#60;<a href='/reference/typescript-api/entities/product#product'>Product</a>&#62;, relations?: RelationPaths&#60;<a href='/reference/typescript-api/entities/product#product'>Product</a>&#62;) => Promise&#60;<a href='/reference/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;Translated&#60;<a href='/reference/typescript-api/entities/product#product'>Product</a>&#62;&#62;&#62;`}   />


### findOne

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productId: <a href='/reference/typescript-api/common/id#id'>ID</a>, relations?: RelationPaths&#60;<a href='/reference/typescript-api/entities/product#product'>Product</a>&#62;) => Promise&#60;Translated&#60;<a href='/reference/typescript-api/entities/product#product'>Product</a>&#62; | undefined&#62;`}   />


### findByIds

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productIds: <a href='/reference/typescript-api/common/id#id'>ID</a>[], relations?: RelationPaths&#60;<a href='/reference/typescript-api/entities/product#product'>Product</a>&#62;) => Promise&#60;Array&#60;Translated&#60;<a href='/reference/typescript-api/entities/product#product'>Product</a>&#62;&#62;&#62;`}   />


### getProductChannels

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/reference/typescript-api/entities/channel#channel'>Channel</a>[]&#62;`}   />

Returns all Channels to which the Product is assigned.
### getFacetValuesForProduct

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;Array&#60;Translated&#60;<a href='/reference/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>&#62;&#62;&#62;`}   />


### findOneBySlug

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, slug: string, relations?: RelationPaths&#60;<a href='/reference/typescript-api/entities/product#product'>Product</a>&#62;) => Promise&#60;Translated&#60;<a href='/reference/typescript-api/entities/product#product'>Product</a>&#62; | undefined&#62;`}   />


### create

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: CreateProductInput) => Promise&#60;Translated&#60;<a href='/reference/typescript-api/entities/product#product'>Product</a>&#62;&#62;`}   />


### update

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateProductInput) => Promise&#60;Translated&#60;<a href='/reference/typescript-api/entities/product#product'>Product</a>&#62;&#62;`}   />


### softDelete

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;DeletionResponse&#62;`}   />


### assignProductsToChannel

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: AssignProductsToChannelInput) => Promise&#60;Array&#60;Translated&#60;<a href='/reference/typescript-api/entities/product#product'>Product</a>&#62;&#62;&#62;`}   />

Assigns a Product to the specified Channel, and optionally uses a `priceFactor` to set the ProductVariantPrices
on the new Channel.

Internally, this method will also call <a href='/reference/typescript-api/services/product-variant-service#productvariantservice'>ProductVariantService</a> `assignProductVariantsToChannel()` for
each of the Product's variants, and will assign the Product's Assets to the Channel too.
### removeProductsFromChannel

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: RemoveProductsFromChannelInput) => Promise&#60;Array&#60;Translated&#60;<a href='/reference/typescript-api/entities/product#product'>Product</a>&#62;&#62;&#62;`}   />


### addOptionGroupToProduct

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productId: <a href='/reference/typescript-api/common/id#id'>ID</a>, optionGroupId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;Translated&#60;<a href='/reference/typescript-api/entities/product#product'>Product</a>&#62;&#62;`}   />


### removeOptionGroupFromProduct

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productId: <a href='/reference/typescript-api/common/id#id'>ID</a>, optionGroupId: <a href='/reference/typescript-api/common/id#id'>ID</a>, force?: boolean) => Promise&#60;<a href='/reference/typescript-api/errors/error-result-union#errorresultunion'>ErrorResultUnion</a>&#60;RemoveOptionGroupFromProductResult, Translated&#60;<a href='/reference/typescript-api/entities/product#product'>Product</a>&#62;&#62;&#62;`}   />




</div>
