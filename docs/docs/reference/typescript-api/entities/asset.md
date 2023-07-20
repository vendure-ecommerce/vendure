---
title: "Asset"
weight: 10
date: 2023-07-20T13:56:15.047Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Asset

<GenerationInfo sourceFile="packages/core/src/entity/asset/asset.entity.ts" sourceLine="19" packageName="@vendure/core" />

An Asset represents a file such as an image which can be associated with certain other entities
such as Products.

```ts title="Signature"
class Asset extends VendureEntity implements Taggable, ChannelAware, HasCustomFields {
  constructor(input?: DeepPartial<Asset>)
  @Column() @Column() name: string;
  @Column('varchar') @Column('varchar') type: AssetType;
  @Column() @Column() mimeType: string;
  @Column({ default: 0 }) @Column({ default: 0 }) width: number;
  @Column({ default: 0 }) @Column({ default: 0 }) height: number;
  @Column() @Column() fileSize: number;
  @Column() @Column() source: string;
  @Column() @Column() preview: string;
  @Column('simple-json', { nullable: true }) @Column('simple-json', { nullable: true })
    focalPoint?: { x: number; y: number };
  @ManyToMany(type => Tag) @JoinTable() @ManyToMany(type => Tag)
    @JoinTable()
    tags: Tag[];
  @ManyToMany(type => Channel) @JoinTable() @ManyToMany(type => Channel)
    @JoinTable()
    channels: Channel[];
  @Column(type => CustomAssetFields) @Column(type => CustomAssetFields)
    customFields: CustomAssetFields;
}
```
Extends

 * <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>


Implements

 * <a href='/typescript-api/entities/interfaces#taggable'>Taggable</a>
 * <a href='/typescript-api/entities/interfaces#channelaware'>ChannelAware</a>
 * HasCustomFields



### constructor

<MemberInfo kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/asset#asset'>Asset</a>&#62;) => Asset"   />


### name

<MemberInfo kind="property" type="string"   />


### type

<MemberInfo kind="property" type="AssetType"   />


### mimeType

<MemberInfo kind="property" type="string"   />


### width

<MemberInfo kind="property" type="number"   />


### height

<MemberInfo kind="property" type="number"   />


### fileSize

<MemberInfo kind="property" type="number"   />


### source

<MemberInfo kind="property" type="string"   />


### preview

<MemberInfo kind="property" type="string"   />


### focalPoint

<MemberInfo kind="property" type="{ x: number; y: number }"   />


### tags

<MemberInfo kind="property" type="<a href='/typescript-api/entities/tag#tag'>Tag</a>[]"   />


### channels

<MemberInfo kind="property" type="<a href='/typescript-api/entities/channel#channel'>Channel</a>[]"   />


### customFields

<MemberInfo kind="property" type="CustomAssetFields"   />


