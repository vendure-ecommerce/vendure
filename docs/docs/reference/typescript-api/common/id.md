---
title: "ID"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ID

<GenerationInfo sourceFile="packages/common/src/shared-types.ts" sourceLine="79" packageName="@vendure/common" />

An entity ID. Depending on the configured <a href='/reference/typescript-api/configuration/entity-id-strategy#entityidstrategy'>EntityIdStrategy</a>, it will be either
a `string` or a `number`;

```ts title="Signature"
type ID = string | number
```
