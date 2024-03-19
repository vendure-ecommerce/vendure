---
title: "Asset"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Asset

<GenerationInfo sourceFile="packages/core/src/entity/asset/asset.entity.ts" sourceLine="22" packageName="@vendure/core" />

An Asset represents a file such as an image which can be associated with certain other entities
such as Products.

```ts title="Signature"
class Asset extends VendureEntity implements Taggable, ChannelAware, HasCustomFields {
    constructor(input?: DeepPartial<Asset>)
    @Column() name: string;
    @Column('varchar') type: AssetType;
    @Column() mimeType: string;
    @Column({ default: 0 }) width: number;
    @Column({ default: 0 }) height: number;
    @Column() fileSize: number;
    @Column() source: string;
    @Column() preview: string;
    @Column('simple-json', { nullable: true })
    focalPoint?: { x: number; y: number };
    @ManyToMany(type => Tag)
    @JoinTable()
    tags: Tag[];
    @ManyToMany(type => Channel)
    @JoinTable()
    channels: Channel[];
    @OneToMany(type => Collection, collection => collection.featuredAsset)
    featuredInCollections?: Collection[];
    @OneToMany(type => ProductVariant, productVariant => productVariant.featuredAsset)
    featuredInVariants?: ProductVariant[];
    @OneToMany(type => Product, product => product.featuredAsset)
    featuredInProducts?: Product[];
    @Column(type => CustomAssetFields)
    customFields: CustomAssetFields;
}
```
* Extends: <code><a href='/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a></code>


* Implements: <code><a href='/reference/typescript-api/entities/interfaces#taggable'>Taggable</a></code>, <code><a href='/reference/typescript-api/entities/interfaces#channelaware'>ChannelAware</a></code>, <code>HasCustomFields</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(input?: DeepPartial&#60;<a href='/reference/typescript-api/entities/asset#asset'>Asset</a>&#62;) => Asset`}   />


### name

<MemberInfo kind="property" type={`string`}   />


### type

<MemberInfo kind="property" type={`AssetType`}   />


### mimeType

<MemberInfo kind="property" type={`string`}   />


### width

<MemberInfo kind="property" type={`number`}   />


### height

<MemberInfo kind="property" type={`number`}   />


### fileSize

<MemberInfo kind="property" type={`number`}   />


### source

<MemberInfo kind="property" type={`string`}   />


### preview

<MemberInfo kind="property" type={`string`}   />


### focalPoint

<MemberInfo kind="property" type={`{ x: number; y: number }`}   />


### tags

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/tag#tag'>Tag</a>[]`}   />


### channels

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/channel#channel'>Channel</a>[]`}   />


### featuredInCollections

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/collection#collection'>Collection</a>[]`}   />


### featuredInVariants

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>[]`}   />


### featuredInProducts

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/product#product'>Product</a>[]`}   />


### customFields

<MemberInfo kind="property" type={`CustomAssetFields`}   />




</div>
