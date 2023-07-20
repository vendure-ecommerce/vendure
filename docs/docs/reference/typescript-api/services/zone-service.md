---
title: "ZoneService"
weight: 10
date: 2023-07-20T13:56:16.704Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ZoneService

<GenerationInfo sourceFile="packages/core/src/service/services/zone.service.ts" sourceLine="36" packageName="@vendure/core" />

Contains methods relating to <a href='/typescript-api/entities/zone#zone'>Zone</a> entities.

```ts title="Signature"
class ZoneService {
  constructor(connection: TransactionalConnection, configService: ConfigService, eventBus: EventBus, translator: TranslatorService, listQueryBuilder: ListQueryBuilder)
  async findAll(ctx: RequestContext, options?: ListQueryOptions<Zone>) => Promise<PaginatedList<Zone>>;
  findOne(ctx: RequestContext, zoneId: ID) => Promise<Zone | undefined>;
  async getAllWithMembers(ctx: RequestContext) => Promise<Zone[]>;
  async create(ctx: RequestContext, input: CreateZoneInput) => Promise<Zone>;
  async update(ctx: RequestContext, input: UpdateZoneInput) => Promise<Zone>;
  async delete(ctx: RequestContext, id: ID) => Promise<DeletionResponse>;
  async addMembersToZone(ctx: RequestContext, { memberIds, zoneId }: MutationAddMembersToZoneArgs) => Promise<Zone>;
  async removeMembersFromZone(ctx: RequestContext, { memberIds, zoneId }: MutationRemoveMembersFromZoneArgs) => Promise<Zone>;
}
```

### constructor

<MemberInfo kind="method" type="(connection: <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, configService: ConfigService, eventBus: <a href='/typescript-api/events/event-bus#eventbus'>EventBus</a>, translator: TranslatorService, listQueryBuilder: <a href='/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>) => ZoneService"   />


### findAll

<MemberInfo kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, options?: ListQueryOptions&#60;<a href='/typescript-api/entities/zone#zone'>Zone</a>&#62;) => Promise&#60;<a href='/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/typescript-api/entities/zone#zone'>Zone</a>&#62;&#62;"   />


### findOne

<MemberInfo kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, zoneId: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/typescript-api/entities/zone#zone'>Zone</a> | undefined&#62;"   />


### getAllWithMembers

<MemberInfo kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;<a href='/typescript-api/entities/zone#zone'>Zone</a>[]&#62;"   />


### create

<MemberInfo kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: CreateZoneInput) => Promise&#60;<a href='/typescript-api/entities/zone#zone'>Zone</a>&#62;"   />


### update

<MemberInfo kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateZoneInput) => Promise&#60;<a href='/typescript-api/entities/zone#zone'>Zone</a>&#62;"   />


### delete

<MemberInfo kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;DeletionResponse&#62;"   />


### addMembersToZone

<MemberInfo kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, { memberIds, zoneId }: MutationAddMembersToZoneArgs) => Promise&#60;<a href='/typescript-api/entities/zone#zone'>Zone</a>&#62;"   />


### removeMembersFromZone

<MemberInfo kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, { memberIds, zoneId }: MutationRemoveMembersFromZoneArgs) => Promise&#60;<a href='/typescript-api/entities/zone#zone'>Zone</a>&#62;"   />


