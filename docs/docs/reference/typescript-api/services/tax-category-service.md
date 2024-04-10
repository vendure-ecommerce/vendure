---
title: "TaxCategoryService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## TaxCategoryService

<GenerationInfo sourceFile="packages/core/src/service/services/tax-category.service.ts" sourceLine="28" packageName="@vendure/core" />

Contains methods relating to <a href='/reference/typescript-api/entities/tax-category#taxcategory'>TaxCategory</a> entities.

```ts title="Signature"
class TaxCategoryService {
    constructor(connection: TransactionalConnection, eventBus: EventBus, listQueryBuilder: ListQueryBuilder)
    findAll(ctx: RequestContext, options?: ListQueryOptions<TaxCategory>) => Promise<PaginatedList<TaxCategory>>;
    findOne(ctx: RequestContext, taxCategoryId: ID) => Promise<TaxCategory | undefined>;
    create(ctx: RequestContext, input: CreateTaxCategoryInput) => Promise<TaxCategory>;
    update(ctx: RequestContext, input: UpdateTaxCategoryInput) => Promise<TaxCategory>;
    delete(ctx: RequestContext, id: ID) => Promise<DeletionResponse>;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(connection: <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, eventBus: <a href='/reference/typescript-api/events/event-bus#eventbus'>EventBus</a>, listQueryBuilder: <a href='/reference/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>) => TaxCategoryService`}   />


### findAll

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, options?: ListQueryOptions&#60;<a href='/reference/typescript-api/entities/tax-category#taxcategory'>TaxCategory</a>&#62;) => Promise&#60;<a href='/reference/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/reference/typescript-api/entities/tax-category#taxcategory'>TaxCategory</a>&#62;&#62;`}   />


### findOne

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, taxCategoryId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/reference/typescript-api/entities/tax-category#taxcategory'>TaxCategory</a> | undefined&#62;`}   />


### create

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: CreateTaxCategoryInput) => Promise&#60;<a href='/reference/typescript-api/entities/tax-category#taxcategory'>TaxCategory</a>&#62;`}   />


### update

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateTaxCategoryInput) => Promise&#60;<a href='/reference/typescript-api/entities/tax-category#taxcategory'>TaxCategory</a>&#62;`}   />


### delete

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;DeletionResponse&#62;`}   />




</div>
