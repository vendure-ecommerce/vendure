---
title: "OrderService"
weight: 10
date: 2023-07-14T16:57:50.415Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# OrderService
<div class="symbol">


# OrderService

{{< generation-info sourceFile="packages/core/src/service/services/order.service.ts" sourceLine="137" packageName="@vendure/core">}}

Contains methods relating to <a href='/typescript-api/entities/order#order'>Order</a> entities.

## Signature

```TypeScript
class OrderService {
  constructor(connection: TransactionalConnection, configService: ConfigService, productVariantService: ProductVariantService, customerService: CustomerService, countryService: CountryService, orderCalculator: OrderCalculator, shippingCalculator: ShippingCalculator, orderStateMachine: OrderStateMachine, orderMerger: OrderMerger, paymentService: PaymentService, paymentStateMachine: PaymentStateMachine, paymentMethodService: PaymentMethodService, fulfillmentService: FulfillmentService, listQueryBuilder: ListQueryBuilder, stockMovementService: StockMovementService, refundStateMachine: RefundStateMachine, historyService: HistoryService, promotionService: PromotionService, eventBus: EventBus, channelService: ChannelService, orderModifier: OrderModifier, customFieldRelationService: CustomFieldRelationService, requestCache: RequestContextCacheService, translator: TranslatorService, stockLevelService: StockLevelService)
  getOrderProcessStates() => OrderProcessState[];
  findAll(ctx: RequestContext, options?: OrderListOptions, relations?: RelationPaths<Order>) => Promise<PaginatedList<Order>>;
  async findOne(ctx: RequestContext, orderId: ID, relations?: RelationPaths<Order>) => Promise<Order | undefined>;
  async findOneByCode(ctx: RequestContext, orderCode: string, relations?: RelationPaths<Order>) => Promise<Order | undefined>;
  async findOneByOrderLineId(ctx: RequestContext, orderLineId: ID, relations?: RelationPaths<Order>) => Promise<Order | undefined>;
  async findByCustomerId(ctx: RequestContext, customerId: ID, options?: ListQueryOptions<Order>, relations?: RelationPaths<Order>) => Promise<PaginatedList<Order>>;
  getOrderPayments(ctx: RequestContext, orderId: ID) => Promise<Payment[]>;
  getOrderModifications(ctx: RequestContext, orderId: ID) => Promise<OrderModification[]>;
  getPaymentRefunds(ctx: RequestContext, paymentId: ID) => Promise<Refund[]>;
  getSellerOrders(ctx: RequestContext, order: Order) => Promise<Order[]>;
  async getAggregateOrder(ctx: RequestContext, order: Order) => Promise<Order | undefined>;
  getOrderChannels(ctx: RequestContext, order: Order) => Promise<Channel[]>;
  async getActiveOrderForUser(ctx: RequestContext, userId: ID) => Promise<Order | undefined>;
  async create(ctx: RequestContext, userId?: ID) => Promise<Order>;
  async createDraft(ctx: RequestContext) => ;
  async updateCustomFields(ctx: RequestContext, orderId: ID, customFields: any) => ;
  async addItemToOrder(ctx: RequestContext, orderId: ID, productVariantId: ID, quantity: number, customFields?: { [key: string]: any }) => Promise<ErrorResultUnion<UpdateOrderItemsResult, Order>>;
  async adjustOrderLine(ctx: RequestContext, orderId: ID, orderLineId: ID, quantity: number, customFields?: { [key: string]: any }) => Promise<ErrorResultUnion<UpdateOrderItemsResult, Order>>;
  async removeItemFromOrder(ctx: RequestContext, orderId: ID, orderLineId: ID) => Promise<ErrorResultUnion<RemoveOrderItemsResult, Order>>;
  async removeAllItemsFromOrder(ctx: RequestContext, orderId: ID) => Promise<ErrorResultUnion<RemoveOrderItemsResult, Order>>;
  async addSurchargeToOrder(ctx: RequestContext, orderId: ID, surchargeInput: Partial<Omit<Surcharge, 'id' | 'createdAt' | 'updatedAt' | 'order'>>) => Promise<Order>;
  async removeSurchargeFromOrder(ctx: RequestContext, orderId: ID, surchargeId: ID) => Promise<Order>;
  async applyCouponCode(ctx: RequestContext, orderId: ID, couponCode: string) => Promise<ErrorResultUnion<ApplyCouponCodeResult, Order>>;
  async removeCouponCode(ctx: RequestContext, orderId: ID, couponCode: string) => ;
  async getOrderPromotions(ctx: RequestContext, orderId: ID) => Promise<Promotion[]>;
  getNextOrderStates(order: Order) => readonly OrderState[];
  async setShippingAddress(ctx: RequestContext, orderId: ID, input: CreateAddressInput) => Promise<Order>;
  async setBillingAddress(ctx: RequestContext, orderId: ID, input: CreateAddressInput) => Promise<Order>;
  async getEligibleShippingMethods(ctx: RequestContext, orderId: ID) => Promise<ShippingMethodQuote[]>;
  async getEligiblePaymentMethods(ctx: RequestContext, orderId: ID) => Promise<PaymentMethodQuote[]>;
  async setShippingMethod(ctx: RequestContext, orderId: ID, shippingMethodIds: ID[]) => Promise<ErrorResultUnion<SetOrderShippingMethodResult, Order>>;
  async transitionToState(ctx: RequestContext, orderId: ID, state: OrderState) => Promise<Order | OrderStateTransitionError>;
  async transitionFulfillmentToState(ctx: RequestContext, fulfillmentId: ID, state: FulfillmentState) => Promise<Fulfillment | FulfillmentStateTransitionError>;
  async modifyOrder(ctx: RequestContext, input: ModifyOrderInput) => Promise<ErrorResultUnion<ModifyOrderResult, Order>>;
  async transitionPaymentToState(ctx: RequestContext, paymentId: ID, state: PaymentState) => Promise<ErrorResultUnion<TransitionPaymentToStateResult, Payment>>;
  async addPaymentToOrder(ctx: RequestContext, orderId: ID, input: PaymentInput) => Promise<ErrorResultUnion<AddPaymentToOrderResult, Order>>;
  async addManualPaymentToOrder(ctx: RequestContext, input: ManualPaymentInput) => Promise<ErrorResultUnion<AddManualPaymentToOrderResult, Order>>;
  async settlePayment(ctx: RequestContext, paymentId: ID) => Promise<ErrorResultUnion<SettlePaymentResult, Payment>>;
  async cancelPayment(ctx: RequestContext, paymentId: ID) => Promise<ErrorResultUnion<CancelPaymentResult, Payment>>;
  async createFulfillment(ctx: RequestContext, input: FulfillOrderInput) => Promise<ErrorResultUnion<AddFulfillmentToOrderResult, Fulfillment>>;
  async getOrderFulfillments(ctx: RequestContext, order: Order) => Promise<Fulfillment[]>;
  async getOrderSurcharges(ctx: RequestContext, orderId: ID) => Promise<Surcharge[]>;
  async cancelOrder(ctx: RequestContext, input: CancelOrderInput) => Promise<ErrorResultUnion<CancelOrderResult, Order>>;
  async refundOrder(ctx: RequestContext, input: RefundOrderInput) => Promise<ErrorResultUnion<RefundOrderResult, Refund>>;
  async settleRefund(ctx: RequestContext, input: SettleRefundInput) => Promise<Refund>;
  async addCustomerToOrder(ctx: RequestContext, orderId: ID, customer: Customer) => Promise<Order>;
  async addNoteToOrder(ctx: RequestContext, input: AddNoteToOrderInput) => Promise<Order>;
  async updateOrderNote(ctx: RequestContext, input: UpdateOrderNoteInput) => Promise<HistoryEntry>;
  async deleteOrderNote(ctx: RequestContext, id: ID) => Promise<DeletionResponse>;
  async deleteOrder(ctx: RequestContext, orderOrId: ID | Order) => ;
  async mergeOrders(ctx: RequestContext, user: User, guestOrder?: Order, existingOrder?: Order) => Promise<Order | undefined>;
  async applyPriceAdjustments(ctx: RequestContext, order: Order, updatedOrderLines?: OrderLine[]) => Promise<Order>;
}
```
## Members

