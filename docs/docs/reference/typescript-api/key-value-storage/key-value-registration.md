---
title: "KeyValueRegistration"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## KeyValueRegistration

<GenerationInfo sourceFile="packages/core/src/config/key-value/key-value-types.ts" sourceLine="85" packageName="@vendure/core" since="3.4.0" />

Configuration for registering a namespace of key-value fields.

```ts title="Signature"
interface KeyValueRegistration {
    namespace: string;
    fields: KeyValueFieldConfig[];
}
```

<div className="members-wrapper">

### namespace

<MemberInfo kind="property" type={`string`}   />

The namespace for these fields (e.g., 'dashboard', 'payment').
Field names will be prefixed with this namespace.
### fields

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/key-value-storage/key-value-field-config#keyvaluefieldconfig'>KeyValueFieldConfig</a>[]`}   />

Array of field configurations for this namespace.


</div>
