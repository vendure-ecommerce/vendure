---
title: "StockMovement"
weight: 10
date: 2023-07-14T16:57:50.015Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# StockMovement
<div class="symbol">


# StockMovement

{{< generation-info sourceFile="packages/core/src/entity/stock-movement/stock-movement.entity.ts" sourceLine="19" packageName="@vendure/core">}}

A StockMovement is created whenever stock of a particular ProductVariant goes in
or out.

## Signature

```TypeScript
class StockMovement extends VendureEntity {
  @Column({ nullable: false, type: 'varchar' }) readonly @Column({ nullable: false, type: 'varchar' })
    readonly type: StockMovementType;
  @Index() @ManyToOne(type => ProductVariant, variant => variant.stockMovements) @Index()
    @ManyToOne(type => ProductVariant, variant => variant.stockMovements)
    productVariant: ProductVariant;
  @Index() @ManyToOne(type => StockLocation, { onDelete: 'CASCADE' }) @Index()
    @ManyToOne(type => StockLocation, { onDelete: 'CASCADE' })
    stockLocation: StockLocation;
  @EntityId() @EntityId()
    stockLocationId: ID;
  @Column() @Column()
    quantity: number;
}
```
## Extends

 * <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>


## Members

### type

{{< member-info kind="property" type="StockMovementType"  >}}

{{< member-description >}}{{< /member-description >}}

### productVariant

{{< member-info kind="property" type="<a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### stockLocation

{{< member-info kind="property" type="<a href='/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### stockLocationId

{{< member-info kind="property" type="<a href='/typescript-api/common/id#id'>ID</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### quantity

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# Allocation

{{< generation-info sourceFile="packages/core/src/entity/stock-movement/allocation.entity.ts" sourceLine="17" packageName="@vendure/core">}}

An Allocation is created for each ProductVariant in an Order when the checkout is completed
(as configured by the <a href='/typescript-api/orders/stock-allocation-strategy#stockallocationstrategy'>StockAllocationStrategy</a>. This prevents stock being sold twice.

## Signature

```TypeScript
class Allocation extends StockMovement {
  readonly readonly type = StockMovementType.ALLOCATION;
  constructor(input: DeepPartial<Allocation>)
  @Index() @ManyToOne(type => OrderLine) @Index()
    @ManyToOne(type => OrderLine)
    orderLine: OrderLine;
}
```
## Extends

 * <a href='/typescript-api/entities/stock-movement#stockmovement'>StockMovement</a>


## Members

### type

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### constructor

{{< member-info kind="method" type="(input: DeepPartial&#60;<a href='/typescript-api/entities/stock-movement#allocation'>Allocation</a>&#62;) => Allocation"  >}}

{{< member-description >}}{{< /member-description >}}

### orderLine

{{< member-info kind="property" type="<a href='/typescript-api/entities/order-line#orderline'>OrderLine</a>"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# Cancellation

{{< generation-info sourceFile="packages/core/src/entity/stock-movement/cancellation.entity.ts" sourceLine="16" packageName="@vendure/core">}}

A Cancellation is created when OrderItems from a fulfilled Order are cancelled.

## Signature

```TypeScript
class Cancellation extends StockMovement {
  readonly readonly type = StockMovementType.CANCELLATION;
  constructor(input: DeepPartial<Cancellation>)
  @ManyToOne(type => OrderLine) @ManyToOne(type => OrderLine)
    orderLine: OrderLine;
}
```
## Extends

 * <a href='/typescript-api/entities/stock-movement#stockmovement'>StockMovement</a>


## Members

### type

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### constructor

{{< member-info kind="method" type="(input: DeepPartial&#60;<a href='/typescript-api/entities/stock-movement#cancellation'>Cancellation</a>&#62;) => Cancellation"  >}}

{{< member-description >}}{{< /member-description >}}

### orderLine

{{< member-info kind="property" type="<a href='/typescript-api/entities/order-line#orderline'>OrderLine</a>"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# Release

{{< generation-info sourceFile="packages/core/src/entity/stock-movement/release.entity.ts" sourceLine="17" packageName="@vendure/core">}}

A Release is created when OrderItems which have been allocated (but not yet fulfilled)
are cancelled.

## Signature

```TypeScript
class Release extends StockMovement {
  readonly readonly type = StockMovementType.RELEASE;
  constructor(input: DeepPartial<Release>)
  @ManyToOne(type => OrderLine) @ManyToOne(type => OrderLine)
    orderLine: OrderLine;
}
```
## Extends

 * <a href='/typescript-api/entities/stock-movement#stockmovement'>StockMovement</a>


## Members

### type

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### constructor

{{< member-info kind="method" type="(input: DeepPartial&#60;<a href='/typescript-api/entities/stock-movement#release'>Release</a>&#62;) => Release"  >}}

{{< member-description >}}{{< /member-description >}}

### orderLine

{{< member-info kind="property" type="<a href='/typescript-api/entities/order-line#orderline'>OrderLine</a>"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# Sale

{{< generation-info sourceFile="packages/core/src/entity/stock-movement/sale.entity.ts" sourceLine="16" packageName="@vendure/core">}}

A Sale is created when OrderItems are fulfilled.

## Signature

```TypeScript
class Sale extends StockMovement {
  readonly readonly type = StockMovementType.SALE;
  constructor(input: DeepPartial<Sale>)
  @ManyToOne(type => OrderLine) @ManyToOne(type => OrderLine)
    orderLine: OrderLine;
}
```
## Extends

 * <a href='/typescript-api/entities/stock-movement#stockmovement'>StockMovement</a>


## Members

### type

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### constructor

{{< member-info kind="method" type="(input: DeepPartial&#60;<a href='/typescript-api/entities/stock-movement#sale'>Sale</a>&#62;) => Sale"  >}}

{{< member-description >}}{{< /member-description >}}

### orderLine

{{< member-info kind="property" type="<a href='/typescript-api/entities/order-line#orderline'>OrderLine</a>"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# StockAdjustment

{{< generation-info sourceFile="packages/core/src/entity/stock-movement/stock-adjustment.entity.ts" sourceLine="14" packageName="@vendure/core">}}

A StockAdjustment is created when the `stockOnHand` level of a ProductVariant is manually adjusted.

## Signature

```TypeScript
class StockAdjustment extends StockMovement {
  readonly readonly type = StockMovementType.ADJUSTMENT;
  constructor(input: DeepPartial<StockAdjustment>)
}
```
## Extends

 * <a href='/typescript-api/entities/stock-movement#stockmovement'>StockMovement</a>


## Members

### type

{{< member-info kind="property" type=""  >}}

{{< member-description >}}{{< /member-description >}}

### constructor

{{< member-info kind="method" type="(input: DeepPartial&#60;<a href='/typescript-api/entities/stock-movement#stockadjustment'>StockAdjustment</a>&#62;) => StockAdjustment"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
