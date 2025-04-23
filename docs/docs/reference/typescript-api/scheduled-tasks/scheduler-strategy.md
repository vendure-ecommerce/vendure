---
title: "SchedulerStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## SchedulerStrategy

<GenerationInfo sourceFile="packages/core/src/scheduler/scheduler-strategy.ts" sourceLine="42" packageName="@vendure/core" since="3.3.0" />

This strategy is used to define the mechanism by which scheduled tasks are executed
and how they are reported on. The main purpose of this strategy is to ensure
that a given task is executed exactly once at the scheduled time, even if there
are multiple instances of the worker running.

To do this, the strategy must use some form of shared storage and a method of
locking so that only a single worker is allowed to execute the task.

By default, the <a href='/reference/typescript-api/scheduled-tasks/default-scheduler-strategy#defaultschedulerstrategy'>DefaultSchedulerStrategy</a> will use the database to enable
this functionality.

```ts title="Signature"
interface SchedulerStrategy extends InjectableStrategy {
    registerTask?(task: ScheduledTask): void;
    executeTask(task: ScheduledTask): (job?: Cron) => Promise<any> | any;
    getTasks(): Promise<TaskReport[]>;
    getTask(id: string): Promise<TaskReport | undefined>;
    triggerTask(task: ScheduledTask): Promise<void>;
    updateTask(input: UpdateScheduledTaskInput): Promise<TaskReport>;
}
```
* Extends: <code><a href='/reference/typescript-api/common/injectable-strategy#injectablestrategy'>InjectableStrategy</a></code>



<div className="members-wrapper">

### registerTask

<MemberInfo kind="method" type={`(task: <a href='/reference/typescript-api/scheduled-tasks/scheduled-task#scheduledtask'>ScheduledTask</a>) => void`}   />

An optional method that may be used by the strategy to register all the configured
tasks ahead of time. This can be useful for keeping an internal reference of
all the tasks to aid in the specific strategy implemetation.
### executeTask

<MemberInfo kind="method" type={`(task: <a href='/reference/typescript-api/scheduled-tasks/scheduled-task#scheduledtask'>ScheduledTask</a>) => (job?: Cron) =&#62; Promise&#60;any&#62; | any`}   />

Execute a scheduled task. This method must also take care of
ensuring that the task is executed exactly once at the scheduled time,
even if there are multiple instances of the worker running.

For instance, in the <a href='/reference/typescript-api/scheduled-tasks/default-scheduler-strategy#defaultschedulerstrategy'>DefaultSchedulerStrategy</a> we make use of a
dedicated database table and a locking mechansim. If you implement a custom
SchedulerStrategy, you must use some other form of shared locking mechanism
that could make use of something like Redis etc. to ensure that the task
is executed exactly once at the scheduled time.

The function returned is then called in order to execture the task. The
`job` argument is an instance of the croner `Cron` class, except when
the task has been manually triggered, in which case it will be undefined.
### getTasks

<MemberInfo kind="method" type={`() => Promise&#60;<a href='/reference/typescript-api/scheduled-tasks/scheduler-strategy#taskreport'>TaskReport</a>[]&#62;`}   />

Get all scheduled tasks.
### getTask

<MemberInfo kind="method" type={`(id: string) => Promise&#60;<a href='/reference/typescript-api/scheduled-tasks/scheduler-strategy#taskreport'>TaskReport</a> | undefined&#62;`}   />

Get a single scheduled task by its id.
### triggerTask

<MemberInfo kind="method" type={`(task: <a href='/reference/typescript-api/scheduled-tasks/scheduled-task#scheduledtask'>ScheduledTask</a>) => Promise&#60;void&#62;`}   />

Manually trigger a given task. This method is not used to actually invoke the
task function itself, since that would cause the task to run on the server
instance which we typically do not want. Instead, it should be used
to signal to the strategy that this specific task needs to be invoked
at the soonest opportunity.

For instance, in the <a href='/reference/typescript-api/scheduled-tasks/default-scheduler-strategy#defaultschedulerstrategy'>DefaultSchedulerStrategy</a> this is done by setting
a flag in the database table which is checked periodically and causes those tasks
to get immediately invoked.
### updateTask

<MemberInfo kind="method" type={`(input: UpdateScheduledTaskInput) => Promise&#60;<a href='/reference/typescript-api/scheduled-tasks/scheduler-strategy#taskreport'>TaskReport</a>&#62;`}   />

Update a scheduled task.


</div>


## TaskReport

<GenerationInfo sourceFile="packages/core/src/scheduler/scheduler-strategy.ts" sourceLine="16" packageName="@vendure/core" since="3.3.0" />

A report on the status of a scheduled task.

```ts title="Signature"
interface TaskReport {
    id: string;
    lastExecutedAt: Date | null;
    isRunning: boolean;
    lastResult: any;
    enabled: boolean;
}
```

<div className="members-wrapper">

### id

<MemberInfo kind="property" type={`string`}   />


### lastExecutedAt

<MemberInfo kind="property" type={`Date | null`}   />


### isRunning

<MemberInfo kind="property" type={`boolean`}   />


### lastResult

<MemberInfo kind="property" type={`any`}   />


### enabled

<MemberInfo kind="property" type={`boolean`}   />




</div>
