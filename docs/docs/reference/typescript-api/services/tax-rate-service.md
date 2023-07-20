---
title: "TaxRateService"
weight: 10
date: 2023-07-14T16:57:50.620Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# TaxRateService
<div class="symbol">


# TaxRateService

{{< generation-info sourceFile="packages/core/src/service/services/tax-rate.service.ts" sourceLine="34" packageName="@vendure/core">}}

Contains methods relating to <a href='/typescript-api/entities/tax-rate#taxrate'>TaxRate</a> entities.

## Signature

```TypeScript
class TaxRateService {
  constructor(connection: TransactionalConnection, eventBus: EventBus, listQueryBuilder: ListQueryBuilder, configService: ConfigService)
  findAll(ctx: RequestContext, options?: ListQueryOptions<TaxRate>, relations?: RelationPaths<TaxRate>) => Promise<PaginatedList<TaxRate>>;
  findOne(ctx: RequestContext, taxRateId: ID, relations?: RelationPaths<TaxRate>) => Promise<TaxRate | undefined>;
  async create(ctx: RequestContext, input: CreateTaxRateInput) => Promise<TaxRate>;
  async update(ctx: RequestContext, input: UpdateTaxRateInput) => Promise<TaxRate>;
  async delete(ctx: RequestContext, id: ID) => Promise<DeletionResponse>;
  async getApplicableTaxRate(ctx: RequestContext, zone: Zone, taxCategory: TaxCategory) => Promise<TaxRate>;
}
```
## Members

### constructor

{{< member-info kind="method" type="(connection: <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, eventBus: <a href='/typescript-api/events/event-bus#eventbus'>EventBus</a>, listQueryBuilder: <a href='/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>, configService: ConfigService) => TaxRateService"  >}}

{{< member-description >}}{{< /member-description >}}

### findAll

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, options?: ListQueryOptions&#60;<a href='/typescript-api/entities/tax-rate#taxrate'>TaxRate</a>&#62;, relations?: RelationPaths&#60;<a href='/typescript-api/entities/tax-rate#taxrate'>TaxRate</a>&#62;) => Promise&#60;<a href='/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/typescript-api/entities/tax-rate#taxrate'>TaxRate</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### findOne

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, taxRateId: <a href='/typescript-api/common/id#id'>ID</a>, relations?: RelationPaths&#60;<a href='/typescript-api/entities/tax-rate#taxrate'>TaxRate</a>&#62;) => Promise&#60;<a href='/typescript-api/entities/tax-rate#taxrate'>TaxRate</a> | undefined&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### create

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: CreateTaxRateInput) => Promise&#60;<a href='/typescript-api/entities/tax-rate#taxrate'>TaxRate</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### update

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateTaxRateInput) => Promise&#60;<a href='/typescript-api/entities/tax-rate#taxrate'>TaxRate</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### delete

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;DeletionResponse&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### getApplicableTaxRate

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, zone: <a href='/typescript-api/entities/zone#zone'>Zone</a>, taxCategory: <a href='/typescript-api/entities/tax-category#taxcategory'>TaxCategory</a>) => Promise&#60;<a href='/typescript-api/entities/tax-rate#taxrate'>TaxRate</a>&#62;"  >}}

{{< member-description >}}Returns the applicable TaxRate based on the specified Zone and TaxCategory. Used when calculating Order
prices.{{< /member-description >}}


</div>
