---
title: "Zone"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Zone

<GenerationInfo sourceFile="packages/core/src/entity/zone/zone.entity.ts" sourceLine="19" packageName="@vendure/core" />

A Zone is a grouping of one or more <a href='/reference/typescript-api/entities/country#country'>Country</a> entities. It is used for
calculating applicable shipping and taxes.

```ts title="Signature"
class Zone extends VendureEntity implements HasCustomFields {
    constructor(input?: DeepPartial<Zone>)
    @Column() name: string;
    @ManyToMany(type => Region)
    @JoinTable()
    members: Region[];
    @Column(type => CustomZoneFields)
    customFields: CustomZoneFields;
    @OneToMany(type => Channel, country => country.defaultShippingZone)
    defaultShippingZoneChannels: Channel[];
    @OneToMany(type => Channel, country => country.defaultTaxZone)
    defaultTaxZoneChannels: Channel[];
    @OneToMany(type => TaxRate, taxRate => taxRate.zone)
    taxRates: TaxRate[];
}
```
* Extends: <code><a href='/reference/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a></code>


* Implements: <code>HasCustomFields</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(input?: DeepPartial&#60;<a href='/reference/typescript-api/entities/zone#zone'>Zone</a>&#62;) => Zone`}   />


### name

<MemberInfo kind="property" type={`string`}   />


### members

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/region#region'>Region</a>[]`}   />


### customFields

<MemberInfo kind="property" type={`CustomZoneFields`}   />


### defaultShippingZoneChannels

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/channel#channel'>Channel</a>[]`}   />


### defaultTaxZoneChannels

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/channel#channel'>Channel</a>[]`}   />


### taxRates

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/entities/tax-rate#taxrate'>TaxRate</a>[]`}   />




</div>
