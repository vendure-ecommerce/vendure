---
title: "Seller"
weight: 10
date: 2023-07-20T13:56:15.368Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Seller

<GenerationInfo sourceFile="packages/core/src/entity/seller/seller.entity.ts" sourceLine="16" packageName="@vendure/core" />

A Seller represents the person or organization who is selling the goods on a given <a href='/typescript-api/entities/channel#channel'>Channel</a>.
By default, a single-channel Vendure installation will have a single default Seller.

```ts title="Signature"
class Seller extends VendureEntity implements SoftDeletable, HasCustomFields {
  constructor(input?: DeepPartial<Seller>)
  @Column({ type: Date, nullable: true }) @Column({ type: Date, nullable: true })
    deletedAt: Date | null;
  @Column() @Column() name: string;
  @Column(type => CustomSellerFields) @Column(type => CustomSellerFields)
    customFields: CustomSellerFields;
}
```
Extends

 * <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>


Implements

 * <a href='/typescript-api/entities/interfaces#softdeletable'>SoftDeletable</a>
 * HasCustomFields



### constructor

<MemberInfo kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/seller#seller'>Seller</a>&#62;) => Seller"   />


### deletedAt

<MemberInfo kind="property" type="Date | null"   />


### name

<MemberInfo kind="property" type="string"   />


### customFields

<MemberInfo kind="property" type="CustomSellerFields"   />


