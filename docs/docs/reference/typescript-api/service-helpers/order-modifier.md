---
title: "OrderModifier"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## OrderModifier

<GenerationInfo sourceFile="packages/core/src/service/helpers/order-modifier/order-modifier.ts" sourceLine="80" packageName="@vendure/core" />

This helper is responsible for modifying the contents of an Order.

Note:
There is not a clear separation of concerns between the OrderService and this, since
the OrderService also contains some method which modify the Order (e.g. removeItemFromOrder).
So this helper was mainly extracted to isolate the huge `modifyOrder` method since the
OrderService was just growing too large. Future refactoring could improve the organization
of these Order-related methods into a more clearly-delineated set of classes.

```ts title="Signature"
class OrderModifier {
    constructor(connection: TransactionalConnection, configService: ConfigService, orderCalculator: OrderCalculator, paymentService: PaymentService, countryService: CountryService, stockMovementService: StockMovementService, productVariantService: ProductVariantService, customFieldRelationService: CustomFieldRelationService, promotionService: PromotionService, eventBus: EventBus, entityHydrator: EntityHydrator, historyService: HistoryService, translator: TranslatorService)
    constrainQuantityToSaleable(ctx: RequestContext, variant: ProductVariant, quantity: number, existingQuantity:  = 0) => ;
    getExistingOrderLine(ctx: RequestContext, order: Order, productVariantId: ID, customFields?: { [key: string]: any }) => Promise<OrderLine | undefined>;
    getOrCreateOrderLine(ctx: RequestContext, order: Order, productVariantId: ID, customFields?: { [key: string]: any }) => ;
    updateOrderLineQuantity(ctx: RequestContext, orderLine: OrderLine, quantity: number, order: Order) => Promise<OrderLine>;
    cancelOrderByOrderLines(ctx: RequestContext, input: CancelOrderInput, lineInputs: OrderLineInput[]) => ;
    modifyOrder(ctx: RequestContext, input: ModifyOrderInput, order: Order) => Promise<JustErrorResults<ModifyOrderResult> | { order: Order; modification: OrderModification }>;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(connection: <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, configService: ConfigService, orderCalculator: <a href='/reference/typescript-api/service-helpers/order-calculator#ordercalculator'>OrderCalculator</a>, paymentService: <a href='/reference/typescript-api/services/payment-service#paymentservice'>PaymentService</a>, countryService: <a href='/reference/typescript-api/services/country-service#countryservice'>CountryService</a>, stockMovementService: <a href='/reference/typescript-api/services/stock-movement-service#stockmovementservice'>StockMovementService</a>, productVariantService: <a href='/reference/typescript-api/services/product-variant-service#productvariantservice'>ProductVariantService</a>, customFieldRelationService: CustomFieldRelationService, promotionService: <a href='/reference/typescript-api/services/promotion-service#promotionservice'>PromotionService</a>, eventBus: <a href='/reference/typescript-api/events/event-bus#eventbus'>EventBus</a>, entityHydrator: <a href='/reference/typescript-api/data-access/entity-hydrator#entityhydrator'>EntityHydrator</a>, historyService: <a href='/reference/typescript-api/services/history-service#historyservice'>HistoryService</a>, translator: <a href='/reference/typescript-api/service-helpers/translator-service#translatorservice'>TranslatorService</a>) => OrderModifier`}   />


### constrainQuantityToSaleable

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, variant: <a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>, quantity: number, existingQuantity:  = 0) => `}   />

Ensure that the ProductVariant has sufficient saleable stock to add the given
quantity to an Order.
### getExistingOrderLine

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/reference/typescript-api/entities/order#order'>Order</a>, productVariantId: <a href='/reference/typescript-api/common/id#id'>ID</a>, customFields?: { [key: string]: any }) => Promise&#60;<a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a> | undefined&#62;`}   />

Given a ProductVariant ID and optional custom fields, this method will return an existing OrderLine that
matches, or `undefined` if no match is found.
### getOrCreateOrderLine

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/reference/typescript-api/entities/order#order'>Order</a>, productVariantId: <a href='/reference/typescript-api/common/id#id'>ID</a>, customFields?: { [key: string]: any }) => `}   />

Returns the OrderLine containing the given <a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>, taking into account any custom field values. If no existing
OrderLine is found, a new OrderLine will be created.
### updateOrderLineQuantity

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderLine: <a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>, quantity: number, order: <a href='/reference/typescript-api/entities/order#order'>Order</a>) => Promise&#60;<a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>&#62;`}   />

Updates the quantity of an OrderLine, taking into account the available saleable stock level.
Returns the actual quantity that the OrderLine was updated to (which may be less than the
`quantity` argument if insufficient stock was available.
### cancelOrderByOrderLines

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: CancelOrderInput, lineInputs: OrderLineInput[]) => `}   />


### modifyOrder

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: ModifyOrderInput, order: <a href='/reference/typescript-api/entities/order#order'>Order</a>) => Promise&#60;JustErrorResults&#60;ModifyOrderResult&#62; | { order: <a href='/reference/typescript-api/entities/order#order'>Order</a>; modification: <a href='/reference/typescript-api/entities/order-modification#ordermodification'>OrderModification</a> }&#62;`}   />




</div>
