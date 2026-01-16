---
title: "FacetService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## FacetService

<GenerationInfo sourceFile="packages/core/src/service/services/facet.service.ts" sourceLine="45" packageName="@vendure/core" />

Contains methods relating to <a href='/reference/typescript-api/entities/facet#facet'>Facet</a> entities.

```ts title="Signature"
class FacetService {
    constructor(connection: TransactionalConnection, facetValueService: FacetValueService, translatableSaver: TranslatableSaver, listQueryBuilder: ListQueryBuilder, configService: ConfigService, channelService: ChannelService, customFieldRelationService: CustomFieldRelationService, eventBus: EventBus, translator: TranslatorService, roleService: RoleService)
    findAll(ctx: RequestContext, options?: ListQueryOptions<Facet>, relations?: RelationPaths<Facet>) => Promise<PaginatedList<Translated<Facet>>>;
    findOne(ctx: RequestContext, facetId: ID, relations?: RelationPaths<Facet>) => Promise<Translated<Facet> | undefined>;
    findByCode(facetCode: string, lang: LanguageCode) => Promise<Translated<Facet> | undefined>;
    findByCode(ctx: RequestContext, facetCode: string, lang: LanguageCode) => Promise<Translated<Facet> | undefined>;
    findByCode(ctxOrFacetCode: RequestContext | string, facetCodeOrLang: string | LanguageCode, lang?: LanguageCode) => Promise<Translated<Facet> | undefined>;
    findByFacetValueId(ctx: RequestContext, id: ID) => Promise<Translated<Facet> | undefined>;
    create(ctx: RequestContext, input: CreateFacetInput) => Promise<Translated<Facet>>;
    update(ctx: RequestContext, input: UpdateFacetInput) => Promise<Translated<Facet>>;
    delete(ctx: RequestContext, id: ID, force: boolean = false) => Promise<DeletionResponse>;
    assignFacetsToChannel(ctx: RequestContext, input: AssignFacetsToChannelInput) => Promise<Array<Translated<Facet>>>;
    removeFacetsFromChannel(ctx: RequestContext, input: RemoveFacetsFromChannelInput) => Promise<Array<ErrorResultUnion<RemoveFacetFromChannelResult, Facet>>>;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(connection: <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, facetValueService: <a href='/reference/typescript-api/services/facet-value-service#facetvalueservice'>FacetValueService</a>, translatableSaver: <a href='/reference/typescript-api/service-helpers/translatable-saver#translatablesaver'>TranslatableSaver</a>, listQueryBuilder: <a href='/reference/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>, configService: ConfigService, channelService: <a href='/reference/typescript-api/services/channel-service#channelservice'>ChannelService</a>, customFieldRelationService: CustomFieldRelationService, eventBus: <a href='/reference/typescript-api/events/event-bus#eventbus'>EventBus</a>, translator: <a href='/reference/typescript-api/service-helpers/translator-service#translatorservice'>TranslatorService</a>, roleService: <a href='/reference/typescript-api/services/role-service#roleservice'>RoleService</a>) => FacetService`}   />


### findAll

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, options?: ListQueryOptions&#60;<a href='/reference/typescript-api/entities/facet#facet'>Facet</a>&#62;, relations?: RelationPaths&#60;<a href='/reference/typescript-api/entities/facet#facet'>Facet</a>&#62;) => Promise&#60;<a href='/reference/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;Translated&#60;<a href='/reference/typescript-api/entities/facet#facet'>Facet</a>&#62;&#62;&#62;`}   />


### findOne

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, facetId: <a href='/reference/typescript-api/common/id#id'>ID</a>, relations?: RelationPaths&#60;<a href='/reference/typescript-api/entities/facet#facet'>Facet</a>&#62;) => Promise&#60;Translated&#60;<a href='/reference/typescript-api/entities/facet#facet'>Facet</a>&#62; | undefined&#62;`}   />


### findByCode

<MemberInfo kind="method" type={`(facetCode: string, lang: <a href='/reference/typescript-api/common/language-code#languagecode'>LanguageCode</a>) => Promise&#60;Translated&#60;<a href='/reference/typescript-api/entities/facet#facet'>Facet</a>&#62; | undefined&#62;`}   />


### findByCode

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, facetCode: string, lang: <a href='/reference/typescript-api/common/language-code#languagecode'>LanguageCode</a>) => Promise&#60;Translated&#60;<a href='/reference/typescript-api/entities/facet#facet'>Facet</a>&#62; | undefined&#62;`}   />


### findByCode

<MemberInfo kind="method" type={`(ctxOrFacetCode: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a> | string, facetCodeOrLang: string | <a href='/reference/typescript-api/common/language-code#languagecode'>LanguageCode</a>, lang?: <a href='/reference/typescript-api/common/language-code#languagecode'>LanguageCode</a>) => Promise&#60;Translated&#60;<a href='/reference/typescript-api/entities/facet#facet'>Facet</a>&#62; | undefined&#62;`}   />


### findByFacetValueId

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;Translated&#60;<a href='/reference/typescript-api/entities/facet#facet'>Facet</a>&#62; | undefined&#62;`}   />

Returns the Facet which contains the given FacetValue id.
### create

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: CreateFacetInput) => Promise&#60;Translated&#60;<a href='/reference/typescript-api/entities/facet#facet'>Facet</a>&#62;&#62;`}   />


### update

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateFacetInput) => Promise&#60;Translated&#60;<a href='/reference/typescript-api/entities/facet#facet'>Facet</a>&#62;&#62;`}   />


### delete

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/reference/typescript-api/common/id#id'>ID</a>, force: boolean = false) => Promise&#60;DeletionResponse&#62;`}   />


### assignFacetsToChannel

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: AssignFacetsToChannelInput) => Promise&#60;Array&#60;Translated&#60;<a href='/reference/typescript-api/entities/facet#facet'>Facet</a>&#62;&#62;&#62;`}   />

Assigns Facets to the specified Channel
### removeFacetsFromChannel

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: RemoveFacetsFromChannelInput) => Promise&#60;Array&#60;<a href='/reference/typescript-api/errors/error-result-union#errorresultunion'>ErrorResultUnion</a>&#60;RemoveFacetFromChannelResult, <a href='/reference/typescript-api/entities/facet#facet'>Facet</a>&#62;&#62;&#62;`}   />

Remove Facets from the specified Channel


</div>
