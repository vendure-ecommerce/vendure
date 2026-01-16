---
title: "Region"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Region

<GenerationInfo sourceFile="packages/core/src/entity/region/region.entity.ts" sourceLine="22" packageName="@vendure/core" />

A Region represents a geographical administrative unit, such as a Country, Province, State, Prefecture etc.
This is an abstract class which is extended by the <a href='/reference/typescript-api/entities/country#country'>Country</a> and <a href='/reference/typescript-api/entities/province#province'>Province</a> entities.
Regions can be grouped into <a href='/reference/typescript-api/entities/zone#zone'>Zone</a>s which are in turn used to determine applicable shipping and taxes for an <a href='/reference/typescript-api/entities/order#order'>Order</a>.

```ts title="Signature"
class Region extends VendureEntity implements Translatable, HasCustomFields {
    @Column() code: string;
    @Column({ nullable: false, type: 'varchar' })
    readonly type: RegionType;
    name: LocaleString;
    @Index()
    @ManyToOne(type => Region, { nullable: true, onDelete: 'SET NULL' })
    parent?: Region;
    @EntityId({ nullable: true })
    parentId?: ID;
    @Column() enabled: boolean;
    @OneToMany(type => RegionTranslation, translation => translation.base, { eager: true })
    translations: Array<Translation<Region>>;
    @Column(type => CustomRegionFields)
    customFields: CustomRegionFields;
}
```
* Extends: <code><a href='/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a></code>


* Implements: <code><a href='/reference/typescript-api/entities/interfaces#translatable'>Translatable</a></code>, <code>HasCustomFields</code>



<div className="members-wrapper">

### code

<MemberInfo kind="property" type={`string`}   />

A code representing the region. The code format will depend on the type of region. For
example, a Country code will be a 2-letter ISO code, whereas a Province code could use
a format relevant to the type of province, e.g. a US state code like "CA".
### type

<MemberInfo kind="property" type={`RegionType`}   />


### name

<MemberInfo kind="property" type={`LocaleString`}   />


### parent

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/region#region'>Region</a>`}   />


### parentId

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/id#id'>ID</a>`}   />


### enabled

<MemberInfo kind="property" type={`boolean`}   />


### translations

<MemberInfo kind="property" type={`Array&#60;Translation&#60;<a href='/reference/typescript-api/entities/region#region'>Region</a>&#62;&#62;`}   />


### customFields

<MemberInfo kind="property" type={`CustomRegionFields`}   />




</div>
