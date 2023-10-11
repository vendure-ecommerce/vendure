---
title: "OrderableAsset"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## OrderableAsset

<GenerationInfo sourceFile="packages/core/src/entity/asset/orderable-asset.entity.ts" sourceLine="18" packageName="@vendure/core" />

This base class is extended in order to enable specific ordering of the one-to-many
Entity -> Assets relation. Using a many-to-many relation does not provide a way
to guarantee order of the Assets, so this entity is used in place of the
usual join table that would be created by TypeORM.
See https://typeorm.io/#/many-to-many-relations/many-to-many-relations-with-custom-properties

```ts title="Signature"
class OrderableAsset extends VendureEntity implements Orderable {
    constructor(input?: DeepPartial<OrderableAsset>)
    @Column()
    assetId: ID;
    @Index()
    @ManyToOne(type => Asset, { eager: true, onDelete: 'CASCADE' })
    asset: Asset;
    @Column()
    position: number;
}
```
* Extends: <code><a href='/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a></code>


* Implements: <code><a href='/reference/typescript-api/entities/interfaces#orderable'>Orderable</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(input?: DeepPartial&#60;<a href='/reference/typescript-api/entities/orderable-asset#orderableasset'>OrderableAsset</a>&#62;) => OrderableAsset`}   />


### assetId

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/id#id'>ID</a>`}   />


### asset

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/asset#asset'>Asset</a>`}   />


### position

<MemberInfo kind="property" type={`number`}   />




</div>
