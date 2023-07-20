---
title: "Collection"
weight: 10
date: 2023-07-20T13:56:15.098Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Collection

<GenerationInfo sourceFile="packages/core/src/entity/collection/collection.entity.ts" sourceLine="35" packageName="@vendure/core" />

A Collection is a grouping of <a href='/typescript-api/entities/product#product'>Product</a>s based on various configurable criteria.

```ts title="Signature"
class Collection extends VendureEntity implements Translatable, HasCustomFields, ChannelAware, Orderable {
  constructor(input?: DeepPartial<Collection>)
  @Column({ default: false }) @Column({ default: false })
    isRoot: boolean;
  @Column() @Column()
    position: number;
  @Column({ default: false }) @Column({ default: false })
    isPrivate: boolean;
  name: LocaleString;
  description: LocaleString;
  slug: LocaleString;
  @OneToMany(type => CollectionTranslation, translation => translation.base, { eager: true }) @OneToMany(type => CollectionTranslation, translation => translation.base, { eager: true })
    translations: Array<Translation<Collection>>;
  @Index() @ManyToOne(type => Asset, { onDelete: 'SET NULL' }) @Index()
    @ManyToOne(type => Asset, { onDelete: 'SET NULL' })
    featuredAsset: Asset;
  @OneToMany(type => CollectionAsset, collectionAsset => collectionAsset.collection) @OneToMany(type => CollectionAsset, collectionAsset => collectionAsset.collection)
    assets: CollectionAsset[];
  @Column('simple-json') @Column('simple-json') filters: ConfigurableOperation[];
  @Column({ default: true }) @Column({ default: true }) inheritFilters: boolean;
  @ManyToMany(type => ProductVariant, productVariant => productVariant.collections) @JoinTable() @ManyToMany(type => ProductVariant, productVariant => productVariant.collections)
    @JoinTable()
    productVariants: ProductVariant[];
  @Column(type => CustomCollectionFields) @Column(type => CustomCollectionFields)
    customFields: CustomCollectionFields;
  @TreeChildren() @TreeChildren()
    children: Collection[];
  @TreeParent() @TreeParent()
    parent: Collection;
  @EntityId({ nullable: true }) @EntityId({ nullable: true })
    parentId: ID;
  @ManyToMany(type => Channel) @JoinTable() @ManyToMany(type => Channel)
    @JoinTable()
    channels: Channel[];
}
```
Extends

 * <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>


Implements

 * <a href='/typescript-api/entities/interfaces#translatable'>Translatable</a>
 * HasCustomFields
 * <a href='/typescript-api/entities/interfaces#channelaware'>ChannelAware</a>
 * <a href='/typescript-api/entities/interfaces#orderable'>Orderable</a>



### constructor

<MemberInfo kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/collection#collection'>Collection</a>&#62;) => Collection"   />


### isRoot

<MemberInfo kind="property" type="boolean"   />


### position

<MemberInfo kind="property" type="number"   />


### isPrivate

<MemberInfo kind="property" type="boolean"   />


### name

<MemberInfo kind="property" type="LocaleString"   />


### description

<MemberInfo kind="property" type="LocaleString"   />


### slug

<MemberInfo kind="property" type="LocaleString"   />


### translations

<MemberInfo kind="property" type="Array&#60;Translation&#60;<a href='/typescript-api/entities/collection#collection'>Collection</a>&#62;&#62;"   />


### featuredAsset

<MemberInfo kind="property" type="<a href='/typescript-api/entities/asset#asset'>Asset</a>"   />


### assets

<MemberInfo kind="property" type="CollectionAsset[]"   />


### filters

<MemberInfo kind="property" type="ConfigurableOperation[]"   />


### inheritFilters

<MemberInfo kind="property" type="boolean"  since="2.0.0"  />


### productVariants

<MemberInfo kind="property" type="<a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>[]"   />


### customFields

<MemberInfo kind="property" type="CustomCollectionFields"   />


### children

<MemberInfo kind="property" type="<a href='/typescript-api/entities/collection#collection'>Collection</a>[]"   />


### parent

<MemberInfo kind="property" type="<a href='/typescript-api/entities/collection#collection'>Collection</a>"   />


### parentId

<MemberInfo kind="property" type="<a href='/typescript-api/common/id#id'>ID</a>"   />


### channels

<MemberInfo kind="property" type="<a href='/typescript-api/entities/channel#channel'>Channel</a>[]"   />


