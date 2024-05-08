---
title: "Product"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Product

<GenerationInfo sourceFile="packages/core/src/entity/product/product.entity.ts" sourceLine="25" packageName="@vendure/core" />

A Product contains one or more <a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>s and serves as a container for those variants,
providing an overall name, description etc.

```ts title="Signature"
class Product extends VendureEntity implements Translatable, HasCustomFields, ChannelAware, SoftDeletable {
    constructor(input?: DeepPartial<Product>)
    @Column({ type: Date, nullable: true })
    deletedAt: Date | null;
    name: LocaleString;
    slug: LocaleString;
    description: LocaleString;
    @Column({ default: true })
    enabled: boolean;
    @Index()
    @ManyToOne(type => Asset, asset => asset.featuredInProducts, { onDelete: 'SET NULL' })
    featuredAsset: Asset;
    @OneToMany(type => ProductAsset, productAsset => productAsset.product)
    assets: ProductAsset[];
    @OneToMany(type => ProductTranslation, translation => translation.base, { eager: true })
    translations: Array<Translation<Product>>;
    @OneToMany(type => ProductVariant, variant => variant.product)
    variants: ProductVariant[];
    @OneToMany(type => ProductOptionGroup, optionGroup => optionGroup.product)
    optionGroups: ProductOptionGroup[];
    @ManyToMany(type => FacetValue, facetValue => facetValue.products)
    @JoinTable()
    facetValues: FacetValue[];
    @ManyToMany(type => Channel, channel => channel.products)
    @JoinTable()
    channels: Channel[];
    @Column(type => CustomProductFields)
    customFields: CustomProductFields;
}
```
* Extends: <code><a href='/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a></code>


* Implements: <code><a href='/reference/typescript-api/entities/interfaces#translatable'>Translatable</a></code>, <code>HasCustomFields</code>, <code><a href='/reference/typescript-api/entities/interfaces#channelaware'>ChannelAware</a></code>, <code><a href='/reference/typescript-api/entities/interfaces#softdeletable'>SoftDeletable</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(input?: DeepPartial&#60;<a href='/reference/typescript-api/entities/product#product'>Product</a>&#62;) => Product`}   />


### deletedAt

<MemberInfo kind="property" type={`Date | null`}   />


### name

<MemberInfo kind="property" type={`LocaleString`}   />


### slug

<MemberInfo kind="property" type={`LocaleString`}   />


### description

<MemberInfo kind="property" type={`LocaleString`}   />


### enabled

<MemberInfo kind="property" type={`boolean`}   />


### featuredAsset

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/asset#asset'>Asset</a>`}   />


### assets

<MemberInfo kind="property" type={`ProductAsset[]`}   />


### translations

<MemberInfo kind="property" type={`Array&#60;Translation&#60;<a href='/reference/typescript-api/entities/product#product'>Product</a>&#62;&#62;`}   />


### variants

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>[]`}   />


### optionGroups

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/product-option-group#productoptiongroup'>ProductOptionGroup</a>[]`}   />


### facetValues

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>[]`}   />


### channels

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/channel#channel'>Channel</a>[]`}   />


### customFields

<MemberInfo kind="property" type={`CustomProductFields`}   />




</div>
