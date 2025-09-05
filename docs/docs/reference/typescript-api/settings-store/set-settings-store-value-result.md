---
title: "SetSettingsStoreValueResult"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## SetSettingsStoreValueResult

<GenerationInfo sourceFile="packages/core/src/config/settings-store/settings-store-types.ts" sourceLine="179" packageName="@vendure/core" since="3.4.0" />

Result type for settings store set operations, providing detailed feedback
about the success or failure of each operation.

```ts title="Signature"
interface SetSettingsStoreValueResult {
    key: string;
    result: boolean;
    error?: string;
}
```

<div className="members-wrapper">

### key

<MemberInfo kind="property" type={`string`}   />

The key that was attempted to be set.
### result

<MemberInfo kind="property" type={`boolean`}   />

Whether the set operation was successful.
### error

<MemberInfo kind="property" type={`string`}   />

Error message if the operation failed, null if successful.


</div>
