---
title: "StockLevel"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## StockLevel

<GenerationInfo sourceFile="packages/core/src/entity/stock-level/stock-level.entity.ts" sourceLine="16" packageName="@vendure/core" />

A StockLevel represents the number of a particular <a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a> which are available
at a particular <a href='/reference/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>.

```ts title="Signature"
class StockLevel extends VendureEntity {
    constructor(input: DeepPartial<StockLevel>)
    @Index()
    @ManyToOne(type => ProductVariant, productVariant => productVariant.stockLevels, { onDelete: 'CASCADE' })
    productVariant: ProductVariant;
    @EntityId()
    productVariantId: ID;
    @Index()
    @ManyToOne(type => StockLocation, { onDelete: 'CASCADE' })
    stockLocation: StockLocation;
    @EntityId()
    stockLocationId: ID;
    @Column()
    stockOnHand: number;
    @Column()
    stockAllocated: number;
}
```
* Extends: <code><a href='/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(input: DeepPartial&#60;<a href='/reference/typescript-api/entities/stock-level#stocklevel'>StockLevel</a>&#62;) => StockLevel`}   />


### productVariant

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>`}   />


### productVariantId

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/id#id'>ID</a>`}   />


### stockLocation

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/stock-location#stocklocation'>StockLocation</a>`}   />


### stockLocationId

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/id#id'>ID</a>`}   />


### stockOnHand

<MemberInfo kind="property" type={`number`}   />


### stockAllocated

<MemberInfo kind="property" type={`number`}   />




</div>
