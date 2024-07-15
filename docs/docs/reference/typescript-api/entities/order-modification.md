---
title: "OrderModification"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## OrderModification

<GenerationInfo sourceFile="packages/core/src/entity/order-modification/order-modification.entity.ts" sourceLine="21" packageName="@vendure/core" />

An entity which represents a modification to an order which has been placed, and
then modified afterwards by an administrator.

```ts title="Signature"
class OrderModification extends VendureEntity {
    constructor(input?: DeepPartial<OrderModification>)
    @Column()
    note: string;
    @Index()
    @ManyToOne(type => Order, order => order.modifications, { onDelete: 'CASCADE' })
    order: Order;
    @OneToMany(type => OrderModificationLine, line => line.modification)
    lines: OrderModificationLine[];
    @OneToMany(type => Surcharge, surcharge => surcharge.orderModification)
    surcharges: Surcharge[];
    @Money()
    priceChange: number;
    @OneToOne(type => Payment)
    @JoinColumn()
    payment?: Payment;
    @OneToOne(type => Refund)
    @JoinColumn()
    refund?: Refund;
    @Column('simple-json', { nullable: true }) shippingAddressChange: OrderAddress;
    @Column('simple-json', { nullable: true }) billingAddressChange: OrderAddress;
    isSettled: boolean
}
```
* Extends: <code><a href='/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(input?: DeepPartial&#60;<a href='/reference/typescript-api/entities/order-modification#ordermodification'>OrderModification</a>&#62;) => OrderModification`}   />


### note

<MemberInfo kind="property" type={`string`}   />


### order

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/order#order'>Order</a>`}   />


### lines

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/order-line-reference#ordermodificationline'>OrderModificationLine</a>[]`}   />


### surcharges

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/surcharge#surcharge'>Surcharge</a>[]`}   />


### priceChange

<MemberInfo kind="property" type={`number`}   />


### payment

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/payment#payment'>Payment</a>`}   />


### refund

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/refund#refund'>Refund</a>`}   />


### shippingAddressChange

<MemberInfo kind="property" type={`OrderAddress`}   />


### billingAddressChange

<MemberInfo kind="property" type={`OrderAddress`}   />


### isSettled

<MemberInfo kind="property" type={`boolean`}   />




</div>
