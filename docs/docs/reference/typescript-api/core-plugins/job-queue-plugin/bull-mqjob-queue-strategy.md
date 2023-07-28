---
title: "BullMQJobQueueStrategy"
weight: 10
date: 2023-07-28T12:05:25.204Z
showtoc: true
generated: true
---
<!-- This file was generated from the Vendure source. Do not modify. Instead, re-run the "docs:build" script -->
import MemberInfo from '@site/src/components/MemberInfo';
import GenerationInfo from '@site/src/components/GenerationInfo';
import MemberDescription from '@site/src/components/MemberDescription';


## BullMQJobQueueStrategy

<GenerationInfo sourceFile="packages/job-queue-plugin/src/bullmq/bullmq-job-queue-strategy.ts" sourceLine="31" packageName="@vendure/job-queue-plugin" />

This JobQueueStrategy uses [BullMQ](https://docs.bullmq.io/) to implement a push-based job queue
on top of Redis. It should not be used alone, but as part of the <a href='/reference/typescript-api/core-plugins/job-queue-plugin/bull-mqjob-queue-plugin#bullmqjobqueueplugin'>BullMQJobQueuePlugin</a>.

```ts title="Signature"
class BullMQJobQueueStrategy implements InspectableJobQueueStrategy {
  async init(injector: Injector) => Promise<void>;
  async destroy() => ;
  async add(job: Job<Data>) => Promise<Job<Data>>;
  async cancelJob(jobId: string) => Promise<Job | undefined>;
  async findMany(options?: JobListOptions) => Promise<PaginatedList<Job>>;
  async findManyById(ids: ID[]) => Promise<Job[]>;
  async findOne(id: ID) => Promise<Job | undefined>;
  async removeSettledJobs(queueNames?: string[], olderThan?: Date) => Promise<number>;
  async start(queueName: string, process: (job: Job<Data>) => Promise<any>) => Promise<void>;
  async stop(queueName: string, process: (job: Job<Data>) => Promise<any>) => Promise<void>;
}
```
* Implements: <code><a href='/reference/typescript-api/job-queue/inspectable-job-queue-strategy#inspectablejobqueuestrategy'>InspectableJobQueueStrategy</a></code>



<div className="members-wrapper">

### init

<MemberInfo kind="method" type={`(injector: <a href='/reference/typescript-api/common/injector#injector'>Injector</a>) => Promise&#60;void&#62;`}   />


### destroy

<MemberInfo kind="method" type={`() => `}   />


### add

<MemberInfo kind="method" type={`(job: <a href='/reference/typescript-api/job-queue/job#job'>Job</a>&#60;Data&#62;) => Promise&#60;<a href='/reference/typescript-api/job-queue/job#job'>Job</a>&#60;Data&#62;&#62;`}   />


### cancelJob

<MemberInfo kind="method" type={`(jobId: string) => Promise&#60;<a href='/reference/typescript-api/job-queue/job#job'>Job</a> | undefined&#62;`}   />


### findMany

<MemberInfo kind="method" type={`(options?: JobListOptions) => Promise&#60;<a href='/reference/typescript-api/common/paginated-list#paginatedlist'>PaginatedList</a>&#60;<a href='/reference/typescript-api/job-queue/job#job'>Job</a>&#62;&#62;`}   />


### findManyById

<MemberInfo kind="method" type={`(ids: <a href='/reference/typescript-api/common/id#id'>ID</a>[]) => Promise&#60;<a href='/reference/typescript-api/job-queue/job#job'>Job</a>[]&#62;`}   />


### findOne

<MemberInfo kind="method" type={`(id: <a href='/reference/typescript-api/common/id#id'>ID</a>) => Promise&#60;<a href='/reference/typescript-api/job-queue/job#job'>Job</a> | undefined&#62;`}   />


### removeSettledJobs

<MemberInfo kind="method" type={`(queueNames?: string[], olderThan?: Date) => Promise&#60;number&#62;`}   />


### start

<MemberInfo kind="method" type={`(queueName: string, process: (job: <a href='/reference/typescript-api/job-queue/job#job'>Job</a>&#60;Data&#62;) =&#62; Promise&#60;any&#62;) => Promise&#60;void&#62;`}   />


### stop

<MemberInfo kind="method" type={`(queueName: string, process: (job: <a href='/reference/typescript-api/job-queue/job#job'>Job</a>&#60;Data&#62;) =&#62; Promise&#60;any&#62;) => Promise&#60;void&#62;`}   />




</div>
