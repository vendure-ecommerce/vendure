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

<GenerationInfo sourceFile="packages/core/src/scheduler/scheduler.service.ts" sourceLine="33" packageName="@vendure/core" since="3.3.0" />

The service that is responsible for setting up and querying the scheduled tasks.

```ts title="Signature"
class SchedulerService implements OnApplicationBootstrap {
    constructor(configService: ConfigService)
    onApplicationBootstrap() => ;
    getTaskList() => Promise<TaskInfo[]>;
    updateTask(input: UpdateScheduledTaskInput) => Promise<TaskInfo>;
}
```
* Implements: <code>OnApplicationBootstrap</code>



<div className="members-wrapper">

### constructor

<MemberInfo kind="method" type={`(configService: ConfigService) => SchedulerService`}   />


### onApplicationBootstrap

<MemberInfo kind="method" type={`() => `}   />


### getTaskList

<MemberInfo kind="method" type={`() => Promise&#60;TaskInfo[]&#62;`}   />

Returns a list of all the scheduled tasks and their current status.
### updateTask

<MemberInfo kind="method" type={`(input: UpdateScheduledTaskInput) => Promise&#60;TaskInfo&#62;`}   />




</div>
