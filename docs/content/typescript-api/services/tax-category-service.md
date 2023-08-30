---
title: "TaxCategoryService"
weight: 10
date: 2023-07-14T16:57:50.615Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# TaxCategoryService
<div class="symbol">


# TaxCategoryService

{{< generation-info sourceFile="packages/core/src/service/services/tax-category.service.ts" sourceLine="29" packageName="@vendure/core">}}

Contains methods relating to <a href='/typescript-api/entities/tax-category#taxcategory'>TaxCategory</a> entities.

## Signature

```TypeScript
class TaxCategoryService {
  constructor(connection: TransactionalConnection, eventBus: EventBus, listQueryBuilder: ListQueryBuilder)
  findAll(ctx: RequestContext, options?: ListQueryOptions<TaxCategory>) => Promise<PaginatedList<TaxCategory>>;
  findOne(ctx: RequestContext, taxCategoryId: ID) => Promise<TaxCategory | undefined>;
  async create(ctx: RequestContext, input: CreateTaxCategoryInput) => Promise<TaxCategory>;
  async update(ctx: RequestContext, input: UpdateTaxCategoryInput) => Promise<TaxCategory>;
  async delete(ctx: RequestContext, id: ID) => Promise<DeletionResponse>;
}
```
## Members

### constructor

{{< member-info kind="method" type="(connection: <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, eventBus: <a href='/typescript-api/events/event-bus#eventbus'>EventBus</a>, listQueryBuilder: <a href='/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>) => TaxCategoryService"  >}}

{{< member-description >}}{{< /member-description >}}

### findAll

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, options?: ListQueryOptions&#60;<a href='/typescript-api/entities/tax-category#taxcategory'>TaxCategory</a>&#62;) => Promise&#60;<a href='/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/typescript-api/entities/tax-category#taxcategory'>TaxCategory</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### findOne

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, taxCategoryId: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/typescript-api/entities/tax-category#taxcategory'>TaxCategory</a> | undefined&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### create

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: CreateTaxCategoryInput) => Promise&#60;<a href='/typescript-api/entities/tax-category#taxcategory'>TaxCategory</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### update

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateTaxCategoryInput) => Promise&#60;<a href='/typescript-api/entities/tax-category#taxcategory'>TaxCategory</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### delete

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;DeletionResponse&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
