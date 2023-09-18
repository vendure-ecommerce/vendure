---
title: "Surcharge"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Surcharge

<GenerationInfo sourceFile="packages/core/src/entity/surcharge/surcharge.entity.ts" sourceLine="21" packageName="@vendure/core" />

A Surcharge represents an arbitrary extra item on an <a href='/reference/typescript-api/entities/order#order'>Order</a> which is not
a ProductVariant. It can be used to e.g. represent payment-related surcharges.

```ts title="Signature"
class Surcharge extends VendureEntity {
    constructor(input?: DeepPartial<Surcharge>)
    @Column()
    description: string;
    @Money()
    listPrice: number;
    @Column()
    listPriceIncludesTax: boolean;
    @Column()
    sku: string;
    @Column('simple-json')
    taxLines: TaxLine[];
    @Index()
    @ManyToOne(type => Order, order => order.surcharges, { onDelete: 'CASCADE' })
    order: Order;
    @Index()
    @ManyToOne(type => OrderModification, orderModification => orderModification.surcharges)
    orderModification: OrderModification;
    price: number
    priceWithTax: number
    taxRate: number
}
```
* Extends: <code><a href='/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(input?: DeepPartial&#60;<a href='/reference/typescript-api/entities/surcharge#surcharge'>Surcharge</a>&#62;) => Surcharge`}   />


### description

<MemberInfo kind="property" type={`string`}   />


### listPrice

<MemberInfo kind="property" type={`number`}   />


### listPriceIncludesTax

<MemberInfo kind="property" type={`boolean`}   />


### sku

<MemberInfo kind="property" type={`string`}   />


### taxLines

<MemberInfo kind="property" type={`TaxLine[]`}   />


### order

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/order#order'>Order</a>`}   />


### orderModification

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/order-modification#ordermodification'>OrderModification</a>`}   />


### price

<MemberInfo kind="property" type={`number`}   />


### priceWithTax

<MemberInfo kind="property" type={`number`}   />


### taxRate

<MemberInfo kind="property" type={`number`}   />




</div>
