---
title: "BullMQJobQueueStrategy"
isDefaultIndex: false
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## BullMQJobQueueStrategy

<GenerationInfo sourceFile="packages/job-queue-plugin/src/bullmq/bullmq-job-queue-strategy.ts" sourceLine="42" packageName="@vendure/job-queue-plugin" />

This JobQueueStrategy uses [BullMQ](https://docs.bullmq.io/) to implement a push-based job queue
on top of Redis. It should not be used alone, but as part of the <a href='/reference/core-plugins/job-queue-plugin/bull-mqjob-queue-plugin#bullmqjobqueueplugin'>BullMQJobQueuePlugin</a>.

```ts title="Signature"
class BullMQJobQueueStrategy implements InspectableJobQueueStrategy {
    init(injector: Injector) => Promise<void>;
    destroy() => ;
    add(job: Job<Data>) => Promise<Job<Data>>;
    cancelJob(jobId: string) => Promise<Job | undefined>;
    findMany(options?: JobListOptions) => Promise<PaginatedList<Job>>;
    findManyById(ids: ID[]) => Promise<Job[]>;
    findOne(id: ID) => Promise<Job | undefined>;
    removeSettledJobs(queueNames?: string[], olderThan?: Date) => Promise<number>;
    start(queueName: string, process: (job: Job<Data>) => Promise<any>) => Promise<void>;
    stop(queueName: string, process: (job: Job<Data>) => Promise<any>) => Promise<void>;
}
```
* Implements: <code>InspectableJobQueueStrategy</code>



<div className="members-wrapper">

### init

<MemberInfo kind="method" type={`(injector: Injector) => Promise&#60;void&#62;`}   />


### destroy

<MemberInfo kind="method" type={`() => `}   />


### add

<MemberInfo kind="method" type={`(job: Job&#60;Data&#62;) => Promise&#60;Job&#60;Data&#62;&#62;`}   />


### cancelJob

<MemberInfo kind="method" type={`(jobId: string) => Promise&#60;Job | undefined&#62;`}   />


### findMany

<MemberInfo kind="method" type={`(options?: JobListOptions) => Promise&#60;PaginatedList&#60;Job&#62;&#62;`}   />


### findManyById

<MemberInfo kind="method" type={`(ids: ID[]) => Promise&#60;Job[]&#62;`}   />


### findOne

<MemberInfo kind="method" type={`(id: ID) => Promise&#60;Job | undefined&#62;`}   />


### removeSettledJobs

<MemberInfo kind="method" type={`(queueNames?: string[], olderThan?: Date) => Promise&#60;number&#62;`}   />


### start

<MemberInfo kind="method" type={`(queueName: string, process: (job: Job&#60;Data&#62;) =&#62; Promise&#60;any&#62;) => Promise&#60;void&#62;`}   />


### stop

<MemberInfo kind="method" type={`(queueName: string, process: (job: Job&#60;Data&#62;) =&#62; Promise&#60;any&#62;) => Promise&#60;void&#62;`}   />




</div>
