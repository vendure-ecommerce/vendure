---
title: "ProvinceService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ProvinceService

<GenerationInfo sourceFile="packages/core/src/service/services/province.service.ts" sourceLine="31" packageName="@vendure/core" />

Contains methods relating to <a href='/reference/typescript-api/entities/province#province'>Province</a> entities.

```ts title="Signature"
class ProvinceService {
    constructor(connection: TransactionalConnection, listQueryBuilder: ListQueryBuilder, translatableSaver: TranslatableSaver, eventBus: EventBus, translator: TranslatorService)
    findAll(ctx: RequestContext, options?: ListQueryOptions<Province>, relations: RelationPaths<Province> = []) => Promise<PaginatedList<Translated<Province>>>;
    findOne(ctx: RequestContext, provinceId: ID, relations: RelationPaths<Province> = []) => Promise<Translated<Province> | undefined>;
    create(ctx: RequestContext, input: CreateProvinceInput) => Promise<Translated<Province>>;
    update(ctx: RequestContext, input: UpdateProvinceInput) => Promise<Translated<Province>>;
    delete(ctx: RequestContext, id: ID) => Promise<DeletionResponse>;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(connection: <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, listQueryBuilder: <a href='/reference/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>, translatableSaver: <a href='/reference/typescript-api/service-helpers/translatable-saver#translatablesaver'>TranslatableSaver</a>, eventBus: <a href='/reference/typescript-api/events/event-bus#eventbus'>EventBus</a>, translator: <a href='/reference/typescript-api/service-helpers/translator-service#translatorservice'>TranslatorService</a>) => ProvinceService`}   />


### findAll

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, options?: ListQueryOptions&#60;<a href='/reference/typescript-api/entities/province#province'>Province</a>&#62;, relations: RelationPaths&#60;<a href='/reference/typescript-api/entities/province#province'>Province</a>&#62; = []) => Promise&#60;<a href='/reference/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;Translated&#60;<a href='/reference/typescript-api/entities/province#province'>Province</a>&#62;&#62;&#62;`}   />


### findOne

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, provinceId: <a href='/reference/typescript-api/common/id#id'>ID</a>, relations: RelationPaths&#60;<a href='/reference/typescript-api/entities/province#province'>Province</a>&#62; = []) => Promise&#60;Translated&#60;<a href='/reference/typescript-api/entities/province#province'>Province</a>&#62; | undefined&#62;`}   />


### create

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: CreateProvinceInput) => Promise&#60;Translated&#60;<a href='/reference/typescript-api/entities/province#province'>Province</a>&#62;&#62;`}   />


### update

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateProvinceInput) => Promise&#60;Translated&#60;<a href='/reference/typescript-api/entities/province#province'>Province</a>&#62;&#62;`}   />


### delete

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;DeletionResponse&#62;`}   />




</div>
