---
title: "CleanSessionsTask"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## cleanSessionsTask

<GenerationInfo sourceFile="packages/core/src/scheduler/tasks/clean-sessions-task.ts" sourceLine="37" packageName="@vendure/core" since="3.3.0" />

A <a href='/reference/typescript-api/scheduled-tasks/scheduled-task#scheduledtask'>ScheduledTask</a> that cleans expired & inactive sessions from the database.

*Example*

```ts
import { cleanSessionsTask, VendureConfig } from '@vendure/core';

export const config: VendureConfig = {
  // ...
  schedulerOptions: {
    tasks: [
      // Use the task as is
      cleanSessionsTask,
      // or configure the task
      cleanSessionsTask.configure({
        // Run the task every day at 3:00am
        // The default schedule is every day at 00:00am
        schedule: cron => cron.everyDayAt(3, 0),
        params: {
          // How many sessions to process in each batch
          // Default: 10_000
          batchSize: 5_000,
        },
      }),
    ],
  },
};
```

