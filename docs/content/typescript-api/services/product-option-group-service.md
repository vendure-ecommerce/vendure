---
title: "ProductOptionGroupService"
weight: 10
date: 2023-07-14T16:57:50.487Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# ProductOptionGroupService
<div class="symbol">


# ProductOptionGroupService

{{< generation-info sourceFile="packages/core/src/service/services/product-option-group.service.ts" sourceLine="34" packageName="@vendure/core">}}

Contains methods relating to <a href='/typescript-api/entities/product-option-group#productoptiongroup'>ProductOptionGroup</a> entities.

## Signature

```TypeScript
class ProductOptionGroupService {
  constructor(connection: TransactionalConnection, translatableSaver: TranslatableSaver, customFieldRelationService: CustomFieldRelationService, productOptionService: ProductOptionService, eventBus: EventBus, translator: TranslatorService)
  findAll(ctx: RequestContext, filterTerm?: string, relations?: RelationPaths<ProductOptionGroup>) => Promise<Array<Translated<ProductOptionGroup>>>;
  findOne(ctx: RequestContext, id: ID, relations?: RelationPaths<ProductOptionGroup>) => Promise<Translated<ProductOptionGroup> | undefined>;
  getOptionGroupsByProductId(ctx: RequestContext, id: ID) => Promise<Array<Translated<ProductOptionGroup>>>;
  async create(ctx: RequestContext, input: CreateProductOptionGroupInput) => Promise<Translated<ProductOptionGroup>>;
  async update(ctx: RequestContext, input: UpdateProductOptionGroupInput) => Promise<Translated<ProductOptionGroup>>;
  async deleteGroupAndOptionsFromProduct(ctx: RequestContext, id: ID, productId: ID) => ;
}
```
## Members

### constructor

{{< member-info kind="method" type="(connection: <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, translatableSaver: <a href='/typescript-api/service-helpers/translatable-saver#translatablesaver'>TranslatableSaver</a>, customFieldRelationService: CustomFieldRelationService, productOptionService: <a href='/typescript-api/services/product-option-service#productoptionservice'>ProductOptionService</a>, eventBus: <a href='/typescript-api/events/event-bus#eventbus'>EventBus</a>, translator: TranslatorService) => ProductOptionGroupService"  >}}

{{< member-description >}}{{< /member-description >}}

### findAll

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, filterTerm?: string, relations?: RelationPaths&#60;<a href='/typescript-api/entities/product-option-group#productoptiongroup'>ProductOptionGroup</a>&#62;) => Promise&#60;Array&#60;Translated&#60;<a href='/typescript-api/entities/product-option-group#productoptiongroup'>ProductOptionGroup</a>&#62;&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### findOne

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/typescript-api/common/id#id'>ID</a>, relations?: RelationPaths&#60;<a href='/typescript-api/entities/product-option-group#productoptiongroup'>ProductOptionGroup</a>&#62;) => Promise&#60;Translated&#60;<a href='/typescript-api/entities/product-option-group#productoptiongroup'>ProductOptionGroup</a>&#62; | undefined&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### getOptionGroupsByProductId

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;Array&#60;Translated&#60;<a href='/typescript-api/entities/product-option-group#productoptiongroup'>ProductOptionGroup</a>&#62;&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### create

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: CreateProductOptionGroupInput) => Promise&#60;Translated&#60;<a href='/typescript-api/entities/product-option-group#productoptiongroup'>ProductOptionGroup</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### update

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateProductOptionGroupInput) => Promise&#60;Translated&#60;<a href='/typescript-api/entities/product-option-group#productoptiongroup'>ProductOptionGroup</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### deleteGroupAndOptionsFromProduct

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/typescript-api/common/id#id'>ID</a>, productId: <a href='/typescript-api/common/id#id'>ID</a>) => "  >}}

{{< member-description >}}Deletes the ProductOptionGroup and any associated ProductOptions. If the ProductOptionGroup
is still referenced by a soft-deleted Product, then a soft-delete will be used to preserve
referential integrity. Otherwise a hard-delete will be performed.{{< /member-description >}}


</div>