### constructor

{{< member-info kind="method" type="(connection: <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, configService: ConfigService, productVariantService: <a href='/typescript-api/services/product-variant-service#productvariantservice'>ProductVariantService</a>, customerService: <a href='/typescript-api/services/customer-service#customerservice'>CustomerService</a>, countryService: <a href='/typescript-api/services/country-service#countryservice'>CountryService</a>, orderCalculator: <a href='/typescript-api/service-helpers/order-calculator#ordercalculator'>OrderCalculator</a>, shippingCalculator: <a href='/typescript-api/shipping/shipping-calculator#shippingcalculator'>ShippingCalculator</a>, orderStateMachine: OrderStateMachine, orderMerger: OrderMerger, paymentService: <a href='/typescript-api/services/payment-service#paymentservice'>PaymentService</a>, paymentStateMachine: PaymentStateMachine, paymentMethodService: <a href='/typescript-api/services/payment-method-service#paymentmethodservice'>PaymentMethodService</a>, fulfillmentService: <a href='/typescript-api/services/fulfillment-service#fulfillmentservice'>FulfillmentService</a>, listQueryBuilder: <a href='/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>, stockMovementService: <a href='/typescript-api/services/stock-movement-service#stockmovementservice'>StockMovementService</a>, refundStateMachine: RefundStateMachine, historyService: <a href='/typescript-api/services/history-service#historyservice'>HistoryService</a>, promotionService: <a href='/typescript-api/services/promotion-service#promotionservice'>PromotionService</a>, eventBus: <a href='/typescript-api/events/event-bus#eventbus'>EventBus</a>, channelService: <a href='/typescript-api/services/channel-service#channelservice'>ChannelService</a>, orderModifier: <a href='/typescript-api/service-helpers/order-modifier#ordermodifier'>OrderModifier</a>, customFieldRelationService: CustomFieldRelationService, requestCache: RequestContextCacheService, translator: TranslatorService, stockLevelService: <a href='/typescript-api/services/stock-level-service#stocklevelservice'>StockLevelService</a>) => OrderService"  >}}

