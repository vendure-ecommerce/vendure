---
title: "OrderService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## OrderService

<GenerationInfo sourceFile="packages/core/src/service/services/order.service.ts" sourceLine="137" packageName="@vendure/core" />

Contains methods relating to <a href='/reference/typescript-api/entities/order#order'>Order</a> entities.

```ts title="Signature"
class OrderService {
    constructor(connection: TransactionalConnection, configService: ConfigService, productVariantService: ProductVariantService, customerService: CustomerService, countryService: CountryService, orderCalculator: OrderCalculator, shippingCalculator: ShippingCalculator, orderStateMachine: OrderStateMachine, orderMerger: OrderMerger, paymentService: PaymentService, paymentMethodService: PaymentMethodService, fulfillmentService: FulfillmentService, listQueryBuilder: ListQueryBuilder, refundStateMachine: RefundStateMachine, historyService: HistoryService, promotionService: PromotionService, eventBus: EventBus, channelService: ChannelService, orderModifier: OrderModifier, customFieldRelationService: CustomFieldRelationService, requestCache: RequestContextCacheService, translator: TranslatorService, stockLevelService: StockLevelService)
    getOrderProcessStates() => OrderProcessState[];
    findAll(ctx: RequestContext, options?: OrderListOptions, relations?: RelationPaths<Order>) => Promise<PaginatedList<Order>>;
    findOne(ctx: RequestContext, orderId: ID, relations?: RelationPaths<Order>) => Promise<Order | undefined>;
    findOneByCode(ctx: RequestContext, orderCode: string, relations?: RelationPaths<Order>) => Promise<Order | undefined>;
    findOneByOrderLineId(ctx: RequestContext, orderLineId: ID, relations?: RelationPaths<Order>) => Promise<Order | undefined>;
    findByCustomerId(ctx: RequestContext, customerId: ID, options?: ListQueryOptions<Order>, relations?: RelationPaths<Order>) => Promise<PaginatedList<Order>>;
    getOrderPayments(ctx: RequestContext, orderId: ID) => Promise<Payment[]>;
    getOrderModifications(ctx: RequestContext, orderId: ID) => Promise<OrderModification[]>;
    getPaymentRefunds(ctx: RequestContext, paymentId: ID) => Promise<Refund[]>;
    getSellerOrders(ctx: RequestContext, order: Order) => Promise<Order[]>;
    getAggregateOrder(ctx: RequestContext, order: Order) => Promise<Order | undefined>;
    getOrderChannels(ctx: RequestContext, order: Order) => Promise<Channel[]>;
    getActiveOrderForUser(ctx: RequestContext, userId: ID) => Promise<Order | undefined>;
    create(ctx: RequestContext, userId?: ID) => Promise<Order>;
    createDraft(ctx: RequestContext) => ;
    updateCustomFields(ctx: RequestContext, orderId: ID, customFields: any) => ;
    updateOrderCustomer(ctx: RequestContext, { customerId, orderId, note }: SetOrderCustomerInput) => ;
    addItemToOrder(ctx: RequestContext, orderId: ID, productVariantId: ID, quantity: number, customFields?: { [key: string]: any }) => Promise<ErrorResultUnion<UpdateOrderItemsResult, Order>>;
    adjustOrderLine(ctx: RequestContext, orderId: ID, orderLineId: ID, quantity: number, customFields?: { [key: string]: any }) => Promise<ErrorResultUnion<UpdateOrderItemsResult, Order>>;
    removeItemFromOrder(ctx: RequestContext, orderId: ID, orderLineId: ID) => Promise<ErrorResultUnion<RemoveOrderItemsResult, Order>>;
    removeAllItemsFromOrder(ctx: RequestContext, orderId: ID) => Promise<ErrorResultUnion<RemoveOrderItemsResult, Order>>;
    addSurchargeToOrder(ctx: RequestContext, orderId: ID, surchargeInput: Partial<Omit<Surcharge, 'id' | 'createdAt' | 'updatedAt' | 'order'>>) => Promise<Order>;
    removeSurchargeFromOrder(ctx: RequestContext, orderId: ID, surchargeId: ID) => Promise<Order>;
    applyCouponCode(ctx: RequestContext, orderId: ID, couponCode: string) => Promise<ErrorResultUnion<ApplyCouponCodeResult, Order>>;
    removeCouponCode(ctx: RequestContext, orderId: ID, couponCode: string) => ;
    getOrderPromotions(ctx: RequestContext, orderId: ID) => Promise<Promotion[]>;
    getNextOrderStates(order: Order) => readonly OrderState[];
    setShippingAddress(ctx: RequestContext, orderId: ID, input: CreateAddressInput) => Promise<Order>;
    setBillingAddress(ctx: RequestContext, orderId: ID, input: CreateAddressInput) => Promise<Order>;
    getEligibleShippingMethods(ctx: RequestContext, orderId: ID) => Promise<ShippingMethodQuote[]>;
    getEligiblePaymentMethods(ctx: RequestContext, orderId: ID) => Promise<PaymentMethodQuote[]>;
    setShippingMethod(ctx: RequestContext, orderId: ID, shippingMethodIds: ID[]) => Promise<ErrorResultUnion<SetOrderShippingMethodResult, Order>>;
    transitionToState(ctx: RequestContext, orderId: ID, state: OrderState) => Promise<Order | OrderStateTransitionError>;
    transitionFulfillmentToState(ctx: RequestContext, fulfillmentId: ID, state: FulfillmentState) => Promise<Fulfillment | FulfillmentStateTransitionError>;
    transitionRefundToState(ctx: RequestContext, refundId: ID, state: RefundState, transactionId?: string) => Promise<Refund | RefundStateTransitionError>;
    modifyOrder(ctx: RequestContext, input: ModifyOrderInput) => Promise<ErrorResultUnion<ModifyOrderResult, Order>>;
    transitionPaymentToState(ctx: RequestContext, paymentId: ID, state: PaymentState) => Promise<ErrorResultUnion<TransitionPaymentToStateResult, Payment>>;
    addPaymentToOrder(ctx: RequestContext, orderId: ID, input: PaymentInput) => Promise<ErrorResultUnion<AddPaymentToOrderResult, Order>>;
    addManualPaymentToOrder(ctx: RequestContext, input: ManualPaymentInput) => Promise<ErrorResultUnion<AddManualPaymentToOrderResult, Order>>;
    settlePayment(ctx: RequestContext, paymentId: ID) => Promise<ErrorResultUnion<SettlePaymentResult, Payment>>;
    cancelPayment(ctx: RequestContext, paymentId: ID) => Promise<ErrorResultUnion<CancelPaymentResult, Payment>>;
    createFulfillment(ctx: RequestContext, input: FulfillOrderInput) => Promise<ErrorResultUnion<AddFulfillmentToOrderResult, Fulfillment>>;
    getOrderFulfillments(ctx: RequestContext, order: Order) => Promise<Fulfillment[]>;
    getOrderSurcharges(ctx: RequestContext, orderId: ID) => Promise<Surcharge[]>;
    cancelOrder(ctx: RequestContext, input: CancelOrderInput) => Promise<ErrorResultUnion<CancelOrderResult, Order>>;
    refundOrder(ctx: RequestContext, input: RefundOrderInput) => Promise<ErrorResultUnion<RefundOrderResult, Refund>>;
    settleRefund(ctx: RequestContext, input: SettleRefundInput) => Promise<Refund>;
    addCustomerToOrder(ctx: RequestContext, orderIdOrOrder: ID | Order, customer: Customer) => Promise<Order>;
    addNoteToOrder(ctx: RequestContext, input: AddNoteToOrderInput) => Promise<Order>;
    updateOrderNote(ctx: RequestContext, input: UpdateOrderNoteInput) => Promise<HistoryEntry>;
    deleteOrderNote(ctx: RequestContext, id: ID) => Promise<DeletionResponse>;
    deleteOrder(ctx: RequestContext, orderOrId: ID | Order) => ;
    mergeOrders(ctx: RequestContext, user: User, guestOrder?: Order, existingOrder?: Order) => Promise<Order | undefined>;
    applyPriceAdjustments(ctx: RequestContext, order: Order, updatedOrderLines?: OrderLine[]) => Promise<Order>;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(connection: <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, configService: ConfigService, productVariantService: <a href='/reference/typescript-api/services/product-variant-service#productvariantservice'>ProductVariantService</a>, customerService: <a href='/reference/typescript-api/services/customer-service#customerservice'>CustomerService</a>, countryService: <a href='/reference/typescript-api/services/country-service#countryservice'>CountryService</a>, orderCalculator: <a href='/reference/typescript-api/service-helpers/order-calculator#ordercalculator'>OrderCalculator</a>, shippingCalculator: <a href='/reference/typescript-api/shipping/shipping-calculator#shippingcalculator'>ShippingCalculator</a>, orderStateMachine: OrderStateMachine, orderMerger: OrderMerger, paymentService: <a href='/reference/typescript-api/services/payment-service#paymentservice'>PaymentService</a>, paymentMethodService: <a href='/reference/typescript-api/services/payment-method-service#paymentmethodservice'>PaymentMethodService</a>, fulfillmentService: <a href='/reference/typescript-api/services/fulfillment-service#fulfillmentservice'>FulfillmentService</a>, listQueryBuilder: <a href='/reference/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>, refundStateMachine: RefundStateMachine, historyService: <a href='/reference/typescript-api/services/history-service#historyservice'>HistoryService</a>, promotionService: <a href='/reference/typescript-api/services/promotion-service#promotionservice'>PromotionService</a>, eventBus: <a href='/reference/typescript-api/events/event-bus#eventbus'>EventBus</a>, channelService: <a href='/reference/typescript-api/services/channel-service#channelservice'>ChannelService</a>, orderModifier: <a href='/reference/typescript-api/service-helpers/order-modifier#ordermodifier'>OrderModifier</a>, customFieldRelationService: CustomFieldRelationService, requestCache: RequestContextCacheService, translator: <a href='/reference/typescript-api/service-helpers/translator-service#translatorservice'>TranslatorService</a>, stockLevelService: <a href='/reference/typescript-api/services/stock-level-service#stocklevelservice'>StockLevelService</a>) => OrderService`}   />


