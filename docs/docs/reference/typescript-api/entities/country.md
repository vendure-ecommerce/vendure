---
title: "Country"
weight: 10
date: 2023-07-20T13:56:15.344Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Country

<GenerationInfo sourceFile="packages/core/src/entity/region/country.entity.ts" sourceLine="14" packageName="@vendure/core" />

A country to which is available when creating / updating an <a href='/typescript-api/entities/address#address'>Address</a>. Countries are
grouped together into <a href='/typescript-api/entities/zone#zone'>Zone</a>s which are in turn used to determine applicable shipping
and taxes for an <a href='/typescript-api/entities/order#order'>Order</a>.

```ts title="Signature"
class Country extends Region {
  constructor(input?: DeepPartial<Country>)
  readonly readonly type: RegionType = 'country';
}
```
Extends

 * <a href='/typescript-api/entities/region#region'>Region</a>



### constructor

<MemberInfo kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/country#country'>Country</a>&#62;) => Country"   />


### type

<MemberInfo kind="property" type="RegionType"   />


