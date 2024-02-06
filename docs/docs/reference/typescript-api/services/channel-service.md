---
title: "ChannelService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ChannelService

<GenerationInfo sourceFile="packages/core/src/service/services/channel.service.ts" sourceLine="54" packageName="@vendure/core" />

Contains methods relating to <a href='/reference/typescript-api/entities/channel#channel'>Channel</a> entities.

```ts title="Signature"
class ChannelService {
    constructor(connection: TransactionalConnection, configService: ConfigService, globalSettingsService: GlobalSettingsService, customFieldRelationService: CustomFieldRelationService, eventBus: EventBus, listQueryBuilder: ListQueryBuilder)
    assignToCurrentChannel(entity: T, ctx: RequestContext) => Promise<T>;
    assignToChannels(ctx: RequestContext, entityType: Type<T>, entityId: ID, channelIds: ID[]) => Promise<T>;
    removeFromChannels(ctx: RequestContext, entityType: Type<T>, entityId: ID, channelIds: ID[]) => Promise<T | undefined>;
    getChannelFromToken(token: string) => Promise<Channel>;
    getChannelFromToken(ctx: RequestContext, token: string) => Promise<Channel>;
    getChannelFromToken(ctxOrToken: RequestContext | string, token?: string) => Promise<Channel>;
    getDefaultChannel(ctx?: RequestContext) => Promise<Channel>;
    findAll(ctx: RequestContext, options?: ListQueryOptions<Channel>, relations?: RelationPaths<Channel>) => Promise<PaginatedList<Channel>>;
    findOne(ctx: RequestContext, id: ID) => Promise<Channel | undefined>;
    create(ctx: RequestContext, input: CreateChannelInput) => Promise<ErrorResultUnion<CreateChannelResult, Channel>>;
    update(ctx: RequestContext, input: UpdateChannelInput) => Promise<ErrorResultUnion<UpdateChannelResult, Channel>>;
    delete(ctx: RequestContext, id: ID) => Promise<DeletionResponse>;
    isChannelAware(entity: VendureEntity) => entity is VendureEntity & ChannelAware;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(connection: <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, configService: ConfigService, globalSettingsService: <a href='/reference/typescript-api/services/global-settings-service#globalsettingsservice'>GlobalSettingsService</a>, customFieldRelationService: CustomFieldRelationService, eventBus: <a href='/reference/typescript-api/events/event-bus#eventbus'>EventBus</a>, listQueryBuilder: <a href='/reference/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>) => ChannelService`}   />


### assignToCurrentChannel

<MemberInfo kind="method" type={`(entity: T, ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;T&#62;`}   />

Assigns a ChannelAware entity to the default Channel as well as any channel
specified in the RequestContext.
### assignToChannels

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entityType: Type&#60;T&#62;, entityId: <a href='/reference/typescript-api/common/id#id'>ID</a>, channelIds: <a href='/reference/typescript-api/common/id#id'>ID</a>[]) => Promise&#60;T&#62;`}   />

Assigns the entity to the given Channels and saves.
### removeFromChannels

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, entityType: Type&#60;T&#62;, entityId: <a href='/reference/typescript-api/common/id#id'>ID</a>, channelIds: <a href='/reference/typescript-api/common/id#id'>ID</a>[]) => Promise&#60;T | undefined&#62;`}   />

Removes the entity from the given Channels and saves.
### getChannelFromToken

<MemberInfo kind="method" type={`(token: string) => Promise&#60;<a href='/reference/typescript-api/entities/channel#channel'>Channel</a>&#62;`}   />

Given a channel token, returns the corresponding Channel if it exists, else will throw
a <a href='/reference/typescript-api/errors/error-types#channelnotfounderror'>ChannelNotFoundError</a>.
### getChannelFromToken

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, token: string) => Promise&#60;<a href='/reference/typescript-api/entities/channel#channel'>Channel</a>&#62;`}   />


### getChannelFromToken

<MemberInfo kind="method" type={`(ctxOrToken: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a> | string, token?: string) => Promise&#60;<a href='/reference/typescript-api/entities/channel#channel'>Channel</a>&#62;`}   />


### getDefaultChannel

<MemberInfo kind="method" type={`(ctx?: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;<a href='/reference/typescript-api/entities/channel#channel'>Channel</a>&#62;`}   />

Returns the default Channel.
### findAll

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, options?: ListQueryOptions&#60;<a href='/reference/typescript-api/entities/channel#channel'>Channel</a>&#62;, relations?: RelationPaths&#60;<a href='/reference/typescript-api/entities/channel#channel'>Channel</a>&#62;) => Promise&#60;<a href='/reference/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/reference/typescript-api/entities/channel#channel'>Channel</a>&#62;&#62;`}   />


### findOne

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/reference/typescript-api/entities/channel#channel'>Channel</a> | undefined&#62;`}   />


### create

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: CreateChannelInput) => Promise&#60;<a href='/reference/typescript-api/errors/error-result-union#errorresultunion'>ErrorResultUnion</a>&#60;CreateChannelResult, <a href='/reference/typescript-api/entities/channel#channel'>Channel</a>&#62;&#62;`}   />


### update

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateChannelInput) => Promise&#60;<a href='/reference/typescript-api/errors/error-result-union#errorresultunion'>ErrorResultUnion</a>&#60;UpdateChannelResult, <a href='/reference/typescript-api/entities/channel#channel'>Channel</a>&#62;&#62;`}   />


### delete

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;DeletionResponse&#62;`}   />


### isChannelAware

<MemberInfo kind="method" type={`(entity: <a href='/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>) => entity is <a href='/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a> &#38; <a href='/reference/typescript-api/entities/interfaces#channelaware'>ChannelAware</a>`}   />

Type guard method which returns true if the given entity is an
instance of a class which implements the <a href='/reference/typescript-api/entities/interfaces#channelaware'>ChannelAware</a> interface.


</div>
