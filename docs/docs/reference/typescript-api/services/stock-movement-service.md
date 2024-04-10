---
title: "StockMovementService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## StockMovementService

<GenerationInfo sourceFile="packages/core/src/service/services/stock-movement.service.ts" sourceLine="41" packageName="@vendure/core" />

Contains methods relating to <a href='/reference/typescript-api/entities/stock-movement#stockmovement'>StockMovement</a> entities.

```ts title="Signature"
class StockMovementService {
    shippingEligibilityCheckers: ShippingEligibilityChecker[];
    shippingCalculators: ShippingCalculator[];
    constructor(connection: TransactionalConnection, listQueryBuilder: ListQueryBuilder, globalSettingsService: GlobalSettingsService, stockLevelService: StockLevelService, eventBus: EventBus, stockLocationService: StockLocationService, configService: ConfigService)
    getStockMovementsByProductVariantId(ctx: RequestContext, productVariantId: ID, options: StockMovementListOptions) => Promise<PaginatedList<StockMovement>>;
    adjustProductVariantStock(ctx: RequestContext, productVariantId: ID, stockOnHandNumberOrInput: number | StockLevelInput[]) => Promise<StockAdjustment[]>;
    createAllocationsForOrder(ctx: RequestContext, order: Order) => Promise<Allocation[]>;
    createAllocationsForOrderLines(ctx: RequestContext, lines: OrderLineInput[]) => Promise<Allocation[]>;
    createSalesForOrder(ctx: RequestContext, lines: OrderLineInput[]) => Promise<Sale[]>;
    createCancellationsForOrderLines(ctx: RequestContext, lineInputs: OrderLineInput[]) => Promise<Cancellation[]>;
    createReleasesForOrderLines(ctx: RequestContext, lineInputs: OrderLineInput[]) => Promise<Release[]>;
}
```

<div className="members-wrapper">

### shippingEligibilityCheckers

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/shipping/shipping-eligibility-checker#shippingeligibilitychecker'>ShippingEligibilityChecker</a>[]`}   />


### shippingCalculators

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/shipping/shipping-calculator#shippingcalculator'>ShippingCalculator</a>[]`}   />


### constructor

<MemberInfo kind="method" type={`(connection: <a href='/reference/typescript-api/data-access/transactional-connection#transactionalconnection'>TransactionalConnection</a>, listQueryBuilder: <a href='/reference/typescript-api/data-access/list-query-builder#listquerybuilder'>ListQueryBuilder</a>, globalSettingsService: <a href='/reference/typescript-api/services/global-settings-service#globalsettingsservice'>GlobalSettingsService</a>, stockLevelService: <a href='/reference/typescript-api/services/stock-level-service#stocklevelservice'>StockLevelService</a>, eventBus: <a href='/reference/typescript-api/events/event-bus#eventbus'>EventBus</a>, stockLocationService: StockLocationService, configService: ConfigService) => StockMovementService`}   />


### getStockMovementsByProductVariantId

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productVariantId: <a href='/reference/typescript-api/common/id#id'>ID</a>, options: StockMovementListOptions) => Promise&#60;<a href='/reference/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/reference/typescript-api/entities/stock-movement#stockmovement'>StockMovement</a>&#62;&#62;`}   />

Returns a <a href='/reference/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a> of all StockMovements associated with the specified ProductVariant.
### adjustProductVariantStock

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, productVariantId: <a href='/reference/typescript-api/common/id#id'>ID</a>, stockOnHandNumberOrInput: number | StockLevelInput[]) => Promise&#60;<a href='/reference/typescript-api/entities/stock-movement#stockadjustment'>StockAdjustment</a>[]&#62;`}   />

Adjusts the stock level of the ProductVariant, creating a new <a href='/reference/typescript-api/entities/stock-movement#stockadjustment'>StockAdjustment</a> entity
in the process.
### createAllocationsForOrder

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, order: <a href='/reference/typescript-api/entities/order#order'>Order</a>) => Promise&#60;<a href='/reference/typescript-api/entities/stock-movement#allocation'>Allocation</a>[]&#62;`}   />

Creates a new <a href='/reference/typescript-api/entities/stock-movement#allocation'>Allocation</a> for each OrderLine in the Order. For ProductVariants
which are configured to track stock levels, the `ProductVariant.stockAllocated` value is
increased, indicating that this quantity of stock is allocated and cannot be sold.
### createAllocationsForOrderLines

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, lines: OrderLineInput[]) => Promise&#60;<a href='/reference/typescript-api/entities/stock-movement#allocation'>Allocation</a>[]&#62;`}   />

Creates a new <a href='/reference/typescript-api/entities/stock-movement#allocation'>Allocation</a> for each of the given OrderLines. For ProductVariants
which are configured to track stock levels, the `ProductVariant.stockAllocated` value is
increased, indicating that this quantity of stock is allocated and cannot be sold.
### createSalesForOrder

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, lines: OrderLineInput[]) => Promise&#60;<a href='/reference/typescript-api/entities/stock-movement#sale'>Sale</a>[]&#62;`}   />

Creates <a href='/reference/typescript-api/entities/stock-movement#sale'>Sale</a>s for each OrderLine in the Order. For ProductVariants
which are configured to track stock levels, the `ProductVariant.stockAllocated` value is
reduced and the `stockOnHand` value is also reduced by the OrderLine quantity, indicating
that the stock is no longer allocated, but is actually sold and no longer available.
### createCancellationsForOrderLines

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, lineInputs: OrderLineInput[]) => Promise&#60;<a href='/reference/typescript-api/entities/stock-movement#cancellation'>Cancellation</a>[]&#62;`}   />

Creates a <a href='/reference/typescript-api/entities/stock-movement#cancellation'>Cancellation</a> for each of the specified OrderItems. For ProductVariants
which are configured to track stock levels, the `ProductVariant.stockOnHand` value is
increased for each Cancellation, allowing that stock to be sold again.
### createReleasesForOrderLines

<MemberInfo kind="method" type={`(ctx: <a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>, lineInputs: OrderLineInput[]) => Promise&#60;<a href='/reference/typescript-api/entities/stock-movement#release'>Release</a>[]&#62;`}   />

Creates a <a href='/reference/typescript-api/entities/stock-movement#release'>Release</a> for each of the specified OrderItems. For ProductVariants
which are configured to track stock levels, the `ProductVariant.stockAllocated` value is
reduced, indicating that this stock is once again available to buy.


</div>
