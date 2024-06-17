---
title: "Refund"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Refund

<GenerationInfo sourceFile="packages/core/src/entity/refund/refund.entity.ts" sourceLine="17" packageName="@vendure/core" />

A refund the belongs to an order

```ts title="Signature"
class Refund extends VendureEntity {
    constructor(input?: DeepPartial<Refund>)
    @Money() items: number;
    @Money() shipping: number;
    @Money() adjustment: number;
    @Money() total: number;
    @Column() method: string;
    @Column({ nullable: true }) reason: string;
    @Column('varchar') state: RefundState;
    @Column({ nullable: true }) transactionId: string;
    @OneToMany(type => RefundLine, line => line.refund)
    @JoinTable()
    lines: RefundLine[];
    @Index()
    @ManyToOne(type => Payment, payment => payment.refunds)
    @JoinColumn()
    payment: Payment;
    @EntityId()
    paymentId: ID;
    @Column('simple-json') metadata: PaymentMetadata;
}
```
* Extends: <code><a href='/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(input?: DeepPartial&#60;<a href='/reference/typescript-api/entities/refund#refund'>Refund</a>&#62;) => Refund`}   />


### items

<MemberInfo kind="property" type={`number`}   />


### shipping

<MemberInfo kind="property" type={`number`}   />


### adjustment

<MemberInfo kind="property" type={`number`}   />


### total

<MemberInfo kind="property" type={`number`}   />


### method

<MemberInfo kind="property" type={`string`}   />


### reason

<MemberInfo kind="property" type={`string`}   />


### state

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/payment/refund-state#refundstate'>RefundState</a>`}   />


### transactionId

<MemberInfo kind="property" type={`string`}   />


### lines

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/order-line-reference#refundline'>RefundLine</a>[]`}   />


### payment

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/payment#payment'>Payment</a>`}   />


### paymentId

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/id#id'>ID</a>`}   />


### metadata

<MemberInfo kind="property" type={`PaymentMetadata`}   />




</div>
