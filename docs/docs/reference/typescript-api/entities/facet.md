---
title: "Facet"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Facet

<GenerationInfo sourceFile="packages/core/src/entity/facet/facet.entity.ts" sourceLine="25" packageName="@vendure/core" />

A Facet is a class of properties which can be applied to a <a href='/reference/typescript-api/entities/product#product'>Product</a> or <a href='/reference/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>.
They are used to enable [faceted search](https://en.wikipedia.org/wiki/Faceted_search) whereby products
can be filtered along a number of dimensions (facets).

For example, there could be a Facet named "Brand" which has a number of <a href='/reference/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>s representing
the various brands of product, e.g. "Apple", "Samsung", "Dell", "HP" etc.

```ts title="Signature"
class Facet extends VendureEntity implements Translatable, HasCustomFields, ChannelAware {
    constructor(input?: DeepPartial<Facet>)
    name: LocaleString;
    @Column({ default: false })
    isPrivate: boolean;
    @Column({ unique: true })
    code: string;
    @OneToMany(type => FacetTranslation, translation => translation.base, { eager: true })
    translations: Array<Translation<Facet>>;
    @OneToMany(type => FacetValue, value => value.facet)
    values: FacetValue[];
    @Column(type => CustomFacetFields)
    customFields: CustomFacetFields;
    @ManyToMany(type => Channel, channel => channel.facets)
    @JoinTable()
    channels: Channel[];
}
```
* Extends: <code><a href='/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a></code>


* Implements: <code><a href='/reference/typescript-api/entities/interfaces#translatable'>Translatable</a></code>, <code>HasCustomFields</code>, <code><a href='/reference/typescript-api/entities/interfaces#channelaware'>ChannelAware</a></code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(input?: DeepPartial&#60;<a href='/reference/typescript-api/entities/facet#facet'>Facet</a>&#62;) => Facet`}   />


### name

<MemberInfo kind="property" type={`LocaleString`}   />


### isPrivate

<MemberInfo kind="property" type={`boolean`}   />


### code

<MemberInfo kind="property" type={`string`}   />


### translations

<MemberInfo kind="property" type={`Array&#60;Translation&#60;<a href='/reference/typescript-api/entities/facet#facet'>Facet</a>&#62;&#62;`}   />


### values

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>[]`}   />


### customFields

<MemberInfo kind="property" type={`CustomFacetFields`}   />


### channels

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/channel#channel'>Channel</a>[]`}   />




</div>
