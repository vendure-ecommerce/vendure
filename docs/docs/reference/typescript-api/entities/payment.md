---
title: "Payment"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Payment

<GenerationInfo sourceFile="packages/core/src/entity/payment/payment.entity.ts" sourceLine="18" packageName="@vendure/core" />

A Payment represents a single payment transaction and exists in a well-defined state
defined by the <a href='/reference/typescript-api/payment/payment-state#paymentstate'>PaymentState</a> type.

```ts title="Signature"
class Payment extends VendureEntity {
    constructor(input?: DeepPartial<Payment>)
    @Column() method: string;
    @Money() amount: number;
    @Column('varchar') state: PaymentState;
    @Column({ type: 'varchar', nullable: true })
    errorMessage: string | undefined;
    @Column({ nullable: true })
    transactionId: string;
    @Column('simple-json') metadata: PaymentMetadata;
    @Index()
    @ManyToOne(type => Order, order => order.payments)
    order: Order;
    @OneToMany(type => Refund, refund => refund.payment)
    refunds: Refund[];
}
```
* Extends: <code><a href='/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(input?: DeepPartial&#60;<a href='/reference/typescript-api/entities/payment#payment'>Payment</a>&#62;) => Payment`}   />


### method

<MemberInfo kind="property" type={`string`}   />


### amount

<MemberInfo kind="property" type={`number`}   />


### state

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/payment/payment-state#paymentstate'>PaymentState</a>`}   />


### errorMessage

<MemberInfo kind="property" type={`string | undefined`}   />


### transactionId

<MemberInfo kind="property" type={`string`}   />


### metadata

<MemberInfo kind="property" type={`PaymentMetadata`}   />


### order

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/order#order'>Order</a>`}   />


### refunds

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/refund#refund'>Refund</a>[]`}   />




</div>