### getOrderProcessStates

<MemberInfo kind="method" type={`() => OrderProcessState[]`}   />

Returns an array of all the configured states and transitions of the order process. This is
based on the default order process plus all configured <a href='/reference/typescript-api/orders/order-process#orderprocess'>OrderProcess</a> objects
defined in the <a href='/reference/typescript-api/orders/order-options#orderoptions'>OrderOptions</a> `process` array.
### findAll

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, options?: OrderListOptions, relations?: RelationPaths&#60;<a href='/reference/typescript-api/entities/order#order'>Order</a>&#62;) => Promise&#60;<a href='/reference/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/reference/typescript-api/entities/order#order'>Order</a>&#62;&#62;`}   />


### findOne

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/reference/typescript-api/common/id#id'>ID</a>, relations?: RelationPaths&#60;<a href='/reference/typescript-api/entities/order#order'>Order</a>&#62;) => Promise&#60;<a href='/reference/typescript-api/entities/order#order'>Order</a> | undefined&#62;`}   />


### findOneByCode

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderCode: string, relations?: RelationPaths&#60;<a href='/reference/typescript-api/entities/order#order'>Order</a>&#62;) => Promise&#60;<a href='/reference/typescript-api/entities/order#order'>Order</a> | undefined&#62;`}   />


