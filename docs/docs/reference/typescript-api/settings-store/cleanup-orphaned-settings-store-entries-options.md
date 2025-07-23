---
title: "CleanupOrphanedSettingsStoreEntriesOptions"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## CleanupOrphanedSettingsStoreEntriesOptions

<GenerationInfo sourceFile="packages/core/src/config/settings-store/settings-store-types.ts" sourceLine="236" packageName="@vendure/core" since="3.4.0" />

Options for cleaning up orphaned settings store entries.

```ts title="Signature"
interface CleanupOrphanedSettingsStoreEntriesOptions {
    dryRun?: boolean;
    olderThan?: string;
    maxDeleteCount?: number;
    batchSize?: number;
}
```

<div className="members-wrapper">

### dryRun

<MemberInfo kind="property" type={`boolean`} default={`false`}   />

If true, perform a dry run without actually deleting entries.
### olderThan

<MemberInfo kind="property" type={`string`} default={`'7d'`}   />

Only delete entries older than this duration.
Examples: '30d', '7d', '1h', '30m'
### maxDeleteCount

<MemberInfo kind="property" type={`number`} default={`1000`}   />

Maximum number of entries to delete in a single operation.
### batchSize

<MemberInfo kind="property" type={`number`} default={`100`}   />

Batch size for deletion operations.


</div>