{{< member-description >}}{{< /member-description >}}

### getOrderProcessStates

{{< member-info kind="method" type="() => OrderProcessState[]"  >}}

{{< member-description >}}Returns an array of all the configured states and transitions of the order process. This is
based on the default order process plus all configured <a href='/typescript-api/orders/order-process#orderprocess'>OrderProcess</a> objects
defined in the <a href='/typescript-api/orders/order-options#orderoptions'>OrderOptions</a> `process` array.{{< /member-description >}}

### findAll

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, options?: OrderListOptions, relations?: RelationPaths&#60;<a href='/typescript-api/entities/order#order'>Order</a>&#62;) => Promise&#60;<a href='/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/typescript-api/entities/order#order'>Order</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### findOne

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/typescript-api/common/id#id'>ID</a>, relations?: RelationPaths&#60;<a href='/typescript-api/entities/order#order'>Order</a>&#62;) => Promise&#60;<a href='/typescript-api/entities/order#order'>Order</a> | undefined&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### findOneByCode

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderCode: string, relations?: RelationPaths&#60;<a href='/typescript-api/entities/order#order'>Order</a>&#62;) => Promise&#60;<a href='/typescript-api/entities/order#order'>Order</a> | undefined&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### findOneByOrderLineId

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderLineId: <a href='/typescript-api/common/id#id'>ID</a>, relations?: RelationPaths&#60;<a href='/typescript-api/entities/order#order'>Order</a>&#62;) => Promise&#60;<a href='/typescript-api/entities/order#order'>Order</a> | undefined&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### findByCustomerId

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, customerId: <a href='/typescript-api/common/id#id'>ID</a>, options?: ListQueryOptions&#60;<a href='/typescript-api/entities/order#order'>Order</a>&#62;, relations?: RelationPaths&#60;<a href='/typescript-api/entities/order#order'>Order</a>&#62;) => Promise&#60;<a href='/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/typescript-api/entities/order#order'>Order</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### getOrderPayments

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/typescript-api/entities/payment#payment'>Payment</a>[]&#62;"  >}}

{{< member-description >}}Returns all <a href='/typescript-api/entities/payment#payment'>Payment</a> entities associated with the Order.{{< /member-description >}}

### getOrderModifications

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/typescript-api/entities/order-modification#ordermodification'>OrderModification</a>[]&#62;"  >}}

