---
title: "ZoneService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ZoneService

<GenerationInfo sourceFile="packages/core/src/service/services/zone.service.ts" sourceLine="36" packageName="@vendure/core" />

Contains methods relating to <a href='/reference/typescript-api/entities/zone#zone'>Zone</a> entities.

```ts title="Signature"
class ZoneService {
    constructor(connection: TransactionalConnection, configService: ConfigService, eventBus: EventBus, translator: TranslatorService, listQueryBuilder: ListQueryBuilder)
    findAll(ctx: RequestContext, options?: ListQueryOptions<Zone>) => Promise<PaginatedList<Zone>>;
    findOne(ctx: RequestContext, zoneId: ID) => Promise<Zone | undefined>;
    getAllWithMembers(ctx: RequestContext) => Promise<Zone[]>;
    create(ctx: RequestContext, input: CreateZoneInput) => Promise<Zone>;
    update(ctx: RequestContext, input: UpdateZoneInput) => Promise<Zone>;
    delete(ctx: RequestContext, id: ID) => Promise<DeletionResponse>;
    addMembersToZone(ctx: RequestContext, { memberIds, zoneId }: MutationAddMembersToZoneArgs) => Promise<Zone>;
    removeMembersFromZone(ctx: RequestContext, { memberIds, zoneId }: MutationRemoveMembersFromZoneArgs) => Promise<Zone>;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(connection: <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, configService: ConfigService, eventBus: <a href='/reference/typescript-api/events/event-bus#eventbus'>EventBus</a>, translator: <a href='/reference/typescript-api/service-helpers/translator-service#translatorservice'>TranslatorService</a>, listQueryBuilder: <a href='/reference/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>) => ZoneService`}   />


### findAll

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, options?: ListQueryOptions&#60;<a href='/reference/typescript-api/entities/zone#zone'>Zone</a>&#62;) => Promise&#60;<a href='/reference/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/reference/typescript-api/entities/zone#zone'>Zone</a>&#62;&#62;`}   />


### findOne

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, zoneId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/reference/typescript-api/entities/zone#zone'>Zone</a> | undefined&#62;`}   />


### getAllWithMembers

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;<a href='/reference/typescript-api/entities/zone#zone'>Zone</a>[]&#62;`}   />


### create

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: CreateZoneInput) => Promise&#60;<a href='/reference/typescript-api/entities/zone#zone'>Zone</a>&#62;`}   />


### update

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateZoneInput) => Promise&#60;<a href='/reference/typescript-api/entities/zone#zone'>Zone</a>&#62;`}   />


### delete

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;DeletionResponse&#62;`}   />


### addMembersToZone

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, { memberIds, zoneId }: MutationAddMembersToZoneArgs) => Promise&#60;<a href='/reference/typescript-api/entities/zone#zone'>Zone</a>&#62;`}   />


### removeMembersFromZone

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, { memberIds, zoneId }: MutationRemoveMembersFromZoneArgs) => Promise&#60;<a href='/reference/typescript-api/entities/zone#zone'>Zone</a>&#62;`}   />




</div>
