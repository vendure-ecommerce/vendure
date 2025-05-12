---
title: "SchedulerOptions"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## SchedulerOptions

<GenerationInfo sourceFile="packages/core/src/config/vendure-config.ts" sourceLine="977" packageName="@vendure/core" since="3.3.0" />

Options related to scheduled tasks..

```ts title="Signature"
interface SchedulerOptions {
    schedulerStrategy?: SchedulerStrategy;
    tasks?: ScheduledTask[];
    runTasksInWorkerOnly?: boolean;
}
```

<div className="members-wrapper">

### schedulerStrategy

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/scheduled-tasks/scheduler-strategy#schedulerstrategy'>SchedulerStrategy</a>`}   />

The strategy used to execute scheduled tasks. If you are using the
<a href='/reference/typescript-api/scheduled-tasks/default-scheduler-plugin#defaultschedulerplugin'>DefaultSchedulerPlugin</a> (which is recommended) then this will be set to the
<a href='/reference/typescript-api/scheduled-tasks/default-scheduler-strategy#defaultschedulerstrategy'>DefaultSchedulerStrategy</a>.
### tasks

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/scheduled-tasks/scheduled-task#scheduledtask'>ScheduledTask</a>[]`}   />

The tasks to be executed.
### runTasksInWorkerOnly

<MemberInfo kind="property" type={`boolean`} default={`true`}   />

Whether to run tasks only in the worker process. Generally this should
be left as true, since tasks may involve expensive operations that should
not be allowed to interfere with the server responsiveness.

This option mainly exists for testing purposes.


</div>