{{< member-description >}}Returns an array of any <a href='/typescript-api/entities/order-modification#ordermodification'>OrderModification</a> entities associated with the Order.{{< /member-description >}}

### getPaymentRefunds

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, paymentId: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;Refund[]&#62;"  >}}

{{< member-description >}}Returns any {@link Refund}s associated with a <a href='/typescript-api/entities/payment#payment'>Payment</a>.{{< /member-description >}}

### getSellerOrders

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/typescript-api/entities/order#order'>Order</a>) => Promise&#60;<a href='/typescript-api/entities/order#order'>Order</a>[]&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### getAggregateOrder

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/typescript-api/entities/order#order'>Order</a>) => Promise&#60;<a href='/typescript-api/entities/order#order'>Order</a> | undefined&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### getOrderChannels

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/typescript-api/entities/order#order'>Order</a>) => Promise&#60;<a href='/typescript-api/entities/channel#channel'>Channel</a>[]&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### getActiveOrderForUser

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, userId: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/typescript-api/entities/order#order'>Order</a> | undefined&#62;"  >}}

{{< member-description >}}Returns any Order associated with the specified User's Customer account
that is still in the `active` state.{{< /member-description >}}

### create

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, userId?: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/typescript-api/entities/order#order'>Order</a>&#62;"  >}}

{{< member-description >}}Creates a new, empty Order. If a `userId` is passed, the Order will get associated with that
User's Customer account.{{< /member-description >}}

### createDraft

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => "  >}}

{{< member-description >}}{{< /member-description >}}

### updateCustomFields

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/typescript-api/common/id#id'>ID</a>, customFields: any) => "  >}}

{{< member-description >}}Updates the custom fields of an Order.{{< /member-description >}}

### addItemToOrder

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/typescript-api/common/id#id'>ID</a>, productVariantId: <a href='/typescript-api/common/id#id'>ID</a>, quantity: number, customFields?: { [key: string]: any }) => Promise&#60;ErrorResultUnion&#60;UpdateOrderItemsResult, <a href='/typescript-api/entities/order#order'>Order</a>&#62;&#62;"  >}}

{{< member-description >}}Adds an item to the Order, either creating a new OrderLine or
incrementing an existing one.{{< /member-description >}}

### adjustOrderLine

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/typescript-api/common/id#id'>ID</a>, orderLineId: <a href='/typescript-api/common/id#id'>ID</a>, quantity: number, customFields?: { [key: string]: any }) => Promise&#60;ErrorResultUnion&#60;UpdateOrderItemsResult, <a href='/typescript-api/entities/order#order'>Order</a>&#62;&#62;"  >}}

{{< member-description >}}Adjusts the quantity and/or custom field values of an existing OrderLine.{{< /member-description >}}

### removeItemFromOrder

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/typescript-api/common/id#id'>ID</a>, orderLineId: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;ErrorResultUnion&#60;RemoveOrderItemsResult, <a href='/typescript-api/entities/order#order'>Order</a>&#62;&#62;"  >}}

{{< member-description >}}Removes the specified OrderLine from the Order.{{< /member-description >}}

### removeAllItemsFromOrder

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;ErrorResultUnion&#60;RemoveOrderItemsResult, <a href='/typescript-api/entities/order#order'>Order</a>&#62;&#62;"  >}}

{{< member-description >}}Removes all OrderLines from the Order.{{< /member-description >}}

### addSurchargeToOrder

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/typescript-api/common/id#id'>ID</a>, surchargeInput: Partial&#60;Omit&#60;<a href='/typescript-api/entities/surcharge#surcharge'>Surcharge</a>, 'id' | 'createdAt' | 'updatedAt' | 'order'&#62;&#62;) => Promise&#60;<a href='/typescript-api/entities/order#order'>Order</a>&#62;"  >}}

{{< member-description >}}Adds a <a href='/typescript-api/entities/surcharge#surcharge'>Surcharge</a> to the Order.{{< /member-description >}}

### removeSurchargeFromOrder

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/typescript-api/common/id#id'>ID</a>, surchargeId: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/typescript-api/entities/order#order'>Order</a>&#62;"  >}}

{{< member-description >}}Removes a <a href='/typescript-api/entities/surcharge#surcharge'>Surcharge</a> from the Order.{{< /member-description >}}

