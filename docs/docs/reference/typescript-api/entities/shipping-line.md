---
title: "ShippingLine"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ShippingLine

<GenerationInfo sourceFile="packages/core/src/entity/shipping-line/shipping-line.entity.ts" sourceLine="24" packageName="@vendure/core" />

A ShippingLine is created when a <a href='/reference/typescript-api/entities/shipping-method#shippingmethod'>ShippingMethod</a> is applied to an <a href='/reference/typescript-api/entities/order#order'>Order</a>.
It contains information about the price of the shipping method, any discounts that were
applied, and the resulting tax on the shipping method.

```ts title="Signature"
class ShippingLine extends VendureEntity {
    constructor(input?: DeepPartial<ShippingLine>)
    @EntityId()
    shippingMethodId: ID | null;
    @Index()
    @ManyToOne(type => ShippingMethod)
    shippingMethod: ShippingMethod;
    @Index()
    @ManyToOne(type => Order, order => order.shippingLines, { onDelete: 'CASCADE' })
    order: Order;
    @Money()
    listPrice: number;
    @Column()
    listPriceIncludesTax: boolean;
    @Column('simple-json')
    adjustments: Adjustment[];
    @Column('simple-json')
    taxLines: TaxLine[];
    @OneToMany(type => OrderLine, orderLine => orderLine.shippingLine)
    orderLines: OrderLine[];
    price: number
    priceWithTax: number
    discountedPrice: number
    discountedPriceWithTax: number
    taxRate: number
    discounts: Discount[]
    addAdjustment(adjustment: Adjustment) => ;
    clearAdjustments() => ;
}
```
* Extends: <code><a href='/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(input?: DeepPartial&#60;<a href='/reference/typescript-api/entities/shipping-line#shippingline'>ShippingLine</a>&#62;) => ShippingLine`}   />


### shippingMethodId

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/id#id'>ID</a> | null`}   />


### shippingMethod

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/shipping-method#shippingmethod'>ShippingMethod</a>`}   />


### order

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/order#order'>Order</a>`}   />


### listPrice

<MemberInfo kind="property" type={`number`}   />


### listPriceIncludesTax

<MemberInfo kind="property" type={`boolean`}   />


### adjustments

<MemberInfo kind="property" type={`Adjustment[]`}   />


### taxLines

<MemberInfo kind="property" type={`TaxLine[]`}   />


### orderLines

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/order-line#orderline'>OrderLine</a>[]`}   />


### price

<MemberInfo kind="property" type={`number`}   />


### priceWithTax

<MemberInfo kind="property" type={`number`}   />


### discountedPrice

<MemberInfo kind="property" type={`number`}   />


### discountedPriceWithTax

<MemberInfo kind="property" type={`number`}   />


### taxRate

<MemberInfo kind="property" type={`number`}   />


### discounts

<MemberInfo kind="property" type={`Discount[]`}   />


### addAdjustment

<MemberInfo kind="method" type={`(adjustment: Adjustment) => `}   />


### clearAdjustments

<MemberInfo kind="method" type={`() => `}   />




</div>
