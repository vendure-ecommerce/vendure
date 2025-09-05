---
title: "StructFieldConfig"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## StructFieldConfig

<GenerationInfo sourceFile="packages/core/src/config/custom-field/custom-field-types.ts" sourceLine="209" packageName="@vendure/core" since="3.1.0" />

Configures an individual field of a "struct" custom field. The individual fields share
the same API as the top-level custom fields, with the exception that they do not support the
`readonly`, `internal`, `nullable`, `unique` and `requiresPermission` options.

*Example*

```ts
const customFields: CustomFields = {
  Product: [
    {
      name: 'specifications',
      type: 'struct',
      fields: [
        { name: 'processor', type: 'string' },
        { name: 'ram', type: 'string' },
        { name: 'screenSize', type: 'float' },
      ],
    },
  ],
};
```

```ts title="Signature"
type StructFieldConfig = | StringStructFieldConfig
    | TextStructFieldConfig
    | IntStructFieldConfig
    | FloatStructFieldConfig
    | BooleanStructFieldConfig
    | DateTimeStructFieldConfig
```
