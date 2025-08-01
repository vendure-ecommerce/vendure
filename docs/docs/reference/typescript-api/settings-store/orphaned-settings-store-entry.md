---
title: "OrphanedSettingsStoreEntry"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## OrphanedSettingsStoreEntry

<GenerationInfo sourceFile="packages/core/src/config/settings-store/settings-store-types.ts" sourceLine="207" packageName="@vendure/core" since="3.4.0" />

Represents an orphaned settings store entry that no longer has a corresponding
field definition in the configuration.

```ts title="Signature"
interface OrphanedSettingsStoreEntry {
    key: string;
    scope: string;
    updatedAt: Date;
    valuePreview: string;
}
```

<div className="members-wrapper">

### key

<MemberInfo kind="property" type={`string`}   />

The orphaned key.
### scope

<MemberInfo kind="property" type={`string`}   />

The scope of the orphaned entry.
### updatedAt

<MemberInfo kind="property" type={`Date`}   />

When the entry was last updated.
### valuePreview

<MemberInfo kind="property" type={`string`}   />

Preview of the stored value (truncated for large values).


</div>
