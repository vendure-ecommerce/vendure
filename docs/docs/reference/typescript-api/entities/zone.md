---
title: "Zone"
weight: 10
date: 2023-07-20T13:56:15.494Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Zone

<GenerationInfo sourceFile="packages/core/src/entity/zone/zone.entity.ts" sourceLine="17" packageName="@vendure/core" />

A Zone is a grouping of one or more <a href='/typescript-api/entities/country#country'>Country</a> entities. It is used for
calculating applicable shipping and taxes.

```ts title="Signature"
class Zone extends VendureEntity implements HasCustomFields {
  constructor(input?: DeepPartial<Zone>)
  @Column() @Column() name: string;
  @ManyToMany(type => Region) @JoinTable() @ManyToMany(type => Region)
    @JoinTable()
    members: Region[];
  @Column(type => CustomZoneFields) @Column(type => CustomZoneFields)
    customFields: CustomZoneFields;
}
```
Extends

 * <a href='/typescript-api/entities/vendure-entity#vendureentity'>VendureEntity</a>


Implements

 * HasCustomFields



### constructor

<MemberInfo kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/zone#zone'>Zone</a>&#62;) => Zone"   />


### name

<MemberInfo kind="property" type="string"   />


### members

<MemberInfo kind="property" type="<a href='/typescript-api/entities/region#region'>Region</a>[]"   />


### customFields

<MemberInfo kind="property" type="CustomZoneFields"   />