### findOneByOrderLineId

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderLineId: <a href='/reference/typescript-api/common/id#id'>ID</a>, relations?: RelationPaths&#60;<a href='/reference/typescript-api/entities/order#order'>Order</a>&#62;) => Promise&#60;<a href='/reference/typescript-api/entities/order#order'>Order</a> | undefined&#62;`}   />


### findByCustomerId

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, customerId: <a href='/reference/typescript-api/common/id#id'>ID</a>, options?: ListQueryOptions&#60;<a href='/reference/typescript-api/entities/order#order'>Order</a>&#62;, relations?: RelationPaths&#60;<a href='/reference/typescript-api/entities/order#order'>Order</a>&#62;) => Promise&#60;<a href='/reference/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/reference/typescript-api/entities/order#order'>Order</a>&#62;&#62;`}   />


### getOrderPayments

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/reference/typescript-api/entities/payment#payment'>Payment</a>[]&#62;`}   />

Returns all <a href='/reference/typescript-api/entities/payment#payment'>Payment</a> entities associated with the Order.
### getOrderModifications

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/reference/typescript-api/entities/order-modification#ordermodification'>OrderModification</a>[]&#62;`}   />

Returns an array of any <a href='/reference/typescript-api/entities/order-modification#ordermodification'>OrderModification</a> entities associated with the Order.
### getPaymentRefunds

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, paymentId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/reference/typescript-api/entities/refund#refund'>Refund</a>[]&#62;`}   />

