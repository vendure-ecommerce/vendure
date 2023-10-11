---
title: "StockMovement"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## StockMovement

<GenerationInfo sourceFile="packages/core/src/entity/stock-movement/stock-movement.entity.ts" sourceLine="19" packageName="@vendure/core" />

A StockMovement is created whenever stock of a particular ProductVariant goes in
or out.

```ts title="Signature"
class StockMovement extends VendureEntity {
    @Column({ nullable: false, type: 'varchar' })
    readonly type: StockMovementType;
    @Index()
    @ManyToOne(type => ProductVariant, variant => variant.stockMovements)
    productVariant: ProductVariant;
    @Index()
    @ManyToOne(type => StockLocation, { onDelete: 'CASCADE' })
    stockLocation: StockLocation;
    @EntityId()
    stockLocationId: ID;
    @Column()
    quantity: number;
}
```
* Extends: <code><a href='/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a></code>



<div className="members-wrapper">

### type

<MemberInfo kind="property" type={`StockMovementType`}   />


### productVariant

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>`}   />


### stockLocation

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>`}   />


### stockLocationId

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/id#id'>ID</a>`}   />


### quantity

<MemberInfo kind="property" type={`number`}   />




</div>


## Allocation

<GenerationInfo sourceFile="packages/core/src/entity/stock-movement/allocation.entity.ts" sourceLine="17" packageName="@vendure/core" />

An Allocation is created for each ProductVariant in an Order when the checkout is completed
(as configured by the <a href='/reference/typescript-api/orders/stock-allocation-strategy#stockallocationstrategy'>StockAllocationStrategy</a>. This prevents stock being sold twice.

```ts title="Signature"
class Allocation extends StockMovement {
    readonly type = StockMovementType.ALLOCATION;
    constructor(input: DeepPartial<Allocation>)
    @Index()
    @ManyToOne(type => OrderLine)
    orderLine: OrderLine;
}
```
* Extends: <code><a href='/reference/typescript-api/entities/stock-movement#stockmovement'>StockMovement</a></code>



<div className="members-wrapper">

### type

<MemberInfo kind="property" type={``}   />


### constructor

<MemberInfo kind="method" type={`(input: DeepPartial&#60;<a href='/reference/typescript-api/entities/stock-movement#allocation'>Allocation</a>&#62;) => Allocation`}   />


### orderLine

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>`}   />




</div>


## Cancellation

<GenerationInfo sourceFile="packages/core/src/entity/stock-movement/cancellation.entity.ts" sourceLine="16" packageName="@vendure/core" />

A Cancellation is created when OrderItems from a fulfilled Order are cancelled.

```ts title="Signature"
class Cancellation extends StockMovement {
    readonly type = StockMovementType.CANCELLATION;
    constructor(input: DeepPartial<Cancellation>)
    @ManyToOne(type => OrderLine)
    orderLine: OrderLine;
}
```
* Extends: <code><a href='/reference/typescript-api/entities/stock-movement#stockmovement'>StockMovement</a></code>



<div className="members-wrapper">

### type

<MemberInfo kind="property" type={``}   />


### constructor

<MemberInfo kind="method" type={`(input: DeepPartial&#60;<a href='/reference/typescript-api/entities/stock-movement#cancellation'>Cancellation</a>&#62;) => Cancellation`}   />


### orderLine

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>`}   />




</div>


## Release

<GenerationInfo sourceFile="packages/core/src/entity/stock-movement/release.entity.ts" sourceLine="17" packageName="@vendure/core" />

A Release is created when OrderItems which have been allocated (but not yet fulfilled)
are cancelled.

```ts title="Signature"
class Release extends StockMovement {
    readonly type = StockMovementType.RELEASE;
    constructor(input: DeepPartial<Release>)
    @ManyToOne(type => OrderLine)
    orderLine: OrderLine;
}
```
* Extends: <code><a href='/reference/typescript-api/entities/stock-movement#stockmovement'>StockMovement</a></code>



<div className="members-wrapper">

### type

<MemberInfo kind="property" type={``}   />


### constructor

<MemberInfo kind="method" type={`(input: DeepPartial&#60;<a href='/reference/typescript-api/entities/stock-movement#release'>Release</a>&#62;) => Release`}   />


### orderLine

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>`}   />




</div>


## Sale

<GenerationInfo sourceFile="packages/core/src/entity/stock-movement/sale.entity.ts" sourceLine="16" packageName="@vendure/core" />

A Sale is created when OrderItems are fulfilled.

```ts title="Signature"
class Sale extends StockMovement {
    readonly type = StockMovementType.SALE;
    constructor(input: DeepPartial<Sale>)
    @ManyToOne(type => OrderLine)
    orderLine: OrderLine;
}
```
* Extends: <code><a href='/reference/typescript-api/entities/stock-movement#stockmovement'>StockMovement</a></code>



<div className="members-wrapper">

### type

<MemberInfo kind="property" type={``}   />


### constructor

<MemberInfo kind="method" type={`(input: DeepPartial&#60;<a href='/reference/typescript-api/entities/stock-movement#sale'>Sale</a>&#62;) => Sale`}   />


### orderLine

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>`}   />




</div>


## StockAdjustment

<GenerationInfo sourceFile="packages/core/src/entity/stock-movement/stock-adjustment.entity.ts" sourceLine="14" packageName="@vendure/core" />

A StockAdjustment is created when the `stockOnHand` level of a ProductVariant is manually adjusted.

```ts title="Signature"
class StockAdjustment extends StockMovement {
    readonly type = StockMovementType.ADJUSTMENT;
    constructor(input: DeepPartial<StockAdjustment>)
}
```
* Extends: <code><a href='/reference/typescript-api/entities/stock-movement#stockmovement'>StockMovement</a></code>



<div className="members-wrapper">

### type

<MemberInfo kind="property" type={``}   />


### constructor

<MemberInfo kind="method" type={`(input: DeepPartial&#60;<a href='/reference/typescript-api/entities/stock-movement#stockadjustment'>StockAdjustment</a>&#62;) => StockAdjustment`}   />




</div>