### applyCouponCode

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/typescript-api/common/id#id'>ID</a>, couponCode: string) => Promise&#60;ErrorResultUnion&#60;ApplyCouponCodeResult, <a href='/typescript-api/entities/order#order'>Order</a>&#62;&#62;"  >}}

{{< member-description >}}Applies a coupon code to the Order, which should be a valid coupon code as specified in the configuration
of an active <a href='/typescript-api/entities/promotion#promotion'>Promotion</a>.{{< /member-description >}}

### removeCouponCode

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/typescript-api/common/id#id'>ID</a>, couponCode: string) => "  >}}

{{< member-description >}}Removes a coupon code from the Order.{{< /member-description >}}

### getOrderPromotions

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/typescript-api/entities/promotion#promotion'>Promotion</a>[]&#62;"  >}}

{{< member-description >}}Returns all <a href='/typescript-api/entities/promotion#promotion'>Promotion</a>s associated with an Order. A Promotion only gets associated with
and Order once the order has been placed (see <a href='/typescript-api/orders/order-placed-strategy#orderplacedstrategy'>OrderPlacedStrategy</a>).{{< /member-description >}}

### getNextOrderStates

{{< member-info kind="method" type="(order: <a href='/typescript-api/entities/order#order'>Order</a>) => readonly <a href='/typescript-api/orders/order-process#orderstate'>OrderState</a>[]"  >}}

{{< member-description >}}Returns the next possible states that the Order may transition to.{{< /member-description >}}

### setShippingAddress

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/typescript-api/common/id#id'>ID</a>, input: CreateAddressInput) => Promise&#60;<a href='/typescript-api/entities/order#order'>Order</a>&#62;"  >}}

{{< member-description >}}Sets the shipping address for the Order.{{< /member-description >}}

### setBillingAddress

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/typescript-api/common/id#id'>ID</a>, input: CreateAddressInput) => Promise&#60;<a href='/typescript-api/entities/order#order'>Order</a>&#62;"  >}}

{{< member-description >}}Sets the billing address for the Order.{{< /member-description >}}

### getEligibleShippingMethods

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;ShippingMethodQuote[]&#62;"  >}}

{{< member-description >}}Returns an array of quotes stating which <a href='/typescript-api/entities/shipping-method#shippingmethod'>ShippingMethod</a>s may be applied to this Order.
This is determined by the configured <a href='/typescript-api/shipping/shipping-eligibility-checker#shippingeligibilitychecker'>ShippingEligibilityChecker</a> of each ShippingMethod.

The quote also includes a price for each method, as determined by the configured
<a href='/typescript-api/shipping/shipping-calculator#shippingcalculator'>ShippingCalculator</a> of each eligible ShippingMethod.{{< /member-description >}}

### getEligiblePaymentMethods

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;PaymentMethodQuote[]&#62;"  >}}

{{< member-description >}}Returns an array of quotes stating which <a href='/typescript-api/entities/payment-method#paymentmethod'>PaymentMethod</a>s may be used on this Order.{{< /member-description >}}

### setShippingMethod

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/typescript-api/common/id#id'>ID</a>, shippingMethodIds: <a href='/typescript-api/common/id#id'>ID</a>[]) => Promise&#60;ErrorResultUnion&#60;SetOrderShippingMethodResult, <a href='/typescript-api/entities/order#order'>Order</a>&#62;&#62;"  >}}

{{< member-description >}}Sets the ShippingMethod to be used on this Order.{{< /member-description >}}

### transitionToState

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/typescript-api/common/id#id'>ID</a>, state: <a href='/typescript-api/orders/order-process#orderstate'>OrderState</a>) => Promise&#60;<a href='/typescript-api/entities/order#order'>Order</a> | OrderStateTransitionError&#62;"  >}}

{{< member-description >}}Transitions the Order to the given state.{{< /member-description >}}

### transitionFulfillmentToState

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, fulfillmentId: <a href='/typescript-api/common/id#id'>ID</a>, state: <a href='/typescript-api/fulfillment/fulfillment-state#fulfillmentstate'>FulfillmentState</a>) => Promise&#60;<a href='/typescript-api/entities/fulfillment#fulfillment'>Fulfillment</a> | FulfillmentStateTransitionError&#62;"  >}}

