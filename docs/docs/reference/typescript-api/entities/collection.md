---
title: "Collection"
weight: 10
date: 2023-07-14T16:57:49.856Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# Collection
<div class="symbol">


# Collection

{{< generation-info sourceFile="packages/core/src/entity/collection/collection.entity.ts" sourceLine="35" packageName="@vendure/core">}}

A Collection is a grouping of <a href='/typescript-api/entities/product#product'>Product</a>s based on various configurable criteria.

## Signature

```TypeScript
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
## Extends

 * <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>


## Implements

 * <a href='/typescript-api/entities/interfaces#translatable'>Translatable</a>
 * HasCustomFields
 * <a href='/typescript-api/entities/interfaces#channelaware'>ChannelAware</a>
 * <a href='/typescript-api/entities/interfaces#orderable'>Orderable</a>


## Members

### constructor

{{< member-info kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/collection#collection'>Collection</a>&#62;) => Collection"  >}}

{{< member-description >}}{{< /member-description >}}

### isRoot

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}

### position

{{< member-info kind="property" type="number"  >}}

{{< member-description >}}{{< /member-description >}}

### isPrivate

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}

### name

{{< member-info kind="property" type="LocaleString"  >}}

{{< member-description >}}{{< /member-description >}}

### description

{{< member-info kind="property" type="LocaleString"  >}}

{{< member-description >}}{{< /member-description >}}

### slug

{{< member-info kind="property" type="LocaleString"  >}}

{{< member-description >}}{{< /member-description >}}

### translations

{{< member-info kind="property" type="Array&#60;Translation&#60;<a href='/typescript-api/entities/collection#collection'>Collection</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### featuredAsset

{{< member-info kind="property" type="<a href='/typescript-api/entities/asset#asset'>Asset</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### assets

{{< member-info kind="property" type="CollectionAsset[]"  >}}

{{< member-description >}}{{< /member-description >}}

### filters

{{< member-info kind="property" type="ConfigurableOperation[]"  >}}

{{< member-description >}}{{< /member-description >}}

### inheritFilters

{{< member-info kind="property" type="boolean"  since="2.0.0" >}}

{{< member-description >}}{{< /member-description >}}

### productVariants

{{< member-info kind="property" type="<a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### customFields

{{< member-info kind="property" type="CustomCollectionFields"  >}}

{{< member-description >}}{{< /member-description >}}

### children

{{< member-info kind="property" type="<a href='/typescript-api/entities/collection#collection'>Collection</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### parent

{{< member-info kind="property" type="<a href='/typescript-api/entities/collection#collection'>Collection</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### parentId

{{< member-info kind="property" type="<a href='/typescript-api/common/id#id'>ID</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### channels

{{< member-info kind="property" type="<a href='/typescript-api/entities/channel#channel'>Channel</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
