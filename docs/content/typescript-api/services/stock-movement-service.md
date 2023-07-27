---
title: "StockMovementService"
weight: 10
date: 2023-07-14T16:57:50.600Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# StockMovementService
<div class="symbol">


# StockMovementService

{{< generation-info sourceFile="packages/core/src/service/services/stock-movement.service.ts" sourceLine="43" packageName="@vendure/core">}}

Contains methods relating to <a href='/typescript-api/entities/stock-movement#stockmovement'>StockMovement</a> entities.

## Signature

```TypeScript
class StockMovementService {
  shippingEligibilityCheckers: ShippingEligibilityChecker[];
  shippingCalculators: ShippingCalculator[];
  constructor(connection: TransactionalConnection, listQueryBuilder: ListQueryBuilder, globalSettingsService: GlobalSettingsService, stockLevelService: StockLevelService, eventBus: EventBus, stockLocationService: StockLocationService, configService: ConfigService)
  getStockMovementsByProductVariantId(ctx: RequestContext, productVariantId: ID, options: StockMovementListOptions) => Promise<PaginatedList<StockMovement>>;
  async adjustProductVariantStock(ctx: RequestContext, productVariantId: ID, stockOnHandNumberOrInput: number | StockLevelInput[]) => Promise<StockAdjustment[]>;
  async createAllocationsForOrder(ctx: RequestContext, order: Order) => Promise<Allocation[]>;
  async createAllocationsForOrderLines(ctx: RequestContext, lines: OrderLineInput[]) => Promise<Allocation[]>;
  async createSalesForOrder(ctx: RequestContext, lines: OrderLineInput[]) => Promise<Sale[]>;
  async createCancellationsForOrderLines(ctx: RequestContext, lineInputs: OrderLineInput[]) => Promise<Cancellation[]>;
  async createReleasesForOrderLines(ctx: RequestContext, lineInputs: OrderLineInput[]) => Promise<Release[]>;
}
```
## Members

### shippingEligibilityCheckers

{{< member-info kind="property" type="<a href='/typescript-api/shipping/shipping-eligibility-checker#shippingeligibilitychecker'>ShippingEligibilityChecker</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### shippingCalculators

{{< member-info kind="property" type="<a href='/typescript-api/shipping/shipping-calculator#shippingcalculator'>ShippingCalculator</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### constructor

{{< member-info kind="method" type="(connection: <a href='/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, listQueryBuilder: <a href='/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>, globalSettingsService: <a href='/typescript-api/services/global-settings-service#globalsettingsservice'>GlobalSettingsService</a>, stockLevelService: <a href='/typescript-api/services/stock-level-service#stocklevelservice'>StockLevelService</a>, eventBus: <a href='/typescript-api/events/event-bus#eventbus'>EventBus</a>, stockLocationService: StockLocationService, configService: ConfigService) => StockMovementService"  >}}

{{< member-description >}}{{< /member-description >}}

### getStockMovementsByProductVariantId

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productVariantId: <a href='/typescript-api/common/id#id'>ID</a>, options: StockMovementListOptions) => Promise&#60;<a href='/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/typescript-api/entities/stock-movement#stockmovement'>StockMovement</a>&#62;&#62;"  >}}

{{< member-description >}}Returns a <a href='/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a> of all StockMovements associated with the specified ProductVariant.{{< /member-description >}}

### adjustProductVariantStock

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productVariantId: <a href='/typescript-api/common/id#id'>ID</a>, stockOnHandNumberOrInput: number | StockLevelInput[]) => Promise&#60;<a href='/typescript-api/entities/stock-movement#stockadjustment'>StockAdjustment</a>[]&#62;"  >}}

{{< member-description >}}Adjusts the stock level of the ProductVariant, creating a new <a href='/typescript-api/entities/stock-movement#stockadjustment'>StockAdjustment</a> entity
in the process.{{< /member-description >}}

### createAllocationsForOrder

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/typescript-api/entities/order#order'>Order</a>) => Promise&#60;<a href='/typescript-api/entities/stock-movement#allocation'>Allocation</a>[]&#62;"  >}}

{{< member-description >}}Creates a new <a href='/typescript-api/entities/stock-movement#allocation'>Allocation</a> for each OrderLine in the Order. For ProductVariants
which are configured to track stock levels, the `ProductVariant.stockAllocated` value is
increased, indicating that this quantity of stock is allocated and cannot be sold.{{< /member-description >}}

### createAllocationsForOrderLines

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, lines: OrderLineInput[]) => Promise&#60;<a href='/typescript-api/entities/stock-movement#allocation'>Allocation</a>[]&#62;"  >}}

{{< member-description >}}Creates a new <a href='/typescript-api/entities/stock-movement#allocation'>Allocation</a> for each of the given OrderLines. For ProductVariants
which are configured to track stock levels, the `ProductVariant.stockAllocated` value is
increased, indicating that this quantity of stock is allocated and cannot be sold.{{< /member-description >}}

### createSalesForOrder

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, lines: OrderLineInput[]) => Promise&#60;<a href='/typescript-api/entities/stock-movement#sale'>Sale</a>[]&#62;"  >}}

{{< member-description >}}Creates <a href='/typescript-api/entities/stock-movement#sale'>Sale</a>s for each OrderLine in the Order. For ProductVariants
which are configured to track stock levels, the `ProductVariant.stockAllocated` value is
reduced and the `stockOnHand` value is also reduced by the OrderLine quantity, indicating
that the stock is no longer allocated, but is actually sold and no longer available.{{< /member-description >}}

### createCancellationsForOrderLines

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, lineInputs: OrderLineInput[]) => Promise&#60;<a href='/typescript-api/entities/stock-movement#cancellation'>Cancellation</a>[]&#62;"  >}}

{{< member-description >}}Creates a <a href='/typescript-api/entities/stock-movement#cancellation'>Cancellation</a> for each of the specified OrderItems. For ProductVariants
which are configured to track stock levels, the `ProductVariant.stockOnHand` value is
increased for each Cancellation, allowing that stock to be sold again.{{< /member-description >}}

### createReleasesForOrderLines

{{< member-info kind="method" type="(ctx: <a href='/typescript-api/request/request-context#requestcontext'>RequestContext</a>, lineInputs: OrderLineInput[]) => Promise&#60;<a href='/typescript-api/entities/stock-movement#release'>Release</a>[]&#62;"  >}}

{{< member-description >}}Creates a <a href='/typescript-api/entities/stock-movement#release'>Release</a> for each of the specified OrderItems. For ProductVariants
which are configured to track stock levels, the `ProductVariant.stockAllocated` value is
reduced, indicating that this stock is once again available to buy.{{< /member-description >}}


</div>