{{< member-description >}}Transitions a Fulfillment to the given state and then transitions the Order state based on
whether all Fulfillments of the Order are shipped or delivered.{{< /member-description >}}

### modifyOrder

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: ModifyOrderInput) => Promise&#60;ErrorResultUnion&#60;ModifyOrderResult, <a href='/typescript-api/entities/order#order'>Order</a>&#62;&#62;"  >}}

{{< member-description >}}Allows the Order to be modified, which allows several aspects of the Order to be changed:

* Changes to OrderLine quantities
* New OrderLines being added
* Arbitrary <a href='/typescript-api/entities/surcharge#surcharge'>Surcharge</a>s being added
* Shipping or billing address changes

Setting the `dryRun` input property to `true` will apply all changes, including updating the price of the
Order, except history entry and additional payment actions.

__Using dryRun option, you must wrap function call in transaction manually.__{{< /member-description >}}

### transitionPaymentToState

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, paymentId: <a href='/typescript-api/common/id#id'>ID</a>, state: <a href='/typescript-api/payment/payment-state#paymentstate'>PaymentState</a>) => Promise&#60;ErrorResultUnion&#60;TransitionPaymentToStateResult, <a href='/typescript-api/entities/payment#payment'>Payment</a>&#62;&#62;"  >}}

{{< member-description >}}Transitions the given <a href='/typescript-api/entities/payment#payment'>Payment</a> to a new state. If the order totalWithTax price is then
covered by Payments, the Order state will be automatically transitioned to `PaymentSettled`
or `PaymentAuthorized`.{{< /member-description >}}

### addPaymentToOrder

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/typescript-api/common/id#id'>ID</a>, input: PaymentInput) => Promise&#60;ErrorResultUnion&#60;AddPaymentToOrderResult, <a href='/typescript-api/entities/order#order'>Order</a>&#62;&#62;"  >}}

{{< member-description >}}Adds a new Payment to the Order. If the Order totalWithTax is covered by Payments, then the Order
state will get automatically transitioned to the `PaymentSettled` or `PaymentAuthorized` state.{{< /member-description >}}

### addManualPaymentToOrder

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: ManualPaymentInput) => Promise&#60;ErrorResultUnion&#60;AddManualPaymentToOrderResult, <a href='/typescript-api/entities/order#order'>Order</a>&#62;&#62;"  >}}

{{< member-description >}}This method is used after modifying an existing completed order using the `modifyOrder()` method. If the modifications
cause the order total to increase (such as when adding a new OrderLine), then there will be an outstanding charge to
pay.

This method allows you to add a new Payment and assumes the actual processing has been done manually, e.g. in the
dashboard of your payment provider.{{< /member-description >}}

### settlePayment

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, paymentId: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;ErrorResultUnion&#60;<a href='/typescript-api/payment/payment-method-types#settlepaymentresult'>SettlePaymentResult</a>, <a href='/typescript-api/entities/payment#payment'>Payment</a>&#62;&#62;"  >}}

{{< member-description >}}Settles a payment by invoking the <a href='/typescript-api/payment/payment-method-handler#paymentmethodhandler'>PaymentMethodHandler</a>'s `settlePayment()` method. Automatically
transitions the Order state if all Payments are settled.{{< /member-description >}}

### cancelPayment

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, paymentId: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;ErrorResultUnion&#60;<a href='/typescript-api/payment/payment-method-types#cancelpaymentresult'>CancelPaymentResult</a>, <a href='/typescript-api/entities/payment#payment'>Payment</a>&#62;&#62;"  >}}

{{< member-description >}}Cancels a payment by invoking the <a href='/typescript-api/payment/payment-method-handler#paymentmethodhandler'>PaymentMethodHandler</a>'s `cancelPayment()` method (if defined), and transitions the Payment to
the `Cancelled` state.{{< /member-description >}}

### createFulfillment

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: FulfillOrderInput) => Promise&#60;ErrorResultUnion&#60;AddFulfillmentToOrderResult, <a href='/typescript-api/entities/fulfillment#fulfillment'>Fulfillment</a>&#62;&#62;"  >}}

{{< member-description >}}Creates a new Fulfillment associated with the given Order and OrderItems.{{< /member-description >}}

### getOrderFulfillments

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/typescript-api/entities/order#order'>Order</a>) => Promise&#60;<a href='/typescript-api/entities/fulfillment#fulfillment'>Fulfillment</a>[]&#62;"  >}}

