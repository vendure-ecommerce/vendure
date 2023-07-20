---
title: "TagService"
weight: 10
date: 2023-07-14T16:57:50.609Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# TagService
<div class="symbol">


# TagService

{{< generation-info sourceFile="packages/core/src/service/services/tag.service.ts" sourceLine="24" packageName="@vendure/core">}}

Contains methods relating to <a href='/typescript-api/entities/tag#tag'>Tag</a> entities.

## Signature

```TypeScript
class TagService {
  constructor(connection: TransactionalConnection, listQueryBuilder: ListQueryBuilder)
  findAll(ctx: RequestContext, options?: ListQueryOptions<Tag>) => Promise<PaginatedList<Tag>>;
  findOne(ctx: RequestContext, tagId: ID) => Promise<Tag | undefined>;
  create(ctx: RequestContext, input: CreateTagInput) => ;
  async update(ctx: RequestContext, input: UpdateTagInput) => ;
  async delete(ctx: RequestContext, id: ID) => Promise<DeletionResponse>;
  async valuesToTags(ctx: RequestContext, values: string[]) => Promise<Tag[]>;
  getTagsForEntity(ctx: RequestContext, entity: Type<VendureEntity & Taggable>, id: ID) => Promise<Tag[]>;
}
```
## Members

### constructor

{{< member-info kind="method" type="(connection: <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, listQueryBuilder: <a href='/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>) => TagService"  >}}

{{< member-description >}}{{< /member-description >}}

### findAll

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, options?: ListQueryOptions&#60;<a href='/typescript-api/entities/tag#tag'>Tag</a>&#62;) => Promise&#60;<a href='/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/typescript-api/entities/tag#tag'>Tag</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### findOne

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, tagId: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/typescript-api/entities/tag#tag'>Tag</a> | undefined&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### create

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: CreateTagInput) => "  >}}

{{< member-description >}}{{< /member-description >}}

### update

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateTagInput) => "  >}}

{{< member-description >}}{{< /member-description >}}

### delete

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;DeletionResponse&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### valuesToTags

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, values: string[]) => Promise&#60;<a href='/typescript-api/entities/tag#tag'>Tag</a>[]&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### getTagsForEntity

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: Type&#60;<a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a> &#38; <a href='/typescript-api/entities/interfaces#taggable'>Taggable</a>&#62;, id: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/typescript-api/entities/tag#tag'>Tag</a>[]&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
