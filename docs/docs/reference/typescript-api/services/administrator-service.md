---
title: "AdministratorService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## AdministratorService

<GenerationInfo sourceFile="packages/core/src/service/services/administrator.service.ts" sourceLine="40" packageName="@vendure/core" />

Contains methods relating to <a href='/reference/typescript-api/entities/administrator#administrator'>Administrator</a> entities.

```ts title="Signature"
class AdministratorService {
    constructor(connection: TransactionalConnection, configService: ConfigService, listQueryBuilder: ListQueryBuilder, passwordCipher: PasswordCipher, userService: UserService, roleService: RoleService, customFieldRelationService: CustomFieldRelationService, eventBus: EventBus, requestContextService: RequestContextService)
    findAll(ctx: RequestContext, options?: ListQueryOptions<Administrator>, relations?: RelationPaths<Administrator>) => Promise<PaginatedList<Administrator>>;
    findOne(ctx: RequestContext, administratorId: ID, relations?: RelationPaths<Administrator>) => Promise<Administrator | undefined>;
    findOneByUserId(ctx: RequestContext, userId: ID, relations?: RelationPaths<Administrator>) => Promise<Administrator | undefined>;
    create(ctx: RequestContext, input: CreateAdministratorInput) => Promise<Administrator>;
    update(ctx: RequestContext, input: UpdateAdministratorInput) => Promise<Administrator>;
    assignRole(ctx: RequestContext, administratorId: ID, roleId: ID) => Promise<Administrator>;
    softDelete(ctx: RequestContext, id: ID) => ;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(connection: <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, configService: ConfigService, listQueryBuilder: <a href='/reference/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>, passwordCipher: PasswordCipher, userService: <a href='/reference/typescript-api/services/user-service#userservice'>UserService</a>, roleService: <a href='/reference/typescript-api/services/role-service#roleservice'>RoleService</a>, customFieldRelationService: CustomFieldRelationService, eventBus: <a href='/reference/typescript-api/events/event-bus#eventbus'>EventBus</a>, requestContextService: <a href='/reference/typescript-api/request/request-context-service#requestcontextservice'>RequestContextService</a>) => AdministratorService`}   />


### findAll

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, options?: ListQueryOptions&#60;<a href='/reference/typescript-api/entities/administrator#administrator'>Administrator</a>&#62;, relations?: RelationPaths&#60;<a href='/reference/typescript-api/entities/administrator#administrator'>Administrator</a>&#62;) => Promise&#60;<a href='/reference/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/reference/typescript-api/entities/administrator#administrator'>Administrator</a>&#62;&#62;`}   />

Get a paginated list of Administrators.
### findOne

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, administratorId: <a href='/reference/typescript-api/common/id#id'>ID</a>, relations?: RelationPaths&#60;<a href='/reference/typescript-api/entities/administrator#administrator'>Administrator</a>&#62;) => Promise&#60;<a href='/reference/typescript-api/entities/administrator#administrator'>Administrator</a> | undefined&#62;`}   />

Get an Administrator by id.
### findOneByUserId

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, userId: <a href='/reference/typescript-api/common/id#id'>ID</a>, relations?: RelationPaths&#60;<a href='/reference/typescript-api/entities/administrator#administrator'>Administrator</a>&#62;) => Promise&#60;<a href='/reference/typescript-api/entities/administrator#administrator'>Administrator</a> | undefined&#62;`}   />

Get an Administrator based on the User id.
### create

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: CreateAdministratorInput) => Promise&#60;<a href='/reference/typescript-api/entities/administrator#administrator'>Administrator</a>&#62;`}   />

Create a new Administrator.
### update

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateAdministratorInput) => Promise&#60;<a href='/reference/typescript-api/entities/administrator#administrator'>Administrator</a>&#62;`}   />

Update an existing Administrator.
### assignRole

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, administratorId: <a href='/reference/typescript-api/common/id#id'>ID</a>, roleId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/reference/typescript-api/entities/administrator#administrator'>Administrator</a>&#62;`}   />

Assigns a Role to the Administrator's User entity.
### softDelete

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/reference/typescript-api/common/id#id'>ID</a>) => `}   />

Soft deletes an Administrator (sets the `deletedAt` field).


</div>
