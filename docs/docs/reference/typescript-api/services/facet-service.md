---
title: "FacetService"
weight: 10
date: 2023-07-14T16:57:50.382Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# FacetService
<div class="symbol">


# FacetService

{{< generation-info sourceFile="packages/core/src/service/services/facet.service.ts" sourceLine="45" packageName="@vendure/core">}}

Contains methods relating to <a href='/typescript-api/entities/facet#facet'>Facet</a> entities.

## Signature

```TypeScript
class FacetService {
  constructor(connection: TransactionalConnection, facetValueService: FacetValueService, translatableSaver: TranslatableSaver, listQueryBuilder: ListQueryBuilder, configService: ConfigService, channelService: ChannelService, customFieldRelationService: CustomFieldRelationService, eventBus: EventBus, translator: TranslatorService, roleService: RoleService)
  findAll(ctx: RequestContext, options?: ListQueryOptions<Facet>, relations?: RelationPaths<Facet>) => Promise<PaginatedList<Translated<Facet>>>;
  findOne(ctx: RequestContext, facetId: ID, relations?: RelationPaths<Facet>) => Promise<Translated<Facet> | undefined>;
  findByCode(facetCode: string, lang: LanguageCode) => Promise<Translated<Facet> | undefined>;
  findByCode(ctx: RequestContext, facetCode: string, lang: LanguageCode) => Promise<Translated<Facet> | undefined>;
  findByCode(ctxOrFacetCode: RequestContext | string, facetCodeOrLang: string | LanguageCode, lang?: LanguageCode) => Promise<Translated<Facet> | undefined>;
  async findByFacetValueId(ctx: RequestContext, id: ID) => Promise<Translated<Facet> | undefined>;
  async create(ctx: RequestContext, input: CreateFacetInput) => Promise<Translated<Facet>>;
  async update(ctx: RequestContext, input: UpdateFacetInput) => Promise<Translated<Facet>>;
  async delete(ctx: RequestContext, id: ID, force: boolean = false) => Promise<DeletionResponse>;
  async assignFacetsToChannel(ctx: RequestContext, input: AssignFacetsToChannelInput) => Promise<Array<Translated<Facet>>>;
  async removeFacetsFromChannel(ctx: RequestContext, input: RemoveFacetsFromChannelInput) => Promise<Array<ErrorResultUnion<RemoveFacetFromChannelResult, Facet>>>;
}
```
## Members

### constructor

{{< member-info kind="method" type="(connection: <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, facetValueService: <a href='/typescript-api/services/facet-value-service#facetvalueservice'>FacetValueService</a>, translatableSaver: <a href='/typescript-api/service-helpers/translatable-saver#translatablesaver'>TranslatableSaver</a>, listQueryBuilder: <a href='/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>, configService: ConfigService, channelService: <a href='/typescript-api/services/channel-service#channelservice'>ChannelService</a>, customFieldRelationService: CustomFieldRelationService, eventBus: <a href='/typescript-api/events/event-bus#eventbus'>EventBus</a>, translator: TranslatorService, roleService: <a href='/typescript-api/services/role-service#roleservice'>RoleService</a>) => FacetService"  >}}

{{< member-description >}}{{< /member-description >}}

### findAll

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, options?: ListQueryOptions&#60;<a href='/typescript-api/entities/facet#facet'>Facet</a>&#62;, relations?: RelationPaths&#60;<a href='/typescript-api/entities/facet#facet'>Facet</a>&#62;) => Promise&#60;<a href='/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;Translated&#60;<a href='/typescript-api/entities/facet#facet'>Facet</a>&#62;&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### findOne

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, facetId: <a href='/typescript-api/common/id#id'>ID</a>, relations?: RelationPaths&#60;<a href='/typescript-api/entities/facet#facet'>Facet</a>&#62;) => Promise&#60;Translated&#60;<a href='/typescript-api/entities/facet#facet'>Facet</a>&#62; | undefined&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### findByCode

{{< member-info kind="method" type="(facetCode: string, lang: <a href='/typescript-api/common/language-code#languagecode'>LanguageCode</a>) => Promise&#60;Translated&#60;<a href='/typescript-api/entities/facet#facet'>Facet</a>&#62; | undefined&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### findByCode

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, facetCode: string, lang: <a href='/typescript-api/common/language-code#languagecode'>LanguageCode</a>) => Promise&#60;Translated&#60;<a href='/typescript-api/entities/facet#facet'>Facet</a>&#62; | undefined&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### findByCode

{{< member-info kind="method" type="(ctxOrFacetCode: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a> | string, facetCodeOrLang: string | <a href='/typescript-api/common/language-code#languagecode'>LanguageCode</a>, lang?: <a href='/typescript-api/common/language-code#languagecode'>LanguageCode</a>) => Promise&#60;Translated&#60;<a href='/typescript-api/entities/facet#facet'>Facet</a>&#62; | undefined&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### findByFacetValueId

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;Translated&#60;<a href='/typescript-api/entities/facet#facet'>Facet</a>&#62; | undefined&#62;"  >}}

{{< member-description >}}Returns the Facet which contains the given FacetValue id.{{< /member-description >}}

### create

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: CreateFacetInput) => Promise&#60;Translated&#60;<a href='/typescript-api/entities/facet#facet'>Facet</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### update

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateFacetInput) => Promise&#60;Translated&#60;<a href='/typescript-api/entities/facet#facet'>Facet</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### delete

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/typescript-api/common/id#id'>ID</a>, force: boolean = false) => Promise&#60;DeletionResponse&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### assignFacetsToChannel

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: AssignFacetsToChannelInput) => Promise&#60;Array&#60;Translated&#60;<a href='/typescript-api/entities/facet#facet'>Facet</a>&#62;&#62;&#62;"  >}}

{{< member-description >}}Assigns Facets to the specified Channel{{< /member-description >}}

### removeFacetsFromChannel

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: RemoveFacetsFromChannelInput) => Promise&#60;Array&#60;ErrorResultUnion&#60;RemoveFacetFromChannelResult, <a href='/typescript-api/entities/facet#facet'>Facet</a>&#62;&#62;&#62;"  >}}

{{< member-description >}}Remove Facets from the specified Channel{{< /member-description >}}


</div>
