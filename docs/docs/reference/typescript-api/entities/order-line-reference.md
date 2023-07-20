---
title: "OrderLineReference"
weight: 10
date: 2023-07-14T16:57:49.919Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# OrderLineReference
<div class="symbol">


# FulfillmentLine

{{< generation-info sourceFile="packages/core/src/entity/order-line-reference/fulfillment-line.entity.ts" sourceLine="16" packageName="@vendure/core">}}

This entity represents a line from an <a href='/typescript-api/entities/order#order'>Order</a> which has been fulfilled by a <a href='/typescript-api/entities/fulfillment#fulfillment'>Fulfillment</a>.

## Signature

```TypeScript
class FulfillmentLine extends OrderLineReference {
  constructor(input?: DeepPartial<FulfillmentLine>)
  @Index() @ManyToOne(type => Fulfillment, fulfillment => fulfillment.lines) @Index()
    @ManyToOne(type => Fulfillment, fulfillment => fulfillment.lines)
    fulfillment: Fulfillment;
  @EntityId() @EntityId()
    fulfillmentId: ID;
}
```
## Extends

 * <a href='/typescript-api/entities/order-line-reference#orderlinereference'>OrderLineReference</a>


## Members

### constructor

{{< member-info kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/order-line-reference#fulfillmentline'>FulfillmentLine</a>&#62;) => FulfillmentLine"  >}}

{{< member-description >}}{{< /member-description >}}

### fulfillment

{{< member-info kind="property" type="<a href='/typescript-api/entities/fulfillment#fulfillment'>Fulfillment</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### fulfillmentId

{{< member-info kind="property" type="<a href='/typescript-api/common/id#id'>ID</a>"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# OrderLineReference

{{< generation-info sourceFile="packages/core/src/entity/order-line-reference/order-line-reference.entity.ts" sourceLine="15" packageName="@vendure/core">}}

This is an abstract base class for entities which reference an <a href='/typescript-api/entities/order-line#orderline'>OrderLine</a>.

## Signature

```TypeScript
class OrderLineReference extends VendureEntity {
  @Column() @Column()
    quantity: number;
  @Index() @ManyToOne(type => OrderLine, { onDelete: 'CASCADE' }) @Index()
    @ManyToOne(type => OrderLine, { onDelete: 'CASCADE' })
    orderLine: OrderLine;
  @EntityId() @EntityId()
    orderLineId: ID;
}
```
## Extends

 * <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>


## Members

### quantity

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### orderLine

{{< member-info kind="property" type="<a href='/typescript-api/entities/order-line#orderline'>OrderLine</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### orderLineId

{{< member-info kind="property" type="<a href='/typescript-api/common/id#id'>ID</a>"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# OrderModificationLine

{{< generation-info sourceFile="packages/core/src/entity/order-line-reference/order-modification-line.entity.ts" sourceLine="16" packageName="@vendure/core">}}

This entity represents a line from an <a href='/typescript-api/entities/order#order'>Order</a> which has been modified by an <a href='/typescript-api/entities/order-modification#ordermodification'>OrderModification</a>.

## Signature

```TypeScript
class OrderModificationLine extends OrderLineReference {
  constructor(input?: DeepPartial<OrderModificationLine>)
  @Index() @ManyToOne(type => OrderModification, modification => modification.lines) @Index()
    @ManyToOne(type => OrderModification, modification => modification.lines)
    modification: OrderModification;
  @EntityId() @EntityId()
    modificationId: ID;
}
```
## Extends

 * <a href='/typescript-api/entities/order-line-reference#orderlinereference'>OrderLineReference</a>


## Members

### constructor

{{< member-info kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/order-line-reference#ordermodificationline'>OrderModificationLine</a>&#62;) => OrderModificationLine"  >}}

{{< member-description >}}{{< /member-description >}}

### modification

{{< member-info kind="property" type="<a href='/typescript-api/entities/order-modification#ordermodification'>OrderModification</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### modificationId

{{< member-info kind="property" type="<a href='/typescript-api/common/id#id'>ID</a>"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
<div class="symbol">


# RefundLine

{{< generation-info sourceFile="packages/core/src/entity/order-line-reference/refund-line.entity.ts" sourceLine="16" packageName="@vendure/core">}}

This entity represents a line from an <a href='/typescript-api/entities/order#order'>Order</a> which has been refunded by a {@link Refund}.

## Signature

```TypeScript
class RefundLine extends OrderLineReference {
  constructor(input?: DeepPartial<RefundLine>)
  @Index() @ManyToOne(type => Refund, refund => refund.lines) @Index()
    @ManyToOne(type => Refund, refund => refund.lines)
    refund: Refund;
  @EntityId() @EntityId()
    refundId: ID;
}
```
## Extends

 * <a href='/typescript-api/entities/order-line-reference#orderlinereference'>OrderLineReference</a>


## Members

### constructor

{{< member-info kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/order-line-reference#refundline'>RefundLine</a>&#62;) => RefundLine"  >}}

{{< member-description >}}{{< /member-description >}}

### refund

{{< member-info kind="property" type="Refund"  >}}

{{< member-description >}}{{< /member-description >}}

### refundId

{{< member-info kind="property" type="<a href='/typescript-api/common/id#id'>ID</a>"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