Returns any <a href='/reference/typescript-api/entities/refund#refund'>Refund</a>s associated with a <a href='/reference/typescript-api/entities/payment#payment'>Payment</a>.
### getSellerOrders

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/reference/typescript-api/entities/order#order'>Order</a>) => Promise&#60;<a href='/reference/typescript-api/entities/order#order'>Order</a>[]&#62;`}   />


### getAggregateOrder

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/reference/typescript-api/entities/order#order'>Order</a>) => Promise&#60;<a href='/reference/typescript-api/entities/order#order'>Order</a> | undefined&#62;`}   />


### getOrderChannels

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/reference/typescript-api/entities/order#order'>Order</a>) => Promise&#60;<a href='/reference/typescript-api/entities/channel#channel'>Channel</a>[]&#62;`}   />


### getActiveOrderForUser

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, userId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/reference/typescript-api/entities/order#order'>Order</a> | undefined&#62;`}   />

Returns any Order associated with the specified User's Customer account
that is still in the `active` state.
### create

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, userId?: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/reference/typescript-api/entities/order#order'>Order</a>&#62;`}   />

Creates a new, empty Order. If a `userId` is passed, the Order will get associated with that
User's Customer account.
### createDraft

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>) => `}   />


### updateCustomFields

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/reference/typescript-api/common/id#id'>ID</a>, customFields: any) => `}   />

Updates the custom fields of an Order.
### updateOrderCustomer

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, { customerId, orderId, note }: SetOrderCustomerInput) => `}  since="2.2.0"  />

Updates the Customer which is assigned to a given Order. The target Customer must be assigned to the same
Channels as the Order, otherwise an error will be thrown.
### addItemToOrder

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/reference/typescript-api/common/id#id'>ID</a>, productVariantId: <a href='/reference/typescript-api/common/id#id'>ID</a>, quantity: number, customFields?: { [key: string]: any }) => Promise&#60;<a href='/reference/typescript-api/errors/error-result-union#errorresultunion'>ErrorResultUnion</a>&#60;UpdateOrderItemsResult, <a href='/reference/typescript-api/entities/order#order'>Order</a>&#62;&#62;`}   />

Adds an item to the Order, either creating a new OrderLine or
incrementing an existing one.
### adjustOrderLine

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/reference/typescript-api/common/id#id'>ID</a>, orderLineId: <a href='/reference/typescript-api/common/id#id'>ID</a>, quantity: number, customFields?: { [key: string]: any }) => Promise&#60;<a href='/reference/typescript-api/errors/error-result-union#errorresultunion'>ErrorResultUnion</a>&#60;UpdateOrderItemsResult, <a href='/reference/typescript-api/entities/order#order'>Order</a>&#62;&#62;`}   />

Adjusts the quantity and/or custom field values of an existing OrderLine.
### removeItemFromOrder

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/reference/typescript-api/common/id#id'>ID</a>, orderLineId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/reference/typescript-api/errors/error-result-union#errorresultunion'>ErrorResultUnion</a>&#60;RemoveOrderItemsResult, <a href='/reference/typescript-api/entities/order#order'>Order</a>&#62;&#62;`}   />

Removes the specified OrderLine from the Order.
### removeAllItemsFromOrder

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/reference/typescript-api/errors/error-result-union#errorresultunion'>ErrorResultUnion</a>&#60;RemoveOrderItemsResult, <a href='/reference/typescript-api/entities/order#order'>Order</a>&#62;&#62;`}   />

Removes all OrderLines from the Order.
### addSurchargeToOrder

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/reference/typescript-api/common/id#id'>ID</a>, surchargeInput: Partial&#60;Omit&#60;<a href='/reference/typescript-api/entities/surcharge#surcharge'>Surcharge</a>, 'id' | 'createdAt' | 'updatedAt' | 'order'&#62;&#62;) => Promise&#60;<a href='/reference/typescript-api/entities/order#order'>Order</a>&#62;`}   />

Adds a <a href='/reference/typescript-api/entities/surcharge#surcharge'>Surcharge</a> to the Order.
### removeSurchargeFromOrder

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/reference/typescript-api/common/id#id'>ID</a>, surchargeId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/reference/typescript-api/entities/order#order'>Order</a>&#62;`}   />

