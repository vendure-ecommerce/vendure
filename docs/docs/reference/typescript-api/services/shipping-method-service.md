---
title: "ShippingMethodService"
weight: 10
date: 2023-07-21T15:46:17.675Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ShippingMethodService

<GenerationInfo sourceFile="packages/core/src/service/services/shipping-method.service.ts" sourceLine="44" packageName="@vendure/core" />

Contains methods relating to <a href='/reference/typescript-api/entities/shipping-method#shippingmethod'>ShippingMethod</a> entities.

```ts title="Signature"
class ShippingMethodService {
  constructor(connection: TransactionalConnection, configService: ConfigService, roleService: RoleService, listQueryBuilder: ListQueryBuilder, channelService: ChannelService, configArgService: ConfigArgService, translatableSaver: TranslatableSaver, customFieldRelationService: CustomFieldRelationService, eventBus: EventBus, translator: TranslatorService)
  findAll(ctx: RequestContext, options?: ListQueryOptions<ShippingMethod>, relations: RelationPaths<ShippingMethod> = []) => Promise<PaginatedList<Translated<ShippingMethod>>>;
  async findOne(ctx: RequestContext, shippingMethodId: ID, includeDeleted:  = false, relations: RelationPaths<ShippingMethod> = []) => Promise<Translated<ShippingMethod> | undefined>;
  async create(ctx: RequestContext, input: CreateShippingMethodInput) => Promise<Translated<ShippingMethod>>;
  async update(ctx: RequestContext, input: UpdateShippingMethodInput) => Promise<Translated<ShippingMethod>>;
  async softDelete(ctx: RequestContext, id: ID) => Promise<DeletionResponse>;
  async assignShippingMethodsToChannel(ctx: RequestContext, input: AssignShippingMethodsToChannelInput) => Promise<Array<Translated<ShippingMethod>>>;
  async removeShippingMethodsFromChannel(ctx: RequestContext, input: RemoveShippingMethodsFromChannelInput) => Promise<Array<Translated<ShippingMethod>>>;
  getShippingEligibilityCheckers(ctx: RequestContext) => ConfigurableOperationDefinition[];
  getShippingCalculators(ctx: RequestContext) => ConfigurableOperationDefinition[];
  getFulfillmentHandlers(ctx: RequestContext) => ConfigurableOperationDefinition[];
  async getActiveShippingMethods(ctx: RequestContext) => Promise<ShippingMethod[]>;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type="(connection: <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, configService: ConfigService, roleService: <a href='/reference/typescript-api/services/role-service#roleservice'>RoleService</a>, listQueryBuilder: <a href='/reference/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>, channelService: <a href='/reference/typescript-api/services/channel-service#channelservice'>ChannelService</a>, configArgService: ConfigArgService, translatableSaver: <a href='/reference/typescript-api/service-helpers/translatable-saver#translatablesaver'>TranslatableSaver</a>, customFieldRelationService: CustomFieldRelationService, eventBus: <a href='/reference/typescript-api/events/event-bus#eventbus'>EventBus</a>, translator: TranslatorService) => ShippingMethodService"   />


### findAll

<MemberInfo kind="method" type="(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, options?: ListQueryOptions&#60;<a href='/reference/typescript-api/entities/shipping-method#shippingmethod'>ShippingMethod</a>&#62;, relations: RelationPaths&#60;<a href='/reference/typescript-api/entities/shipping-method#shippingmethod'>ShippingMethod</a>&#62; = []) => Promise&#60;<a href='/reference/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;Translated&#60;<a href='/reference/typescript-api/entities/shipping-method#shippingmethod'>ShippingMethod</a>&#62;&#62;&#62;"   />


### findOne

<MemberInfo kind="method" type="(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, shippingMethodId: <a href='/reference/typescript-api/common/id#id'>ID</a>, includeDeleted:  = false, relations: RelationPaths&#60;<a href='/reference/typescript-api/entities/shipping-method#shippingmethod'>ShippingMethod</a>&#62; = []) => Promise&#60;Translated&#60;<a href='/reference/typescript-api/entities/shipping-method#shippingmethod'>ShippingMethod</a>&#62; | undefined&#62;"   />


### create

<MemberInfo kind="method" type="(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: CreateShippingMethodInput) => Promise&#60;Translated&#60;<a href='/reference/typescript-api/entities/shipping-method#shippingmethod'>ShippingMethod</a>&#62;&#62;"   />


### update

<MemberInfo kind="method" type="(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateShippingMethodInput) => Promise&#60;Translated&#60;<a href='/reference/typescript-api/entities/shipping-method#shippingmethod'>ShippingMethod</a>&#62;&#62;"   />


### softDelete

<MemberInfo kind="method" type="(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;DeletionResponse&#62;"   />


### assignShippingMethodsToChannel

<MemberInfo kind="method" type="(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: AssignShippingMethodsToChannelInput) => Promise&#60;Array&#60;Translated&#60;<a href='/reference/typescript-api/entities/shipping-method#shippingmethod'>ShippingMethod</a>&#62;&#62;&#62;"   />


### removeShippingMethodsFromChannel

<MemberInfo kind="method" type="(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: RemoveShippingMethodsFromChannelInput) => Promise&#60;Array&#60;Translated&#60;<a href='/reference/typescript-api/entities/shipping-method#shippingmethod'>ShippingMethod</a>&#62;&#62;&#62;"   />


### getShippingEligibilityCheckers

<MemberInfo kind="method" type="(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => ConfigurableOperationDefinition[]"   />


### getShippingCalculators

<MemberInfo kind="method" type="(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => ConfigurableOperationDefinition[]"   />


### getFulfillmentHandlers

<MemberInfo kind="method" type="(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => ConfigurableOperationDefinition[]"   />


### getActiveShippingMethods

<MemberInfo kind="method" type="(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => Promise&#60;<a href='/reference/typescript-api/entities/shipping-method#shippingmethod'>ShippingMethod</a>[]&#62;"   />




</div>
