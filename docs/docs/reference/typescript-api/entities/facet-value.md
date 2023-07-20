---
title: "FacetValue"
weight: 10
date: 2023-07-20T13:56:15.148Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## FacetValue

<GenerationInfo sourceFile="packages/core/src/entity/facet-value/facet-value.entity.ts" sourceLine="20" packageName="@vendure/core" />

A particular value of a <a href='/typescript-api/entities/facet#facet'>Facet</a>.

```ts title="Signature"
class FacetValue extends VendureEntity implements Translatable, HasCustomFields, ChannelAware {
  constructor(input?: DeepPartial<FacetValue>)
  name: LocaleString;
  @Column() @Column() code: string;
  @OneToMany(type => FacetValueTranslation, translation => translation.base, { eager: true }) @OneToMany(type => FacetValueTranslation, translation => translation.base, { eager: true })
    translations: Array<Translation<FacetValue>>;
  @Index() @ManyToOne(type => Facet, group => group.values, { onDelete: 'CASCADE' }) @Index()
    @ManyToOne(type => Facet, group => group.values, { onDelete: 'CASCADE' })
    facet: Facet;
  @Column(type => CustomFacetValueFields) @Column(type => CustomFacetValueFields)
    customFields: CustomFacetValueFields;
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



### constructor

<MemberInfo kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>&#62;) => FacetValue"   />


### name

<MemberInfo kind="property" type="LocaleString"   />


### code

<MemberInfo kind="property" type="string"   />


### translations

<MemberInfo kind="property" type="Array&#60;Translation&#60;<a href='/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>&#62;&#62;"   />


### facet

<MemberInfo kind="property" type="<a href='/typescript-api/entities/facet#facet'>Facet</a>"   />


### customFields

<MemberInfo kind="property" type="CustomFacetValueFields"   />


### channels

<MemberInfo kind="property" type="<a href='/typescript-api/entities/channel#channel'>Channel</a>[]"   />


