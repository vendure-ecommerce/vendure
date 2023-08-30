---
title: "ProductOptionService"
weight: 10
date: 2023-07-14T16:57:50.494Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# ProductOptionService
<div class="symbol">


# ProductOptionService

{{< generation-info sourceFile="packages/core/src/service/services/product-option.service.ts" sourceLine="32" packageName="@vendure/core">}}

Contains methods relating to <a href='/typescript-api/entities/product-option#productoption'>ProductOption</a> entities.

## Signature

```TypeScript
class ProductOptionService {
  constructor(connection: TransactionalConnection, translatableSaver: TranslatableSaver, customFieldRelationService: CustomFieldRelationService, eventBus: EventBus, translator: TranslatorService)
  findAll(ctx: RequestContext) => Promise<Array<Translated<ProductOption>>>;
  findOne(ctx: RequestContext, id: ID) => Promise<Translated<ProductOption> | undefined>;
  async create(ctx: RequestContext, group: ProductOptionGroup | ID, input: CreateGroupOptionInput | CreateProductOptionInput) => Promise<Translated<ProductOption>>;
  async update(ctx: RequestContext, input: UpdateProductOptionInput) => Promise<Translated<ProductOption>>;
  async delete(ctx: RequestContext, id: ID) => Promise<DeletionResponse>;
}
```
## Members

### constructor

{{< member-info kind="method" type="(connection: <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, translatableSaver: <a href='/typescript-api/service-helpers/translatable-saver#translatablesaver'>TranslatableSaver</a>, customFieldRelationService: CustomFieldRelationService, eventBus: <a href='/typescript-api/events/event-bus#eventbus'>EventBus</a>, translator: TranslatorService) => ProductOptionService"  >}}

{{< member-description >}}{{< /member-description >}}

### findAll

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;Array&#60;Translated&#60;<a href='/typescript-api/entities/product-option#productoption'>ProductOption</a>&#62;&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### findOne

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;Translated&#60;<a href='/typescript-api/entities/product-option#productoption'>ProductOption</a>&#62; | undefined&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### create

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, group: <a href='/typescript-api/entities/product-option-group#productoptiongroup'>ProductOptionGroup</a> | <a href='/typescript-api/common/id#id'>ID</a>, input: CreateGroupOptionInput | CreateProductOptionInput) => Promise&#60;Translated&#60;<a href='/typescript-api/entities/product-option#productoption'>ProductOption</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### update

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateProductOptionInput) => Promise&#60;Translated&#60;<a href='/typescript-api/entities/product-option#productoption'>ProductOption</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### delete

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;DeletionResponse&#62;"  >}}

{{< member-description >}}Deletes a ProductOption.

- If the ProductOption is used by any ProductVariants, the deletion will fail.
- If the ProductOption is used only by soft-deleted ProductVariants, the option will itself
  be soft-deleted.
- If the ProductOption is not used by any ProductVariant at all, it will be hard-deleted.{{< /member-description >}}


</div>
