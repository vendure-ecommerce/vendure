---
title: "AdministratorService"
weight: 10
date: 2023-07-14T16:57:50.270Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# AdministratorService
<div class="symbol">


# AdministratorService

{{< generation-info sourceFile="packages/core/src/service/services/administrator.service.ts" sourceLine="40" packageName="@vendure/core">}}

Contains methods relating to <a href='/typescript-api/entities/administrator#administrator'>Administrator</a> entities.

## Signature

```TypeScript
class AdministratorService {
  constructor(connection: TransactionalConnection, configService: ConfigService, listQueryBuilder: ListQueryBuilder, passwordCipher: PasswordCipher, userService: UserService, roleService: RoleService, customFieldRelationService: CustomFieldRelationService, eventBus: EventBus, requestContextService: RequestContextService)
  findAll(ctx: RequestContext, options?: ListQueryOptions<Administrator>, relations?: RelationPaths<Administrator>) => Promise<PaginatedList<Administrator>>;
  findOne(ctx: RequestContext, administratorId: ID, relations?: RelationPaths<Administrator>) => Promise<Administrator | undefined>;
  findOneByUserId(ctx: RequestContext, userId: ID, relations?: RelationPaths<Administrator>) => Promise<Administrator | undefined>;
  async create(ctx: RequestContext, input: CreateAdministratorInput) => Promise<Administrator>;
  async update(ctx: RequestContext, input: UpdateAdministratorInput) => Promise<Administrator>;
  async assignRole(ctx: RequestContext, administratorId: ID, roleId: ID) => Promise<Administrator>;
  async softDelete(ctx: RequestContext, id: ID) => ;
}
```
## Members

### constructor

{{< member-info kind="method" type="(connection: <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, configService: ConfigService, listQueryBuilder: <a href='/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>, passwordCipher: PasswordCipher, userService: <a href='/typescript-api/services/user-service#userservice'>UserService</a>, roleService: <a href='/typescript-api/services/role-service#roleservice'>RoleService</a>, customFieldRelationService: CustomFieldRelationService, eventBus: <a href='/typescript-api/events/event-bus#eventbus'>EventBus</a>, requestContextService: <a href='/typescript-api/request/request-context-service#requestcontextservice'>RequestContextService</a>) => AdministratorService"  >}}

{{< member-description >}}{{< /member-description >}}

### findAll

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, options?: ListQueryOptions&#60;<a href='/typescript-api/entities/administrator#administrator'>Administrator</a>&#62;, relations?: RelationPaths&#60;<a href='/typescript-api/entities/administrator#administrator'>Administrator</a>&#62;) => Promise&#60;<a href='/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/typescript-api/entities/administrator#administrator'>Administrator</a>&#62;&#62;"  >}}

{{< member-description >}}Get a paginated list of Administrators.{{< /member-description >}}

### findOne

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, administratorId: <a href='/typescript-api/common/id#id'>ID</a>, relations?: RelationPaths&#60;<a href='/typescript-api/entities/administrator#administrator'>Administrator</a>&#62;) => Promise&#60;<a href='/typescript-api/entities/administrator#administrator'>Administrator</a> | undefined&#62;"  >}}

{{< member-description >}}Get an Administrator by id.{{< /member-description >}}

### findOneByUserId

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, userId: <a href='/typescript-api/common/id#id'>ID</a>, relations?: RelationPaths&#60;<a href='/typescript-api/entities/administrator#administrator'>Administrator</a>&#62;) => Promise&#60;<a href='/typescript-api/entities/administrator#administrator'>Administrator</a> | undefined&#62;"  >}}

{{< member-description >}}Get an Administrator based on the User id.{{< /member-description >}}

### create

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: CreateAdministratorInput) => Promise&#60;<a href='/typescript-api/entities/administrator#administrator'>Administrator</a>&#62;"  >}}

{{< member-description >}}Create a new Administrator.{{< /member-description >}}

### update

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateAdministratorInput) => Promise&#60;<a href='/typescript-api/entities/administrator#administrator'>Administrator</a>&#62;"  >}}

{{< member-description >}}Update an existing Administrator.{{< /member-description >}}

### assignRole

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, administratorId: <a href='/typescript-api/common/id#id'>ID</a>, roleId: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/typescript-api/entities/administrator#administrator'>Administrator</a>&#62;"  >}}

{{< member-description >}}Assigns a Role to the Administrator's User entity.{{< /member-description >}}

### softDelete

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/typescript-api/common/id#id'>ID</a>) => "  >}}

{{< member-description >}}Soft deletes an Administrator (sets the `deletedAt` field).{{< /member-description >}}


</div>
