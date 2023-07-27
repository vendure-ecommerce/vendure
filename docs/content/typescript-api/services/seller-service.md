---
title: "SellerService"
weight: 10
date: 2023-07-14T16:57:50.570Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# SellerService
<div class="symbol">


# SellerService

{{< generation-info sourceFile="packages/core/src/service/services/seller.service.ts" sourceLine="26" packageName="@vendure/core">}}

Contains methods relating to <a href='/typescript-api/entities/seller#seller'>Seller</a> entities.

## Signature

```TypeScript
class SellerService {
  constructor(connection: TransactionalConnection, listQueryBuilder: ListQueryBuilder, eventBus: EventBus, customFieldRelationService: CustomFieldRelationService)
  async initSellers() => ;
  findAll(ctx: RequestContext, options?: ListQueryOptions<Seller>) => Promise<PaginatedList<Seller>>;
  findOne(ctx: RequestContext, sellerId: ID) => Promise<Seller | undefined>;
  async create(ctx: RequestContext, input: CreateSellerInput) => ;
  async update(ctx: RequestContext, input: UpdateSellerInput) => ;
  async delete(ctx: RequestContext, id: ID) => Promise<DeletionResponse>;
}
```
## Members

### constructor

{{< member-info kind="method" type="(connection: <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, listQueryBuilder: <a href='/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>, eventBus: <a href='/typescript-api/events/event-bus#eventbus'>EventBus</a>, customFieldRelationService: CustomFieldRelationService) => SellerService"  >}}

{{< member-description >}}{{< /member-description >}}

### initSellers

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}{{< /member-description >}}

### findAll

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, options?: ListQueryOptions&#60;<a href='/typescript-api/entities/seller#seller'>Seller</a>&#62;) => Promise&#60;<a href='/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/typescript-api/entities/seller#seller'>Seller</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### findOne

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, sellerId: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/typescript-api/entities/seller#seller'>Seller</a> | undefined&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### create

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: CreateSellerInput) => "  >}}

{{< member-description >}}{{< /member-description >}}

### update

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateSellerInput) => "  >}}

{{< member-description >}}{{< /member-description >}}

### delete

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;DeletionResponse&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
