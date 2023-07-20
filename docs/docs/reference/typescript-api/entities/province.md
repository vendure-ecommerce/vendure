---
title: "Province"
weight: 10
date: 2023-07-20T13:56:15.347Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## Province

<GenerationInfo sourceFile="packages/core/src/entity/region/province.entity.ts" sourceLine="13" packageName="@vendure/core" />

A Province represents an administrative subdivision of a <a href='/typescript-api/entities/country#country'>Country</a>. For example, in the
United States, the country would be "United States" and the province would be "California".

```ts title="Signature"
class Province extends Region {
  constructor(input?: DeepPartial<Province>)
  readonly readonly type: RegionType = 'province';
}
```
Extends

 * <a href='/typescript-api/entities/region#region'>Region</a>



### constructor

<MemberInfo kind="method" type="(input?: DeepPartial&#60;<a href='/typescript-api/entities/province#province'>Province</a>&#62;) => Province"   />


### type

<MemberInfo kind="property" type="RegionType"   />


