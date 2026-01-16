---
title: "Collection"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Collection

<GenerationInfo sourceFile="packages/core/src/entity/collection/collection.entity.ts" sourceLine="35" packageName="@vendure/core" />

A Collection is a grouping of <a href='/reference/typescript-api/entities/product#product'>Product</a>s based on various configurable criteria.

```ts title="Signature"
class Collection extends VendureEntity implements Translatable, HasCustomFields, ChannelAware, Orderable {
    constructor(input?: DeepPartial<Collection>)
    @Column({ default: false })
    isRoot: boolean;
    @Column()
    position: number;
    @Column({ default: false })
    isPrivate: boolean;
    name: LocaleString;
    description: LocaleString;
    slug: LocaleString;
    @OneToMany(type => CollectionTranslation, translation => translation.base, { eager: true })
    translations: Array<Translation<Collection>>;
    @Index()
    @ManyToOne(type => Asset, asset => asset.featuredInCollections, { onDelete: 'SET NULL' })
    featuredAsset: Asset;
    @OneToMany(type => CollectionAsset, collectionAsset => collectionAsset.collection)
    assets: CollectionAsset[];
    @Column('simple-json') filters: ConfigurableOperation[];
    @Column({ default: true }) inheritFilters: boolean;
    @ManyToMany(type => ProductVariant, productVariant => productVariant.collections)
    @JoinTable()
    productVariants: ProductVariant[];
    @Column(type => CustomCollectionFields)
    customFields: CustomCollectionFields;
    @TreeChildren()
    children: Collection[];
    @TreeParent()
    parent: Collection;
    @EntityId({ nullable: true })
    parentId: ID;
    @ManyToMany(type => Channel, channel => channel.collections)
    @JoinTable()
    channels: Channel[];
}
```
* Extends: <code><a href='/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a></code>


* Implements: <code><a href='/reference/typescript-api/entities/interfaces#translatable'>Translatable</a></code>, <code>HasCustomFields</code>, <code><a href='/reference/typescript-api/entities/interfaces#channelaware'>ChannelAware</a></code>, <code><a href='/reference/typescript-api/entities/interfaces#orderable'>Orderable</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(input?: DeepPartial&#60;<a href='/reference/typescript-api/entities/collection#collection'>Collection</a>&#62;) => Collection`}   />


### isRoot

<MemberInfo kind="property" type={`boolean`}   />


### position

<MemberInfo kind="property" type={`number`}   />


### isPrivate

<MemberInfo kind="property" type={`boolean`}   />


### name

<MemberInfo kind="property" type={`LocaleString`}   />


### description

<MemberInfo kind="property" type={`LocaleString`}   />


### slug

<MemberInfo kind="property" type={`LocaleString`}   />


### translations

<MemberInfo kind="property" type={`Array&#60;Translation&#60;<a href='/reference/typescript-api/entities/collection#collection'>Collection</a>&#62;&#62;`}   />


### featuredAsset

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/asset#asset'>Asset</a>`}   />


### assets

<MemberInfo kind="property" type={`CollectionAsset[]`}   />


### filters

<MemberInfo kind="property" type={`ConfigurableOperation[]`}   />


### inheritFilters

<MemberInfo kind="property" type={`boolean`}  since="2.0.0"  />


### productVariants

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>[]`}   />


### customFields

<MemberInfo kind="property" type={`CustomCollectionFields`}   />


### children

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/collection#collection'>Collection</a>[]`}   />


### parent

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/collection#collection'>Collection</a>`}   />


### parentId

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/id#id'>ID</a>`}   />


### channels

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/channel#channel'>Channel</a>[]`}   />




</div>
