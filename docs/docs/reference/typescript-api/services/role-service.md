---
title: "RoleService"
weight: 10
date: 2023-07-20T13:56:16.526Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## RoleService

<GenerationInfo sourceFile="packages/core/src/service/services/role.service.ts" sourceLine="51" packageName="@vendure/core" />

Contains methods relating to <a href='/typescript-api/entities/role#role'>Role</a> entities.

```ts title="Signature"
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

### constructor

<MemberInfo kind="method" type="(connection: <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, channelService: <a href='/typescript-api/services/channel-service#channelservice'>ChannelService</a>, listQueryBuilder: <a href='/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>, configService: ConfigService, eventBus: <a href='/typescript-api/events/event-bus#eventbus'>EventBus</a>) => RoleService"   />


### initRoles

<MemberInfo kind="method" type="() => "   />


### findAll

<MemberInfo kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, options?: ListQueryOptions&#60;<a href='/typescript-api/entities/role#role'>Role</a>&#62;, relations?: RelationPaths&#60;<a href='/typescript-api/entities/role#role'>Role</a>&#62;) => Promise&#60;<a href='/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/typescript-api/entities/role#role'>Role</a>&#62;&#62;"   />


### findOne

<MemberInfo kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, roleId: <a href='/typescript-api/common/id#id'>ID</a>, relations?: RelationPaths&#60;<a href='/typescript-api/entities/role#role'>Role</a>&#62;) => Promise&#60;<a href='/typescript-api/entities/role#role'>Role</a> | undefined&#62;"   />


### getChannelsForRole

<MemberInfo kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, roleId: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/typescript-api/entities/channel#channel'>Channel</a>[]&#62;"   />


### getSuperAdminRole

<MemberInfo kind="method" type="(ctx?: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;<a href='/typescript-api/entities/role#role'>Role</a>&#62;"   />

Returns the special SuperAdmin Role, which always exists in Vendure.
### getCustomerRole

<MemberInfo kind="method" type="(ctx?: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;<a href='/typescript-api/entities/role#role'>Role</a>&#62;"   />

Returns the special Customer Role, which always exists in Vendure.
### getAllPermissions

<MemberInfo kind="method" type="() => string[]"   />

Returns all the valid Permission values
### userHasPermissionOnChannel

<MemberInfo kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, channelId: <a href='/typescript-api/common/id#id'>ID</a>, permission: <a href='/typescript-api/common/permission#permission'>Permission</a>) => Promise&#60;boolean&#62;"   />

Returns true if the User has the specified permission on that Channel
### userHasAnyPermissionsOnChannel

<MemberInfo kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, channelId: <a href='/typescript-api/common/id#id'>ID</a>, permissions: <a href='/typescript-api/common/permission#permission'>Permission</a>[]) => Promise&#60;boolean&#62;"   />

Returns true if the User has any of the specified permissions on that Channel
### userHasAllPermissionsOnChannel

<MemberInfo kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, channelId: <a href='/typescript-api/common/id#id'>ID</a>, permissions: <a href='/typescript-api/common/permission#permission'>Permission</a>[]) => Promise&#60;boolean&#62;"   />

Returns true if the User has all the specified permissions on that Channel
### create

<MemberInfo kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: CreateRoleInput) => Promise&#60;<a href='/typescript-api/entities/role#role'>Role</a>&#62;"   />


### update

<MemberInfo kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateRoleInput) => Promise&#60;<a href='/typescript-api/entities/role#role'>Role</a>&#62;"   />


### delete

<MemberInfo kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;DeletionResponse&#62;"   />


### assignRoleToChannel

<MemberInfo kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, roleId: <a href='/typescript-api/common/id#id'>ID</a>, channelId: <a href='/typescript-api/common/id#id'>ID</a>) => "   />


