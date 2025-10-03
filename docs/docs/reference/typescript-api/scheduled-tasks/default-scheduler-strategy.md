---
title: "DefaultSchedulerStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## DefaultSchedulerStrategy

<GenerationInfo sourceFile="packages/core/src/plugin/default-scheduler-plugin/default-scheduler-strategy.ts" sourceLine="28" packageName="@vendure/core" since="3.3.0" />

The default <a href='/reference/typescript-api/scheduled-tasks/scheduler-strategy#schedulerstrategy'>SchedulerStrategy</a> implementation that uses the database to
execute scheduled tasks. This strategy is configured when you use the
<a href='/reference/typescript-api/scheduled-tasks/default-scheduler-plugin#defaultschedulerplugin'>DefaultSchedulerPlugin</a>.

```ts title="Signature"
class DefaultSchedulerStrategy implements SchedulerStrategy {
    init(injector: Injector) => ;
    destroy() => ;
    registerTask(task: ScheduledTask) => void;
    executeTask(task: ScheduledTask) => ;
    getTasks() => Promise<TaskReport[]>;
    getTask(id: string) => Promise<TaskReport | undefined>;
    updateTask(input: UpdateScheduledTaskInput) => Promise<TaskReport>;
    triggerTask(task: ScheduledTask) => Promise<void>;
}
```
* Implements: <code><a href='/reference/typescript-api/scheduled-tasks/scheduler-strategy#schedulerstrategy'>SchedulerStrategy</a></code>



<div className="members-wrapper">

### init

<MemberInfo kind="method" type={`(injector: <a href='/reference/typescript-api/common/injector#injector'>Injector</a>) => `}   />


### destroy

<MemberInfo kind="method" type={`() => `}   />


### registerTask

<MemberInfo kind="method" type={`(task: <a href='/reference/typescript-api/scheduled-tasks/scheduled-task#scheduledtask'>ScheduledTask</a>) => void`}   />


### executeTask

<MemberInfo kind="method" type={`(task: <a href='/reference/typescript-api/scheduled-tasks/scheduled-task#scheduledtask'>ScheduledTask</a>) => `}   />


### getTasks

<MemberInfo kind="method" type={`() => Promise&#60;<a href='/reference/typescript-api/scheduled-tasks/scheduler-strategy#taskreport'>TaskReport</a>[]&#62;`}   />


### getTask

<MemberInfo kind="method" type={`(id: string) => Promise&#60;<a href='/reference/typescript-api/scheduled-tasks/scheduler-strategy#taskreport'>TaskReport</a> | undefined&#62;`}   />


### updateTask

<MemberInfo kind="method" type={`(input: UpdateScheduledTaskInput) => Promise&#60;<a href='/reference/typescript-api/scheduled-tasks/scheduler-strategy#taskreport'>TaskReport</a>&#62;`}   />


### triggerTask

<MemberInfo kind="method" type={`(task: <a href='/reference/typescript-api/scheduled-tasks/scheduled-task#scheduledtask'>ScheduledTask</a>) => Promise&#60;void&#62;`}   />




</div>
