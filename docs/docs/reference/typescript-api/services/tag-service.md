---
title: "TagService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## TagService

<GenerationInfo sourceFile="packages/core/src/service/services/tag.service.ts" sourceLine="24" packageName="@vendure/core" />

Contains methods relating to <a href='/reference/typescript-api/entities/tag#tag'>Tag</a> entities.

```ts title="Signature"
class TagService {
    constructor(connection: TransactionalConnection, listQueryBuilder: ListQueryBuilder)
    findAll(ctx: RequestContext, options?: ListQueryOptions<Tag>) => Promise<PaginatedList<Tag>>;
    findOne(ctx: RequestContext, tagId: ID) => Promise<Tag | undefined>;
    create(ctx: RequestContext, input: CreateTagInput) => ;
    update(ctx: RequestContext, input: UpdateTagInput) => ;
    delete(ctx: RequestContext, id: ID) => Promise<DeletionResponse>;
    valuesToTags(ctx: RequestContext, values: string[]) => Promise<Tag[]>;
    getTagsForEntity(ctx: RequestContext, entity: Type<VendureEntity & Taggable>, id: ID) => Promise<Tag[]>;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(connection: <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, listQueryBuilder: <a href='/reference/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>) => TagService`}   />


### findAll

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, options?: ListQueryOptions&#60;<a href='/reference/typescript-api/entities/tag#tag'>Tag</a>&#62;) => Promise&#60;<a href='/reference/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/reference/typescript-api/entities/tag#tag'>Tag</a>&#62;&#62;`}   />


### findOne

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, tagId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/reference/typescript-api/entities/tag#tag'>Tag</a> | undefined&#62;`}   />


### create

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: CreateTagInput) => `}   />


### update

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateTagInput) => `}   />


### delete

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;DeletionResponse&#62;`}   />


### valuesToTags

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, values: string[]) => Promise&#60;<a href='/reference/typescript-api/entities/tag#tag'>Tag</a>[]&#62;`}   />


### getTagsForEntity

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entity: Type&#60;<a href='/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a> &#38; <a href='/reference/typescript-api/entities/interfaces#taggable'>Taggable</a>&#62;, id: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/reference/typescript-api/entities/tag#tag'>Tag</a>[]&#62;`}   />




</div>
