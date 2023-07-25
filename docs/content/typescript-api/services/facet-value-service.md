---
title: "FacetValueService"
weight: 10
date: 2023-07-14T16:57:50.371Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# FacetValueService
<div class="symbol">


# FacetValueService

{{< generation-info sourceFile="packages/core/src/service/services/facet-value.service.ts" sourceLine="39" packageName="@vendure/core">}}

Contains methods relating to <a href='/typescript-api/entities/facet-value#facetvalue'>FacetValue</a> entities.

## Signature

```TypeScript
class FacetValueService {
  constructor(connection: TransactionalConnection, translatableSaver: TranslatableSaver, configService: ConfigService, customFieldRelationService: CustomFieldRelationService, channelService: ChannelService, eventBus: EventBus, translator: TranslatorService, listQueryBuilder: ListQueryBuilder)
  findAll(lang: LanguageCode) => Promise<Array<Translated<FacetValue>>>;
  findAll(ctx: RequestContext, lang: LanguageCode) => Promise<Array<Translated<FacetValue>>>;
  findAll(ctxOrLang: RequestContext | LanguageCode, lang?: LanguageCode) => Promise<Array<Translated<FacetValue>>>;
  findAllList(ctx: RequestContext, options?: ListQueryOptions<FacetValue>, relations?: RelationPaths<FacetValue>) => Promise<PaginatedList<Translated<FacetValue>>>;
  findOne(ctx: RequestContext, id: ID) => Promise<Translated<FacetValue> | undefined>;
  findByIds(ctx: RequestContext, ids: ID[]) => Promise<Array<Translated<FacetValue>>>;
  findByFacetId(ctx: RequestContext, id: ID) => Promise<Array<Translated<FacetValue>>>;
  async create(ctx: RequestContext, facet: Facet, input: CreateFacetValueInput | CreateFacetValueWithFacetInput) => Promise<Translated<FacetValue>>;
  async update(ctx: RequestContext, input: UpdateFacetValueInput) => Promise<Translated<FacetValue>>;
  async delete(ctx: RequestContext, id: ID, force: boolean = false) => Promise<DeletionResponse>;
  async checkFacetValueUsage(ctx: RequestContext, facetValueIds: ID[], channelId?: ID) => Promise<{ productCount: number; variantCount: number }>;
}
```
## Members

### constructor

{{< member-info kind="method" type="(connection: <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, translatableSaver: <a href='/typescript-api/service-helpers/translatable-saver#translatablesaver'>TranslatableSaver</a>, configService: ConfigService, customFieldRelationService: CustomFieldRelationService, channelService: <a href='/typescript-api/services/channel-service#channelservice'>ChannelService</a>, eventBus: <a href='/typescript-api/events/event-bus#eventbus'>EventBus</a>, translator: TranslatorService, listQueryBuilder: <a href='/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>) => FacetValueService"  >}}

{{< member-description >}}{{< /member-description >}}

### findAll

{{< member-info kind="method" type="(lang: <a href='/typescript-api/common/language-code#languagecode'>LanguageCode</a>) => Promise&#60;Array&#60;Translated&#60;<a href='/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>&#62;&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### findAll

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, lang: <a href='/typescript-api/common/language-code#languagecode'>LanguageCode</a>) => Promise&#60;Array&#60;Translated&#60;<a href='/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>&#62;&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### findAll

{{< member-info kind="method" type="(ctxOrLang: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a> | <a href='/typescript-api/common/language-code#languagecode'>LanguageCode</a>, lang?: <a href='/typescript-api/common/language-code#languagecode'>LanguageCode</a>) => Promise&#60;Array&#60;Translated&#60;<a href='/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>&#62;&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### findAllList

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, options?: ListQueryOptions&#60;<a href='/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>&#62;, relations?: RelationPaths&#60;<a href='/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>&#62;) => Promise&#60;<a href='/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;Translated&#60;<a href='/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>&#62;&#62;&#62;"  >}}

{{< member-description >}}Returns a PaginatedList of FacetValues.

TODO: in v2 this should replace the `findAll()` method.
A separate method was created just to avoid a breaking change in v1.9.{{< /member-description >}}

### findOne

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;Translated&#60;<a href='/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>&#62; | undefined&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### findByIds

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, ids: <a href='/typescript-api/common/id#id'>ID</a>[]) => Promise&#60;Array&#60;Translated&#60;<a href='/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>&#62;&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### findByFacetId

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;Array&#60;Translated&#60;<a href='/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>&#62;&#62;&#62;"  >}}

{{< member-description >}}Returns all FacetValues belonging to the Facet with the given id.{{< /member-description >}}

### create

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, facet: <a href='/typescript-api/entities/facet#facet'>Facet</a>, input: CreateFacetValueInput | CreateFacetValueWithFacetInput) => Promise&#60;Translated&#60;<a href='/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### update

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateFacetValueInput) => Promise&#60;Translated&#60;<a href='/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### delete

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/typescript-api/common/id#id'>ID</a>, force: boolean = false) => Promise&#60;DeletionResponse&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### checkFacetValueUsage

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, facetValueIds: <a href='/typescript-api/common/id#id'>ID</a>[], channelId?: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;{ productCount: number; variantCount: number }&#62;"  >}}

{{< member-description >}}Checks for usage of the given FacetValues in any Products or Variants, and returns the counts.{{< /member-description >}}


</div>
