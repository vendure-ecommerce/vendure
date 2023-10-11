---
title: "SellerService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## SellerService

<GenerationInfo sourceFile="packages/core/src/service/services/seller.service.ts" sourceLine="26" packageName="@vendure/core" />

Contains methods relating to <a href='/reference/typescript-api/entities/seller#seller'>Seller</a> entities.

```ts title="Signature"
class SellerService {
    constructor(connection: TransactionalConnection, listQueryBuilder: ListQueryBuilder, eventBus: EventBus, customFieldRelationService: CustomFieldRelationService)
    initSellers() => ;
    findAll(ctx: RequestContext, options?: ListQueryOptions<Seller>) => Promise<PaginatedList<Seller>>;
    findOne(ctx: RequestContext, sellerId: ID) => Promise<Seller | undefined>;
    create(ctx: RequestContext, input: CreateSellerInput) => ;
    update(ctx: RequestContext, input: UpdateSellerInput) => ;
    delete(ctx: RequestContext, id: ID) => Promise<DeletionResponse>;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(connection: <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, listQueryBuilder: <a href='/reference/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>, eventBus: <a href='/reference/typescript-api/events/event-bus#eventbus'>EventBus</a>, customFieldRelationService: CustomFieldRelationService) => SellerService`}   />


### initSellers

<MemberInfo kind="method" type={`() => `}   />


### findAll

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, options?: ListQueryOptions&#60;<a href='/reference/typescript-api/entities/seller#seller'>Seller</a>&#62;) => Promise&#60;<a href='/reference/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/reference/typescript-api/entities/seller#seller'>Seller</a>&#62;&#62;`}   />


### findOne

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, sellerId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/reference/typescript-api/entities/seller#seller'>Seller</a> | undefined&#62;`}   />


### create

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: CreateSellerInput) => `}   />


### update

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateSellerInput) => `}   />


### delete

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;DeletionResponse&#62;`}   />




</div>
