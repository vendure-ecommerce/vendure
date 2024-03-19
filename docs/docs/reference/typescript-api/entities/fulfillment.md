---
title: "Fulfillment"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Fulfillment

<GenerationInfo sourceFile="packages/core/src/entity/fulfillment/fulfillment.entity.ts" sourceLine="18" packageName="@vendure/core" />

This entity represents a fulfillment of an Order or part of it, i.e. which <a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>s have been
delivered to the Customer after successful payment.

```ts title="Signature"
class Fulfillment extends VendureEntity implements HasCustomFields {
    constructor(input?: DeepPartial<Fulfillment>)
    @Column('varchar') state: FulfillmentState;
    @Column({ default: '' })
    trackingCode: string;
    @Column()
    method: string;
    @Column()
    handlerCode: string;
    @OneToMany(type => FulfillmentLine, fulfillmentLine => fulfillmentLine.fulfillment)
    lines: FulfillmentLine[];
    @ManyToMany(type => Order, order => order.fulfillments)
    orders: Order[];
    @Column(type => CustomFulfillmentFields)
    customFields: CustomFulfillmentFields;
}
```
* Extends: <code><a href='/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a></code>


* Implements: <code>HasCustomFields</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(input?: DeepPartial&#60;<a href='/reference/typescript-api/entities/fulfillment#fulfillment'>Fulfillment</a>&#62;) => Fulfillment`}   />


### state

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/fulfillment/fulfillment-state#fulfillmentstate'>FulfillmentState</a>`}   />


### trackingCode

<MemberInfo kind="property" type={`string`}   />


### method

<MemberInfo kind="property" type={`string`}   />


### handlerCode

<MemberInfo kind="property" type={`string`}   />


### lines

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/order-line-reference#fulfillmentline'>FulfillmentLine</a>[]`}   />


### orders

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/order#order'>Order</a>[]`}   />


### customFields

<MemberInfo kind="property" type={`CustomFulfillmentFields`}   />




</div>
