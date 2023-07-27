---
title: "CountryService"
weight: 10
date: 2023-07-14T16:57:50.332Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# CountryService
<div class="symbol">


# CountryService

{{< generation-info sourceFile="packages/core/src/service/services/country.service.ts" sourceLine="33" packageName="@vendure/core">}}

Contains methods relating to <a href='/typescript-api/entities/country#country'>Country</a> entities.

## Signature

```TypeScript
class CountryService {
  constructor(connection: TransactionalConnection, listQueryBuilder: ListQueryBuilder, translatableSaver: TranslatableSaver, eventBus: EventBus, translator: TranslatorService)
  findAll(ctx: RequestContext, options?: ListQueryOptions<Country>, relations: RelationPaths<Country> = []) => Promise<PaginatedList<Translated<Country>>>;
  findOne(ctx: RequestContext, countryId: ID, relations: RelationPaths<Country> = []) => Promise<Translated<Country> | undefined>;
  findAllAvailable(ctx: RequestContext) => Promise<Array<Translated<Country>>>;
  async findOneByCode(ctx: RequestContext, countryCode: string) => Promise<Translated<Country>>;
  async create(ctx: RequestContext, input: CreateCountryInput) => Promise<Translated<Country>>;
  async update(ctx: RequestContext, input: UpdateCountryInput) => Promise<Translated<Country>>;
  async delete(ctx: RequestContext, id: ID) => Promise<DeletionResponse>;
}
```
## Members

### constructor

{{< member-info kind="method" type="(connection: <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, listQueryBuilder: <a href='/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>, translatableSaver: <a href='/typescript-api/service-helpers/translatable-saver#translatablesaver'>TranslatableSaver</a>, eventBus: <a href='/typescript-api/events/event-bus#eventbus'>EventBus</a>, translator: TranslatorService) => CountryService"  >}}

{{< member-description >}}{{< /member-description >}}

### findAll

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, options?: ListQueryOptions&#60;<a href='/typescript-api/entities/country#country'>Country</a>&#62;, relations: RelationPaths&#60;<a href='/typescript-api/entities/country#country'>Country</a>&#62; = []) => Promise&#60;<a href='/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;Translated&#60;<a href='/typescript-api/entities/country#country'>Country</a>&#62;&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### findOne

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, countryId: <a href='/typescript-api/common/id#id'>ID</a>, relations: RelationPaths&#60;<a href='/typescript-api/entities/country#country'>Country</a>&#62; = []) => Promise&#60;Translated&#60;<a href='/typescript-api/entities/country#country'>Country</a>&#62; | undefined&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### findAllAvailable

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;Array&#60;Translated&#60;<a href='/typescript-api/entities/country#country'>Country</a>&#62;&#62;&#62;"  >}}

{{< member-description >}}Returns an array of enabled Countries, intended for use in a public-facing (ie. Shop) API.{{< /member-description >}}

### findOneByCode

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, countryCode: string) => Promise&#60;Translated&#60;<a href='/typescript-api/entities/country#country'>Country</a>&#62;&#62;"  >}}

{{< member-description >}}Returns a Country based on its ISO country code.{{< /member-description >}}

### create

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: CreateCountryInput) => Promise&#60;Translated&#60;<a href='/typescript-api/entities/country#country'>Country</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### update

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateCountryInput) => Promise&#60;Translated&#60;<a href='/typescript-api/entities/country#country'>Country</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### delete

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;DeletionResponse&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
