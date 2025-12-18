---
title: "SettingsStore"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## cleanOrphanedSettingsStoreTask

<GenerationInfo sourceFile="packages/core/src/config/settings-store/clean-orphaned-settings-store-task.ts" sourceLine="39" packageName="@vendure/core" since="3.4.0" />

A <a href='/reference/typescript-api/scheduled-tasks/scheduled-task#scheduledtask'>ScheduledTask</a> that cleans up orphaned settings store entries from the database.
Orphaned entries are entries that no longer have corresponding field definitions
in the settings store configuration.

This task can be configured with options for dry-run mode, age thresholds,
and batch processing settings. Users can override or disable this task entirely
using the existing ScheduledTask APIs.

*Example*

```ts
// Override the default task with custom options
const customCleanupTask = new ScheduledTask({
  id: 'clean-orphaned-settings-store',
  description: 'Custom orphaned settings store cleanup',
  schedule: cron => cron.every(7).days(),
  async execute({ injector }) {
    const settingsStoreService = injector.get(SettingsStoreService);
    return settingsStoreService.cleanupOrphanedEntries({
      olderThan: '30d',
      maxDeleteCount: 500,
      batchSize: 50,
    });
  },
});
```

