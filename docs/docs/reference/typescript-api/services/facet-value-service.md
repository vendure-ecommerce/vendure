---
title: "FacetValueService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## FacetValueService

<GenerationInfo sourceFile="packages/core/src/service/services/facet-value.service.ts" sourceLine="39" packageName="@vendure/core" />

Contains methods relating to <a href='/reference/typescript-api/entities/facet-value#facetvalue'>FacetValue</a> entities.

```ts title="Signature"
class FacetValueService {
    constructor(connection: TransactionalConnection, translatableSaver: TranslatableSaver, configService: ConfigService, customFieldRelationService: CustomFieldRelationService, channelService: ChannelService, eventBus: EventBus, translator: TranslatorService, listQueryBuilder: ListQueryBuilder)
    findAll(lang: LanguageCode) => Promise<Array<Translated<FacetValue>>>;
    findAll(ctx: RequestContext, lang: LanguageCode) => Promise<Array<Translated<FacetValue>>>;
    findAll(ctxOrLang: RequestContext | LanguageCode, lang?: LanguageCode) => Promise<Array<Translated<FacetValue>>>;
    findAllList(ctx: RequestContext, options?: ListQueryOptions<FacetValue>, relations?: RelationPaths<FacetValue>) => Promise<PaginatedList<Translated<FacetValue>>>;
    findOne(ctx: RequestContext, id: ID) => Promise<Translated<FacetValue> | undefined>;
    findByIds(ctx: RequestContext, ids: ID[]) => Promise<Array<Translated<FacetValue>>>;
    findByFacetId(ctx: RequestContext, id: ID) => Promise<Array<Translated<FacetValue>>>;
    findByFacetIdList(ctx: RequestContext, id: ID, options?: ListQueryOptions<FacetValue>, relations?: RelationPaths<FacetValue>) => Promise<PaginatedList<Translated<FacetValue>>>;
    create(ctx: RequestContext, facet: Facet, input: CreateFacetValueInput | CreateFacetValueWithFacetInput) => Promise<Translated<FacetValue>>;
    update(ctx: RequestContext, input: UpdateFacetValueInput) => Promise<Translated<FacetValue>>;
    delete(ctx: RequestContext, id: ID, force: boolean = false) => Promise<DeletionResponse>;
    checkFacetValueUsage(ctx: RequestContext, facetValueIds: ID[], channelId?: ID) => Promise<{ productCount: number; variantCount: number }>;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(connection: <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, translatableSaver: <a href='/reference/typescript-api/service-helpers/translatable-saver#translatablesaver'>TranslatableSaver</a>, configService: ConfigService, customFieldRelationService: CustomFieldRelationService, channelService: <a href='/reference/typescript-api/services/channel-service#channelservice'>ChannelService</a>, eventBus: <a href='/reference/typescript-api/events/event-bus#eventbus'>EventBus</a>, translator: <a href='/reference/typescript-api/service-helpers/translator-service#translatorservice'>TranslatorService</a>, listQueryBuilder: <a href='/reference/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>) => FacetValueService`}   />


### findAll

<MemberInfo kind="method" type={`(lang: <a href='/reference/typescript-api/common/language-code#languagecode'>LanguageCode</a>) => Promise&#60;Array&#60;Translated&#60;<a href='/reference/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>&#62;&#62;&#62;`}   />


### findAll

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, lang: <a href='/reference/typescript-api/common/language-code#languagecode'>LanguageCode</a>) => Promise&#60;Array&#60;Translated&#60;<a href='/reference/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>&#62;&#62;&#62;`}   />


### findAll

<MemberInfo kind="method" type={`(ctxOrLang: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a> | <a href='/reference/typescript-api/common/language-code#languagecode'>LanguageCode</a>, lang?: <a href='/reference/typescript-api/common/language-code#languagecode'>LanguageCode</a>) => Promise&#60;Array&#60;Translated&#60;<a href='/reference/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>&#62;&#62;&#62;`}   />


### findAllList

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, options?: ListQueryOptions&#60;<a href='/reference/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>&#62;, relations?: RelationPaths&#60;<a href='/reference/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>&#62;) => Promise&#60;<a href='/reference/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;Translated&#60;<a href='/reference/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>&#62;&#62;&#62;`}   />

Returns a PaginatedList of FacetValues.

TODO: in v2 this should replace the `findAll()` method.
A separate method was created just to avoid a breaking change in v1.9.
### findOne

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;Translated&#60;<a href='/reference/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>&#62; | undefined&#62;`}   />


### findByIds

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, ids: <a href='/reference/typescript-api/common/id#id'>ID</a>[]) => Promise&#60;Array&#60;Translated&#60;<a href='/reference/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>&#62;&#62;&#62;`}   />


### findByFacetId

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;Array&#60;Translated&#60;<a href='/reference/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>&#62;&#62;&#62;`}   />

Returns all FacetValues belonging to the Facet with the given id.
### findByFacetIdList

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/reference/typescript-api/common/id#id'>ID</a>, options?: ListQueryOptions&#60;<a href='/reference/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>&#62;, relations?: RelationPaths&#60;<a href='/reference/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>&#62;) => Promise&#60;<a href='/reference/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;Translated&#60;<a href='/reference/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>&#62;&#62;&#62;`}   />

Returns all FacetValues belonging to the Facet with the given id.
### create

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, facet: <a href='/reference/typescript-api/entities/facet#facet'>Facet</a>, input: CreateFacetValueInput | CreateFacetValueWithFacetInput) => Promise&#60;Translated&#60;<a href='/reference/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>&#62;&#62;`}   />


### update

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateFacetValueInput) => Promise&#60;Translated&#60;<a href='/reference/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>&#62;&#62;`}   />


### delete

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/reference/typescript-api/common/id#id'>ID</a>, force: boolean = false) => Promise&#60;DeletionResponse&#62;`}   />


### checkFacetValueUsage

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, facetValueIds: <a href='/reference/typescript-api/common/id#id'>ID</a>[], channelId?: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;{ productCount: number; variantCount: number }&#62;`}   />

Checks for usage of the given FacetValues in any Products or Variants, and returns the counts.


</div>
