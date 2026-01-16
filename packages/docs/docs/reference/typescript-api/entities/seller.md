---
title: "Seller"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Seller

<GenerationInfo sourceFile="packages/core/src/entity/seller/seller.entity.ts" sourceLine="17" packageName="@vendure/core" />

A Seller represents the person or organization who is selling the goods on a given <a href='/reference/typescript-api/entities/channel#channel'>Channel</a>.
By default, a single-channel Vendure installation will have a single default Seller.

```ts title="Signature"
class Seller extends VendureEntity implements SoftDeletable, HasCustomFields {
    constructor(input?: DeepPartial<Seller>)
    @Column({ type: Date, nullable: true })
    deletedAt: Date | null;
    @Column() name: string;
    @Column(type => CustomSellerFields)
    customFields: CustomSellerFields;
    @OneToMany(type => Channel, channel => channel.seller)
    channels: Channel[];
}
```
* Extends: <code><a href='/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a></code>


* Implements: <code><a href='/reference/typescript-api/entities/interfaces#softdeletable'>SoftDeletable</a></code>, <code>HasCustomFields</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(input?: DeepPartial&#60;<a href='/reference/typescript-api/entities/seller#seller'>Seller</a>&#62;) => Seller`}   />


### deletedAt

<MemberInfo kind="property" type={`Date | null`}   />


### name

<MemberInfo kind="property" type={`string`}   />


### customFields

<MemberInfo kind="property" type={`CustomSellerFields`}   />


### channels

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/channel#channel'>Channel</a>[]`}   />




</div>
