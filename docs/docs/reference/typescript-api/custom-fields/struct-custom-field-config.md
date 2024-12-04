---
title: "StructCustomFieldConfig"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## StructCustomFieldConfig

<GenerationInfo sourceFile="packages/core/src/config/custom-field/custom-field-types.ts" sourceLine="215" packageName="@vendure/core" since="3.1.0" />

Configures a "struct" custom field.

```ts title="Signature"
type StructCustomFieldConfig = TypedCustomFieldConfig<
    'struct',
    Omit<GraphQLStructCustomFieldConfig, 'fields'>
> & {
    fields: StructFieldConfig[];
}
```
