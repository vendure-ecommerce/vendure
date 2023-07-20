---
title: "RoleService"
weight: 10
date: 2023-07-14T16:57:50.556Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# RoleService
<div class="symbol">


# RoleService

{{< generation-info sourceFile="packages/core/src/service/services/role.service.ts" sourceLine="51" packageName="@vendure/core">}}

Contains methods relating to <a href='/typescript-api/entities/role#role'>Role</a> entities.

## Signature

```TypeScript
class RoleService {
  constructor(connection: TransactionalConnection, channelService: ChannelService, listQueryBuilder: ListQueryBuilder, configService: ConfigService, eventBus: EventBus)
  async initRoles() => ;
  findAll(ctx: RequestContext, options?: ListQueryOptions<Role>, relations?: RelationPaths<Role>) => Promise<PaginatedList<Role>>;
  findOne(ctx: RequestContext, roleId: ID, relations?: RelationPaths<Role>) => Promise<Role | undefined>;
  getChannelsForRole(ctx: RequestContext, roleId: ID) => Promise<Channel[]>;
  getSuperAdminRole(ctx?: RequestContext) => Promise<Role>;
  getCustomerRole(ctx?: RequestContext) => Promise<Role>;
  getAllPermissions() => string[];
  async userHasPermissionOnChannel(ctx: RequestContext, channelId: ID, permission: Permission) => Promise<boolean>;
  async userHasAnyPermissionsOnChannel(ctx: RequestContext, channelId: ID, permissions: Permission[]) => Promise<boolean>;
  async userHasAllPermissionsOnChannel(ctx: RequestContext, channelId: ID, permissions: Permission[]) => Promise<boolean>;
  async create(ctx: RequestContext, input: CreateRoleInput) => Promise<Role>;
  async update(ctx: RequestContext, input: UpdateRoleInput) => Promise<Role>;
  async delete(ctx: RequestContext, id: ID) => Promise<DeletionResponse>;
  async assignRoleToChannel(ctx: RequestContext, roleId: ID, channelId: ID) => ;
}
```
## Members

### constructor

{{< member-info kind="method" type="(connection: <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, channelService: <a href='/typescript-api/services/channel-service#channelservice'>ChannelService</a>, listQueryBuilder: <a href='/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>, configService: ConfigService, eventBus: <a href='/typescript-api/events/event-bus#eventbus'>EventBus</a>) => RoleService"  >}}

{{< member-description >}}{{< /member-description >}}

### initRoles

{{< member-info kind="method" type="() => "  >}}

{{< member-description >}}{{< /member-description >}}

### findAll

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, options?: ListQueryOptions&#60;<a href='/typescript-api/entities/role#role'>Role</a>&#62;, relations?: RelationPaths&#60;<a href='/typescript-api/entities/role#role'>Role</a>&#62;) => Promise&#60;<a href='/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/typescript-api/entities/role#role'>Role</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### findOne

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, roleId: <a href='/typescript-api/common/id#id'>ID</a>, relations?: RelationPaths&#60;<a href='/typescript-api/entities/role#role'>Role</a>&#62;) => Promise&#60;<a href='/typescript-api/entities/role#role'>Role</a> | undefined&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### getChannelsForRole

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, roleId: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/typescript-api/entities/channel#channel'>Channel</a>[]&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### getSuperAdminRole

{{< member-info kind="method" type="(ctx?: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;<a href='/typescript-api/entities/role#role'>Role</a>&#62;"  >}}

{{< member-description >}}Returns the special SuperAdmin Role, which always exists in Vendure.{{< /member-description >}}

### getCustomerRole

{{< member-info kind="method" type="(ctx?: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;<a href='/typescript-api/entities/role#role'>Role</a>&#62;"  >}}

{{< member-description >}}Returns the special Customer Role, which always exists in Vendure.{{< /member-description >}}

### getAllPermissions

{{< member-info kind="method" type="() => string[]"  >}}

{{< member-description >}}Returns all the valid Permission values{{< /member-description >}}

### userHasPermissionOnChannel

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, channelId: <a href='/typescript-api/common/id#id'>ID</a>, permission: <a href='/typescript-api/common/permission#permission'>Permission</a>) => Promise&#60;boolean&#62;"  >}}

{{< member-description >}}Returns true if the User has the specified permission on that Channel{{< /member-description >}}

### userHasAnyPermissionsOnChannel

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, channelId: <a href='/typescript-api/common/id#id'>ID</a>, permissions: <a href='/typescript-api/common/permission#permission'>Permission</a>[]) => Promise&#60;boolean&#62;"  >}}

{{< member-description >}}Returns true if the User has any of the specified permissions on that Channel{{< /member-description >}}

### userHasAllPermissionsOnChannel

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, channelId: <a href='/typescript-api/common/id#id'>ID</a>, permissions: <a href='/typescript-api/common/permission#permission'>Permission</a>[]) => Promise&#60;boolean&#62;"  >}}

{{< member-description >}}Returns true if the User has all the specified permissions on that Channel{{< /member-description >}}

### create

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: CreateRoleInput) => Promise&#60;<a href='/typescript-api/entities/role#role'>Role</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### update

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateRoleInput) => Promise&#60;<a href='/typescript-api/entities/role#role'>Role</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### delete

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;DeletionResponse&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### assignRoleToChannel

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, roleId: <a href='/typescript-api/common/id#id'>ID</a>, channelId: <a href='/typescript-api/common/id#id'>ID</a>) => "  >}}

{{< member-description >}}{{< /member-description >}}


</div>
