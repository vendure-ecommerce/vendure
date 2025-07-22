---
title: "CleanupOrphanedEntriesResult"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## CleanupOrphanedEntriesResult

<GenerationInfo sourceFile="packages/core/src/config/key-value/key-value-types.ts" sourceLine="274" packageName="@vendure/core" since="3.4.0" />

Result of a cleanup operation for orphaned key-value entries.

```ts title="Signature"
interface CleanupOrphanedEntriesResult {
    deletedCount: number;
    dryRun: boolean;
    deletedEntries: OrphanedKeyValueEntry[];
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

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/key-value-storage/orphaned-key-value-entry#orphanedkeyvalueentry'>OrphanedKeyValueEntry</a>[]`}   />

Sample of deleted entries (for logging/audit purposes).


</div>