{{< member-description >}}Returns an array of all Fulfillments associated with the Order.{{< /member-description >}}

### getOrderSurcharges

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/typescript-api/entities/surcharge#surcharge'>Surcharge</a>[]&#62;"  >}}

{{< member-description >}}Returns an array of all Surcharges associated with the Order.{{< /member-description >}}

### cancelOrder

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: CancelOrderInput) => Promise&#60;ErrorResultUnion&#60;CancelOrderResult, <a href='/typescript-api/entities/order#order'>Order</a>&#62;&#62;"  >}}

{{< member-description >}}Cancels an Order by transitioning it to the `Cancelled` state. If stock is being tracked for the ProductVariants
in the Order, then new <a href='/typescript-api/entities/stock-movement#stockmovement'>StockMovement</a>s will be created to correct the stock levels.{{< /member-description >}}

### refundOrder

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: RefundOrderInput) => Promise&#60;ErrorResultUnion&#60;RefundOrderResult, Refund&#62;&#62;"  >}}

{{< member-description >}}Creates a {@link Refund} against the order and in doing so invokes the `createRefund()` method of the
<a href='/typescript-api/payment/payment-method-handler#paymentmethodhandler'>PaymentMethodHandler</a>.{{< /member-description >}}

### settleRefund

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: SettleRefundInput) => Promise&#60;Refund&#62;"  >}}

{{< member-description >}}Settles a Refund by transitioning it to the `Settled` state.{{< /member-description >}}

### addCustomerToOrder

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/typescript-api/common/id#id'>ID</a>, customer: <a href='/typescript-api/entities/customer#customer'>Customer</a>) => Promise&#60;<a href='/typescript-api/entities/order#order'>Order</a>&#62;"  >}}

{{< member-description >}}Associates a Customer with the Order.{{< /member-description >}}

### addNoteToOrder

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: AddNoteToOrderInput) => Promise&#60;<a href='/typescript-api/entities/order#order'>Order</a>&#62;"  >}}

{{< member-description >}}Creates a new "ORDER_NOTE" type <a href='/typescript-api/entities/order-history-entry#orderhistoryentry'>OrderHistoryEntry</a> in the Order's history timeline.{{< /member-description >}}

### updateOrderNote

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateOrderNoteInput) => Promise&#60;<a href='/typescript-api/entities/history-entry#historyentry'>HistoryEntry</a>&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### deleteOrderNote

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/typescript-api/common/id#id'>ID</a>) => Promise&#60;DeletionResponse&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### deleteOrder

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderOrId: <a href='/typescript-api/common/id#id'>ID</a> | <a href='/typescript-api/entities/order#order'>Order</a>) => "  since="1.5.0" >}}

{{< member-description >}}Deletes an Order, ensuring that any Sessions that reference this Order are dereferenced before deletion.{{< /member-description >}}

### mergeOrders

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, user: <a href='/typescript-api/entities/user#user'>User</a>, guestOrder?: <a href='/typescript-api/entities/order#order'>Order</a>, existingOrder?: <a href='/typescript-api/entities/order#order'>Order</a>) => Promise&#60;<a href='/typescript-api/entities/order#order'>Order</a> | undefined&#62;"  >}}

{{< member-description >}}When a guest user with an anonymous Order signs in and has an existing Order associated with that Customer,
we need to reconcile the contents of the two orders.

The logic used to do the merging is specified in the <a href='/typescript-api/orders/order-options#orderoptions'>OrderOptions</a> `mergeStrategy` config setting.{{< /member-description >}}

### applyPriceAdjustments

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/typescript-api/entities/order#order'>Order</a>, updatedOrderLines?: <a href='/typescript-api/entities/order-line#orderline'>OrderLine</a>[]) => Promise&#60;<a href='/typescript-api/entities/order#order'>Order</a>&#62;"  >}}

{{< member-description >}}Applies promotions, taxes and shipping to the Order. If the `updatedOrderLines` argument is passed in,
then all of those OrderLines will have their prices re-calculated using the configured <a href='/typescript-api/orders/order-item-price-calculation-strategy#orderitempricecalculationstrategy'>OrderItemPriceCalculationStrategy</a>.{{< /member-description >}}


</div>
