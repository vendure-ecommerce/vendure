---
title: "ChannelService"
weight: 10
date: 2023-07-04T11:02:13.042Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# ChannelService
<div class="symbol">


# ChannelService

{{< generation-info sourceFile="packages/core/src/service/services/channel.service.ts" sourceLine="53" packageName="@vendure/core">}}

Contains methods relating to <a href='/typescript-api/entities/channel#channel'>Channel</a> entities.

## Signature

```TypeScript
class ChannelService {
  constructor(connection: TransactionalConnection, configService: ConfigService, globalSettingsService: GlobalSettingsService, customFieldRelationService: CustomFieldRelationService, eventBus: EventBus, listQueryBuilder: ListQueryBuilder)
  async assignToCurrentChannel(entity: T, ctx: RequestContext) => Promise<T>;
  async assignToChannels(ctx: RequestContext, entityType: Type<T>, entityId: ID, channelIds: ID[]) => Promise<T>;
  async removeFromChannels(ctx: RequestContext, entityType: Type<T>, entityId: ID, channelIds: ID[]) => Promise<T | undefined>;
  async getChannelFromToken(token: string) => Promise<Channel>;
  async getChannelFromToken(ctx: RequestContext, token: string) => Promise<Channel>;
  async getChannelFromToken(ctxOrToken: RequestContext | string, token?: string) => Promise<Channel>;
  async getDefaultChannel(ctx?: RequestContext) => Promise<Channel>;
  findAll(ctx: RequestContext, options?: ListQueryOptions<Channel>, relations?: RelationPaths<Channel>) => Promise<PaginatedList<Channel>>;
  findOne(ctx: RequestContext, id: ID) => Promise<Channel | undefined>;
  async create(ctx: RequestContext, input: CreateChannelInput) => Promise<ErrorResultUnion<CreateChannelResult, Channel>>;
  async update(ctx: RequestContext, input: UpdateChannelInput) => Promise<ErrorResultUnion<UpdateChannelResult, Channel>>;
  async delete(ctx: RequestContext, id: ID) => Promise<DeletionResponse>;
  public isChannelAware(entity: VendureEntity) => entity is VendureEntity & ChannelAware;
}
```
## Members

### constructor

{{< member-info kind="method" type="(connection: <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, configService: ConfigService, globalSettingsService: <a href='/typescript-api/services/global-settings-service#globalsettingsservice'>GlobalSettingsService</a>, customFieldRelationService: CustomFieldRelationService, eventBus: <a href='/typescript-api/events/event-bus#eventbus'>EventBus</a>, listQueryBuilder: <a href='/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>) => ChannelService"  >}}

{{< member-description >}}{{< /member-description >}}

### assignToCurrentChannel

{{< member-info kind="method" type="(entity: T, ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;T&#62;"  >}}

{{< member-description >}}Assigns a ChannelAware entity to the default Channel as well as any channel
specified in the RequestContext.{{< /member-description >}}

### assignToChannels

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entityType: Type&#60;T&#62;, entityId: <a href='/typescript-api/common/id#id'>ID</a>, channelIds: <a href='/typescript-api/common/id#id'>ID</a>[]) => Promise&#60;T&#62;"  >}}

{{< member-description >}}Assigns the entity to the given Channels and saves.{{< /member-description >}}

### removeFromChannels

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entityType: Type&#60;T&#62;, entityId: <a href='/typescript-api/common/id#id'>ID</a>, channelIds: <a href='/typescript-api/common/id#id'>ID</a>[]) => Promise&#60;T | undefined&#62;"  >}}

{{< member-description >}}Removes the entity from the given Channels and saves.{{< /member-description >}}

### getChannelFromToken

{{< member-info kind="method" type="(token: string) => Promise&#60;<a href='/typescript-api/entities/channel#channel'>Channel</a>&#62;"  >}}

{{< member-description >}}Given a channel token, returns the corresponding Channel if it exists, else will throw
a <a href='/typescript-api/errors/error-types#channelnotfounderror'>ChannelNotFoundError</a>.{{< /member-description >}}

### getChannelFromToken

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, token: string) => Promise&#60;<a href='/typescript-api/entities/channel#channel'>Channel</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### getChannelFromToken

{{< member-info kind="method" type="(ctxOrToken: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a> | string, token?: string) => Promise&#60;<a href='/typescript-api/entities/channel#channel'>Channel</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### getDefaultChannel

{{< member-info kind="method" type="(ctx?: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;<a href='/typescript-api/entities/channel#channel'>Channel</a>&#62;"  >}}

{{< member-description >}}Returns the default Channel.{{< /member-description >}}

### findAll

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, options?: ListQueryOptions&#60;<a href='/typescript-api/entities/channel#channel'>Channel</a>&#62;, relations?: RelationPaths&#60;<a href='/typescript-api/entities/channel#channel'>Channel</a>&#62;) => Promise&#60;<a href='/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/typescript-api/entities/channel#channel'>Channel</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### findOne

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/typescript-api/entities/channel#channel'>Channel</a> | undefined&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### create

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: CreateChannelInput) => Promise&#60;ErrorResultUnion&#60;CreateChannelResult, <a href='/typescript-api/entities/channel#channel'>Channel</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### update

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateChannelInput) => Promise&#60;ErrorResultUnion&#60;UpdateChannelResult, <a href='/typescript-api/entities/channel#channel'>Channel</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### delete

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;DeletionResponse&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### isChannelAware

{{< member-info kind="method" type="(entity: <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>) => entity is <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a> &#38; <a href='/typescript-api/entities/interfaces#channelaware'>ChannelAware</a>"  >}}

{{< member-description >}}Type guard method which returns true if the given entity is an
instance of a class which implements the <a href='/typescript-api/entities/interfaces#channelaware'>ChannelAware</a> interface.{{< /member-description >}}


</div>
