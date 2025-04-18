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

<GenerationInfo sourceFile="packages/core/src/config/vendure-config.ts" sourceLine="974" packageName="@vendure/core" since="3.3.0" />

Options related to scheduled tasks..

```ts title="Signature"
interface SchedulerOptions {
    schedulerStrategy?: SchedulerStrategy;
    tasks?: ScheduledTask[];
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


</div>