Removes a <a href='/reference/typescript-api/entities/surcharge#surcharge'>Surcharge</a> from the Order.
### applyCouponCode

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/reference/typescript-api/common/id#id'>ID</a>, couponCode: string) => Promise&#60;<a href='/reference/typescript-api/errors/error-result-union#errorresultunion'>ErrorResultUnion</a>&#60;ApplyCouponCodeResult, <a href='/reference/typescript-api/entities/order#order'>Order</a>&#62;&#62;`}   />

Applies a coupon code to the Order, which should be a valid coupon code as specified in the configuration
of an active <a href='/reference/typescript-api/entities/promotion#promotion'>Promotion</a>.
### removeCouponCode

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/reference/typescript-api/common/id#id'>ID</a>, couponCode: string) => `}   />

Removes a coupon code from the Order.
### getOrderPromotions

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/reference/typescript-api/entities/promotion#promotion'>Promotion</a>[]&#62;`}   />

Returns all <a href='/reference/typescript-api/entities/promotion#promotion'>Promotion</a>s associated with an Order.
### getNextOrderStates

<MemberInfo kind="method" type={`(order: <a href='/reference/typescript-api/entities/order#order'>Order</a>) => readonly <a href='/reference/typescript-api/orders/order-process#orderstate'>OrderState</a>[]`}   />

Returns the next possible states that the Order may transition to.
### setShippingAddress

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/reference/typescript-api/common/id#id'>ID</a>, input: CreateAddressInput) => Promise&#60;<a href='/reference/typescript-api/entities/order#order'>Order</a>&#62;`}   />

Sets the shipping address for the Order.
### setBillingAddress

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/reference/typescript-api/common/id#id'>ID</a>, input: CreateAddressInput) => Promise&#60;<a href='/reference/typescript-api/entities/order#order'>Order</a>&#62;`}   />

Sets the billing address for the Order.
### getEligibleShippingMethods

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;ShippingMethodQuote[]&#62;`}   />

Returns an array of quotes stating which <a href='/reference/typescript-api/entities/shipping-method#shippingmethod'>ShippingMethod</a>s may be applied to this Order.
This is determined by the configured <a href='/reference/typescript-api/shipping/shipping-eligibility-checker#shippingeligibilitychecker'>ShippingEligibilityChecker</a> of each ShippingMethod.

The quote also includes a price for each method, as determined by the configured
<a href='/reference/typescript-api/shipping/shipping-calculator#shippingcalculator'>ShippingCalculator</a> of each eligible ShippingMethod.
### getEligiblePaymentMethods

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;PaymentMethodQuote[]&#62;`}   />

Returns an array of quotes stating which <a href='/reference/typescript-api/entities/payment-method#paymentmethod'>PaymentMethod</a>s may be used on this Order.
### setShippingMethod

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/reference/typescript-api/common/id#id'>ID</a>, shippingMethodIds: <a href='/reference/typescript-api/common/id#id'>ID</a>[]) => Promise&#60;<a href='/reference/typescript-api/errors/error-result-union#errorresultunion'>ErrorResultUnion</a>&#60;SetOrderShippingMethodResult, <a href='/reference/typescript-api/entities/order#order'>Order</a>&#62;&#62;`}   />

Sets the ShippingMethod to be used on this Order.
### transitionToState

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/reference/typescript-api/common/id#id'>ID</a>, state: <a href='/reference/typescript-api/orders/order-process#orderstate'>OrderState</a>) => Promise&#60;<a href='/reference/typescript-api/entities/order#order'>Order</a> | OrderStateTransitionError&#62;`}   />

Transitions the Order to the given state.
### transitionFulfillmentToState

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, fulfillmentId: <a href='/reference/typescript-api/common/id#id'>ID</a>, state: <a href='/reference/typescript-api/fulfillment/fulfillment-state#fulfillmentstate'>FulfillmentState</a>) => Promise&#60;<a href='/reference/typescript-api/entities/fulfillment#fulfillment'>Fulfillment</a> | FulfillmentStateTransitionError&#62;`}   />

Transitions a Fulfillment to the given state and then transitions the Order state based on
whether all Fulfillments of the Order are shipped or delivered.
### transitionRefundToState

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, refundId: <a href='/reference/typescript-api/common/id#id'>ID</a>, state: <a href='/reference/typescript-api/payment/refund-state#refundstate'>RefundState</a>, transactionId?: string) => Promise&#60;<a href='/reference/typescript-api/entities/refund#refund'>Refund</a> | RefundStateTransitionError&#62;`}   />

