---
title: "CleanupOrphanedSettingsStoreEntriesResult"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## CleanupOrphanedSettingsStoreEntriesResult

<GenerationInfo sourceFile="packages/core/src/config/settings-store/settings-store-types.ts" sourceLine="278" packageName="@vendure/core" since="3.4.0" />

Result of a cleanup operation for orphaned settings store entries.

```ts title="Signature"
interface CleanupOrphanedSettingsStoreEntriesResult {
    deletedCount: number;
    dryRun: boolean;
    deletedEntries: OrphanedSettingsStoreEntry[];
}
```

<div className="members-wrapper">

### deletedCount

<MemberInfo kind="property" type={`number`}   />

Number of entries that were (or would be) deleted.
### dryRun

<MemberInfo kind="property" type={`boolean`}   />

Whether this was a dry run.
### deletedEntries

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/settings-store/orphaned-settings-store-entry#orphanedsettingsstoreentry'>OrphanedSettingsStoreEntry</a>[]`}   />

Sample of deleted entries (for logging/audit purposes).


</div>
