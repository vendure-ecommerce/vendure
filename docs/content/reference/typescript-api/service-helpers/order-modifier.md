---
title: "OrderModifier"
weight: 10
date: 2023-07-14T16:57:50.246Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# OrderModifier
<div class="symbol">


# OrderModifier

{{< generation-info sourceFile="packages/core/src/service/helpers/order-modifier/order-modifier.ts" sourceLine="80" packageName="@vendure/core">}}

This helper is responsible for modifying the contents of an Order.

Note:
There is not a clear separation of concerns between the OrderService and this, since
the OrderService also contains some method which modify the Order (e.g. removeItemFromOrder).
So this helper was mainly extracted to isolate the huge `modifyOrder` method since the
OrderService was just growing too large. Future refactoring could improve the organization
of these Order-related methods into a more clearly-delineated set of classes.

## Signature

```TypeScript
class OrderModifier {
  constructor(connection: TransactionalConnection, configService: ConfigService, orderCalculator: OrderCalculator, paymentService: PaymentService, countryService: CountryService, stockMovementService: StockMovementService, productVariantService: ProductVariantService, customFieldRelationService: CustomFieldRelationService, promotionService: PromotionService, eventBus: EventBus, entityHydrator: EntityHydrator, historyService: HistoryService, translator: TranslatorService)
  async constrainQuantityToSaleable(ctx: RequestContext, variant: ProductVariant, quantity: number, existingQuantity:  = 0) => ;
  async getExistingOrderLine(ctx: RequestContext, order: Order, productVariantId: ID, customFields?: { [key: string]: any }) => Promise<OrderLine | undefined>;
  async getOrCreateOrderLine(ctx: RequestContext, order: Order, productVariantId: ID, customFields?: { [key: string]: any }) => ;
  async updateOrderLineQuantity(ctx: RequestContext, orderLine: OrderLine, quantity: number, order: Order) => Promise<OrderLine>;
  async cancelOrderByOrderLines(ctx: RequestContext, input: CancelOrderInput, lineInputs: OrderLineInput[]) => ;
  async modifyOrder(ctx: RequestContext, input: ModifyOrderInput, order: Order) => Promise<JustErrorResults<ModifyOrderResult> | { order: Order; modification: OrderModification }>;
}
```
## Members

### constructor

{{< member-info kind="method" type="(connection: <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, configService: ConfigService, orderCalculator: <a href='/typescript-api/service-helpers/order-calculator#ordercalculator'>OrderCalculator</a>, paymentService: <a href='/typescript-api/services/payment-service#paymentservice'>PaymentService</a>, countryService: <a href='/typescript-api/services/country-service#countryservice'>CountryService</a>, stockMovementService: <a href='/typescript-api/services/stock-movement-service#stockmovementservice'>StockMovementService</a>, productVariantService: <a href='/typescript-api/services/product-variant-service#productvariantservice'>ProductVariantService</a>, customFieldRelationService: CustomFieldRelationService, promotionService: <a href='/typescript-api/services/promotion-service#promotionservice'>PromotionService</a>, eventBus: <a href='/typescript-api/events/event-bus#eventbus'>EventBus</a>, entityHydrator: <a href='/typescript-api/data-access/entity-hydrator#entityhydrator'>EntityHydrator</a>, historyService: <a href='/typescript-api/services/history-service#historyservice'>HistoryService</a>, translator: TranslatorService) => OrderModifier"  >}}

{{< member-description >}}{{< /member-description >}}

### constrainQuantityToSaleable

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, variant: <a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>, quantity: number, existingQuantity:  = 0) => "  >}}

{{< member-description >}}Ensure that the ProductVariant has sufficient saleable stock to add the given
quantity to an Order.{{< /member-description >}}

### getExistingOrderLine

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/typescript-api/entities/order#order'>Order</a>, productVariantId: <a href='/typescript-api/common/id#id'>ID</a>, customFields?: { [key: string]: any }) => Promise&#60;<a href='/typescript-api/entities/order-line#orderline'>OrderLine</a> | undefined&#62;"  >}}

{{< member-description >}}Given a ProductVariant ID and optional custom fields, this method will return an existing OrderLine that
matches, or `undefined` if no match is found.{{< /member-description >}}

### getOrCreateOrderLine

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/typescript-api/entities/order#order'>Order</a>, productVariantId: <a href='/typescript-api/common/id#id'>ID</a>, customFields?: { [key: string]: any }) => "  >}}

{{< member-description >}}Returns the OrderLine containing the given <a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>, taking into account any custom field values. If no existing
OrderLine is found, a new OrderLine will be created.{{< /member-description >}}

### updateOrderLineQuantity

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, orderLine: <a href='/typescript-api/entities/order-line#orderline'>OrderLine</a>, quantity: number, order: <a href='/typescript-api/entities/order#order'>Order</a>) => Promise&#60;<a href='/typescript-api/entities/order-line#orderline'>OrderLine</a>&#62;"  >}}

{{< member-description >}}Updates the quantity of an OrderLine, taking into account the available saleable stock level.
Returns the actual quantity that the OrderLine was updated to (which may be less than the
`quantity` argument if insufficient stock was available.{{< /member-description >}}

### cancelOrderByOrderLines

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: CancelOrderInput, lineInputs: OrderLineInput[]) => "  >}}

{{< member-description >}}{{< /member-description >}}

### modifyOrder

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, input: ModifyOrderInput, order: <a href='/typescript-api/entities/order#order'>Order</a>) => Promise&#60;JustErrorResults&#60;ModifyOrderResult&#62; | { order: <a href='/typescript-api/entities/order#order'>Order</a>; modification: <a href='/typescript-api/entities/order-modification#ordermodification'>OrderModification</a> }&#62;"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