Transitions a Refund to the given state
### modifyOrder

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: ModifyOrderInput) => Promise&#60;<a href='/reference/typescript-api/errors/error-result-union#errorresultunion'>ErrorResultUnion</a>&#60;ModifyOrderResult, <a href='/reference/typescript-api/entities/order#order'>Order</a>&#62;&#62;`}   />

Allows the Order to be modified, which allows several aspects of the Order to be changed:

* Changes to OrderLine quantities
* New OrderLines being added
* Arbitrary <a href='/reference/typescript-api/entities/surcharge#surcharge'>Surcharge</a>s being added
* Shipping or billing address changes

Setting the `dryRun` input property to `true` will apply all changes, including updating the price of the
Order, except history entry and additional payment actions.

__Using dryRun option, you must wrap function call in transaction manually.__
### transitionPaymentToState

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, paymentId: <a href='/reference/typescript-api/common/id#id'>ID</a>, state: <a href='/reference/typescript-api/payment/payment-state#paymentstate'>PaymentState</a>) => Promise&#60;<a href='/reference/typescript-api/errors/error-result-union#errorresultunion'>ErrorResultUnion</a>&#60;TransitionPaymentToStateResult, <a href='/reference/typescript-api/entities/payment#payment'>Payment</a>&#62;&#62;`}   />

Transitions the given <a href='/reference/typescript-api/entities/payment#payment'>Payment</a> to a new state. If the order totalWithTax price is then
covered by Payments, the Order state will be automatically transitioned to `PaymentSettled`
or `PaymentAuthorized`.
### addPaymentToOrder

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/reference/typescript-api/common/id#id'>ID</a>, input: PaymentInput) => Promise&#60;<a href='/reference/typescript-api/errors/error-result-union#errorresultunion'>ErrorResultUnion</a>&#60;AddPaymentToOrderResult, <a href='/reference/typescript-api/entities/order#order'>Order</a>&#62;&#62;`}   />

Adds a new Payment to the Order. If the Order totalWithTax is covered by Payments, then the Order
state will get automatically transitioned to the `PaymentSettled` or `PaymentAuthorized` state.
### addManualPaymentToOrder

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: ManualPaymentInput) => Promise&#60;<a href='/reference/typescript-api/errors/error-result-union#errorresultunion'>ErrorResultUnion</a>&#60;AddManualPaymentToOrderResult, <a href='/reference/typescript-api/entities/order#order'>Order</a>&#62;&#62;`}   />

This method is used after modifying an existing completed order using the `modifyOrder()` method. If the modifications
cause the order total to increase (such as when adding a new OrderLine), then there will be an outstanding charge to
pay.

This method allows you to add a new Payment and assumes the actual processing has been done manually, e.g. in the
dashboard of your payment provider.
### settlePayment

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, paymentId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/reference/typescript-api/errors/error-result-union#errorresultunion'>ErrorResultUnion</a>&#60;<a href='/reference/typescript-api/payment/payment-method-types#settlepaymentresult'>SettlePaymentResult</a>, <a href='/reference/typescript-api/entities/payment#payment'>Payment</a>&#62;&#62;`}   />

Settles a payment by invoking the <a href='/reference/typescript-api/payment/payment-method-handler#paymentmethodhandler'>PaymentMethodHandler</a>'s `settlePayment()` method. Automatically
transitions the Order state if all Payments are settled.
### cancelPayment

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, paymentId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/reference/typescript-api/errors/error-result-union#errorresultunion'>ErrorResultUnion</a>&#60;<a href='/reference/typescript-api/payment/payment-method-types#cancelpaymentresult'>CancelPaymentResult</a>, <a href='/reference/typescript-api/entities/payment#payment'>Payment</a>&#62;&#62;`}   />

Cancels a payment by invoking the <a href='/reference/typescript-api/payment/payment-method-handler#paymentmethodhandler'>PaymentMethodHandler</a>'s `cancelPayment()` method (if defined), and transitions the Payment to
the `Cancelled` state.
### createFulfillment

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: FulfillOrderInput) => Promise&#60;<a href='/reference/typescript-api/errors/error-result-union#errorresultunion'>ErrorResultUnion</a>&#60;AddFulfillmentToOrderResult, <a href='/reference/typescript-api/entities/fulfillment#fulfillment'>Fulfillment</a>&#62;&#62;`}   />

