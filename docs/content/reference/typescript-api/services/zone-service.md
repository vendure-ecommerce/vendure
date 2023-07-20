---
title: "ZoneService"
weight: 10
date: 2023-07-14T16:57:50.642Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# ZoneService
<div class="symbol">


# ZoneService

{{< generation-info sourceFile="packages/core/src/service/services/zone.service.ts" sourceLine="36" packageName="@vendure/core">}}

Contains methods relating to <a href='/typescript-api/entities/zone#zone'>Zone</a> entities.

## Signature

```TypeScript
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
## Members

### constructor

{{< member-info kind="method" type="(connection: <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, configService: ConfigService, eventBus: <a href='/typescript-api/events/event-bus#eventbus'>EventBus</a>, translator: TranslatorService, listQueryBuilder: <a href='/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>) => ZoneService"  >}}

{{< member-description >}}{{< /member-description >}}

### findAll

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, options?: ListQueryOptions&#60;<a href='/typescript-api/entities/zone#zone'>Zone</a>&#62;) => Promise&#60;<a href='/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/typescript-api/entities/zone#zone'>Zone</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### findOne

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, zoneId: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/typescript-api/entities/zone#zone'>Zone</a> | undefined&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### getAllWithMembers

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;<a href='/typescript-api/entities/zone#zone'>Zone</a>[]&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### create

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: CreateZoneInput) => Promise&#60;<a href='/typescript-api/entities/zone#zone'>Zone</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### update

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateZoneInput) => Promise&#60;<a href='/typescript-api/entities/zone#zone'>Zone</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### delete

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;DeletionResponse&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### addMembersToZone

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, { memberIds, zoneId }: MutationAddMembersToZoneArgs) => Promise&#60;<a href='/typescript-api/entities/zone#zone'>Zone</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### removeMembersFromZone

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, { memberIds, zoneId }: MutationRemoveMembersFromZoneArgs) => Promise&#60;<a href='/typescript-api/entities/zone#zone'>Zone</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
