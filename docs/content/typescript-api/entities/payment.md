---
title: "Payment"
weight: 10
date: 2023-07-14T16:57:49.930Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# Payment
<div class="symbol">


# Payment

{{< generation-info sourceFile="packages/core/src/entity/payment/payment.entity.ts" sourceLine="18" packageName="@vendure/core">}}

A Payment represents a single payment transaction and exists in a well-defined state
defined by the <a href='/typescript-api/payment/payment-state#paymentstate'>PaymentState</a> type.

## Signature

```TypeScript
class Payment extends VendureEntity {
  constructor(input?: DeepPartial<Payment>)
  @Column() @Column() method: string;
  @Money() @Money() amount: number;
  @Column('varchar') @Column('varchar') state: PaymentState;
  @Column({ type: 'varchar', nullable: true }) @Column({ type: 'varchar', nullable: true })
    errorMessage: string | undefined;
  @Column({ nullable: true }) @Column({ nullable: true })
    transactionId: string;
  @Column('simple-json') @Column('simple-json') metadata: PaymentMetadata;
  @Index() @ManyToOne(type => Order, order => order.payments) @Index()
    @ManyToOne(type => Order, order => order.payments)
    order: Order;
  @OneToMany(type => Refund, refund => refund.payment) @OneToMany(type => Refund, refund => refund.payment)
    refunds: Refund[];
}
```
## Extends

 * <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>


## Members

### constructor

{{< member-info kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/payment#payment'>Payment</a>&#62;) => Payment"  >}}

{{< member-description >}}{{< /member-description >}}

### method

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### amount

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### state

{{< member-info kind="property" type="<a href='/typescript-api/payment/payment-state#paymentstate'>PaymentState</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### errorMessage

{{< member-info kind="property" type="string | undefined"  >}}

{{< member-description >}}{{< /member-description >}}

### transactionId

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### metadata

{{< member-info kind="property" type="PaymentMetadata"  >}}

{{< member-description >}}{{< /member-description >}}

### order

{{< member-info kind="property" type="<a href='/typescript-api/entities/order#order'>Order</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### refunds

{{< member-info kind="property" type="Refund[]"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
