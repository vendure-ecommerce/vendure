---
title: "CustomFieldConfig"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## CustomFieldConfig

<GenerationInfo sourceFile="packages/core/src/config/custom-field/custom-field-types.ts" sourceLine="124" packageName="@vendure/core" />

An object used to configure a custom field.

```ts title="Signature"
type CustomFieldConfig = | StringCustomFieldConfig
    | LocaleStringCustomFieldConfig
    | TextCustomFieldConfig
    | LocaleTextCustomFieldConfig
    | IntCustomFieldConfig
    | FloatCustomFieldConfig
    | BooleanCustomFieldConfig
    | DateTimeCustomFieldConfig
    | RelationCustomFieldConfig
```
