---
title: "TaxCategoryService"
weight: 10
date: 2023-07-20T13:56:16.647Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## TaxCategoryService

<GenerationInfo sourceFile="packages/core/src/service/services/tax-category.service.ts" sourceLine="29" packageName="@vendure/core" />

Contains methods relating to <a href='/typescript-api/entities/tax-category#taxcategory'>TaxCategory</a> entities.

```ts title="Signature"
class TaxCategoryService {
  constructor(connection: TransactionalConnection, eventBus: EventBus, listQueryBuilder: ListQueryBuilder)
  findAll(ctx: RequestContext, options?: ListQueryOptions<TaxCategory>) => Promise<PaginatedList<TaxCategory>>;
  findOne(ctx: RequestContext, taxCategoryId: ID) => Promise<TaxCategory | undefined>;
  async create(ctx: RequestContext, input: CreateTaxCategoryInput) => Promise<TaxCategory>;
  async update(ctx: RequestContext, input: UpdateTaxCategoryInput) => Promise<TaxCategory>;
  async delete(ctx: RequestContext, id: ID) => Promise<DeletionResponse>;
}
```

### constructor

<MemberInfo kind="method" type="(connection: <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, eventBus: <a href='/typescript-api/events/event-bus#eventbus'>EventBus</a>, listQueryBuilder: <a href='/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>) => TaxCategoryService"   />


### findAll

<MemberInfo kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, options?: ListQueryOptions&#60;<a href='/typescript-api/entities/tax-category#taxcategory'>TaxCategory</a>&#62;) => Promise&#60;<a href='/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/typescript-api/entities/tax-category#taxcategory'>TaxCategory</a>&#62;&#62;"   />


### findOne

<MemberInfo kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, taxCategoryId: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/typescript-api/entities/tax-category#taxcategory'>TaxCategory</a> | undefined&#62;"   />


### create

<MemberInfo kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: CreateTaxCategoryInput) => Promise&#60;<a href='/typescript-api/entities/tax-category#taxcategory'>TaxCategory</a>&#62;"   />


### update

<MemberInfo kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateTaxCategoryInput) => Promise&#60;<a href='/typescript-api/entities/tax-category#taxcategory'>TaxCategory</a>&#62;"   />


### delete

<MemberInfo kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;DeletionResponse&#62;"   />


