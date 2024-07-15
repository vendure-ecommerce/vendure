---
title: "FacetValue"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## FacetValue

<GenerationInfo sourceFile="packages/core/src/entity/facet-value/facet-value.entity.ts" sourceLine="23" packageName="@vendure/core" />

A particular value of a <a href='/reference/typescript-api/entities/facet#facet'>Facet</a>.

```ts title="Signature"
class FacetValue extends VendureEntity implements Translatable, HasCustomFields, ChannelAware {
    constructor(input?: DeepPartial<FacetValue>)
    name: LocaleString;
    @Column() code: string;
    @OneToMany(type => FacetValueTranslation, translation => translation.base, { eager: true })
    translations: Array<Translation<FacetValue>>;
    @Index()
    @ManyToOne(type => Facet, group => group.values, { onDelete: 'CASCADE' })
    facet: Facet;
    @EntityId()
    facetId: ID;
    @Column(type => CustomFacetValueFields)
    customFields: CustomFacetValueFields;
    @ManyToMany(type => Channel, channel => channel.facetValues)
    @JoinTable()
    channels: Channel[];
    @ManyToMany(() => Product, product => product.facetValues, { onDelete: 'CASCADE' })
    products: Product[];
    @ManyToMany(type => ProductVariant, productVariant => productVariant.facetValues)
    productVariants: ProductVariant[];
}
```
* Extends: <code><a href='/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a></code>


* Implements: <code><a href='/reference/typescript-api/entities/interfaces#translatable'>Translatable</a></code>, <code>HasCustomFields</code>, <code><a href='/reference/typescript-api/entities/interfaces#channelaware'>ChannelAware</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(input?: DeepPartial&#60;<a href='/reference/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>&#62;) => FacetValue`}   />


### name

<MemberInfo kind="property" type={`LocaleString`}   />


### code

<MemberInfo kind="property" type={`string`}   />


### translations

<MemberInfo kind="property" type={`Array&#60;Translation&#60;<a href='/reference/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>&#62;&#62;`}   />


### facet

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/facet#facet'>Facet</a>`}   />


### facetId

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/id#id'>ID</a>`}   />


### customFields

<MemberInfo kind="property" type={`CustomFacetValueFields`}   />


### channels

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/channel#channel'>Channel</a>[]`}   />


### products

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/product#product'>Product</a>[]`}   />


### productVariants

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>[]`}   />




</div>
