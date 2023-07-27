---
title: "Region"
weight: 10
date: 2023-07-14T16:57:49.981Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->

# Region
<div class="symbol">


# Region

{{< generation-info sourceFile="packages/core/src/entity/region/region.entity.ts" sourceLine="22" packageName="@vendure/core">}}

A Region represents a geographical administrative unit, such as a Country, Province, State, Prefecture etc.
This is an abstract class which is extended by the <a href='/typescript-api/entities/country#country'>Country</a> and <a href='/typescript-api/entities/province#province'>Province</a> entities.
Regions can be grouped into <a href='/typescript-api/entities/zone#zone'>Zone</a>s which are in turn used to determine applicable shipping and taxes for an <a href='/typescript-api/entities/order#order'>Order</a>.

## Signature

```TypeScript
class Region extends VendureEntity implements Translatable, HasCustomFields {
  @Column() @Column() code: string;
  @Column({ nullable: false, type: 'varchar' }) readonly @Column({ nullable: false, type: 'varchar' })
    readonly type: RegionType;
  name: LocaleString;
  @Index() @ManyToOne(type => Region, { nullable: true, onDelete: 'SET NULL' }) @Index()
    @ManyToOne(type => Region, { nullable: true, onDelete: 'SET NULL' })
    parent?: Region;
  @EntityId({ nullable: true }) @EntityId({ nullable: true })
    parentId?: ID;
  @Column() @Column() enabled: boolean;
  @OneToMany(type => RegionTranslation, translation => translation.base, { eager: true }) @OneToMany(type => RegionTranslation, translation => translation.base, { eager: true })
    translations: Array<Translation<Region>>;
  @Column(type => CustomRegionFields) @Column(type => CustomRegionFields)
    customFields: CustomRegionFields;
}
```
## Extends

 * <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>


## Implements

 * <a href='/typescript-api/entities/interfaces#translatable'>Translatable</a>
 * HasCustomFields


## Members

### code

{{< member-info kind="property" type="string"  >}}

{{< member-description >}}A code representing the region. The code format will depend on the type of region. For
example, a Country code will be a 2-letter ISO code, whereas a Province code could use
a format relevant to the type of province, e.g. a US state code like "CA".{{< /member-description >}}

### type

{{< member-info kind="property" type="RegionType"  >}}

{{< member-description >}}{{< /member-description >}}

### name

{{< member-info kind="property" type="LocaleString"  >}}

{{< member-description >}}{{< /member-description >}}

### parent

{{< member-info kind="property" type="<a href='/typescript-api/entities/region#region'>Region</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### parentId

{{< member-info kind="property" type="<a href='/typescript-api/common/id#id'>ID</a>"  >}}

{{< member-description >}}{{< /member-description >}}

### enabled

{{< member-info kind="property" type="boolean"  >}}

{{< member-description >}}{{< /member-description >}}

### translations

{{< member-info kind="property" type="Array&#60;Translation&#60;<a href='/typescript-api/entities/region#region'>Region</a>&#62;&#62;"  >}}

{{< member-description >}}{{< /member-description >}}

### customFields

{{< member-info kind="property" type="CustomRegionFields"  >}}

{{< member-description >}}{{< /member-description >}}


</div>
