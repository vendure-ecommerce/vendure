---
title: "PromotionService"
weight: 10
date: 2023-07-14T16:57:50.537Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# PromotionService
<div class="symbol">


# PromotionService

{{< generation-info sourceFile="packages/core/src/service/services/promotion.service.ts" sourceLine="58" packageName="@vendure/core">}}

Contains methods relating to <a href='/typescript-api/entities/promotion#promotion'>Promotion</a> entities.

## Signature

```TypeScript
class PromotionService {
  availableConditions: PromotionCondition[] = [];
  availableActions: PromotionAction[] = [];
  constructor(connection: TransactionalConnection, configService: ConfigService, channelService: ChannelService, listQueryBuilder: ListQueryBuilder, configArgService: ConfigArgService, customFieldRelationService: CustomFieldRelationService, eventBus: EventBus, translatableSaver: TranslatableSaver, translator: TranslatorService)
  findAll(ctx: RequestContext, options?: ListQueryOptions<Promotion>, relations: RelationPaths<Promotion> = []) => Promise<PaginatedList<Promotion>>;
  async findOne(ctx: RequestContext, adjustmentSourceId: ID, relations: RelationPaths<Promotion> = []) => Promise<Promotion | undefined>;
  getPromotionConditions(ctx: RequestContext) => ConfigurableOperationDefinition[];
  getPromotionActions(ctx: RequestContext) => ConfigurableOperationDefinition[];
  async createPromotion(ctx: RequestContext, input: CreatePromotionInput) => Promise<ErrorResultUnion<CreatePromotionResult, Promotion>>;
  async updatePromotion(ctx: RequestContext, input: UpdatePromotionInput) => Promise<ErrorResultUnion<UpdatePromotionResult, Promotion>>;
  async softDeletePromotion(ctx: RequestContext, promotionId: ID) => Promise<DeletionResponse>;
  async assignPromotionsToChannel(ctx: RequestContext, input: AssignPromotionsToChannelInput) => Promise<Promotion[]>;
  async removePromotionsFromChannel(ctx: RequestContext, input: RemovePromotionsFromChannelInput) => ;
  async validateCouponCode(ctx: RequestContext, couponCode: string, customerId?: ID) => Promise<JustErrorResults<ApplyCouponCodeResult> | Promotion>;
  getActivePromotionsInChannel(ctx: RequestContext) => ;
  async getActivePromotionsOnOrder(ctx: RequestContext, orderId: ID) => Promise<Promotion[]>;
  async runPromotionSideEffects(ctx: RequestContext, order: Order, promotionsPre: Promotion[]) => ;
  async addPromotionsToOrder(ctx: RequestContext, order: Order) => Promise<Order>;
}
```
## Members

### availableConditions

{{< member-info kind="property" type="<a href='/typescript-api/promotions/promotion-condition#promotioncondition'>PromotionCondition</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### availableActions

{{< member-info kind="property" type="<a href='/typescript-api/promotions/promotion-action#promotionaction'>PromotionAction</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### constructor

{{< member-info kind="method" type="(connection: <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, configService: ConfigService, channelService: <a href='/typescript-api/services/channel-service#channelservice'>ChannelService</a>, listQueryBuilder: <a href='/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>, configArgService: ConfigArgService, customFieldRelationService: CustomFieldRelationService, eventBus: <a href='/typescript-api/events/event-bus#eventbus'>EventBus</a>, translatableSaver: <a href='/typescript-api/service-helpers/translatable-saver#translatablesaver'>TranslatableSaver</a>, translator: TranslatorService) => PromotionService"  >}}

{{< member-description >}}{{< /member-description >}}

### findAll

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, options?: ListQueryOptions&#60;<a href='/typescript-api/entities/promotion#promotion'>Promotion</a>&#62;, relations: RelationPaths&#60;<a href='/typescript-api/entities/promotion#promotion'>Promotion</a>&#62; = []) => Promise&#60;<a href='/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/typescript-api/entities/promotion#promotion'>Promotion</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### findOne

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, adjustmentSourceId: <a href='/typescript-api/common/id#id'>ID</a>, relations: RelationPaths&#60;<a href='/typescript-api/entities/promotion#promotion'>Promotion</a>&#62; = []) => Promise&#60;<a href='/typescript-api/entities/promotion#promotion'>Promotion</a> | undefined&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### getPromotionConditions

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => ConfigurableOperationDefinition[]"  >}}

{{< member-description >}}{{< /member-description >}}

### getPromotionActions

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => ConfigurableOperationDefinition[]"  >}}

{{< member-description >}}{{< /member-description >}}

### createPromotion

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: CreatePromotionInput) => Promise&#60;ErrorResultUnion&#60;CreatePromotionResult, <a href='/typescript-api/entities/promotion#promotion'>Promotion</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### updatePromotion

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdatePromotionInput) => Promise&#60;ErrorResultUnion&#60;UpdatePromotionResult, <a href='/typescript-api/entities/promotion#promotion'>Promotion</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### softDeletePromotion

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, promotionId: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;DeletionResponse&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### assignPromotionsToChannel

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: AssignPromotionsToChannelInput) => Promise&#60;<a href='/typescript-api/entities/promotion#promotion'>Promotion</a>[]&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### removePromotionsFromChannel

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: RemovePromotionsFromChannelInput) => "  >}}

{{< member-description >}}{{< /member-description >}}

### validateCouponCode

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, couponCode: string, customerId?: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;JustErrorResults&#60;ApplyCouponCodeResult&#62; | <a href='/typescript-api/entities/promotion#promotion'>Promotion</a>&#62;"  >}}

{{< member-description >}}Checks the validity of a coupon code, by checking that it is associated with an existing,
enabled and non-expired Promotion. Additionally, if there is a usage limit on the coupon code,
this method will enforce that limit against the specified Customer.{{< /member-description >}}

### getActivePromotionsInChannel

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => "  >}}

{{< member-description >}}{{< /member-description >}}

### getActivePromotionsOnOrder

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/typescript-api/entities/promotion#promotion'>Promotion</a>[]&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### runPromotionSideEffects

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/typescript-api/entities/order#order'>Order</a>, promotionsPre: <a href='/typescript-api/entities/promotion#promotion'>Promotion</a>[]) => "  >}}

{{< member-description >}}{{< /member-description >}}

### addPromotionsToOrder

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/typescript-api/entities/order#order'>Order</a>) => Promise&#60;<a href='/typescript-api/entities/order#order'>Order</a>&#62;"  >}}

{{< member-description >}}Used internally to associate a Promotion with an Order, once an Order has been placed.{{< /member-description >}}


</div>
