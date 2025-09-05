---
title: "SettingsStoreRegistration"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## SettingsStoreRegistration

<GenerationInfo sourceFile="packages/core/src/config/settings-store/settings-store-types.ts" sourceLine="89" packageName="@vendure/core" since="3.4.0" />

Configuration for registering a namespace of settings store fields.

```ts title="Signature"
interface SettingsStoreRegistration {
    namespace: string;
    fields: SettingsStoreFieldConfig[];
}
```

<div className="members-wrapper">

### namespace

<MemberInfo kind="property" type={`string`}   />

The namespace for these fields (e.g., 'dashboard', 'payment').
Field names will be prefixed with this namespace.
### fields

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/settings-store/settings-store-field-config#settingsstorefieldconfig'>SettingsStoreFieldConfig</a>[]`}   />

Array of field configurations for this namespace.


</div>
