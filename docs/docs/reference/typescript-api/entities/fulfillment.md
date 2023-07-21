---
title: "Fulfillment"
weight: 10
date: 2023-07-21T07:17:00.870Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Fulfillment

<GenerationInfo sourceFile="packages/core/src/entity/fulfillment/fulfillment.entity.ts" sourceLine="17" packageName="@vendure/core" />

This entity represents a fulfillment of an Order or part of it, i.e. which <a href='/docs/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>s have been
delivered to the Customer after successful payment.

```ts title="Signature"
class Fulfillment extends VendureEntity implements HasCustomFields {
  constructor(input?: DeepPartial<Fulfillment>)
  @Column('varchar') @Column('varchar') state: FulfillmentState;
  @Column({ default: '' }) @Column({ default: '' })
    trackingCode: string;
  @Column() @Column()
    method: string;
  @Column() @Column()
    handlerCode: string;
  @OneToMany(type => FulfillmentLine, fulfillmentLine => fulfillmentLine.fulfillment) @OneToMany(type => FulfillmentLine, fulfillmentLine => fulfillmentLine.fulfillment)
    lines: FulfillmentLine[];
  @Column(type => CustomFulfillmentFields) @Column(type => CustomFulfillmentFields)
    customFields: CustomFulfillmentFields;
}
```
* Extends: <code><a href='/docs/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a></code>


* Implements: <code>HasCustomFields</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type="(input?: DeepPartial&#60;<a href='/docs/reference/typescript-api/entities/fulfillment#fulfillment'>Fulfillment</a>&#62;) => Fulfillment"   />


### state

<MemberInfo kind="property" type="<a href='/docs/reference/typescript-api/fulfillment/fulfillment-state#fulfillmentstate'>FulfillmentState</a>"   />


### trackingCode

<MemberInfo kind="property" type="string"   />


### method

<MemberInfo kind="property" type="string"   />


### handlerCode

<MemberInfo kind="property" type="string"   />


### lines

<MemberInfo kind="property" type="<a href='/docs/reference/typescript-api/entities/order-line-reference#fulfillmentline'>FulfillmentLine</a>[]"   />


### customFields

<MemberInfo kind="property" type="CustomFulfillmentFields"   />




</div>
