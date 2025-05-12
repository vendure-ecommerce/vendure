---
title: "ScheduledTask"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## ScheduledTask

<GenerationInfo sourceFile="packages/core/src/scheduler/scheduled-task.ts" sourceLine="120" packageName="@vendure/core" since="3.3.0" />

Use this class to define a scheduled task that will be executed at a given cron schedule.

*Example*

```ts
import { ScheduledTask } from '@vendure/core';

const task = new ScheduledTask({
    id: 'test-job',
    schedule: cron => cron.every(2).minutes(),
    execute: async ({ injector, scheduledContext, params }) => {
        // some logic here
    },
});
```

```ts title="Signature"
class ScheduledTask<C extends Record<string, any> = Record<string, any>> {
    constructor(config: ScheduledTaskConfig<C>)
    id: void
    options: void
    execute(injector: Injector) => ;
    configure(additionalConfig: Partial<Pick<ScheduledTaskConfig<C>, 'schedule' | 'timeout' | 'params'>>) => ;
}
```

<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(config: <a href='/reference/typescript-api/scheduled-tasks/scheduled-task#scheduledtaskconfig'>ScheduledTaskConfig</a>&#60;C&#62;) => ScheduledTask`}   />


### id

<MemberInfo kind="property" type={``}   />


### options

<MemberInfo kind="property" type={``}   />


### execute

<MemberInfo kind="method" type={`(injector: <a href='/reference/typescript-api/common/injector#injector'>Injector</a>) => `}   />


### configure

<MemberInfo kind="method" type={`(additionalConfig: Partial&#60;Pick&#60;<a href='/reference/typescript-api/scheduled-tasks/scheduled-task#scheduledtaskconfig'>ScheduledTaskConfig</a>&#60;C&#62;, 'schedule' | 'timeout' | 'params'&#62;&#62;) => `}   />

This method allows you to further configure existing scheduled tasks. For example, you may
wish to change the schedule or timeout of a task, without having to define a new task.

*Example*

```ts
import { ScheduledTask } from '@vendure/core';

const task = new ScheduledTask({
    id: 'test-job',
    schedule: cron => cron.every(2).minutes(),
    execute: async ({ injector, scheduledContext, params }) => {
        // some logic here
    },
});

// later, you can configure the task
task.configure({ schedule: cron => cron.every(5).minutes() });
```


</div>


## ScheduledTaskExecutionArgs

<GenerationInfo sourceFile="packages/core/src/scheduler/scheduled-task.ts" sourceLine="16" packageName="@vendure/core" since="3.3.0" />

The arguments passed to the execute method of a scheduled task.

```ts title="Signature"
interface ScheduledTaskExecutionArgs<C extends Record<string, any> = Record<string, any>> {
    injector: Injector;
    scheduledContext: RequestContext;
    params: C;
}
```

<div className="members-wrapper">

### injector

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/common/injector#injector'>Injector</a>`}   />

The injector instance.
### scheduledContext

<MemberInfo kind="property" type={`<a href='/reference/typescript-api/request/request-context#requestcontext'>RequestContext</a>`}   />

A RequestContext instance that is configured for the scheduled task.
### params

<MemberInfo kind="property" type={`C`}   />

The parameters for the scheduled task.


</div>


## ScheduledTaskConfig

<GenerationInfo sourceFile="packages/core/src/scheduler/scheduled-task.ts" sourceLine="42" packageName="@vendure/core" since="3.3.0" />

The configuration for a scheduled task.

```ts title="Signature"
interface ScheduledTaskConfig<C extends Record<string, any> = Record<string, any>> {
    id: string;
    description?: string;
    params?: C;
    schedule: string | ((cronTime: typeof CronTime) => string);
    timeout?: number | string;
    preventOverlap?: boolean;
    execute(args: ScheduledTaskExecutionArgs<C>): Promise<any>;
}
```

<div className="members-wrapper">

### id

<MemberInfo kind="property" type={`string`}   />

The unique identifier for the scheduled task.
### description

<MemberInfo kind="property" type={`string`}   />

The description for the scheduled task.
### params

<MemberInfo kind="property" type={`C`}   />

Optional parameters that will be passed to the `execute` function.
### schedule

<MemberInfo kind="property" type={`string | ((cronTime: typeof CronTime) =&#62; string)`}   />

The cron schedule for the scheduled task. This can be a standard cron expression or
a function that returns a [cron-time-generator](https://www.npmjs.com/package/cron-time-generator)
expression.

*Example*

```ts
// Standard cron expression
{ schedule: '0 0-23/5 * * *', } // every 5 hours
{ schedule: '0 22 * * *', } // every day at 10:00 PM

// Cron-time-generator expression
{ schedule: cronTime => cronTime.every(2).minutes(), }
{ schedule: cronTime => cronTime.every(5).hours(), }
```
### timeout

<MemberInfo kind="property" type={`number | string`} default={`60_000ms`}   />

The timeout for the scheduled task. If the task takes longer than the timeout, the task
will be considered to have failed with a timeout error.
### preventOverlap

<MemberInfo kind="property" type={`boolean`} default={`true`}   />

Whether the scheduled task should be prevented from running if it is already running.
### execute

<MemberInfo kind="method" type={`(args: <a href='/reference/typescript-api/scheduled-tasks/scheduled-task#scheduledtaskexecutionargs'>ScheduledTaskExecutionArgs</a>&#60;C&#62;) => Promise&#60;any&#62;`}   />

The function that will be executed when the scheduled task is run.


</div>
