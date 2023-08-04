---
title: "ProvinceService"
weight: 10
date: 2023-07-14T16:57:50.551Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# ProvinceService
<div class="symbol">


# ProvinceService

{{< generation-info sourceFile="packages/core/src/service/services/province.service.ts" sourceLine="31" packageName="@vendure/core">}}

Contains methods relating to <a href='/typescript-api/entities/province#province'>Province</a> entities.

## Signature

```TypeScript
class ProvinceService {
  constructor(connection: TransactionalConnection, listQueryBuilder: ListQueryBuilder, translatableSaver: TranslatableSaver, eventBus: EventBus, translator: TranslatorService)
  findAll(ctx: RequestContext, options?: ListQueryOptions<Province>, relations: RelationPaths<Province> = []) => Promise<PaginatedList<Translated<Province>>>;
  findOne(ctx: RequestContext, provinceId: ID, relations: RelationPaths<Province> = []) => Promise<Translated<Province> | undefined>;
  async create(ctx: RequestContext, input: CreateProvinceInput) => Promise<Translated<Province>>;
  async update(ctx: RequestContext, input: UpdateProvinceInput) => Promise<Translated<Province>>;
  async delete(ctx: RequestContext, id: ID) => Promise<DeletionResponse>;
}
```
## Members

### constructor

{{< member-info kind="method" type="(connection: <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, listQueryBuilder: <a href='/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>, translatableSaver: <a href='/typescript-api/service-helpers/translatable-saver#translatablesaver'>TranslatableSaver</a>, eventBus: <a href='/typescript-api/events/event-bus#eventbus'>EventBus</a>, translator: TranslatorService) => ProvinceService"  >}}

{{< member-description >}}{{< /member-description >}}

### findAll

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, options?: ListQueryOptions&#60;<a href='/typescript-api/entities/province#province'>Province</a>&#62;, relations: RelationPaths&#60;<a href='/typescript-api/entities/province#province'>Province</a>&#62; = []) => Promise&#60;<a href='/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;Translated&#60;<a href='/typescript-api/entities/province#province'>Province</a>&#62;&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### findOne

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, provinceId: <a href='/typescript-api/common/id#id'>ID</a>, relations: RelationPaths&#60;<a href='/typescript-api/entities/province#province'>Province</a>&#62; = []) => Promise&#60;Translated&#60;<a href='/typescript-api/entities/province#province'>Province</a>&#62; | undefined&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### create

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: CreateProvinceInput) => Promise&#60;Translated&#60;<a href='/typescript-api/entities/province#province'>Province</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### update

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateProvinceInput) => Promise&#60;Translated&#60;<a href='/typescript-api/entities/province#province'>Province</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### delete

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;DeletionResponse&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
