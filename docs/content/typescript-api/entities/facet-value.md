---
title: "FacetValue"
weight: 10
date: 2023-07-14T16:57:49.876Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# FacetValue
<div class="symbol">


# FacetValue

{{< generation-info sourceFile="packages/core/src/entity/facet-value/facet-value.entity.ts" sourceLine="20" packageName="@vendure/core">}}

A particular value of a <a href='/typescript-api/entities/facet#facet'>Facet</a>.

## Signature

```TypeScript
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
## Extends

 * <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>


## Implements

 * <a href='/typescript-api/entities/interfaces#translatable'>Translatable</a>
 * HasCustomFields
 * <a href='/typescript-api/entities/interfaces#channelaware'>ChannelAware</a>


## Members

### constructor

{{< member-info kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>&#62;) => FacetValue"  >}}

{{< member-description >}}{{< /member-description >}}

### name

{{< member-info kind="property" type="LocaleString"  >}}

{{< member-description >}}{{< /member-description >}}

### code

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### translations

{{< member-info kind="property" type="Array&#60;Translation&#60;<a href='/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### facet

{{< member-info kind="property" type="<a href='/typescript-api/entities/facet#facet'>Facet</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### customFields

{{< member-info kind="property" type="CustomFacetValueFields"  >}}

{{< member-description >}}{{< /member-description >}}

### channels

{{< member-info kind="property" type="<a href='/typescript-api/entities/channel#channel'>Channel</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
