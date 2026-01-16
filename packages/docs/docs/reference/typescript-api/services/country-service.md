---
title: "CountryService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## CountryService

<GenerationInfo sourceFile="packages/core/src/service/services/country.service.ts" sourceLine="33" packageName="@vendure/core" />

Contains methods relating to <a href='/reference/typescript-api/entities/country#country'>Country</a> entities.

```ts title="Signature"
class CountryService {
    constructor(connection: TransactionalConnection, listQueryBuilder: ListQueryBuilder, translatableSaver: TranslatableSaver, eventBus: EventBus, translator: TranslatorService)
    findAll(ctx: RequestContext, options?: ListQueryOptions<Country>, relations: RelationPaths<Country> = []) => Promise<PaginatedList<Translated<Country>>>;
    findOne(ctx: RequestContext, countryId: ID, relations: RelationPaths<Country> = []) => Promise<Translated<Country> | undefined>;
    findAllAvailable(ctx: RequestContext) => Promise<Array<Translated<Country>>>;
    findOneByCode(ctx: RequestContext, countryCode: string) => Promise<Translated<Country>>;
    create(ctx: RequestContext, input: CreateCountryInput) => Promise<Translated<Country>>;
    update(ctx: RequestContext, input: UpdateCountryInput) => Promise<Translated<Country>>;
    delete(ctx: RequestContext, id: ID) => Promise<DeletionResponse>;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(connection: <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, listQueryBuilder: <a href='/reference/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>, translatableSaver: <a href='/reference/typescript-api/service-helpers/translatable-saver#translatablesaver'>TranslatableSaver</a>, eventBus: <a href='/reference/typescript-api/events/event-bus#eventbus'>EventBus</a>, translator: <a href='/reference/typescript-api/service-helpers/translator-service#translatorservice'>TranslatorService</a>) => CountryService`}   />


### findAll

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, options?: ListQueryOptions&#60;<a href='/reference/typescript-api/entities/country#country'>Country</a>&#62;, relations: RelationPaths&#60;<a href='/reference/typescript-api/entities/country#country'>Country</a>&#62; = []) => Promise&#60;<a href='/reference/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;Translated&#60;<a href='/reference/typescript-api/entities/country#country'>Country</a>&#62;&#62;&#62;`}   />


### findOne

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, countryId: <a href='/reference/typescript-api/common/id#id'>ID</a>, relations: RelationPaths&#60;<a href='/reference/typescript-api/entities/country#country'>Country</a>&#62; = []) => Promise&#60;Translated&#60;<a href='/reference/typescript-api/entities/country#country'>Country</a>&#62; | undefined&#62;`}   />


### findAllAvailable

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;Array&#60;Translated&#60;<a href='/reference/typescript-api/entities/country#country'>Country</a>&#62;&#62;&#62;`}   />

Returns an array of enabled Countries, intended for use in a public-facing (ie. Shop) API.
### findOneByCode

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, countryCode: string) => Promise&#60;Translated&#60;<a href='/reference/typescript-api/entities/country#country'>Country</a>&#62;&#62;`}   />

Returns a Country based on its ISO country code.
### create

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: CreateCountryInput) => Promise&#60;Translated&#60;<a href='/reference/typescript-api/entities/country#country'>Country</a>&#62;&#62;`}   />


### update

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateCountryInput) => Promise&#60;Translated&#60;<a href='/reference/typescript-api/entities/country#country'>Country</a>&#62;&#62;`}   />


### delete

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;DeletionResponse&#62;`}   />




</div>
