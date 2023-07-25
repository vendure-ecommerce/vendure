---
title: "Facet"
weight: 10
date: 2023-07-14T16:57:49.872Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# Facet
<div class="symbol">


# Facet

{{< generation-info sourceFile="packages/core/src/entity/facet/facet.entity.ts" sourceLine="25" packageName="@vendure/core">}}

A Facet is a class of properties which can be applied to a <a href='/typescript-api/entities/product#product'>Product</a> or <a href='/typescript-api/entities/product-variant#productvariant'>ProductVariant</a>.
They are used to enable [faceted search](https://en.wikipedia.org/wiki/Faceted_search) whereby products
can be filtered along a number of dimensions (facets).

For example, there could be a Facet named "Brand" which has a number of <a href='/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>s representing
the various brands of product, e.g. "Apple", "Samsung", "Dell", "HP" etc.

## Signature

```TypeScript
class Facet extends VendureEntity implements Translatable, HasCustomFields, ChannelAware {
  constructor(input?: DeepPartial<Facet>)
  name: LocaleString;
  @Column({ default: false }) @Column({ default: false })
    isPrivate: boolean;
  @Column({ unique: true }) @Column({ unique: true })
    code: string;
  @OneToMany(type => FacetTranslation, translation => translation.base, { eager: true }) @OneToMany(type => FacetTranslation, translation => translation.base, { eager: true })
    translations: Array<Translation<Facet>>;
  @OneToMany(type => FacetValue, value => value.facet) @OneToMany(type => FacetValue, value => value.facet)
    values: FacetValue[];
  @Column(type => CustomFacetFields) @Column(type => CustomFacetFields)
    customFields: CustomFacetFields;
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

{{< member-info kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/facet#facet'>Facet</a>&#62;) => Facet"  >}}

{{< member-description >}}{{< /member-description >}}

### name

{{< member-info kind="property" type="LocaleString"  >}}

{{< member-description >}}{{< /member-description >}}

### isPrivate

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}

### code

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}{{< /member-description >}}

### translations

{{< member-info kind="property" type="Array&#60;Translation&#60;<a href='/typescript-api/entities/facet#facet'>Facet</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### values

{{< member-info kind="property" type="<a href='/typescript-api/entities/facet-value#facetvalue'>FacetValue</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}

### customFields

{{< member-info kind="property" type="CustomFacetFields"  >}}

{{< member-description >}}{{< /member-description >}}

### channels

{{< member-info kind="property" type="<a href='/typescript-api/entities/channel#channel'>Channel</a>[]"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
