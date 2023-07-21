---
title: "ShippingLine"
weight: 10
date: 2023-07-21T07:17:01.096Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ShippingLine

<GenerationInfo sourceFile="packages/core/src/entity/shipping-line/shipping-line.entity.ts" sourceLine="23" packageName="@vendure/core" />

A ShippingLine is created when a <a href='/docs/reference/typescript-api/entities/shipping-method#shippingmethod'>ShippingMethod</a> is applied to an <a href='/docs/reference/typescript-api/entities/order#order'>Order</a>.
It contains information about the price of the shipping method, any discounts that were
applied, and the resulting tax on the shipping method.

```ts title="Signature"
class ShippingLine extends VendureEntity {
  constructor(input?: DeepPartial<ShippingLine>)
  @EntityId() @EntityId()
    shippingMethodId: ID | null;
  @Index() @ManyToOne(type => ShippingMethod) @Index()
    @ManyToOne(type => ShippingMethod)
    shippingMethod: ShippingMethod;
  @Index() @ManyToOne(type => Order, order => order.shippingLines, { onDelete: 'CASCADE' }) @Index()
    @ManyToOne(type => Order, order => order.shippingLines, { onDelete: 'CASCADE' })
    order: Order;
  @Money() @Money()
    listPrice: number;
  @Column() @Column()
    listPriceIncludesTax: boolean;
  @Column('simple-json') @Column('simple-json')
    adjustments: Adjustment[];
  @Column('simple-json') @Column('simple-json')
    taxLines: TaxLine[];
  @Calculated() price: number
  @Calculated() priceWithTax: number
  @Calculated() discountedPrice: number
  @Calculated() discountedPriceWithTax: number
  @Calculated() taxRate: number
  @Calculated() discounts: Discount[]
  addAdjustment(adjustment: Adjustment) => ;
  clearAdjustments() => ;
}
```
* Extends: <code><a href='/docs/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type="(input?: DeepPartial&#60;<a href='/docs/reference/typescript-api/entities/shipping-line#shippingline'>ShippingLine</a>&#62;) => ShippingLine"   />


### shippingMethodId

<MemberInfo kind="property" type="<a href='/docs/reference/typescript-api/common/id#id'>ID</a> | null"   />


### shippingMethod

<MemberInfo kind="property" type="<a href='/docs/reference/typescript-api/entities/shipping-method#shippingmethod'>ShippingMethod</a>"   />


### order

<MemberInfo kind="property" type="<a href='/docs/reference/typescript-api/entities/order#order'>Order</a>"   />


### listPrice

<MemberInfo kind="property" type="number"   />


### listPriceIncludesTax

<MemberInfo kind="property" type="boolean"   />


### adjustments

<MemberInfo kind="property" type="Adjustment[]"   />


### taxLines

<MemberInfo kind="property" type="TaxLine[]"   />


### price

<MemberInfo kind="property" type="number"   />


### priceWithTax

<MemberInfo kind="property" type="number"   />


### discountedPrice

<MemberInfo kind="property" type="number"   />


### discountedPriceWithTax

<MemberInfo kind="property" type="number"   />


### taxRate

<MemberInfo kind="property" type="number"   />


### discounts

<MemberInfo kind="property" type="Discount[]"   />


### addAdjustment

<MemberInfo kind="method" type="(adjustment: Adjustment) => "   />


### clearAdjustments

<MemberInfo kind="method" type="() => "   />




</div>
