---
title: "SchedulerService"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## SchedulerService

<GenerationInfo sourceFile="packages/core/src/scheduler/scheduler.service.ts" sourceLine="34" packageName="@vendure/core" since="3.3.0" />

The service that is responsible for setting up and querying the scheduled tasks.

```ts title="Signature"
class SchedulerService implements OnApplicationBootstrap, OnApplicationShutdown {
    constructor(configService: ConfigService, processContext: ProcessContext)
    onApplicationBootstrap() => ;
    onApplicationShutdown(signal?: string) => ;
    getTaskList() => Promise<TaskInfo[]>;
    updateTask(input: UpdateScheduledTaskInput) => Promise<TaskInfo>;
    runTask(taskId: string) => Promise<Success>;
}
```
* Implements: <code>OnApplicationBootstrap</code>, <code>OnApplicationShutdown</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(configService: ConfigService, processContext: <a href='/reference/typescript-api/common/process-context#processcontext'>ProcessContext</a>) => SchedulerService`}   />


### onApplicationBootstrap

<MemberInfo kind="method" type={`() => `}   />


### onApplicationShutdown

<MemberInfo kind="method" type={`(signal?: string) => `}   />


### getTaskList

<MemberInfo kind="method" type={`() => Promise&#60;TaskInfo[]&#62;`}   />

Returns a list of all the scheduled tasks and their current status.
### updateTask

<MemberInfo kind="method" type={`(input: UpdateScheduledTaskInput) => Promise&#60;TaskInfo&#62;`}   />


### runTask

<MemberInfo kind="method" type={`(taskId: string) => Promise&#60;Success&#62;`}   />




</div>