Creates a new Fulfillment associated with the given Order and OrderItems.
### getOrderFulfillments

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/reference/typescript-api/entities/order#order'>Order</a>) => Promise&#60;<a href='/reference/typescript-api/entities/fulfillment#fulfillment'>Fulfillment</a>[]&#62;`}   />

Returns an array of all Fulfillments associated with the Order.
### getOrderSurcharges

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderId: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/reference/typescript-api/entities/surcharge#surcharge'>Surcharge</a>[]&#62;`}   />

Returns an array of all Surcharges associated with the Order.
### cancelOrder

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: CancelOrderInput) => Promise&#60;<a href='/reference/typescript-api/errors/error-result-union#errorresultunion'>ErrorResultUnion</a>&#60;CancelOrderResult, <a href='/reference/typescript-api/entities/order#order'>Order</a>&#62;&#62;`}   />

Cancels an Order by transitioning it to the `Cancelled` state. If stock is being tracked for the ProductVariants
in the Order, then new <a href='/reference/typescript-api/entities/stock-movement#stockmovement'>StockMovement</a>s will be created to correct the stock levels.
### refundOrder

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: RefundOrderInput) => Promise&#60;<a href='/reference/typescript-api/errors/error-result-union#errorresultunion'>ErrorResultUnion</a>&#60;RefundOrderResult, <a href='/reference/typescript-api/entities/refund#refund'>Refund</a>&#62;&#62;`}   />

Creates a <a href='/reference/typescript-api/entities/refund#refund'>Refund</a> against the order and in doing so invokes the `createRefund()` method of the
<a href='/reference/typescript-api/payment/payment-method-handler#paymentmethodhandler'>PaymentMethodHandler</a>.
### settleRefund

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: SettleRefundInput) => Promise&#60;<a href='/reference/typescript-api/entities/refund#refund'>Refund</a>&#62;`}   />

Settles a Refund by transitioning it to the `Settled` state.
### addCustomerToOrder

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderIdOrOrder: <a href='/reference/typescript-api/common/id#id'>ID</a> | <a href='/reference/typescript-api/entities/order#order'>Order</a>, customer: <a href='/reference/typescript-api/entities/customer#customer'>Customer</a>) => Promise&#60;<a href='/reference/typescript-api/entities/order#order'>Order</a>&#62;`}   />

Associates a Customer with the Order.
### addNoteToOrder

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: AddNoteToOrderInput) => Promise&#60;<a href='/reference/typescript-api/entities/order#order'>Order</a>&#62;`}   />

Creates a new "ORDER_NOTE" type <a href='/reference/typescript-api/entities/order-history-entry#orderhistoryentry'>OrderHistoryEntry</a> in the Order's history timeline.
### updateOrderNote

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: UpdateOrderNoteInput) => Promise&#60;<a href='/reference/typescript-api/entities/history-entry#historyentry'>HistoryEntry</a>&#62;`}   />


### deleteOrderNote

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, id: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;DeletionResponse&#62;`}   />


### deleteOrder

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderOrId: <a href='/reference/typescript-api/common/id#id'>ID</a> | <a href='/reference/typescript-api/entities/order#order'>Order</a>) => `}  since="1.5.0"  />

Deletes an Order, ensuring that any Sessions that reference this Order are dereferenced before deletion.
### mergeOrders

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, user: <a href='/reference/typescript-api/entities/user#user'>User</a>, guestOrder?: <a href='/reference/typescript-api/entities/order#order'>Order</a>, existingOrder?: <a href='/reference/typescript-api/entities/order#order'>Order</a>) => Promise&#60;<a href='/reference/typescript-api/entities/order#order'>Order</a> | undefined&#62;`}   />

When a guest user with an anonymous Order signs in and has an existing Order associated with that Customer,
we need to reconcile the contents of the two orders.

The logic used to do the merging is specified in the <a href='/reference/typescript-api/orders/order-options#orderoptions'>OrderOptions</a> `mergeStrategy` config setting.
### applyPriceAdjustments

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/reference/typescript-api/entities/order#order'>Order</a>, updatedOrderLines?: <a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>[]) => Promise&#60;<a href='/reference/typescript-api/entities/order#order'>Order</a>&#62;`}   />

Applies promotions, taxes and shipping to the Order. If the `updatedOrderLines` argument is passed in,
then all of those OrderLines will have their prices re-calculated using the configured <a href='/reference/typescript-api/orders/order-item-price-calculation-strategy#orderitempricecalculationstrategy'>OrderItemPriceCalculationStrategy</a>.


</div>
