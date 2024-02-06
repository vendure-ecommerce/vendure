---
title: "PromotionService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## PromotionService

<GenerationInfo sourceFile="packages/core/src/service/services/promotion.service.ts" sourceLine="58" packageName="@vendure/core" />

Contains methods relating to <a href='/reference/typescript-api/entities/promotion#promotion'>Promotion</a> entities.

```ts title="Signature"
class PromotionService {
    availableConditions: PromotionCondition[] = [];
    availableActions: PromotionAction[] = [];
    constructor(connection: TransactionalConnection, configService: ConfigService, channelService: ChannelService, listQueryBuilder: ListQueryBuilder, configArgService: ConfigArgService, customFieldRelationService: CustomFieldRelationService, eventBus: EventBus, translatableSaver: TranslatableSaver, translator: TranslatorService)
    findAll(ctx: RequestContext, options?: ListQueryOptions<Promotion>, relations: RelationPaths<Promotion> = []) => Promise<PaginatedList<Promotion>>;
    findOne(ctx: RequestContext, adjustmentSourceId: ID, relations: RelationPaths<Promotion> = []) => Promise<Promotion | undefined>;
    getPromotionConditions(ctx: RequestContext) => ConfigurableOperationDefinition[];
    getPromotionActions(ctx: RequestContext) => ConfigurableOperationDefinition[];
    createPromotion(ctx: RequestContext, input: CreatePromotionInput) => Promise<ErrorResultUnion<CreatePromotionResult, Promotion>>;
    updatePromotion(ctx: RequestContext, input: UpdatePromotionInput) => Promise<ErrorResultUnion<UpdatePromotionResult, Promotion>>;
    softDeletePromotion(ctx: RequestContext, promotionId: ID) => Promise<DeletionResponse>;
    assignPromotionsToChannel(ctx: RequestContext, input: AssignPromotionsToChannelInput) => Promise<Promotion[]>;
    removePromotionsFromChannel(ctx: RequestContext, input: RemovePromotionsFromChannelInput) => ;
    validateCouponCode(ctx: RequestContext, couponCode: string, customerId?: ID) => Promise<JustErrorResults<ApplyCouponCodeResult> | Promotion>;
    getActivePromotionsInChannel(ctx: RequestContext) => ;
    getActivePromotionsOnOrder(ctx: RequestContext, orderId: ID) => Promise<Promotion[]>;
    runPromotionSideEffects(ctx: RequestContext, order: Order, promotionsPre: Promotion[]) => ;
    addPromotionsToOrder(ctx: RequestContext, order: Order) => Promise<Order>;
}
```

<div className="members-wrapper">

### availableConditions

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/promotions/promotion-condition#promotioncondition'>PromotionCondition</a>[]`}   />


### availableActions

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/promotions/promotion-action#promotionaction'>PromotionAction</a>[]`}   />


### constructor

<MemberInfo kind="method" type={`(connection: <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, configService: ConfigService, channelService: <a href='/reference/typescript-api/services/channel-service#channelservice'>ChannelService</a>, listQueryBuilder: <a href='/reference/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>, configArgService: ConfigArgService, customFieldRelationService: CustomFieldRelationService, eventBus: <a href='/reference/typescript-api/events/event-bus#eventbus'>EventBus</a>, translatableSaver: <a href='/reference/typescript-api/service-helpers/translatable-saver#translatablesaver'>TranslatableSaver</a>, translator: <a href='/reference/typescript-api/service-helpers/translator-service#translatorservice'>TranslatorService</a>) => PromotionService`}   />


### findAll

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, options?: ListQueryOptions&#60;<a href='/reference/typescript-api/entities/promotion#promotion'>Promotion</a>&#62;, relations: RelationPaths&#60;<a href='/reference/typescript-api/entities/promotion#promotion'>Promotion</a>&#62; = []) => Promise&#60;<a href='/reference/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/reference/typescript-api/entities/promotion#promotion'>Promotion</a>&#62;&#62;`}   />


### findOne

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, adjustmentSourceId: <a href='/reference/typescript-api/common/id#id'>ID</a>, relations: RelationPaths&#60;<a href='/reference/typescript-api/entities/promotion#promotion'>Promotion</a>&#62; = []) => Promise&#60;<a href='/reference/typescript-api/entities/promotion#promotion'>Promotion</a> | undefined&#62;`}   />


### getPromotionConditions

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => ConfigurableOperationDefinition[]`}   />


### getPromotionActions

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => ConfigurableOperationDefinition[]`}   />


### createPromotion

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: CreatePromotionInput) => Promise&#60;<a href='/reference/typescript-api/errors/error-result-union#errorresultunion'>ErrorResultUnion</a>&#60;CreatePromotionResult, <a href='/reference/typescript-api/entities/promotion#promotion'>Promotion</a>&#62;&#62;`}   />


### updatePromotion

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdatePromotionInput) => Promise&#60;<a href='/reference/typescript-api/errors/error-result-union#errorresultunion'>ErrorResultUnion</a>&#60;UpdatePromotionResult, <a href='/reference/typescript-api/entities/promotion#promotion'>Promotion</a>&#62;&#62;`}   />


### softDeletePromotion

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, promotionId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;DeletionResponse&#62;`}   />


### assignPromotionsToChannel

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: AssignPromotionsToChannelInput) => Promise&#60;<a href='/reference/typescript-api/entities/promotion#promotion'>Promotion</a>[]&#62;`}   />


### removePromotionsFromChannel

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: RemovePromotionsFromChannelInput) => `}   />


### validateCouponCode

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, couponCode: string, customerId?: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;JustErrorResults&#60;ApplyCouponCodeResult&#62; | <a href='/reference/typescript-api/entities/promotion#promotion'>Promotion</a>&#62;`}   />

Checks the validity of a coupon code, by checking that it is associated with an existing,
enabled and non-expired Promotion. Additionally, if there is a usage limit on the coupon code,
this method will enforce that limit against the specified Customer.
### getActivePromotionsInChannel

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => `}   />


### getActivePromotionsOnOrder

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/reference/typescript-api/entities/promotion#promotion'>Promotion</a>[]&#62;`}   />


### runPromotionSideEffects

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/reference/typescript-api/entities/order#order'>Order</a>, promotionsPre: <a href='/reference/typescript-api/entities/promotion#promotion'>Promotion</a>[]) => `}   />


### addPromotionsToOrder

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/reference/typescript-api/entities/order#order'>Order</a>) => Promise&#60;<a href='/reference/typescript-api/entities/order#order'>Order</a>&#62;`}   />

Used internally to associate a Promotion with an Order, once an Order has been placed.


</div>
