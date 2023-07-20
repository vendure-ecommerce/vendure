---
title: "OrderModification"
weight: 10
date: 2023-07-14T16:57:49.925Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# OrderModification
<div class="symbol">


# OrderModification

{{< generation-info sourceFile="packages/core/src/entity/order-modification/order-modification.entity.ts" sourceLine="21" packageName="@vendure/core">}}

An entity which represents a modification to an order which has been placed, and
then modified afterwards by an administrator.

## Signature

```TypeScript
class OrderModification extends VendureEntity {
  constructor(input?: DeepPartial<OrderModification>)
  @Column() @Column()
    note: string;
  @Index() @ManyToOne(type => Order, order => order.modifications, { onDelete: 'CASCADE' }) @Index()
    @ManyToOne(type => Order, order => order.modifications, { onDelete: 'CASCADE' })
    order: Order;
  @OneToMany(type => OrderModificationLine, line => line.modification) @OneToMany(type => OrderModificationLine, line => line.modification)
    lines: OrderModificationLine[];
  @OneToMany(type => Surcharge, surcharge => surcharge.orderModification) @OneToMany(type => Surcharge, surcharge => surcharge.orderModification)
    surcharges: Surcharge[];
  @Money() @Money()
    priceChange: number;
  @OneToOne(type => Payment) @JoinColumn() @OneToOne(type => Payment)
    @JoinColumn()
    payment?: Payment;
  @OneToOne(type => Refund) @JoinColumn() @OneToOne(type => Refund)
    @JoinColumn()
    refund?: Refund;
  @Column('simple-json', { nullable: true }) @Column('simple-json', { nullable: true }) shippingAddressChange: OrderAddress;
  @Column('simple-json', { nullable: true }) @Column('simple-json', { nullable: true }) billingAddressChange: OrderAddress;
  @Calculated() isSettled: boolean
}
```
## Extends

 * <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>


## Members

### constructor

{{< member-info kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/order-modification#ordermodification'>OrderModification</a>&#62;) => OrderModification"  >}}

{{< member-description >}}{{< /member-description >}}

### note

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### order

{{< member-info kind="property" type="<a href='/typescript-api/entities/order#order'>Order</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### lines

{{< member-info kind="property" type="<a href='/typescript-api/entities/order-line-reference#ordermodificationline'>OrderModificationLine</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### surcharges

{{< member-info kind="property" type="<a href='/typescript-api/entities/surcharge#surcharge'>Surcharge</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### priceChange

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### payment

{{< member-info kind="property" type="<a href='/typescript-api/entities/payment#payment'>Payment</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### refund

{{< member-info kind="property" type="Refund"  >}}

{{< member-description >}}{{< /member-description >}}

### shippingAddressChange

{{< member-info kind="property" type="OrderAddress"  >}}

{{< member-description >}}{{< /member-description >}}

### billingAddressChange

{{< member-info kind="property" type="OrderAddress"  >}}

{{< member-description >}}{{< /member-description >}}

### isSettled

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
